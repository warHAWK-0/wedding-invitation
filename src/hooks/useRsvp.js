import { useCallback, useState } from 'react'
import { RSVP_FORM } from '../data/wedding'

/* ============================================================
   Sending a reply.

   The site has no backend, so replies go to a Google Apps Script
   web app that appends a row to a Google Sheet. The family reads
   the replies in a spreadsheet; nothing here needs a server, and
   there is no key in the bundle to leak.

   Two things about posting to Apps Script are worth knowing,
   because they are why this is not a two-line fetch:

   1. The request has to stay a "simple" one or the browser sends
      a CORS preflight, which Apps Script does not answer. Sending
      it as text/plain keeps it simple; the script parses the body
      as JSON regardless of the header we claim.
   2. Apps Script answers a POST with a redirect to a different
      Google host. That final response usually carries permissive
      CORS headers, so the reply can be read and genuinely
      confirmed — but not on every account. So: try to read the
      answer, and if the browser won't let us, send it again as an
      opaque no-cors request, which always goes through but tells
      us nothing back.

   The guest sees one success either way. What we never do is
   report success when the request did not leave the device.
   ============================================================ */

const STORE = 'sv-invite-rsvp'

export function readStoredRsvp() {
  try {
    const raw = localStorage.getItem(STORE)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null // private mode, blocked storage, or a bad write
  }
}

function remember(reply) {
  try {
    localStorage.setItem(STORE, JSON.stringify(reply))
  } catch {
    /* The reply is already sent; failing to note it locally only
       means this guest is offered the form again. */
  }
}

export default function useRsvp() {
  /* 'idle' | 'sending' | 'done' | 'error' */
  const [status, setStatus] = useState(() => (readStoredRsvp() ? 'done' : 'idle'))
  const [reply, setReply] = useState(readStoredRsvp)
  const [error, setError] = useState(null)

  const submit = useCallback(async ({ name, guests, side }) => {
    if (!RSVP_FORM.endpoint) {
      setError(
        'This form is not connected yet. Please tell the family directly for now.'
      )
      setStatus('error')
      return false
    }

    setStatus('sending')
    setError(null)

    const payload = {
      name: name.trim(),
      guests,
      side,
      at: new Date().toISOString(),
    }
    const body = JSON.stringify(payload)
    const headers = { 'Content-Type': 'text/plain;charset=utf-8' }

    let sent = false
    /* Answered, and said no. Worth separating from "we could not
       read the answer", because an opaque request resolves for a
       500 exactly as it does for a 200 — so retrying a refusal
       opaquely would turn a real failure into a false success. */
    let refused = false

    try {
      const res = await fetch(RSVP_FORM.endpoint, { method: 'POST', headers, body })
      /* A readable answer means we know which way it went — but
         the status alone is not the answer. Apps Script catches
         its own errors and reports them as {ok:false} with a
         perfectly healthy 200, so a sheet that has been renamed
         or had its permission revoked would look like success
         here. Read the body and believe what it says. */
      if (res.ok) {
        const said = await res.clone().json().catch(() => null)
        if (said && said.ok === false) refused = true
        else sent = true
      } else {
        refused = true
      }
    } catch {
      /* Either the browser hid the answer from us or the network
         failed; we cannot yet tell which. */
    }

    if (!sent && !refused) {
      /* Send it again opaquely. If this resolves, the request left
         the device — which is as much as an opaque response can
         ever tell us. The one case this cannot catch is an endpoint
         that is both CORS-opaque and failing; there is no way to
         read that from the browser, and the guest keeps a local
         copy of the reply either way. */
      try {
        await fetch(RSVP_FORM.endpoint, {
          method: 'POST',
          mode: 'no-cors',
          headers,
          body,
        })
        sent = true
      } catch {
        sent = false
      }
    }

    if (!sent) {
      setError('That did not go through. Please check your connection and try again.')
      setStatus('error')
      return false
    }

    remember(payload)
    setReply(payload)
    setStatus('done')
    return true
  }, [])

  /* Lets a guest correct a reply they already sent. The sheet
     keeps both rows, timestamped, so the later one wins. */
  const reset = useCallback(() => {
    setStatus('idle')
    setError(null)
  }, [])

  return { status, reply, error, submit, reset }
}
