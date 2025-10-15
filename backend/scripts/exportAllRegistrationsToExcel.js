const mongoose = require('mongoose');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const config = require('../config');
const ExcelJS = require('exceljs');
const path = require('path');

async function exportAllRegistrationsToExcel() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all registrations (both internal and external students)
    const allRegistrations = await Registration.find({})
      .populate('eventId', 'title category type dates department club')
      .sort({ createdAt: 1 });

    console.log(`\nFound ${allRegistrations.length} total registrations across all events\n`);

    if (allRegistrations.length === 0) {
      console.log('No registrations found');
      process.exit(0);
    }

    // Get unique events that have registrations
    const eventIds = [...new Set(allRegistrations.map(reg => reg.eventId._id.toString()))];
    const events = await Event.find({ _id: { $in: eventIds } });

    console.log(`Events with registrations: ${events.length}`);

    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Gardenia2025 System';
    workbook.lastModifiedBy = 'Gardenia2025 System';
    workbook.created = new Date();

    // Sheet 1: Complete Registration Overview
    const overviewSheet = workbook.addWorksheet('Complete Registration Overview');

    // Add comprehensive headers
    overviewSheet.columns = [
      { header: 'S.No', key: 'sno', width: 8 },
      { header: 'Registration ID', key: 'regId', width: 18 },
      { header: 'Event Name', key: 'eventName', width: 30 },
      { header: 'Event Category', key: 'eventCategory', width: 25 },
      { header: 'Event Type', key: 'eventType', width: 15 },
      { header: 'Event Date', key: 'eventDate', width: 20 },
      { header: 'Registration Date', key: 'regDate', width: 20 },
      { header: 'Final Event Date', key: 'finalEventDate', width: 20 },
      { header: 'Student Type', key: 'studentType', width: 15 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Leader Name', key: 'leaderName', width: 25 },
      { header: 'Leader Email', key: 'leaderEmail', width: 35 },
      { header: 'Leader Phone', key: 'leaderPhone', width: 15 },
      { header: 'Leader College', key: 'leaderCollege', width: 35 },
      { header: 'Leader Register Number', key: 'leaderRegisterNumber', width: 20 },
      { header: 'Team Members Count', key: 'teamMembersCount', width: 18 },
      { header: 'Total Team Size', key: 'totalTeamSize', width: 15 },
      { header: 'Department', key: 'department', width: 25 },
      { header: 'Club', key: 'club', width: 25 }
    ];

    let serialNo = 1;
    allRegistrations.forEach((reg) => {
      overviewSheet.addRow({
        sno: serialNo++,
        regId: reg.regId,
        eventName: reg.eventId.title,
        eventCategory: reg.eventId.category,
        eventType: reg.eventId.type,
        eventDate: reg.eventId.dates.outside,
        regDate: reg.createdAt ? reg.createdAt.toLocaleString() : 'N/A',
        finalEventDate: reg.finalEventDate,
        studentType: reg.isGardenCityStudent ? 'Internal' : 'External',
        status: reg.status,
        leaderName: reg.leader.name,
        leaderEmail: reg.leader.email,
        leaderPhone: reg.leader.phone,
        leaderCollege: reg.leader.collegeName || 'Garden City University',
        leaderRegisterNumber: reg.leader.collegeRegisterNumber || reg.leader.registerNumber || 'N/A',
        teamMembersCount: reg.teamMembers ? reg.teamMembers.length : 0,
        totalTeamSize: 1 + (reg.teamMembers ? reg.teamMembers.length : 0),
        department: reg.eventId.department,
        club: reg.eventId.club || 'N/A'
      });
    });

    // Style the overview sheet
    overviewSheet.getRow(1).font = { bold: true, size: 12 };
    overviewSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' }
    };
    overviewSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    // Sheet 2: All Participants Detailed List
    const participantsSheet = workbook.addWorksheet('All Participants Detailed');

    participantsSheet.columns = [
      { header: 'S.No', key: 'sno', width: 8 },
      { header: 'Registration ID', key: 'regId', width: 18 },
      { header: 'Event Name', key: 'eventName', width: 30 },
      { header: 'Event Date', key: 'eventDate', width: 20 },
      { header: 'Registration Date', key: 'regDate', width: 20 },
      { header: 'Student Type', key: 'studentType', width: 15 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Participant Type', key: 'participantType', width: 18 },
      { header: 'Participant Name', key: 'participantName', width: 25 },
      { header: 'College Name', key: 'collegeName', width: 35 },
      { header: 'Register Number', key: 'registerNumber', width: 20 },
      { header: 'Email', key: 'email', width: 35 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Department', key: 'department', width: 25 }
    ];

    let participantSerialNo = 1;
    allRegistrations.forEach((reg) => {
      // Add team leader
      participantsSheet.addRow({
        sno: participantSerialNo++,
        regId: reg.regId,
        eventName: reg.eventId.title,
        eventDate: reg.finalEventDate,
        regDate: reg.createdAt ? reg.createdAt.toLocaleString() : 'N/A',
        studentType: reg.isGardenCityStudent ? 'Internal' : 'External',
        status: reg.status,
        participantType: 'Team Leader',
        participantName: reg.leader.name,
        collegeName: reg.leader.collegeName || 'Garden City University',
        registerNumber: reg.leader.collegeRegisterNumber || reg.leader.registerNumber || 'N/A',
        email: reg.leader.email,
        phone: reg.leader.phone,
        department: reg.eventId.department
      });

      // Add team members
      if (reg.teamMembers && reg.teamMembers.length > 0) {
        reg.teamMembers.forEach((member) => {
          participantsSheet.addRow({
            sno: participantSerialNo++,
            regId: reg.regId,
            eventName: reg.eventId.title,
            eventDate: reg.finalEventDate,
            regDate: '',
            studentType: reg.isGardenCityStudent ? 'Internal' : 'External',
            status: reg.status,
            participantType: 'Team Member',
            participantName: member.name,
            collegeName: member.collegeName || 'Garden City University',
            registerNumber: member.collegeRegisterNumber || member.registerNumber || 'N/A',
            email: '',
            phone: '',
            department: reg.eventId.department
          });
        });
      }
    });

    // Style the participants sheet
    participantsSheet.getRow(1).font = { bold: true, size: 12 };
    participantsSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF70AD47' }
    };
    participantsSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    // Sheet 3: Summary Statistics
    const summarySheet = workbook.addWorksheet('Summary Statistics');

    summarySheet.columns = [
      { header: 'Metric', key: 'metric', width: 40 },
      { header: 'Value', key: 'value', width: 20 }
    ];

    const totalParticipants = allRegistrations.reduce((sum, reg) => {
      return sum + 1 + (reg.teamMembers ? reg.teamMembers.length : 0);
    }, 0);

    const internalRegistrations = allRegistrations.filter(r => r.isGardenCityStudent).length;
    const externalRegistrations = allRegistrations.filter(r => !r.isGardenCityStudent).length;

    const internalParticipants = allRegistrations
      .filter(r => r.isGardenCityStudent)
      .reduce((sum, reg) => sum + 1 + (reg.teamMembers ? reg.teamMembers.length : 0), 0);

    const externalParticipants = allRegistrations
      .filter(r => !r.isGardenCityStudent)
      .reduce((sum, reg) => sum + 1 + (reg.teamMembers ? reg.teamMembers.length : 0), 0);

    const eventWiseCount = {};
    allRegistrations.forEach(reg => {
      const eventTitle = reg.eventId.title;
      if (!eventWiseCount[eventTitle]) {
        eventWiseCount[eventTitle] = { registrations: 0, participants: 0, internal: 0, external: 0 };
      }
      eventWiseCount[eventTitle].registrations++;
      eventWiseCount[eventTitle].participants += 1 + (reg.teamMembers ? reg.teamMembers.length : 0);
      if (reg.isGardenCityStudent) {
        eventWiseCount[eventTitle].internal++;
      } else {
        eventWiseCount[eventTitle].external++;
      }
    });

    const statusCounts = {};
    allRegistrations.forEach(reg => {
      if (!statusCounts[reg.status]) {
        statusCounts[reg.status] = 0;
      }
      statusCounts[reg.status]++;
    });

    summarySheet.addRows([
      { metric: 'TOTAL REGISTRATIONS & PARTICIPANTS' },
      { metric: 'Total Registrations', value: allRegistrations.length },
      { metric: 'Total Participants', value: totalParticipants },
      { metric: 'Events with Registrations', value: events.length },
      { metric: '' },
      { metric: 'BREAKDOWN BY STUDENT TYPE' },
      { metric: 'Internal (Garden City) Registrations', value: internalRegistrations },
      { metric: 'External Registrations', value: externalRegistrations },
      { metric: 'Internal (Garden City) Participants', value: internalParticipants },
      { metric: 'External Participants', value: externalParticipants },
      { metric: '' },
      { metric: 'BREAKDOWN BY STATUS' },
      { metric: 'Approved', value: statusCounts.APPROVED || 0 },
      { metric: 'Pending', value: statusCounts.PENDING || 0 },
      { metric: 'Rejected', value: statusCounts.REJECTED || 0 },
      { metric: '' },
      { metric: 'EVENT-WISE BREAKDOWN' }
    ]);

    Object.entries(eventWiseCount).forEach(([eventTitle, data]) => {
      summarySheet.addRow({
        metric: `${eventTitle}`,
        value: `${data.registrations} teams, ${data.participants} participants (${data.internal} internal, ${data.external} external)`
      });
    });

    // Style the summary sheet
    summarySheet.getRow(1).font = { bold: true, size: 14 };
    summarySheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFC000' }
    };
    summarySheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    // Sheet 4: Event-wise Detailed Summary
    const eventWiseSheet = workbook.addWorksheet('Event-wise Details');

    eventWiseSheet.columns = [
      { header: 'Event Name', key: 'eventName', width: 30 },
      { header: 'Category', key: 'category', width: 25 },
      { header: 'Type', key: 'type', width: 15 },
      { header: 'Department', key: 'department', width: 25 },
      { header: 'Club', key: 'club', width: 25 },
      { header: 'Event Date', key: 'eventDate', width: 20 },
      { header: 'Total Teams', key: 'totalTeams', width: 15 },
      { header: 'Total Participants', key: 'totalParticipants', width: 20 },
      { header: 'Internal Teams', key: 'internalTeams', width: 15 },
      { header: 'External Teams', key: 'externalTeams', width: 15 },
      { header: 'Approved', key: 'approved', width: 12 },
      { header: 'Pending', key: 'pending', width: 12 },
      { header: 'Rejected', key: 'rejected', width: 12 }
    ];

    events.forEach(event => {
      const eventRegistrations = allRegistrations.filter(reg => reg.eventId._id.toString() === event._id.toString());
      const eventParticipants = eventRegistrations.reduce((sum, reg) => {
        return sum + 1 + (reg.teamMembers ? reg.teamMembers.length : 0);
      }, 0);

      const internalTeams = eventRegistrations.filter(r => r.isGardenCityStudent).length;
      const externalTeams = eventRegistrations.filter(r => !r.isGardenCityStudent).length;

      const approved = eventRegistrations.filter(r => r.status === 'APPROVED').length;
      const pending = eventRegistrations.filter(r => r.status === 'PENDING').length;
      const rejected = eventRegistrations.filter(r => r.status === 'REJECTED').length;

      eventWiseSheet.addRow({
        eventName: event.title,
        category: event.category,
        type: event.type,
        department: event.department,
        club: event.club || 'N/A',
        eventDate: event.dates.outside,
        totalTeams: eventRegistrations.length,
        totalParticipants: eventParticipants,
        internalTeams: internalTeams,
        externalTeams: externalTeams,
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
      fgColor: { argb: 'FF9966FF' }
    };
    eventWiseSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    // Save the workbook
    const outputDir = path.join(__dirname, '../outputs');
    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const filename = `all_registrations_complete_${timestamp}.xlsx`;
    const filepath = path.join(outputDir, filename);

    await workbook.xlsx.writeFile(filepath);
    console.log(`\n✅ Complete Excel file created successfully!`);
    console.log(`📁 File location: ${filepath}`);
    console.log(`\n📊 File contains:`);
    console.log(`   • ${allRegistrations.length} total registrations`);
    console.log(`   • ${totalParticipants} total participants`);
    console.log(`   • ${events.length} events with registrations`);
    console.log(`   • Both internal and external students`);
    console.log(`\n📄 Sheets included:`);
    console.log(`   1. Complete Registration Overview - All registration details`);
    console.log(`   2. All Participants Detailed - Every individual participant`);
    console.log(`   3. Summary Statistics - Comprehensive statistics`);
    console.log(`   4. Event-wise Details - Detailed breakdown by event`);

    // Disconnect
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

exportAllRegistrationsToExcel();

