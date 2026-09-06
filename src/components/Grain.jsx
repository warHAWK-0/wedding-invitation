/* ============================================================
   Paper grain, once for the whole site.

   This used to be a full-screen feTurbulence filter per slide —
   ten live fractal-noise filters plus ten blend layers, all
   recomposited on every scroll frame. It is one of the most
   expensive filters in SVG and it was costing more framerate
   than anything else on the page.

   Here it is rasterised once as a small tiling bitmap and pinned
   to the viewport. Cheaper by an order of magnitude, and more
   correct besides: grain belongs to the lens, not the scene, so
   it should sit still while the plates move under it.
   ============================================================ */

const TILE = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160">\
<filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.82" \
numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/>\
</filter><rect width="160" height="160" filter="url(#n)" opacity="0.42"/></svg>`

const GRAIN_URL = `url("data:image/svg+xml;utf8,${encodeURIComponent(TILE)}")`

export default function Grain() {
  return (
    <div
      className="grain"
      aria-hidden="true"
      style={{ backgroundImage: GRAIN_URL }}
    />
  )
}
