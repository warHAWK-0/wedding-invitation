/* The gold hairline frame with corner flourishes.
   Repeated on every slide — the one device that ties the site
   back to the master illustration's border. */
export default function Frame({ color }) {
  const style = color ? { '--frame-color': color } : undefined
  return (
    <div className="frame" style={style} aria-hidden="true">
      {['tl', 'tr', 'bl', 'br'].map((pos) => (
        <svg
          key={pos}
          className={`frame__corner frame__corner--${pos}`}
          viewBox="0 0 22 22"
        >
          <path d="M0 8 Q0 0 8 0" />
          <path d="M0 14 Q0 6 6 4 Q10 2.5 12 0" opacity="0.65" />
          <circle cx="4.5" cy="4.5" r="1.1" />
        </svg>
      ))}
    </div>
  )
}
