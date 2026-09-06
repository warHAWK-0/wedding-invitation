# Suraj & Varsha — wedding invite site

A single-page mobile invite. No backend, no database, no accounts. RSVP opens a
prefilled WhatsApp message to Harish Chandra Bhatt, so replies land in his chat
rather than in a form you'd have to check.

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
dates, times, venues, Maps links, the blessing, the RSVP number and the WhatsApp
message text are all in there. You shouldn't need to touch any component file to
change wording.

Two things in that file are marked and still need your call:

- `BLESSING.lines` — the wording referencing Varsha's parents. Placeholder text
  is in place; confirm the exact phrasing with Varsha before you share the link.
- `VENUES.*.maps` — these are Google Maps *search* links built from the venue
  names, which work today. When you have the exact pin, replace them with the
  short `maps.app.goo.gl/...` link from the Maps share sheet.

---

## Artwork

The site runs right now without any images. Each slide falls back to a soft
colour wash built from that scene's palette, so you can deploy and preview
before the Runway plates are approved. Drop files in and they take over
automatically — no code change.

Put these in `public/plates/`:

| File | Slide | Source |
|---|---|---|
| `seal.png` | Envelope (transparent PNG) | New — Ganesh seal or monogram |
| `hero.jpg` | Suraj & Varsha | Plate 2, Radha–Krishna landscape |
| `ganesh-puja.jpg` | Ganesh Puja | Plate 3 |
| `sangeet.jpg` | Ring Ceremony & Sangeet | Plate 4 |
| `haldi.jpg` | Haldi | Plate 5 |
| `baraat.jpg` | Baraat | Plate 6 |
| `jaimala.jpg` | Jaimala | **New plate needed** |
| `vivah.jpg` | Wedding | Plate 7 |
| `blessing.jpg` | Closing slide | **New plate needed** |
| `share-card.jpg` | WhatsApp link preview, 1200×630 | Crop from Plate 2 |

**Two plates don't exist yet:** Jaimala and the closing blessing. Worth adding to
the Runway queue alongside the seven you've already planned.

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

## Slide order

1. Envelope — tap to open
2. Suraj & Varsha
3. Countdown
4. Ganesh Puja — Sun 13 Dec, 10:00 AM, Elegance Samruddhi
5. Ring Ceremony & Sangeet — Sun 13 Dec, 5:00 PM, RK Gardenia
6. Haldi — Mon 14 Dec, 7:00 AM, Elegance Samruddhi
7. Baraat — Mon 14 Dec, 11:00 AM, Elegance Samruddhi → RK Gardenia
8. Jaimala — Mon 14 Dec, 2:00 PM, RK Gardenia
9. Wedding — Mon 14 Dec, 3:00 PM, RK Gardenia
10. Blessings & RSVP

The countdown targets the Ganesh Puja on the 13th, since that's the first thing
guests attend. Change `COUNTDOWN_TARGET` in the data file if you'd rather it
point at the pheras — keep the `+05:30` on the end either way.

---

## Design notes

Colours, type and the frame device all come from the master style frame, so the
site and the film read as one piece:

- Ivory `#F7F1E3`, sandstone `#E3D2B4`, antique gold `#A5872C`
- Marigold `#EFA51C` marks Elegance Samruddhi, deep madder `#99392C` marks
  RK Gardenia — the same venue coding as the film
- Text is warm brown `#3E3226`, never black, matching the printed-card feel
- Cormorant Garamond throughout, with Tiro Devanagari Hindi for the Hindi names

The site is currently English-first with Devanagari accents. If you decide to go
fully Hindi, the `hi` fields already exist on every event in the data file —
it's a swap in the components, not a rebuild.

The thin rail on the left edge tracks your position through the two days, with a
gold dot marking where the 13th ends and the 14th begins.

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
