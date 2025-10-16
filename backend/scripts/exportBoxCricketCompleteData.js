const mongoose = require('mongoose');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const config = require('../config');
const ExcelJS = require('exceljs');
const path = require('path');

async function exportBoxCricketCompleteData() {
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

    // Create a new workbook with ALL DATA IN ONE SHEET
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('All Box Cricket External Participants');
    
    // Define columns for ALL participant data
    sheet.columns = [
      { header: 'S.No', key: 'sno', width: 8 },
      { header: 'Team No.', key: 'teamNumber', width: 10 },
      { header: 'Registration ID', key: 'regId', width: 18 },
      { header: 'Registration Date', key: 'regDate', width: 20 },
      { header: 'Participant Type', key: 'participantType', width: 18 },
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Email', key: 'email', width: 35 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'College Name', key: 'collegeName', width: 40 },
      { header: 'Register Number', key: 'registerNumber', width: 20 },
      { header: 'Event Date', key: 'eventDate', width: 18 },
      { header: 'Status', key: 'status', width: 12 }
    ];

    let rowCounter = 1;

    registrations.forEach((reg, teamIndex) => {
      // Add team leader
      sheet.addRow({
        sno: rowCounter++,
        teamNumber: teamIndex + 1,
        regId: reg.regId,
        regDate: reg.createdAt ? reg.createdAt.toLocaleString() : 'N/A',
        participantType: 'Team Leader',
        name: reg.leader.name,
        email: reg.leader.email,
        phone: reg.leader.phone,
        collegeName: reg.leader.collegeName || 'N/A',
        registerNumber: reg.leader.collegeRegisterNumber || reg.leader.registerNumber || 'N/A',
        eventDate: reg.finalEventDate,
        status: reg.status
      });

      // Add team members
      if (reg.teamMembers && reg.teamMembers.length > 0) {
        reg.teamMembers.forEach((member, memberIndex) => {
          sheet.addRow({
            sno: rowCounter++,
            teamNumber: teamIndex + 1,
            regId: reg.regId,
            regDate: reg.createdAt ? reg.createdAt.toLocaleString() : 'N/A',
            participantType: `Team Member ${memberIndex + 1}`,
            name: member.name,
            email: '', // Team members don't have email in data
            phone: '', // Team members don't have phone in data
            collegeName: member.collegeName || 'N/A',
            registerNumber: member.collegeRegisterNumber || member.registerNumber || 'N/A',
            eventDate: reg.finalEventDate,
            status: reg.status
          });
        });
      }
    });

    // Style the header row
    sheet.getRow(1).font = { bold: true, size: 12 };
    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' }
    };
    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    // Add alternating row colors for better readability
    for (let i = 2; i <= sheet.rowCount; i++) {
      if (i % 2 === 0) {
        sheet.getRow(i).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF2F2F2' }
        };
      }
    }

    // Add summary information at the top
    sheet.insertRow(1, ['BOX CRICKET - EXTERNAL PARTICIPANTS COMPLETE DATA']);
    sheet.mergeCells('A1:L1');
    sheet.getCell('A1').font = { bold: true, size: 16, color: { argb: 'FFFFFFFF' } };
    sheet.getCell('A1').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF2F4F4F' }
    };
    sheet.getCell('A1').alignment = { horizontal: 'center' };

    // Add event details
    sheet.insertRow(2, [
      `Event: ${boxCricketEvent.title}`,
      `Date: ${boxCricketEvent.dates.outside}`,
      `Total Teams: ${registrations.length}`,
      `Total Participants: ${rowCounter - 3}`,
      `Generated: ${new Date().toLocaleString()}`
    ]);
    sheet.mergeCells('A2:L2');
    sheet.getCell('A2').font = { bold: true, size: 12 };
    sheet.getCell('A2').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE6E6FA' }
    };

    // Empty row
    sheet.insertRow(3, []);

    // Save the workbook
    const outputDir = path.join(__dirname, '../outputs');
    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const filename = `box_cricket_all_participants_complete_${timestamp}.xlsx`;
    const filepath = path.join(outputDir, filename);
    
    await workbook.xlsx.writeFile(filepath);
    console.log(`\n✅ Complete Excel file created successfully!`);
    console.log(`📁 File location: ${filepath}`);
    console.log(`\n📊 File contains ALL ${rowCounter - 3} participants from ${registrations.length} teams`);
    console.log(`📄 Single sheet with ALL participant data - no need to switch tabs!`);
    console.log(`\n🎯 This file shows EVERY participant with their complete details:`);
    console.log(`   - Team leaders with emails and phone numbers`);
    console.log(`   - All team members with college details`);
    console.log(`   - Registration IDs and dates`);
    console.log(`   - College names and register numbers`);

    // Disconnect
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

exportBoxCricketCompleteData();








