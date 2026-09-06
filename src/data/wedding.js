/* ============================================================
   EVERYTHING YOU WILL EVER NEED TO EDIT LIVES IN THIS FILE.
   Change the text here and the whole site updates.
   ============================================================ */

export const COUPLE = {
  groom: { en: 'Suraj', hi: 'सूरज' },
  bride: { en: 'Varsha', hi: 'वर्षा' },
  family: { en: 'The Bhatt Family', hi: 'भट्ट परिवार' },
  city: 'Bengaluru',
  dateRange: '13 & 14 December 2026',
}

/* The countdown points at the first function guests attend. */
export const COUNTDOWN_TARGET = '2026-12-13T10:00:00+05:30'

export const VENUES = {
  elegance: {
    name: 'Elegance Samruddhi',
    area: 'Electronic City, Bengaluru',
    accent: '#efa51c', // marigold
    maps: 'https://www.google.com/maps/search/?api=1&query=Elegance+Samruddhi+Electronic+City+Bengaluru',
  },
  rk: {
    name: 'RK Gardenia',
    area: 'Chandapura, Bengaluru',
    accent: '#99392c', // deep madder
    maps: 'https://www.google.com/maps/search/?api=1&query=RK+Gardenia+Chandapura+Bengaluru',
  },
}

/* --------------------------------------------------------------
   Events, in the order guests will attend them.
   `wash` is the fallback colour used until the plate art is added.
   -------------------------------------------------------------- */
export const EVENTS = [
  {
    id: 'ganesh-puja',
    hi: 'गणेश पूजा',
    en: 'Ganesh Puja',
    eyebrow: 'The divine beginning',
    day: 'Sunday',
    date: '13 December 2026',
    time: '10:00 AM onwards',
    venue: VENUES.elegance,
    note: 'We begin by seeking Ganeshji’s blessings for the days ahead.',
    plate: '/plates/ganesh-puja.jpg',
    wash: ['#f7f1e3', '#e9dcc2', '#d9c29f'],
    accent: '#a5872c',
  },
  {
    id: 'sangeet',
    hi: 'सगाई एवं संगीत',
    en: 'Ring Ceremony & Sangeet',
    eyebrow: 'An evening in the garden',
    day: 'Sunday',
    date: '13 December 2026',
    time: '5:00 PM onwards',
    venue: VENUES.rk,
    note: 'Rings exchanged under the lights, and then the music begins.',
    plate: '/plates/sangeet.jpg',
    wash: ['#2f3a52', '#3d4a63', '#8a6f3f'],
    accent: '#c9ac5c',
    dark: true,
  },
  {
    id: 'haldi',
    hi: 'हल्दी',
    en: 'Haldi',
    eyebrow: 'Marigold morning',
    day: 'Monday',
    date: '14 December 2026',
    time: '7:00 AM onwards',
    venue: VENUES.elegance,
    note: 'The garden wakes up yellow. Wear something you don’t mind staining.',
    plate: '/plates/haldi.jpg',
    wash: ['#fdf0cf', '#f5c33f', '#e27d1d'],
    accent: '#8a5a12',
  },
  {
    id: 'baraat',
    hi: 'बारात',
    en: 'Baraat',
    eyebrow: 'The procession',
    day: 'Monday',
    date: '14 December 2026',
    time: '11:00 AM onwards',
    venue: {
      name: 'Elegance Samruddhi to RK Gardenia',
      area: 'Electronic City to Chandapura',
      accent: '#e27d1d',
      maps: VENUES.rk.maps,
    },
    note: 'Setting out from Elegance Samruddhi and arriving at RK Gardenia.',
    plate: '/plates/baraat.jpg',
    wash: ['#f7ecd8', '#e0bd8b', '#c07a3a'],
    accent: '#8a4a1a',
  },
  {
    id: 'jaimala',
    hi: 'जयमाला',
    en: 'Jaimala',
    eyebrow: 'The garlands',
    day: 'Monday',
    date: '14 December 2026',
    time: '2:00 PM onwards',
    venue: VENUES.rk,
    note: 'Suraj and Varsha meet on the stage and exchange garlands.',
    plate: '/plates/jaimala.jpg',
    wash: ['#f6e3d4', '#e6b09a', '#b9584a'],
    accent: '#8e2f26',
  },
  {
    id: 'vivah',
    hi: 'विवाह',
    en: 'Wedding',
    eyebrow: 'The seven vows',
    day: 'Monday',
    date: '14 December 2026',
    time: '3:00 PM onwards',
    venue: VENUES.rk,
    note: 'The pheras around the sacred fire, as the afternoon turns gold.',
    plate: '/plates/vivah.jpg',
    wash: ['#f6e6cd', '#e0a860', '#9c5a2e'],
    accent: '#8a4a1a',
  },
]

/* --------------------------------------------------------------
   Closing slide
   -------------------------------------------------------------- */
export const BLESSING = {
  /* TODO: confirm exact wording with Varsha before going live. */
  lines: [
    'With the blessings of our elders,',
    'and in loving memory of Varsha’s parents,',
    'whose presence we will feel through every ritual.',
  ],
  closing: 'Your presence is the blessing we are asking for.',
}

export const RSVP = {
  name: 'Harish Chandra Bhatt',
  relation: 'Father of the groom',
  phone: '919739651480',
  display: '+91 97396 51480',
  message: `Namaste 🙏

This is ______ .

We received the invitation for Suraj & Varsha’s wedding and would love to be there.

Attending: ______ guests

With warm wishes.`,
}

export const rsvpLink = () =>
  `https://wa.me/${RSVP.phone}?text=${encodeURIComponent(RSVP.message)}`

/* --------------------------------------------------------------
   Audio. Drop the two files into public/audio/ and set enabled.
   -------------------------------------------------------------- */
export const AUDIO = {
  enabled: true,
  seal: '/audio/seal.mp3',
  inner: '/audio/inner.mp3',
}
