/**
 * RSVP receiver for the Suraj & Varsha invite.
 *
 * Paste this into a Google Sheet's Apps Script editor
 * (Extensions -> Apps Script), deploy it as a web app, and put the
 * /exec URL it gives you into RSVP_FORM.endpoint in
 * src/data/wedding.js. Full steps are in the README.
 *
 * Every reply becomes one row. A guest who replies twice makes two
 * rows rather than overwriting the first — the timestamps say which
 * is current, and you keep the trail of what changed.
 *
 * AFTER EDITING THIS FILE you must re-deploy: Deploy -> Manage
 * deployments -> the pencil -> Version: New version -> Deploy. The
 * /exec URL stays the same, but until you do it the live endpoint
 * is still running the old code and the new column never appears.
 */

var SHEET_NAME = 'RSVPs'
var HEADERS = ['Received', 'Side', 'Name', 'Phone', 'Guests', 'Sent at']

function doPost(e) {
  /* Two guests replying in the same second would otherwise race for
     the same row. */
  var lock = LockService.getScriptLock()
  lock.waitLock(20000)

  try {
    var reply = JSON.parse(e.postData.contents)
    var sheet = getSheet_()

    var phone = String(reply.phone || '').slice(0, 32)

    sheet.appendRow([
      new Date(),
      reply.side === 'bride' ? "Bride's side" : "Groom's side",
      String(reply.name || '').slice(0, 120),
      /* Leading apostrophe forces Sheets to keep this as text. A
         bare +91… is read as a formula and a leading 0 is dropped
         off the front of the number, and either way you are left
         with something you cannot dial. */
      phone ? "'" + phone : '',
      Number(reply.guests) || 0,
      reply.at || '',
    ])

    return json_({ ok: true })
  } catch (err) {
    return json_({ ok: false, error: String(err) })
  } finally {
    lock.releaseLock()
  }
}

/* Opening the /exec URL in a browser should say something friendly
   rather than error — it is how you check the deploy worked. */
function doGet() {
  return json_({ ok: true, message: 'RSVP endpoint is live.' })
}

function getSheet_() {
  var book = SpreadsheetApp.getActiveSpreadsheet()
  var sheet = book.getSheetByName(SHEET_NAME)

  if (!sheet) {
    sheet = book.insertSheet(SHEET_NAME)
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS)
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold')
    sheet.setFrozenRows(1)
  } else {
    migrateHeaders_(sheet)
  }
  return sheet
}

/* A sheet that already has replies in it never runs the header
   write above, so adding a column to HEADERS would otherwise put
   every new row out of step with the titles above it — phone
   numbers filed under "Guests". This puts the missing columns in
   where they belong and shifts the existing data across with them,
   so the rows already collected stay correct.

   Runs on every reply and does nothing once the headers match. */
function migrateHeaders_(sheet) {
  var width = Math.max(sheet.getLastColumn(), 1)
  var have = sheet.getRange(1, 1, 1, width).getValues()[0]

  for (var i = 0; i < HEADERS.length; i++) {
    if (String(have[i] || '').trim() === HEADERS[i]) continue

    /* Insert rather than overwrite, so the value sitting here — it
       belongs to the next header along, not to this one — and the
       whole column of data under it move across together. Past the
       last column there is nothing to push, so the title is simply
       written in. */
    if (i < sheet.getLastColumn()) {
      sheet.insertColumnBefore(i + 1)
    }
    sheet.getRange(1, i + 1).setValue(HEADERS[i]).setFontWeight('bold')
    have = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
  }
}

function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  )
}
