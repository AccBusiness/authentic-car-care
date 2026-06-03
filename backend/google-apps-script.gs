/**
 * Authentic Car Care — booking lead catcher
 * Receives a booking from the website, then:
 *   1. Appends a row to a Google Sheet (your lead log)
 *   2. Emails you a notification
 *   3. Saves any uploaded photos to a Drive folder
 *
 * SETUP: see backend/SETUP.md for click-by-click instructions.
 */

// ---- CONFIG — change these two if you want ----
var NOTIFY_EMAIL = 'getauthenticcare@gmail.com';   // where lead alerts go
var DRIVE_FOLDER_NAME = 'Authentic Car Care — booking photos';
// -----------------------------------------------

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    // 1) ---- Append to the Sheet ----
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Leads')
             || SpreadsheetApp.getActiveSpreadsheet().insertSheet('Leads');

    // Write a header row once.
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Received', 'Name', 'Phone', 'Email', 'Address',
        'Vehicle', 'Service', 'Add-ons', 'Estimated total',
        'Preferred date', 'Preferred time', 'Notes', 'Photos'
      ]);
      sheet.getRange(1, 1, 1, 13).setFontWeight('bold');
    }

    // 3) ---- Save photos to Drive (if any) ----
    var photoLinks = [];
    var bookingFolderUrl = '';
    if (data.photos && data.photos.length) {
      var parentFolder = getOrCreateFolder_(DRIVE_FOLDER_NAME);
      var stamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd_HH-mm');
      var safeName = (data.name || 'lead').replace(/[^a-zA-Z0-9 ]/g, '').trim() || 'lead';
      // One subfolder per booking, named after the customer + date.
      var bookingFolder = parentFolder.createFolder(safeName + ' — ' + stamp);
      bookingFolder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      bookingFolderUrl = bookingFolder.getUrl();
      data.photos.forEach(function (p, i) {
        try {
          var parts = p.split(',');                 // data:image/jpeg;base64,XXXX
          var meta = parts[0];
          var b64 = parts[1];
          var mime = meta.substring(meta.indexOf(':') + 1, meta.indexOf(';')) || 'image/jpeg';
          var ext = mime.split('/')[1] || 'jpg';
          var blob = Utilities.newBlob(Utilities.base64Decode(b64), mime,
                       safeName + '_' + (i + 1) + '.' + ext);
          var file = bookingFolder.createFile(blob);
          file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
          photoLinks.push(file.getUrl());
        } catch (errPhoto) {
          photoLinks.push('(photo ' + (i + 1) + ' failed to save)');
        }
      });
    }

    var row = [
      new Date(),
      data.name || '', data.phone || '', data.email || '', data.address || '',
      data.vehicle || '', data.service || '', data.addons || '', data.total || '',
      data.date || '', data.time || '', data.notes || '',
      // Link to the customer's folder first, then the individual photo links.
      (bookingFolderUrl ? 'Folder: ' + bookingFolderUrl + '\n' : '') + photoLinks.join('\n')
    ];
    sheet.appendRow(row);

    // 2) ---- Email notification ----
    var body =
      'New booking request from the website:\n\n' +
      'Name:      ' + (data.name || '') + '\n' +
      'Phone:     ' + (data.phone || '') + '\n' +
      'Email:     ' + (data.email || '') + '\n' +
      'Address:   ' + (data.address || '') + '\n' +
      'Vehicle:   ' + (data.vehicle || '') + '\n' +
      'Service:   ' + (data.service || '') + '\n' +
      'Add-ons:   ' + (data.addons || '—') + '\n' +
      'Estimate:  ' + (data.total || '') + '\n' +
      'Date:      ' + (data.date || '') + '\n' +
      'Time:      ' + (data.time || '') + '\n' +
      'Notes:     ' + (data.notes || '—') + '\n' +
      (bookingFolderUrl ? '\nPhoto folder: ' + bookingFolderUrl + '\n' : '') +
      (photoLinks.length ? '\nPhotos:\n' + photoLinks.join('\n') + '\n' : '') +
      '\n— sent automatically from authenticcarcare website';

    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: 'New booking — ' + (data.name || 'website lead') + ' (' + (data.service || '') + ')',
      body: body,
      replyTo: data.email || NOTIFY_EMAIL
    });

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function getOrCreateFolder_(name) {
  var it = DriveApp.getFoldersByName(name);
  return it.hasNext() ? it.next() : DriveApp.createFolder(name);
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
