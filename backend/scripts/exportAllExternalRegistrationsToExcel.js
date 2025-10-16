const mongoose = require('mongoose');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const config = require('../config');
const ExcelJS = require('exceljs');
const path = require('path');

async function exportAllExternalRegistrationsToExcel() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all registrations where isGardenCityStudent is false (external students)
    const externalRegistrations = await Registration.find({
      isGardenCityStudent: false
    })
    .populate('eventId', 'title category type dates')
    .sort({ createdAt: 1 });

    console.log(`\nFound ${externalRegistrations.length} external student registrations across all events\n`);

    if (externalRegistrations.length === 0) {
      console.log('No external registrations found');
      process.exit(0);
    }

    // Get unique events that have external registrations
    const eventIds = [...new Set(externalRegistrations.map(reg => reg.eventId._id.toString()))];
    const events = await Event.find({ _id: { $in: eventIds } });

    console.log(`Events with external registrations: ${events.length}`);

    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Gardenia2025 System';
    workbook.lastModifiedBy = 'Gardenia2025 System';
    workbook.created = new Date();

    // Sheet 1: Summary Dashboard
    const summarySheet = workbook.addWorksheet('Summary Dashboard');

    // Add summary headers
    summarySheet.columns = [
      { header: 'Metric', key: 'metric', width: 30 },
      { header: 'Value', key: 'value', width: 20 }
    ];

    const totalParticipants = externalRegistrations.reduce((sum, reg) => {
      return sum + 1 + (reg.teamMembers ? reg.teamMembers.length : 0);
    }, 0);

    const eventWiseCount = {};
    externalRegistrations.forEach(reg => {
      const eventTitle = reg.eventId.title;
      if (!eventWiseCount[eventTitle]) {
        eventWiseCount[eventTitle] = { registrations: 0, participants: 0 };
      }
      eventWiseCount[eventTitle].registrations++;
      eventWiseCount[eventTitle].participants += 1 + (reg.teamMembers ? reg.teamMembers.length : 0);
    });

    summarySheet.addRows([
      { metric: 'Total External Registrations', value: externalRegistrations.length },
      { metric: 'Total External Participants', value: totalParticipants },
      { metric: 'Events with External Participation', value: events.length },
      { metric: 'Report Generated On', value: new Date().toLocaleString() },
      { metric: '' },
      { metric: 'BREAKDOWN BY EVENT' }
    ]);

    Object.entries(eventWiseCount).forEach(([eventTitle, data]) => {
      summarySheet.addRow({ metric: `${eventTitle}`, value: `${data.registrations} teams, ${data.participants} participants` });
    });

    // Style the summary sheet
    summarySheet.getRow(1).font = { bold: true, size: 14 };
    summarySheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' }
    };
    summarySheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    // Sheet 2: All External Participants (Detailed List)
    const detailedSheet = workbook.addWorksheet('All External Participants');

    detailedSheet.columns = [
      { header: 'S.No', key: 'sno', width: 8 },
      { header: 'Event Name', key: 'eventName', width: 25 },
      { header: 'Registration ID', key: 'regId', width: 18 },
      { header: 'Registration Date', key: 'regDate', width: 20 },
      { header: 'Event Date', key: 'eventDate', width: 15 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Participant Type', key: 'participantType', width: 18 },
      { header: 'Name', key: 'name', width: 25 },
      { header: 'College Name', key: 'collegeName', width: 35 },
      { header: 'Register Number', key: 'registerNumber', width: 20 },
      { header: 'Email (Leader Only)', key: 'email', width: 35 },
      { header: 'Phone (Leader Only)', key: 'phone', width: 15 }
    ];

    let serialNo = 1;
    externalRegistrations.forEach((reg) => {
      // Add team leader
      detailedSheet.addRow({
        sno: serialNo++,
        eventName: reg.eventId.title,
        regId: reg.regId,
        regDate: reg.createdAt ? reg.createdAt.toLocaleString() : 'N/A',
        eventDate: reg.finalEventDate,
        status: reg.status,
        participantType: 'Team Leader',
        name: reg.leader.name,
        collegeName: reg.leader.collegeName || 'N/A',
        registerNumber: reg.leader.collegeRegisterNumber || reg.leader.registerNumber || 'N/A',
        email: reg.leader.email,
        phone: reg.leader.phone
      });

      // Add team members
      if (reg.teamMembers && reg.teamMembers.length > 0) {
        reg.teamMembers.forEach((member) => {
          detailedSheet.addRow({
            sno: serialNo++,
            eventName: reg.eventId.title,
            regId: reg.regId,
            regDate: '',
            eventDate: reg.finalEventDate,
            status: reg.status,
            participantType: `Team Member`,
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
    detailedSheet.getRow(1).font = { bold: true, size: 12 };
    detailedSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF70AD47' }
    };
    detailedSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    // Sheet 3: Event-wise Summary
    const eventWiseSheet = workbook.addWorksheet('Event-wise Summary');

    eventWiseSheet.columns = [
      { header: 'Event Name', key: 'eventName', width: 30 },
      { header: 'Category', key: 'category', width: 25 },
      { header: 'Type', key: 'type', width: 15 },
      { header: 'Event Date', key: 'eventDate', width: 20 },
      { header: 'External Teams', key: 'externalTeams', width: 15 },
      { header: 'External Participants', key: 'externalParticipants', width: 20 },
      { header: 'Approved', key: 'approved', width: 12 },
      { header: 'Pending', key: 'pending', width: 12 },
      { header: 'Rejected', key: 'rejected', width: 12 }
    ];

    events.forEach(event => {
      const eventRegistrations = externalRegistrations.filter(reg => reg.eventId._id.toString() === event._id.toString());
      const eventParticipants = eventRegistrations.reduce((sum, reg) => {
        return sum + 1 + (reg.teamMembers ? reg.teamMembers.length : 0);
      }, 0);

      const approved = eventRegistrations.filter(r => r.status === 'APPROVED').length;
      const pending = eventRegistrations.filter(r => r.status === 'PENDING').length;
      const rejected = eventRegistrations.filter(r => r.status === 'REJECTED').length;

      eventWiseSheet.addRow({
        eventName: event.title,
        category: event.category,
        type: event.type,
        eventDate: event.dates.outside,
        externalTeams: eventRegistrations.length,
        externalParticipants: eventParticipants,
        approved: approved,
        pending: pending,
        rejected: rejected
      });
    });

    // Style the event-wise sheet
    eventWiseSheet.getRow(1).font = { bold: true, size: 12 };
    eventWiseSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFC000' }
    };
    eventWiseSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    // Sheet 4: Team Leaders Only
    const leadersSheet = workbook.addWorksheet('Team Leaders');

    leadersSheet.columns = [
      { header: 'S.No', key: 'sno', width: 8 },
      { header: 'Event Name', key: 'eventName', width: 25 },
      { header: 'Registration ID', key: 'regId', width: 18 },
      { header: 'Registration Date', key: 'regDate', width: 20 },
      { header: 'Leader Name', key: 'leaderName', width: 25 },
      { header: 'Email', key: 'email', width: 35 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'College Name', key: 'collegeName', width: 35 },
      { header: 'Register Number', key: 'registerNumber', width: 20 },
      { header: 'Team Size', key: 'teamSize', width: 12 },
      { header: 'Status', key: 'status', width: 12 }
    ];

    externalRegistrations.forEach((reg, index) => {
      leadersSheet.addRow({
        sno: index + 1,
        eventName: reg.eventId.title,
        regId: reg.regId,
        regDate: reg.createdAt ? reg.createdAt.toLocaleString() : 'N/A',
        leaderName: reg.leader.name,
        email: reg.leader.email,
        phone: reg.leader.phone,
        collegeName: reg.leader.collegeName || 'N/A',
        registerNumber: reg.leader.collegeRegisterNumber || reg.leader.registerNumber || 'N/A',
        teamSize: 1 + (reg.teamMembers ? reg.teamMembers.length : 0),
        status: reg.status
      });
    });

    // Style the leaders sheet
    leadersSheet.getRow(1).font = { bold: true, size: 11 };
    leadersSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF9966FF' }
    };
    leadersSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    // Save the workbook
    const outputDir = path.join(__dirname, '../outputs');
    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const filename = `all_external_registrations_${timestamp}.xlsx`;
    const filepath = path.join(outputDir, filename);

    await workbook.xlsx.writeFile(filepath);
    console.log(`\n✅ Excel file created successfully!`);
    console.log(`📁 File location: ${filepath}`);
    console.log(`\n📊 File contains:`);
    console.log(`   • ${externalRegistrations.length} external teams`);
    console.log(`   • ${totalParticipants} total external participants`);
    console.log(`   • ${events.length} events with external participation`);
    console.log(`\n📄 Sheets included:`);
    console.log(`   1. Summary Dashboard - Overview statistics`);
    console.log(`   2. All External Participants - Complete participant list`);
    console.log(`   3. Event-wise Summary - Breakdown by event`);
    console.log(`   4. Team Leaders - Team leader contact information`);

    // Disconnect
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

exportAllExternalRegistrationsToExcel();


