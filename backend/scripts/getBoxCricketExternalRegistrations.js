const mongoose = require('mongoose');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const config = require('../config');
const fs = require('fs');
const path = require('path');

async function getBoxCricketExternalRegistrations() {
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

    // Format output as text
    let outputText = '='.repeat(80) + '\n';
    outputText += 'BOX CRICKET - EXTERNAL PARTICIPANT REGISTRATIONS\n';
    outputText += '='.repeat(80) + '\n\n';
    outputText += `Event: ${boxCricketEvent.title}\n`;
    outputText += `Event Date (External): ${boxCricketEvent.dates.outside}\n`;
    outputText += `Total External Registrations: ${registrations.length}\n`;
    outputText += `Generated on: ${new Date().toLocaleString()}\n`;
    outputText += '='.repeat(80) + '\n\n';

    registrations.forEach((reg, index) => {
      outputText += `REGISTRATION #${index + 1}\n`;
      outputText += '-'.repeat(80) + '\n';
      outputText += `Registration ID: ${reg.regId}\n`;
      outputText += `Registration Date: ${reg.createdAt ? reg.createdAt.toLocaleString() : 'N/A'}\n`;
      outputText += `Event Date: ${reg.finalEventDate}\n`;
      outputText += `Status: ${reg.status}\n\n`;

      // Leader information
      outputText += `TEAM LEADER:\n`;
      outputText += `  Name: ${reg.leader.name}\n`;
      outputText += `  Email: ${reg.leader.email}\n`;
      outputText += `  Phone: ${reg.leader.phone}\n`;
      outputText += `  College Name: ${reg.leader.collegeName || 'N/A'}\n`;
      outputText += `  College Register Number: ${reg.leader.collegeRegisterNumber || 'N/A'}\n\n`;

      // Team members
      if (reg.teamMembers && reg.teamMembers.length > 0) {
        outputText += `TEAM MEMBERS (${reg.teamMembers.length}):\n`;
        reg.teamMembers.forEach((member, memberIndex) => {
          outputText += `  ${memberIndex + 1}. Name: ${member.name}\n`;
          if (member.collegeName) {
            outputText += `     College Name: ${member.collegeName}\n`;
          }
          if (member.collegeRegisterNumber) {
            outputText += `     College Register Number: ${member.collegeRegisterNumber}\n`;
          }
          outputText += '\n';
        });
      } else {
        outputText += `TEAM MEMBERS: None\n\n`;
      }

      outputText += `Total Team Size: ${1 + (reg.teamMembers ? reg.teamMembers.length : 0)} members\n`;
      outputText += '\n' + '='.repeat(80) + '\n\n';
    });

    // Summary statistics
    outputText += '\n' + '='.repeat(80) + '\n';
    outputText += 'SUMMARY STATISTICS\n';
    outputText += '='.repeat(80) + '\n';
    outputText += `Total Registrations: ${registrations.length}\n`;
    
    const totalParticipants = registrations.reduce((sum, reg) => {
      return sum + 1 + (reg.teamMembers ? reg.teamMembers.length : 0);
    }, 0);
    outputText += `Total Participants: ${totalParticipants}\n`;

    const approvedCount = registrations.filter(r => r.status === 'APPROVED').length;
    const pendingCount = registrations.filter(r => r.status === 'PENDING').length;
    const rejectedCount = registrations.filter(r => r.status === 'REJECTED').length;
    
    outputText += `Approved: ${approvedCount}\n`;
    outputText += `Pending: ${pendingCount}\n`;
    outputText += `Rejected: ${rejectedCount}\n`;
    outputText += '='.repeat(80) + '\n';

    // Print to console
    console.log(outputText);

    // Save to file
    const outputDir = path.join(__dirname, '../outputs');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const filename = `box_cricket_external_registrations_${timestamp}.txt`;
    const filepath = path.join(outputDir, filename);
    
    fs.writeFileSync(filepath, outputText, 'utf8');
    console.log(`\nData saved to: ${filepath}`);

    // Disconnect
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

getBoxCricketExternalRegistrations();











