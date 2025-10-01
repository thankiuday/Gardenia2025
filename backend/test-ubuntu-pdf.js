// Test script for Ubuntu 22.04 PDF generation
const puppeteer = require('puppeteer');
const fs = require('fs');

async function testUbuntuPDF() {
  
  // Check for Chrome/Chromium installations
  const possiblePaths = [
    '/usr/bin/google-chrome-stable',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium'
  ];
  
  let executablePath = null;
  for (const path of possiblePaths) {
    if (fs.existsSync(path)) {
      executablePath = path;
      break;
    }
  }
  
  try {
    const launchOptions = {
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--disable-gpu'
      ]
    };
    
    if (executablePath) {
      launchOptions.executablePath = executablePath;
    }
    
    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();
    
    await page.setContent(`
      <html>
        <body>
          <h1>Ubuntu 22.04 PDF Test</h1>
          <p>This PDF was generated on Ubuntu 22.04</p>
          <p>Timestamp: ${new Date().toISOString()}</p>
        </body>
      </html>
    `);
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });
    
    // Save test PDF
    fs.writeFileSync('ubuntu-test.pdf', pdfBuffer);
    
    await browser.close();
    return true;
  } catch (error) {
    console.error('❌ PDF generation failed:', error.message);
    return false;
  }
}

testUbuntuPDF().then(success => {
  process.exit(success ? 0 : 1);
});
