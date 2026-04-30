// ─────────────────────────────────────────────────────────────────
// PASTE THIS ENTIRE FILE into Google Apps Script, then deploy.
// Instructions at the bottom.
// ─────────────────────────────────────────────────────────────────

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Auto-create a styled header row on first submission
    if (sheet.getLastRow() === 0) {
      const headers = [
        'Timestamp', 'First Name', 'Last Name',
        'Email', 'Phone', 'Age', 'Gender', 'Programs', 'Message'
      ];
      sheet.appendRow(headers);
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold')
                 .setBackground('#2f6641')
                 .setFontColor('white');
      sheet.setFrozenRows(1);
      sheet.setColumnWidth(1, 180); // Timestamp
      sheet.setColumnWidth(4, 200); // Email
      sheet.setColumnWidth(8, 300); // Programs
      sheet.setColumnWidth(9, 300); // Message
    }

    const data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date().toLocaleString('en-AU', { timeZone: 'Australia/Melbourne' }),
      data.first_name || '',
      data.last_name  || '',
      data.email      || '',
      data.phone      || '',
      data.age        || '',
      data.gender     || '',
      Array.isArray(data.programs)
        ? data.programs.join(', ')
        : (data.programs || ''),
      data.message || ''
    ]);

    return ContentService
      .createTextResponse(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextResponse(JSON.stringify({ ok: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ─────────────────────────────────────────────────────────────────
// HOW TO DEPLOY (one-time setup, ~3 minutes):
//
// 1. Go to sheets.new  →  a new Google Sheet opens
// 2. Click Extensions → Apps Script
// 3. Delete all existing code and paste this entire file
// 4. Click Deploy → New Deployment
// 5. Type: Web App
//    Execute as: Me
//    Who has access: Anyone
// 6. Click Deploy → copy the Web App URL
// 7. Open .env.local in this project and replace the placeholder:
//    SHEETS_URL=<paste the URL here>
// 8. Run: npm run dev
//
// Done. Every form submission will appear as a new row in your Sheet.
// ─────────────────────────────────────────────────────────────────
