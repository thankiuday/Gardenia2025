# Admin Entry Export Guide

## Overview
This guide explains how administrators can export allowed and declined entry data in Excel format, and how these statistics are displayed in the admin dashboard.

## Features Implemented

### 1. Excel Export for Allowed Entries
**Endpoint:** `GET /api/admin/entries/allowed/export`

#### Authentication Required
All export endpoints require admin authentication. Include the JWT token in the Authorization header.

#### Access the Export
From the admin panel, you can access the allowed entries export. The system will generate an Excel file with all allowed entry data.

#### Excel Columns Include:
- Serial Number
- Registration ID
- Event Title, Category, Department, Type
- Event Date, Time, Location
- Student Type (GCU Student / External Participant)
- Team Size
- Leader Name, Email, Phone
- Leader Registration/College Information
- Team Member Names and Details
- Entry Scanned At (timestamp when QR was scanned)
- Entry Logged At (timestamp when entry was logged)
- Status

#### Example API Call:
```javascript
const token = localStorage.getItem('adminToken');
const response = await axios.get(
  'http://localhost:5000/api/admin/entries/allowed/export',
  {
    headers: { Authorization: `Bearer ${token}` },
    responseType: 'blob' // Important for file download
  }
);

// Create download link
const url = window.URL.createObjectURL(new Blob([response.data]));
const link = document.createElement('a');
link.href = url;
link.setAttribute('download', `Allowed_Entries_${new Date().toISOString().split('T')[0]}.xlsx`);
document.body.appendChild(link);
link.click();
link.remove();
```

#### File Name Format:
`Gardenia2025_Allowed_Entries_YYYY-MM-DD.xlsx`

---

### 2. Excel Export for Declined Entries
**Endpoint:** `GET /api/admin/entries/declined/export`

#### Same Features as Allowed Entries PLUS:
- **Decline Reason** column: Shows why entry was denied

#### Example API Call:
```javascript
const token = localStorage.getItem('adminToken');
const response = await axios.get(
  'http://localhost:5000/api/admin/entries/declined/export',
  {
    headers: { Authorization: `Bearer ${token}` },
    responseType: 'blob'
  }
);

// Create download link
const url = window.URL.createObjectURL(new Blob([response.data]));
const link = document.createElement('a');
link.href = url;
link.setAttribute('download', `Declined_Entries_${new Date().toISOString().split('T')[0]}.xlsx`);
document.body.appendChild(link);
link.click();
link.remove();
```

#### File Name Format:
`Gardenia2025_Declined_Entries_YYYY-MM-DD.xlsx`

---

### 3. Admin Dashboard Statistics

The admin dashboard now displays three new statistics cards:

#### Card 1: Allowed Entries
- **Icon:** Green checkmark
- **Shows:** Total number of entries that were allowed
- **Color Scheme:** Emerald green
- **API Field:** `totalAllowedEntries`

#### Card 2: Declined Entries
- **Icon:** Red X mark
- **Shows:** Total number of entries that were declined
- **Color Scheme:** Red
- **API Field:** `totalDeclinedEntries`

#### Card 3: Total Entry Scans
- **Icon:** QR code scanner
- **Shows:** Combined total of all entry scans (allowed + declined)
- **Color Scheme:** Cyan
- **API Field:** `totalEntries`

#### API Response Structure:
```json
{
  "success": true,
  "data": {
    "totalRegistrations": 500,
    "gcuRegistrations": 300,
    "outsideRegistrations": 200,
    "totalContacts": 50,
    "totalVisitors": 1000,
    "totalTicketDownloads": 450,
    // New entry statistics
    "totalAllowedEntries": 350,
    "totalDeclinedEntries": 25,
    "totalEntries": 375,
    "allowedEntriesPerEvent": [
      {
        "_id": "event_id",
        "eventTitle": "Event Name",
        "count": 50
      }
    ],
    "declinedEntriesPerEvent": [
      {
        "_id": "event_id",
        "eventTitle": "Event Name",
        "count": 5
      }
    ]
  }
}
```

---

## Query Parameters (Optional)

Both export endpoints support filtering:

