// Test script for Ubuntu 22.04 PDF generation
const puppeteer = require('puppeteer');
const fs = require('fs');

async function testUbuntuPDF() {
  console.log('Testing PDF generation on Ubuntu 22.04...');
  console.log('Platform:', process.platform);
  
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
      console.log('Found browser at:', path);
      break;
    }
  }
  
  if (!executablePath) {
    console.log('No browser found, using bundled Chromium');
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
    
    console.log('Launching browser with options:', launchOptions);
    
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
    
    console.log('✅ PDF generated successfully!');
    console.log('PDF size:', pdfBuffer.length, 'bytes');
    
    // Save test PDF
    fs.writeFileSync('ubuntu-test.pdf', pdfBuffer);
    console.log('Test PDF saved as ubuntu-test.pdf');
    
    await browser.close();
    return true;
  } catch (error) {
    console.error('❌ PDF generation failed:', error.message);
    return false;
  }
}

testUbuntuPDF().then(success => {
  if (success) {
    console.log('🎉 Ubuntu 22.04 PDF generation test passed!');
  } else {
    console.log('💥 Ubuntu 22.04 PDF generation test failed!');
  }
  process.exit(success ? 0 : 1);
});
