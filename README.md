# Suraj & Varsha — wedding invite site

A single-page mobile invite. No backend and no accounts. Guests reply on a form
slide at the end, and the replies land as rows in a Google Sheet you can sort
and count.

This is a cross-cultural wedding, so **one link serves both families**. The
first screen after the envelope asks the guest to swipe — right for the groom's
side, left for the bride's — and from there the invite runs one of two flows:

|  | Groom's side | Bride's side |
|---|---|---|
| Language | Hindi (Devanagari) | Tamil |
| Ceremonies | 5 | 3 |
| Countdown to | Ganesh Puja, 10 AM on the 13th | the evening of the 13th |

Shared functions appear on both, each in that family's own language. The choice
is remembered for the session, and the closing slide has a quiet link to switch
if a guest swiped the wrong way.

---

## Run it

```bash
cd wedding-invite
npm install
npm run dev
```

Open the printed localhost URL. It's built for a 430px phone width and centres
itself on desktop.

## Put it online

```bash
npm install -g vercel      # once
vercel login               # once
npm run build
vercel --prod --yes
```

After the first deploy, updates are just `npm run build` then
`vercel --prod --yes`. The link stays the same, so guests never need a new one.

---

## Editing content

**Everything you'll want to change lives in `src/data/wedding.js`.** Names,
dates, times, venues, Maps links, the blessing, the contact number, and the RSVP
form's wording and endpoint are all in there. You shouldn't need to touch any
component file to change wording.

### How the two sides are stored

`EVENTS` is one list, in the order the functions actually happen. Each entry is
tagged with the `sides` that attend it, and carries a `groom` and/or `bride`
block holding that side's own wording:

```js
{
  id: 'muhurtham',
  sides: ['groom', 'bride'],   // both families attend
  time: '3:00 PM onwards',
  groom: { native: 'वरमाला एवं विवाह', en: 'Varmala & Wedding', ... },
  bride: { native: 'மாலை மாற்றல் & கல்யாணம்', en: 'Maalai Maatral & Kalyanam', ... },
}
```

A function only one family attends simply has the one block, and only appears
on that side. `eventsForSide()` flattens an entry down to a single language
before it reaches a slide, so **no component ever branches on Hindi vs Tamil** —
add a function by adding an entry, and both flows update.

Per-side names, family lines and greetings live in `SIDE_COPY`; the blessing and
the RSVP contact are keyed by side in `BLESSING` and `RSVP`.

### Still needs your call

Four things in that file are marked `TODO`:

- **`SIDES.bride.house` and `SIDE_COPY.bride.family`** — the bride's side is
  invited under "The Family of Varsha" as a placeholder. Confirm the name the
  family should be named by.
- **`VENUES.home`** — the Ganesh puja, the groom's haldi and the start of the
  baraat are all "at the groom's house", set here to Elegance Samruddhi on the
  assumption that's where the family is staying. Put the real address in if not.
- **`BLESSING`** — the wording referencing Varsha's parents. Placeholder text is
  in place, held identical on both sides; confirm the phrasing with both
  families, and reword the bride's copy if it should read differently to her
  own relatives.
- **`VENUES.*.maps`** — these are Google Maps *search* links built from the
  venue names, which work today. When you have the exact pin, replace them with
  the short `maps.app.goo.gl/...` link from the Maps share sheet.

---

## Artwork

The site runs right now without any images. Each slide falls back to a soft
colour wash built from that scene's palette, so you can deploy and preview
before the Runway plates are approved. Drop files in and they take over
automatically — no code change.

Put these in `public/plates/`:

