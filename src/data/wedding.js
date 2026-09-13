/* ============================================================
   EVERYTHING YOU WILL EVER NEED TO EDIT LIVES IN THIS FILE.
   Change the text here and the whole site updates.

   This is a cross-cultural wedding, so the invite runs two flows
   off one codebase:

     groom — Hindi (Devanagari), the Bhatt side
     bride — Tamil, the Manimaran side

   A guest picks their side by swiping on the first screen, and
   from then on every slide reads in their family's language and
   lists only the functions they are invited to.

   The rule for events: one entry per function, in chronological
   order, tagged with the sides that attend it. Each entry then
   carries a `groom` and/or `bride` block holding that side's own
   wording. A function only one side attends simply has the one
   block.
   ============================================================ */

/* --------------------------------------------------------------
   The two sides
   -------------------------------------------------------------- */
export const SIDES = {
  groom: {
    id: 'groom',
    /* The CSS class this side's native-language lines are set in. */
    script: 'deva',
    label: { en: 'Groom’s side', native: 'वर पक्ष' },
    house: { en: 'The Bhatt family', native: 'भट्ट परिवार' },
  },
  bride: {
    id: 'bride',
    script: 'tamil',
    label: { en: 'Bride’s side', native: 'மணமகள் தரப்பு' },
    house: { en: 'The Manimaran family', native: 'மணிமாறன் குடும்பம்' },
  },
}

export const SIDE_IDS = ['groom', 'bride']

/* --------------------------------------------------------------
   The couple
   -------------------------------------------------------------- */
export const COUPLE = {
  groom: { en: 'Suraj', hi: 'सूरज', ta: 'சூரஜ்' },
  bride: { en: 'Varsha', hi: 'वर्षा', ta: 'வர்ஷா' },
  city: 'Bengaluru',
  dateRange: '13 & 14 December 2026',
}

/* Per-side framing of the same two people. Each family reads
   their own name first, the way their printed card would set it. */
export const SIDE_COPY = {
  groom: {
    nativePair: 'सूरज एवं वर्षा',
    family: { en: 'The Bhatt Family', native: 'भट्ट परिवार' },
    invite: 'The Bhatt family invite you to the wedding of',
    first: 'Suraj',
    second: 'Varsha',
    joiner: 'and',
  },
  bride: {
    nativePair: 'வர்ஷா & சூரஜ்',
    family: { en: 'The Manimaran Family', native: 'மணிமாறன் குடும்பம்' },
    invite: 'The Manimaran family invite you to the wedding of',
    first: 'Varsha',
    second: 'Suraj',
    joiner: 'and',
  },
}

/* --------------------------------------------------------------
   Venues
   -------------------------------------------------------------- */
export const VENUES = {
  /* The groom's house for the wedding days — where the Ganesh
     puja, his haldi and the baraat all happen. Confirmed by the
     family, and this is the pin they shared rather than a name
     search, so it drops guests on the door. */
  home: {
    name: 'Elegance Samruddhi',
    area: 'Groom’s residence · Electronic City, Bengaluru',
    accent: '#efa51c', // marigold
    maps: 'https://maps.app.goo.gl/oyKgY6iCh3uPeZpZ6',
  },
  rk: {
    name: 'RK Gardenia',
    area: 'Chandapura, Bengaluru',
    accent: '#99392c', // deep madder
    maps: 'https://www.google.com/maps/search/?api=1&query=RK+Gardenia+Chandapura+Bengaluru',
  },
}

/* --------------------------------------------------------------
   Every function, in the order it happens.

   `sides` — who attends. A shared function is seen by both, each
             in their own language.
   `wash`  — fallback palette used until the plate art is added.
   `art`   — an optional cut-out illustration, and it belongs
             *inside* a side's block rather than on the event. Two
             families can hold the same function and decorate it
             differently, and on a shared function one side may
             have art where the other has none.

             There are two kinds, and the difference is what makes
             the slides hold together at every screen height:

             A piece that *floats* — a centred motif with air all
             round it — is set `flow: true`. It joins the layout
             above the copy, takes whatever height the copy did not
             need, and centres in it. So the gap between picture and
             text is always the space that is actually going spare:
             it closes up on a small phone and opens out on a tall
             one, instead of being a number that is only right once.

             A piece that is *pinned* — foliage cut off at its own
             stem, garlands drawn to hang, a horse walking in from
             off the page — stays absolute at a `top`, because it
             belongs to the edge of the slide rather than to the
             copy. Flowing those would pull their deliberate crops
             back into view, which is the one thing their placement
             exists to prevent.
   -------------------------------------------------------------- */