### Filter by Event
```javascript
GET /api/admin/entries/allowed/export?eventId=EVENT_ID
```

### Search by Participant
```javascript
GET /api/admin/entries/allowed/export?search=John
```
Searches in: name, email, phone, registration ID

### Combine Filters
```javascript
GET /api/admin/entries/allowed/export?eventId=EVENT_ID&search=John
```

---

## Data Structure in Excel

### For GCU Students:
```
S.No | Reg ID | Event Title | ... | Leader Name | Leader Email | Leader Phone | 
Leader Register Number | Entry Scanned At | Entry Logged At | Team Member Names | 
Team Member Register Numbers | Status
```

### For External Students:
```
S.No | Reg ID | Event Title | ... | Leader Name | Leader Email | Leader Phone | 
Leader College/School Name | Leader College/School Registration Number | 
Entry Scanned At | Entry Logged At | Team Member Names | 
Team Member College/School Names | Team Member College/School Registration Numbers | Status
```

### For Declined Entries (Additional Column):
```
... | Decline Reason | ...
```

---

## Performance Considerations

### Maximum Records
- Maximum 50,000 records per export
- For larger datasets, use filters to reduce size

### Memory Optimization
- Automatic garbage collection for exports > 10,000 records
- Compressed Excel format reduces file size
- Streaming response for efficient memory usage

### File Size
Export files are automatically compressed with:
- Compression enabled
- Cell styles disabled for better performance
- Optimized column widths

---

## Error Handling

### Common Errors

#### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access token required"
}
```
**Solution:** Ensure you're logged in and include the JWT token.

#### 413 Payload Too Large
```json
{
  "success": false,
  "message": "Dataset too large for export. Please use filters to reduce the data size.",
  "recordCount": 55000,
  "maxAllowed": 50000
}
```
**Solution:** Use filters (eventId or search) to reduce the dataset.

#### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Unable to export entries. Please try again.",
  "timestamp": "2025-10-14T10:30:00.000Z"
}
```
**Solution:** Check server logs, verify MongoDB connection.

---

## Browser Usage Example

### Complete Frontend Implementation:

```javascript
// Function to export allowed entries
const exportAllowedEntries = async () => {
  try {
    const token = localStorage.getItem('adminToken');
    
    // Show loading indicator
    setLoading(true);
    
    const response = await axios.get(
      `${API_ENDPOINTS.ADMIN.BASE}/entries/allowed/export`,
      {
        headers: { 
          Authorization: `Bearer ${token}` 
        },
        responseType: 'blob'
      }
    );
    
    // Create blob URL
    const blob = new Blob([response.data], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    const url = window.URL.createObjectURL(blob);
    
    // Create temporary link and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Gardenia2025_Allowed_Entries_${new Date().toISOString().split('T')[0]}.xlsx`);
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    link.remove();
    window.URL.revokeObjectURL(url);
    
    // Show success message
    alert('Export completed successfully!');
  } catch (error) {
    console.error('Export failed:', error);
    alert('Failed to export data. Please try again.');
  } finally {
    setLoading(false);
  }
};

