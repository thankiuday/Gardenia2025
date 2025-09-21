/**
 * Download Helper Utility
 * Handles file downloads with fallbacks for different browser behaviors
 */

/**
 * Force download a file from a URL
 * @param {string} url - The URL to download from
 * @param {string} filename - The filename for the download
 */
export const forceDownload = async (url, filename) => {
  try {
    // Method 1: Try direct download with download attribute
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    // Add additional attributes to force download
    link.setAttribute('download', filename);
    link.setAttribute('target', '_self');
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('✅ Download initiated with direct method');
    return true;
  } catch (error) {
    console.warn('Direct download failed, trying fetch method:', error);
    
    try {
      // Method 2: Fetch and create blob URL
      const response = await fetch(url, {
        mode: 'cors',
        credentials: 'omit'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up blob URL after a delay
      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
      }, 1000);
      
      console.log('✅ Download initiated with fetch method');
      return true;
    } catch (fetchError) {
      console.warn('Fetch download failed, trying iframe method:', fetchError);
      
      try {
        // Method 3: Use hidden iframe (fallback for older browsers)
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = url;
        document.body.appendChild(iframe);
        
        // Remove iframe after download starts
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 2000);
        
        console.log('✅ Download initiated with iframe method');
        return true;
      } catch (iframeError) {
        console.error('All download methods failed:', iframeError);
        return false;
      }
    }
  }
};

/**
 * Download a PDF ticket with proper filename
 * @param {string} pdfUrl - The PDF URL
 * @param {string} registrationId - The registration ID
 */
export const downloadTicket = async (pdfUrl, registrationId) => {
  const filename = `Gardenia2025-Ticket-${registrationId}.pdf`;
  return await forceDownload(pdfUrl, filename);
};

/**
 * Show download instructions to user
 * @param {string} pdfUrl - The PDF URL
 * @param {string} registrationId - The registration ID
 */
export const showDownloadInstructions = (pdfUrl, registrationId) => {
  const filename = `Gardenia2025-Ticket-${registrationId}.pdf`;
  
  const instructions = `
Your ticket is ready for download!

If the download didn't start automatically:
1. Right-click on this link and select "Save link as..."
2. Save the file as: ${filename}

Or click the download button below.

Download Link: ${pdfUrl}
  `;
  
  alert(instructions);
};