export const EVENTS = [
  {
    id: 'ganesh-puja',
    sides: ['groom'],
    day: 'Sunday',
    date: '13 December 2026',
    time: '10:00 AM onwards',
    venue: VENUES.home,
    plate: '/plates/ganesh-puja.jpg',
    wash: ['#f7f1e3', '#e9dcc2', '#d9c29f'],
    accent: '#a5872c',
    groom: {
      native: 'गणेश पूजा',
      en: 'Ganesh Puja',
      eyebrow: 'The divine beginning',
      note: 'We begin at home, seeking Ganeshji’s blessings for the days ahead.',
      /* Floats — see the note on `art` above. */
      art: {
        src: '/plates/ganesha-art.png',
        width: 'clamp(190px, 30svh, 290px)',
        flow: true,
        top: 'clamp(18px, 4svh, 44px)',
        bottom: 'clamp(10px, 2svh, 22px)',
      },
    },
  },
  {
    id: 'sagai-sangeet',
    sides: ['groom', 'bride'],
    day: 'Sunday',
    date: '13 December 2026',
    time: '5:00 PM onwards',
    venue: VENUES.rk,
    plate: '/plates/sangeet.jpg',
    wash: ['#2f3a52', '#3d4a63', '#8a6f3f'],
    accent: '#c9ac5c',
    dark: true,
    groom: {
      native: 'सगाई, स्वागत एवं संगीत',
      en: 'Ring Ceremony, Reception & Sangeet',
      eyebrow: 'An evening in the garden',
      note: 'Rings exchanged under the lights, both families meet, and then the music begins.',
      /* The same rings the bride's side sees on this evening, set
         at the same size — it is one ceremony, and both families
         should recognise it as the same page. */
      art: {
        src: '/plates/rings-art.png',
        width: 'clamp(200px, 31svh, 300px)',
        flow: true,
        top: 'clamp(14px, 3svh, 32px)',
        bottom: 'clamp(10px, 2svh, 22px)',
      },
    },
    bride: {
      /* மாற்றம் is the same "exchange" that returns in மாலை
         மாற்றல் on the wedding day — rings first, garlands after. */
      native: 'மோதிர மாற்றம், வரவேற்பு & சங்கீத்',
      en: 'Ring Ceremony, Reception & Sangeet',
      eyebrow: 'An evening in the garden',
      note: 'The rings are exchanged, both families meet, and the evening turns to music.',
      /* Sits on the one dark slide of the run, so it is given a
         little more room than art on a pale ground would need. */
      art: {
        src: '/plates/rings-art.png',
        width: 'clamp(200px, 31svh, 300px)',
        flow: true,
        top: 'clamp(14px, 3svh, 32px)',
        bottom: 'clamp(10px, 2svh, 22px)',
      },
    },
  },
  {
    id: 'haldi',
    sides: ['groom'],
    day: 'Monday',
    date: '14 December 2026',
    time: '7:00 AM onwards',
    venue: VENUES.home,
    plate: '/plates/haldi.jpg',
    wash: ['#fdf0cf', '#f5c33f', '#e27d1d'],
    accent: '#8a5a12',
    groom: {
      native: 'हल्दी',
      en: 'Haldi',
      eyebrow: 'Marigold morning',
      note: 'Turmeric for the groom, at home. Wear something you don’t mind staining.',
      /* Marigold strings, drawn to hang, so they stay flush with
         the top edge — art that hangs should hang off something
         rather than float in the middle.

         Pinned art cannot balance its own gap the way flowing art
         does, because its whole job is to hold an edge. What it can
         do is hold a constant *share* of the slide: a width in svh
         makes the drop deeper on a tall screen and shorter on a
         small one, so the band of empty page between the flowers
         and the type stays the same wherever it is read. The image
         keeps its ratio, so width is the lever for both axes. */
      art: {
        src: '/plates/haldi-art.png',
        width: 'clamp(250px, 40svh, 330px)',
        top: 0,
      },
    },
  },
  {
    id: 'nalangu',
    sides: ['bride'],
    day: 'Monday',
    date: '14 December 2026',
    time: '8:00 AM onwards',
    venue: VENUES.rk,
    plate: '/plates/nalangu.jpg',
    wash: ['#fdf1dd', '#f3c96a', '#c96f57'],
    accent: '#8a4a2a',
    bride: {
      native: 'நலங்கு',
      en: 'Nalangu',
      eyebrow: 'Turmeric morning',
      note: 'Manjal and sandalwood for the bride at the venue, with songs from the women of the family.',
      /* Banana foliage, drawn cut off at its own left edge, so it
         is pinned to that side and hung a little past it — the
         leaves creep in from off the page rather than sitting in
         the middle of it. Banana trees are tied at the entrance
         for a Tamil wedding, which is the reason it belongs here
         and not on the groom's morning. */
      art: [
        {
          src: '/plates/nalangu-art.png',
          width: 'clamp(120px, 20svh, 165px)',
          top: 0,
          align: 'left',
          inset: -14,
        },
        /* Marigold strings hanging in the far corner, drawn cut off
           at their own top and right, so both edges are hung past
           the slide and only the fall of the flowers is seen. Kept
           under the leaves' width so the two sides stay balanced
           rather than competing. */
        {
          src: '/plates/hang-flower.png',
          width: 'clamp(105px, 17svh, 140px)',
          top: -18,
          align: 'right',
          inset: -10,
        },
      ],
    },
  },
  {
    id: 'baraat',
    sides: ['groom'],
    day: 'Monday',
    date: '14 December 2026',
    time: '11:00 AM onwards',
    venue: {
      name: 'Elegance Samruddhi to RK Gardenia',
      area: 'Electronic City to Chandapura',
      accent: '#e27d1d',
      /* The baraat is the one entry whose map should point at the
         start, not the destination — a guest joining it needs the
         house, and everything after this slide is at RK Gardenia
         anyway. */
      maps: VENUES.home.maps,
    },
    plate: '/plates/baraat.jpg',
    wash: ['#f7ecd8', '#e0bd8b', '#c07a3a'],
    accent: '#8a4a1a',
    groom: {
      native: 'बारात',
      en: 'Baraat',
      eyebrow: 'The procession',
      note: 'Setting out from the groom’s home and dancing all the way to RK Gardenia.',
      /* The ghodi, cut off at its own right edge, so it is pinned
         to that side and hung past it — the horse walks in from
         off the page, facing back into the slide. Mirror of the
         banana foliage on the bride's morning. */
      art: {
        src: '/plates/horse-art.png',
        width: 'clamp(145px, 24svh, 200px)',
        top: 'clamp(8px, 2svh, 20px)',
        align: 'right',
        inset: -18,
      },
    },
  },
  {
    id: 'muhurtham',
    sides: ['groom', 'bride'],
    day: 'Monday',
    date: '14 December 2026',
    time: '3:00 PM onwards',
    venue: VENUES.rk,
    plate: '/plates/vivah.jpg',
    wash: ['#f6e4d2', '#e2a86a', '#9c4a34'],
    accent: '#8e2f26',
    groom: {
      native: 'वरमाला एवं विवाह',
      en: 'Varmala & Wedding',
      eyebrow: 'The garlands and the vows',
      note: 'The bride and groom exchange garlands, the families gather, and the wedding follows.',
      /* Same art, same placement as the bride's Maalai Maatral —
         see the note there for why it is hung above the slide. */
      art: {
        src: '/plates/wedding-art.png',
        width: 'clamp(250px, 38svh, 330px)',
        top: -20,
      },
    },
    bride: {
      native: 'மாலை மாற்றல் & கல்யாணம்',
      en: 'Maalai Maatral & Kalyanam',
      eyebrow: 'The garlands and the vows',
      note: 'The bride and groom exchange garlands, the families gather, and the kalyanam follows.',
      /* Pinned to the top of the slide. Its own top edge is cropped
         hard, so it is hung a little above the slide to put that cut
         out of sight — far enough that the scroll drift can never
         pull it back down into view. Only the right edge is
         feathered in the file; the top is left crisp because it is
         never seen. */
      art: {
        src: '/plates/wedding-art.png',
        width: 'clamp(250px, 38svh, 330px)',
        top: -20,
      },
    },
  },
]

