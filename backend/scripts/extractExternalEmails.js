const mongoose = require('mongoose');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const config = require('../config');
const fs = require('fs');
const path = require('path');

async function extractExternalEmails() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all external registrations (isGardenCityStudent: false)
    const externalRegistrations = await Registration.find({
      isGardenCityStudent: false
    })
    .populate('eventId', 'title')
    .sort({ createdAt: 1 });

    console.log(`\nFound ${externalRegistrations.length} external student registrations\n`);

    if (externalRegistrations.length === 0) {
      console.log('No external registrations found');
      process.exit(0);
    }

    // Extract all unique emails
    const allEmails = new Set();
    const emailDetails = [];

    externalRegistrations.forEach((reg) => {
      // Add team leader email
      if (reg.leader.email) {
        allEmails.add(reg.leader.email);
        emailDetails.push({
          email: reg.leader.email,
          name: reg.leader.name,
          event: reg.eventId.title,
          type: 'Team Leader',
          registrationId: reg.regId,
          registrationDate: reg.createdAt ? reg.createdAt.toLocaleString() : 'N/A'
        });
      }

      // Add team member emails
      if (reg.teamMembers && reg.teamMembers.length > 0) {
        reg.teamMembers.forEach((member) => {
          // Note: Team members might not have email in the current schema
          // But if they do, we'll include them
          if (member.email) {
            allEmails.add(member.email);
            emailDetails.push({
              email: member.email,
              name: member.name,
              event: reg.eventId.title,
              type: 'Team Member',
              registrationId: reg.regId,
              registrationDate: reg.createdAt ? reg.createdAt.toLocaleString() : 'N/A'
            });
          }
        });
      }
    });

    console.log(`Found ${allEmails.size} unique external participant emails`);

    // Create output content
    let outputText = '='.repeat(80) + '\n';
    outputText += 'EXTERNAL PARTICIPANT EMAILS - GARDENIA 2025\n';
    outputText += '='.repeat(80) + '\n\n';
    outputText += `Total Unique Emails: ${allEmails.size}\n`;
    outputText += `Total External Registrations: ${externalRegistrations.length}\n`;
    outputText += `Generated on: ${new Date().toLocaleString()}\n`;
    outputText += '='.repeat(80) + '\n\n';

    // Add summary section
    outputText += 'EMAIL SUMMARY:\n';
    outputText += '-'.repeat(80) + '\n';

    const emailsArray = Array.from(allEmails).sort();
    emailsArray.forEach((email, index) => {
      outputText += `${index + 1}. ${email}\n`;
    });

    outputText += '\n' + '='.repeat(80) + '\n';
    outputText += 'DETAILED BREAKDOWN:\n';
    outputText += '='.repeat(80) + '\n\n';

    // Group by event for detailed breakdown
    const eventGroups = {};
    emailDetails.forEach(detail => {
      if (!eventGroups[detail.event]) {
        eventGroups[detail.event] = [];
      }
      eventGroups[detail.event].push(detail);
    });

    Object.keys(eventGroups).sort().forEach(eventName => {
      outputText += `EVENT: ${eventName}\n`;
      outputText += '-'.repeat(80) + '\n';

      eventGroups[eventName].forEach((detail, index) => {
        outputText += `${index + 1}. ${detail.name} (${detail.type})\n`;
        outputText += `   Email: ${detail.email}\n`;
        outputText += `   Registration ID: ${detail.registrationId}\n`;
        outputText += `   Registration Date: ${detail.registrationDate}\n\n`;
      });
    });

    // Save to file
    const outputDir = path.join(__dirname, '../outputs');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const filename = `external_participant_emails_${timestamp}.txt`;
    const filepath = path.join(outputDir, filename);

    fs.writeFileSync(filepath, outputText, 'utf8');
    console.log(`\n✅ Email list saved successfully!`);
    console.log(`📁 File location: ${filepath}`);
    console.log(`📧 Total unique emails: ${allEmails.size}`);

    // Also create a simple email list file (just emails, one per line)
    const simpleEmailList = emailsArray.join('\n');
    const simpleFilename = `external_emails_simple_${timestamp}.txt`;
    const simpleFilepath = path.join(outputDir, simpleFilename);

    fs.writeFileSync(simpleFilepath, simpleEmailList, 'utf8');
    console.log(`📋 Simple email list saved: ${simpleFilepath}`);

    // Disconnect
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

extractExternalEmails();