| File | Slide | Source |
|---|---|---|
| `seal.png` | Envelope (transparent PNG) | ✅ In place — Ganesha line art |
| `hero.jpg` | Suraj & Varsha | Plate 2, Radha–Krishna landscape |
| `ganesh-puja.jpg` | Ganesh Puja | Plate 3 |
| `sangeet.jpg` | Ring Ceremony & Sangeet | Plate 4 |
| `haldi.jpg` | Haldi (groom's side) | Plate 5 |
| `nalangu.jpg` | Nalangu (bride's side) | **New plate needed** |
| `baraat.jpg` | Baraat (groom's side) | Plate 6 |
| `vivah.jpg` | Varmala / Maalai Maatral | Plate 7 |
| `blessing.jpg` | Blessings slide | **New plate needed** |
| `rsvp.jpg` | RSVP form slide | Optional — the green wash stands on its own |
| `share-card.jpg` | WhatsApp link preview, 1200×630 | Crop from Plate 2 |

**Two plates don't exist yet:** Nalangu and the closing blessing. Worth adding
to the Runway queue alongside the ones you've already planned. Nalangu is the
one genuinely new subject — the bride's turmeric ceremony at the venue, and the
only plate a bride-side guest sees that the groom's side never does. Jaimala no
longer needs its own plate: the garlands, reception and wedding are one slide
now, on `vivah.jpg`.

A shared function uses the same plate for both sides — only the type over it
changes — so there is no second set of artwork to commission.

**Crop note.** The plates are authored 9:16 for the film. The website slides are
also portrait, so most will drop in cleanly — but the text sits in the lower
third here, and the film keeps its negative space centred. Check each plate's
lower third is quiet enough for type when you approve the keyframe, rather than
discovering it afterwards.

Export web copies at roughly 1080×1920, JPEG quality 80, aiming for under 300 KB
each. Nine full-size plates will make the site slow on a wedding-hall 4G
connection.

## Music

Two tracks, optional. Put `seal.mp3` and `inner.mp3` in `public/audio/`. The
first plays on the envelope screen, the second takes over once it opens, with a
crossfade. A mute button sits bottom-right.

If you'd rather have no music, set `AUDIO.enabled` to `false` in
`src/data/wedding.js`. If the files are simply missing, playback fails silently
and nothing breaks.

Phones will not autoplay audio. Playback can only start inside a real tap, which
is why it begins on the envelope touch and not on a timer. This is the most
fragile part of the site — test it on a real iPhone and a real Android before
sending the link out.

---

## Collecting replies

Guests reply on the last slide — name and how many are coming. Replies are
posted to a Google Apps Script web app that appends a row to a Google Sheet, so
there is no server to run, no database to pay for, no submission cap, and no key
in the bundle. You read the replies in a spreadsheet.

The endpoint is live and wired in — replies from both sides have been sent
through it end to end and landed in the sheet. The steps below are here in case
it ever has to be rebuilt.

**Setting it up, once:**

1. Make a new Google Sheet. Name it whatever you like.
2. **Extensions → Apps Script**. Delete the placeholder `function myFunction`.
3. Paste in all of `scripts/rsvp-apps-script.gs` from this repo. Save.
4. **Deploy → New deployment**, type **Web app**. Set *Execute as* to **Me**,
   and *Who has access* to **Anyone**. Deploy, and approve the permissions
   prompt Google shows you.
5. Copy the **Web app URL** — it ends in `/exec`.
6. Paste it into `RSVP_FORM.endpoint` in `src/data/wedding.js`, then rebuild
   and redeploy the site.

To check it worked, open that `/exec` URL in a browser. It should answer
`{"ok":true,"message":"RSVP endpoint is live."}`. Then send yourself a test
reply from the site and watch the row appear in the sheet.

**Things worth knowing:**

- Each reply is one row: received time, side, name, guest count. A guest who
  replies twice makes a second row rather than overwriting the first — the
  timestamps say which is current, and you keep the trail of what changed.
- The reply is also kept in the guest's own browser, so someone who comes back
  to the link sees "Thank you" and what they sent, rather than an empty form
  they might fill in again. There is a quiet link to send a corrected reply.
- **If you change the script, you must deploy a new version** (Deploy → Manage
  deployments → edit → New version). Saving alone does not update the live URL.
- Everyone who opens the link posts to the same URL. It is unauthenticated by
  design, which is right for a wedding invite but means a determined stranger
  could add junk rows. Do not put anything in the sheet you would mind seeing a
  spam row next to.

### Why the sending code is not a two-line `fetch`

Two things about posting to Apps Script shape `src/hooks/useRsvp.js`:

1. The request has to stay a **simple** one, or the browser sends a CORS
   preflight that Apps Script does not answer. Sending it as `text/plain` keeps
   it simple; the script parses the body as JSON regardless of the header.
2. Apps Script answers a POST with a **redirect to a different Google host**.
   That final response usually carries permissive CORS headers, so the answer
   can be read and the reply genuinely confirmed — but not on every account.

So the hook tries to read the answer, and if the browser hides it, sends the
reply again as an opaque `no-cors` request, which always goes through but
reports nothing back. The guest sees one success either way.

On this deployment the readable path works, so guests get genuine confirmation
rather than an optimistic one.

Two rules the hook holds to, both of which exist to stop a failure being shown
to a guest as success:

- **A refusal is never retried opaquely.** An opaque request resolves for a 500
  exactly as it does for a 200, so falling back after a real rejection would
  turn a failure into a false "Thank you".
- **A 200 is not the answer; the body is.** Apps Script catches its own errors
  and reports them as `{"ok":false}` with a perfectly healthy 200 — so a sheet
  that has been renamed, or whose permission has lapsed, would otherwise look
  like a success. The hook reads the body and believes what it says.

---

## Slide order

Both flows open the same way — envelope, then the swipe screen — and then split.

**Groom's side** (9 slides)

1. Suraj & Varsha
2. Countdown
3. गणेश पूजा · Ganesh Puja — Sun 13 Dec, 10:00 AM, groom's home
4. सगाई, स्वागत एवं संगीत · Ring Ceremony, Reception & Sangeet — Sun 13 Dec, 5:00 PM, RK Gardenia
5. हल्दी · Haldi — Mon 14 Dec, 7:00 AM, groom's home
6. बारात · Baraat — Mon 14 Dec, 11:00 AM, groom's home → RK Gardenia
7. वरमाला एवं विवाह · Varmala & Wedding — Mon 14 Dec, 3:00 PM, RK Gardenia
8. Blessings
9. क्या आप आ रहे हैं? · RSVP form

**Bride's side** (7 slides)

1. Varsha & Suraj
2. Countdown
3. மோதிர மாற்றம், வரவேற்பு & சங்கீத் · Ring Ceremony, Reception & Sangeet — Sun 13 Dec, 5:00 PM, RK Gardenia
4. நலங்கு · Nalangu — Mon 14 Dec, 8:00 AM, RK Gardenia
5. மாலை மாற்றல் & கல்யாணம் · Maalai Maatral & Kalyanam — Mon 14 Dec, 3:00 PM, RK Gardenia
6. Blessings
7. நீங்கள் வருகிறீர்களா? · RSVP form

The countdown targets the first function that side actually attends — the puja
at 10 AM for the groom's family, 5 PM for the bride's — so nobody is shown a
clock running toward something they aren't invited to. Those two times are in
`START_TIMES` in the data file; keep the `+05:30` on the end.

---

## Design notes

Colours, type and the frame device all come from the master style frame, so the
site and the film read as one piece:

- Ivory `#F7F1E3`, sandstone `#E3D2B4`, antique gold `#A5872C`
- Marigold `#EFA51C` marks Elegance Samruddhi, deep madder `#99392C` marks
  RK Gardenia — the same venue coding as the film
- Text is warm brown `#3E3226`, never black, matching the printed-card feel
- Cormorant Garamond throughout, with Tiro Devanagari Hindi for the Hindi lines
  and Noto Serif Tamil for the Tamil ones

The site is English-first with a native-script accent line above each name.
Tamil sets taller than Devanagari at the same size, so `.tamil` runs a little
lighter than `.deva` and every place that sets a native line steps the size
down for it — the aim is that a guest on either side sees the same weight of
ink on the page, not that the two use identical numbers.

Both flows share one palette and one frame. Nothing about the design says which
side you are on except the language, which is the point: it should read as one
wedding, told twice.

The thin rail on the left edge tracks your position through the two days, with a
gold dot marking where the 13th ends and the 14th begins. It has a different
number of ticks per side, and the day break is found from that side's list
rather than counted out.

The RSVP slide is the one deliberate break in the colour run — a deep garden
green, the only ground the invite does not otherwise use, so the last slide
reads as the place something is asked of you. Everything else about it is the
same system: the same frame, the same reveals, and fields set as ruled lines
rather than boxes, which is the device the ceremony slides use for day, time
and venue. The action stays gold, because gold is what you press everywhere
else on the site.

Only the groom's side lists a phone number. Varsha's side has no contact to
give out, so `CONTACT.bride` is `null` and the closing slide leaves the space
out entirely — a wrong number on a wedding invite is worse than no number.

## The swipe screen

`src/components/SideSelect.jsx`. The card leans toward whichever side you pull
it to, the label on that edge lifts as the other fades, and releasing past ~88px
(or flicking faster than 480px/s) commits. A swipe is never the only way
through: the two labels underneath are real buttons, and the left/right arrow
keys do the same job — a good number of these guests will open the link on a
laptop, or with a screen reader.

The chosen side lives in `sessionStorage` and is read through
`src/hooks/useSide.jsx`, which hands every slide below it that side's language
and list of functions. It is deliberately *session* storage, not local: a phone
passed around a family gets a fresh start the next day.

One thing to know if you change `App.jsx`: the `.snap` scroll box must outlive a
change of side. It is the element the single scroll listener is bound to, and
that binding is made once against the ref — remount the box and the listener is
left on a detached node, with every slide frozen at the progress it last read.
So the remount key sits on the *contents*, which are what differ per side.

## Motion

Transitions are **scroll-linked, not timed**. Every slide knows its own progress
through the viewport — `0` is one screen below, `0.5` is centred and at rest,
`1` is one screen above — and every moving thing on that slide is a function of
that number. Scroll down and the slide arrives; scroll back up and it leaves
again, exactly in reverse; stop halfway and it holds there. Nothing plays on a
timer, so nothing can be out of step with your finger.

That progress comes from `src/hooks/useSlideScroll.jsx`, which keeps the scroll
position in a framer-motion `MotionValue` rather than React state. One listener
for the whole site, and no component re-renders while you scroll — the transforms
run straight on the compositor. The only thing still routed through React is the
left rail, and only when the whole-number slide index changes.

Four things move, all off that one value:

- **Copy** staggers in line by line (`Reveal`, with an `order` per line).
- **Plate art** drifts against the scroll, so it sits behind the frame rather
  than printed on it.
- **A slow scale** is widest off-centre and settles as the slide parks, so
  arriving feels like coming to a stop rather than stopping dead.
- **A veil** — the important one. Two full-bleed plates butted together is a
  cut. Each plate sinking into its own shadow as it leaves and rising out of it
  as it arrives is a dissolve. Both halves are veiled at the moment they share
  the screen, so their palettes never clash.

If you want the whole thing calmer or brisker, the ranges live in two places:
`Reveal` in `src/components/Reveal.jsx` for the copy, and the three
`useTransform` calls at the top of `src/components/PlateArt.jsx` for the art.
The spring in `useEasedProgress` sets how much weight the motion has.

Grain is one fixed layer over the whole viewport (`src/components/Grain.jsx`),
rasterised once as a tiling bitmap. It used to be a full-screen `feTurbulence`
filter per slide — ten live fractal-noise filters recompositing on every scroll
frame, which cost more framerate than everything else combined. It also belongs
on the lens rather than the scene, so it is more correct sitting still.

## Deviation from the Globuzz guide

The guide installs both `framer-motion` and `gsap`. This build uses framer-motion
only — it covers every animation here, and one animation system means one set of
behaviours to debug. Nothing is lost.