/* The functions one side attends, each flattened with that side's
   own wording — so no slide component ever branches on language. */
export function eventsForSide(side) {
  return EVENTS.filter((e) => e.sides.includes(side)).map((e) => {
    const { groom, bride, sides, ...rest } = e
    return { ...rest, ...(side === 'bride' ? bride : groom) }
  })
}

/* The countdown points at the first function that side attends —
   the morning puja for the groom's family, the evening for the
   bride's. */
const START_TIMES = {
  'ganesh-puja': '2026-12-13T10:00:00+05:30',
  'sagai-sangeet': '2026-12-13T17:00:00+05:30',
}

export function countdownTarget(side) {
  const first = eventsForSide(side)[0]
  return START_TIMES[first.id] ?? '2026-12-13T17:00:00+05:30'
}

/* --------------------------------------------------------------
   Closing slide
   -------------------------------------------------------------- */
/* The blessing slide is the one place both sides see the same
   art as well as the same words. */
export const BLESSING_ART = {
  src: '/plates/ganesha-portrait.png',
  /* Centred in the space above the blessing, with a little more
     room left beneath it than above — that reads as deliberate,
     where dead-centre in a tall gap reads as adrift. The width cap
     is what decides the size on a big phone; on a short one the
     height runs out first and the picture shrinks to suit. */
  width: 'clamp(210px, 32svh, 300px)',
  top: 'clamp(10px, 2svh, 20px)',
  bottom: 'clamp(18px, 3.5svh, 34px)',
}