// Function to export declined entries
const exportDeclinedEntries = async () => {
  try {
    const token = localStorage.getItem('adminToken');
    
    setLoading(true);
    
    const response = await axios.get(
      `${API_ENDPOINTS.ADMIN.BASE}/entries/declined/export`,
      {
        headers: { 
          Authorization: `Bearer ${token}` 
        },
        responseType: 'blob'
      }
    );
    
    const blob = new Blob([response.data], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Gardenia2025_Declined_Entries_${new Date().toISOString().split('T')[0]}.xlsx`);
    document.body.appendChild(link);
    link.click();
    
    link.remove();
    window.URL.revokeObjectURL(url);
    
    alert('Export completed successfully!');
  } catch (error) {
    console.error('Export failed:', error);
    alert('Failed to export data. Please try again.');
  } finally {
    setLoading(false);
  }
};
```

### Add Export Buttons to Your Admin Panel:

```jsx
<div className="flex gap-4">
  <button
    onClick={exportAllowedEntries}
    disabled={loading}
    className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50"
  >
    {loading ? 'Exporting...' : 'Export Allowed Entries'}
  </button>
  
  <button
    onClick={exportDeclinedEntries}
    disabled={loading}
    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
  >
    {loading ? 'Exporting...' : 'Export Declined Entries'}
  </button>
</div>
```

---

## Security Features

1. **Authentication Required:** All export endpoints require valid admin JWT token
2. **Authorization Check:** Only authenticated admins can access exports
3. **Data Validation:** All queries are validated before execution
4. **Error Handling:** Sensitive information is not exposed in error messages
5. **Rate Limiting:** Export endpoints are protected by rate limiting (if enabled)

---

## Testing the Implementation

### 1. Test Admin Dashboard Stats
```bash
# Login as admin first
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your_password"}'

# Get stats (use token from login response)
curl http://localhost:5000/api/admin/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 2. Test Allowed Entries Export
```bash
curl http://localhost:5000/api/admin/entries/allowed/export \
  -H "Authorization: Bearer YOUR_TOKEN" \
  --output allowed_entries.xlsx
```

### 3. Test Declined Entries Export
```bash
curl http://localhost:5000/api/admin/entries/declined/export \
  -H "Authorization: Bearer YOUR_TOKEN" \
  --output declined_entries.xlsx
```

### 4. Test with Filters
```bash
# Filter by event
curl "http://localhost:5000/api/admin/entries/allowed/export?eventId=EVENT_ID" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  --output filtered_allowed.xlsx

# Search by name
curl "http://localhost:5000/api/admin/entries/allowed/export?search=John" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  --output searched_allowed.xlsx
```

---

## Files Modified/Created

### Backend Files:
1. **`backend/models/AllowedEntry.js`** - Schema for allowed entries (already created)
2. **`backend/models/DeclineEntry.js`** - Schema for declined entries (already created)
3. **`backend/routes/admin.js`** - Added:
   - Import statements for AllowedEntry and DeclineEntry models
   - Updated `/stats` endpoint to include entry statistics
   - New `/entries/allowed/export` endpoint
   - New `/entries/declined/export` endpoint
4. **`backend/routes/registrations.js`** - Entry logging endpoint (already updated)

### Frontend Files:
1. **`frontend/src/pages/admin/AdminDashboard.jsx`** - Added:
   - Three new statistics cards (Allowed Entries, Declined Entries, Total Scans)
   - Icons and styling for entry statistics

### Documentation Files:
1. **`ENTRY_LOGGING_IMPLEMENTATION.md`** - Complete implementation documentation
2. **`ADMIN_ENTRY_EXPORT_GUIDE.md`** - This guide

---

## Support & Troubleshooting

### Issue: Export button not working
**Check:**
- Admin is logged in
- JWT token is valid
- Backend server is running
- Network connection is stable

### Issue: Empty Excel file
**Check:**
- Data exists in database (check MongoDB collections: `allowedentries`, `declineentries`)
- Filters are not too restrictive
- Query is not returning 0 results

### Issue: Excel file won't download
**Check:**
- Browser allows downloads
- No popup blockers preventing download
- `responseType: 'blob'` is set in axios request

### Issue: Statistics not showing on dashboard
**Check:**
- Backend stats endpoint is returning new fields
- Frontend is using latest version with updated component
- Browser cache is cleared

---

## Next Steps

To fully integrate these features into your admin panel:

1. **Add Export Buttons:** Create a dedicated page or section for entry management with export buttons
2. **Add Visual Analytics:** Consider adding charts to visualize allowed vs declined entries over time
3. **Add Filtering UI:** Create filter controls for event and search parameters
4. **Add Download History:** Track which exports were downloaded and by whom
5. **Add Scheduled Exports:** Implement automatic daily/weekly exports via email

---

## Conclusion

The entry export system provides administrators with comprehensive tools to:
- Export allowed and declined entry data in Excel format
- View entry statistics in real-time on the dashboard
- Filter and search exports by event or participant
- Track entry patterns and monitor event attendance

All exports include complete participant information, timestamps, and event details for comprehensive record-keeping and analysis.




