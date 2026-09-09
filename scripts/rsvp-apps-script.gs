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
 */

var SHEET_NAME = 'RSVPs'
var HEADERS = ['Received', 'Side', 'Name', 'Guests', 'Sent at']

function doPost(e) {
  /* Two guests replying in the same second would otherwise race for
     the same row. */
  var lock = LockService.getScriptLock()
  lock.waitLock(20000)

  try {
    var reply = JSON.parse(e.postData.contents)
    var sheet = getSheet_()

    sheet.appendRow([
      new Date(),
      reply.side === 'bride' ? "Bride's side" : "Groom's side",
      String(reply.name || '').slice(0, 120),
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
  }
  return sheet
}

function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  )
}