export const BLESSING = {
  /* TODO: confirm exact wording with both families before going live. */
  groom: {
    lines: [
      'With the blessings of our elders,',
      'and in loving memory of the bride’s parents,',
      'whose presence we will feel through every ritual.',
    ],
    closing: 'Your presence is the blessing we are asking for.',
  },
  bride: {
    lines: [
      'With the blessings of our elders,',
      'and in loving memory of the bride’s parents,',
      'whose presence we will feel through every ritual.',
    ],
    closing: 'Your presence is the blessing we are asking for.',
  },
}

/* --------------------------------------------------------------
   Who to call.

   Only the groom's side lists a contact. The Manimaran side has
   no number to give out yet, so that block is simply absent and
   the closing slide leaves the space out rather than showing a
   placeholder — a wrong number on a wedding invite is worse than
   no number at all.
   -------------------------------------------------------------- */
export const CONTACT = {
  groom: {
    name: 'Harish Chandra Bhatt',
    relation: 'Father of the groom',
    phone: '919739651480',
    display: '+91 97396 51480',
  },
  /* TODO: replace with the real contact on the Manimaran side,
     in the same shape as the groom's block above.

     Null, not a placeholder. This used to hold "To be confirmed"
     and "+91 XXXXX XXXXX", which the closing slide then printed
     on the card for every bride-side guest to read — an invite
     that admits, in gold, that it is not finished. Absent is the
     honest state, and the slide already omits the block entirely
     when there is nothing here.

     When a real contact arrives, a real `phone` also turns the
     display line back into a tel: link. Never fill `phone` with a
     stand-in: a guest tapping it would ring a stranger, and that
     is the kind of mistake nobody catches until it happens. */
  bride: null,
}

/* --------------------------------------------------------------
   RSVP.

   Replies are posted to a Google Apps Script web app, which
   appends a row to a Google Sheet — the family reads the replies
   in a spreadsheet, and nothing here needs a server or a key.

   Paste the /exec URL from the Apps Script deploy dialog below.
   The script itself is in scripts/rsvp-apps-script.gs, and the
   setup is written out in the README.
   -------------------------------------------------------------- */
export const RSVP_FORM = {
  /* The Apps Script web app behind the family's RSVP sheet.
     If this is ever cleared, the form tells the guest it cannot
     send rather than pretending to — see useRsvp.js. */
  endpoint:
    'https://script.google.com/macros/s/AKfycbxbbv4MvdKK7QHQWBPo99z0eXhuTSeyi-uSYFdAmMOYSrqCEF6uuuv_I-VXuEObtWau2A/exec',
  minGuests: 1,
  maxGuests: 20,
}

/* The form slide, in each side's own language. The field labels
   stay English like the day/time/venue labels on the ceremony
   slides — it is the heading and the accent line that change.

   The tone matters more here than anywhere else on the site. An
   Indian family does not summon its guests: it hopes for them, and
   asks after them. So nothing on this slide instructs — "क्या आप आ
   रहे हैं?" ("are you coming?") is a checklist question, where
   asking a guest to join the family in its happiness is an
   invitation, and the difference is the whole slide. Every field
   below is asked the same way, as a request the guest is free to
   answer rather than a form they owe. */
export const RSVP_COPY = {
  groom: {
    eyebrow: 'With your blessings',
    native: 'क्या आप हमारे साथ इस ख़ुशी में शामिल होंगे?',
    en: 'Will you join us in this happiness?',
    note: 'Please share your name and the number of guests joining you, so we can welcome each of you.',
    doneNative: 'धन्यवाद',
    doneEn: 'Thank you',
    doneNote: 'Your reply has reached the family. We are counting the days until we see you in December.',
  },
  bride: {
    eyebrow: 'With your blessings',
    native: 'இந்த மகிழ்ச்சியில் நீங்களும் எங்களுடன் இணைவீர்களா?',
    en: 'Will you join us in this happiness?',
    note: 'Please share your name and the number of guests joining you, so we can welcome each of you.',
    doneNative: 'நன்றி',
    doneEn: 'Thank you',
    doneNote: 'Your reply has reached the family. We are counting the days until we see you in December.',
  },
}

/* --------------------------------------------------------------
   Audio. Drop the two files into public/audio/ and set enabled.
   -------------------------------------------------------------- */
export const AUDIO = {
  enabled: true,
  seal: '/audio/seal.mp3',
  inner: '/audio/inner.mp3',
}
