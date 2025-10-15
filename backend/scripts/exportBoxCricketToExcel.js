const mongoose = require('mongoose');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const config = require('../config');
const ExcelJS = require('exceljs');
const path = require('path');

async function exportBoxCricketToExcel() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find Box Cricket event
    const boxCricketEvent = await Event.findOne({ 
      title: { $regex: /box cricket/i } 
    });

    if (!boxCricketEvent) {
      console.log('Box Cricket event not found');
      process.exit(0);
    }

    console.log(`Found event: ${boxCricketEvent.title} (ID: ${boxCricketEvent._id})`);

    // Find all external participant registrations for Box Cricket
    const registrations = await Registration.find({
      eventId: boxCricketEvent._id,
      isGardenCityStudent: false  // External participants only
    }).sort({ createdAt: 1 });

    console.log(`\nFound ${registrations.length} external participant registrations for Box Cricket\n`);

    if (registrations.length === 0) {
      console.log('No external registrations found for Box Cricket');
      process.exit(0);
    }

    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    
    // Sheet 1: Summary
    const summarySheet = workbook.addWorksheet('Summary');
    
    // Add summary headers
    summarySheet.columns = [
      { header: 'Event Name', key: 'eventName', width: 30 },
      { header: 'Event Date', key: 'eventDate', width: 20 },
      { header: 'Total Registrations', key: 'totalRegistrations', width: 20 },
      { header: 'Total Participants', key: 'totalParticipants', width: 20 },
      { header: 'Generated On', key: 'generatedOn', width: 25 }
    ];

    const totalParticipants = registrations.reduce((sum, reg) => {
      return sum + 1 + (reg.teamMembers ? reg.teamMembers.length : 0);
    }, 0);

    summarySheet.addRow({
      eventName: boxCricketEvent.title,
      eventDate: boxCricketEvent.dates.outside,
      totalRegistrations: registrations.length,
      totalParticipants: totalParticipants,
      generatedOn: new Date().toLocaleString()
    });

    // Style the summary sheet
    summarySheet.getRow(1).font = { bold: true, size: 12 };
    summarySheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' }
    };
    summarySheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    // Sheet 2: Team Leaders
    const leadersSheet = workbook.addWorksheet('Team Leaders');
    
    leadersSheet.columns = [
      { header: 'S.No', key: 'sno', width: 8 },
      { header: 'Registration ID', key: 'regId', width: 18 },
      { header: 'Registration Date', key: 'regDate', width: 20 },
      { header: 'Leader Name', key: 'leaderName', width: 25 },
      { header: 'Email', key: 'email', width: 35 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'College Name', key: 'collegeName', width: 40 },
      { header: 'Register Number', key: 'registerNumber', width: 20 },
      { header: 'Team Size', key: 'teamSize', width: 12 },
      { header: 'Status', key: 'status', width: 12 }
    ];

    registrations.forEach((reg, index) => {
      leadersSheet.addRow({
        sno: index + 1,
        regId: reg.regId,
        regDate: reg.createdAt ? reg.createdAt.toLocaleString() : 'N/A',
        leaderName: reg.leader.name,
        email: reg.leader.email,
        phone: reg.leader.phone,
        collegeName: reg.leader.collegeName || 'N/A',
        registerNumber: reg.leader.collegeRegisterNumber || 'N/A',
        teamSize: 1 + (reg.teamMembers ? reg.teamMembers.length : 0),
        status: reg.status
      });
    });

    // Style the leaders sheet
    leadersSheet.getRow(1).font = { bold: true, size: 11 };
    leadersSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF70AD47' }
    };
    leadersSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    // Sheet 3: All Participants (Detailed)
    const detailedSheet = workbook.addWorksheet('All Participants');
    
    detailedSheet.columns = [
      { header: 'Registration ID', key: 'regId', width: 18 },
      { header: 'Team Number', key: 'teamNumber', width: 12 },
      { header: 'Participant Type', key: 'participantType', width: 18 },
      { header: 'Name', key: 'name', width: 25 },
      { header: 'College Name', key: 'collegeName', width: 40 },
      { header: 'Register Number', key: 'registerNumber', width: 20 },
      { header: 'Email (Leader Only)', key: 'email', width: 35 },
      { header: 'Phone (Leader Only)', key: 'phone', width: 15 }
    ];

    registrations.forEach((reg, index) => {
      // Add team leader
      detailedSheet.addRow({
        regId: reg.regId,
        teamNumber: index + 1,
        participantType: 'Team Leader',
        name: reg.leader.name,
        collegeName: reg.leader.collegeName || 'N/A',
        registerNumber: reg.leader.collegeRegisterNumber || reg.leader.registerNumber || 'N/A',
        email: reg.leader.email,
        phone: reg.leader.phone
      });

      // Add team members
      if (reg.teamMembers && reg.teamMembers.length > 0) {
        reg.teamMembers.forEach((member, memberIndex) => {
          detailedSheet.addRow({
            regId: reg.regId,
            teamNumber: index + 1,
            participantType: `Team Member ${memberIndex + 1}`,
            name: member.name,
            collegeName: member.collegeName || 'N/A',
            registerNumber: member.collegeRegisterNumber || member.registerNumber || 'N/A',
            email: '',
            phone: ''
          });
        });
      }
    });

    // Style the detailed sheet
    detailedSheet.getRow(1).font = { bold: true, size: 11 };
    detailedSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFC000' }
    };
    detailedSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    // Sheet 4: Team-wise Details
    const teamwiseSheet = workbook.addWorksheet('Team-wise Details');
    
    teamwiseSheet.columns = [
      { header: 'Team No.', key: 'teamNo', width: 10 },
      { header: 'Registration ID', key: 'regId', width: 18 },
      { header: 'Registration Date', key: 'regDate', width: 20 },
      { header: 'Leader Name', key: 'leaderName', width: 25 },
      { header: 'Leader Email', key: 'leaderEmail', width: 35 },
      { header: 'Leader Phone', key: 'leaderPhone', width: 15 },
      { header: 'College Name', key: 'collegeName', width: 40 },
      { header: 'Team Members', key: 'teamMembers', width: 60 },
      { header: 'Total Members', key: 'totalMembers', width: 15 }
    ];

    registrations.forEach((reg, index) => {
      const teamMembersList = reg.teamMembers && reg.teamMembers.length > 0
        ? reg.teamMembers.map((m, i) => `${i + 1}. ${m.name} (${m.collegeRegisterNumber || m.registerNumber || 'N/A'})`).join('; ')
        : 'No team members';

      teamwiseSheet.addRow({
        teamNo: index + 1,
        regId: reg.regId,
        regDate: reg.createdAt ? reg.createdAt.toLocaleString() : 'N/A',
        leaderName: reg.leader.name,
        leaderEmail: reg.leader.email,
        leaderPhone: reg.leader.phone,
        collegeName: reg.leader.collegeName || 'N/A',
        teamMembers: teamMembersList,
        totalMembers: 1 + (reg.teamMembers ? reg.teamMembers.length : 0)
      });
    });

    // Style the teamwise sheet
    teamwiseSheet.getRow(1).font = { bold: true, size: 11 };
    teamwiseSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF9966FF' }
    };
    teamwiseSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    // Save the workbook
    const outputDir = path.join(__dirname, '../outputs');
    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const filename = `box_cricket_external_registrations_${timestamp}.xlsx`;
    const filepath = path.join(outputDir, filename);
    
    await workbook.xlsx.writeFile(filepath);
    console.log(`\n✅ Excel file created successfully!`);
    console.log(`📁 File location: ${filepath}`);
    console.log(`\n📊 File contains ${registrations.length} teams with ${totalParticipants} total participants`);
    console.log(`\n📄 Sheets included:`);
    console.log(`   1. Summary - Overview statistics`);
    console.log(`   2. Team Leaders - All team leader information`);
    console.log(`   3. All Participants - Detailed list of every participant`);
    console.log(`   4. Team-wise Details - Complete team information`);

    // Disconnect
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

exportBoxCricketToExcel();








