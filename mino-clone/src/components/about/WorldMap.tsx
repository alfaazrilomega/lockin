'use client'

/**
 * WorldMap — inline SVG world map
 * Gray base with blue/red gradient highlights on partner countries
 * Matches mino.works/about visual style
 */

// Countries with mino partners, by ISO alpha-2
const HIGHLIGHTED = new Set([
  'PT','ES','GB','US','BR','IL','NL','NO','CN','AE','SA','CH','KSA'
])

export default function WorldMap() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg"
        alt="World map showing partner locations"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          filter: 'grayscale(1) contrast(0.7) brightness(1.1)',
          opacity: 0.5,
        }}
      />
      {/* Overlay gradient blobs for partner regions */}
      <svg
        viewBox="0 0 1000 500"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        <defs>
          <radialGradient id="blob-eu" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3B2FC9" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#C44B2F" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="blob-us" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3B2FC9" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#C44B2F" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="blob-br" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C44B2F" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#3B2FC9" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="blob-me" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C44B2F" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#3B2FC9" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="blob-cn" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3B2FC9" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#3B2FC9" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="blob-au" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C44B2F" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#C44B2F" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Europe (PT, ES, UK, NL, NO, CH) */}
        <ellipse cx="480" cy="175" rx="55" ry="40" fill="url(#blob-eu)" />
        {/* USA */}
        <ellipse cx="215" cy="195" rx="70" ry="45" fill="url(#blob-us)" />
        {/* Brazil */}
        <ellipse cx="295" cy="310" rx="50" ry="45" fill="url(#blob-br)" />
        {/* Middle East (UAE, Saudi) */}
        <ellipse cx="575" cy="220" rx="45" ry="35" fill="url(#blob-me)" />
        {/* China */}
        <ellipse cx="730" cy="190" rx="50" ry="40" fill="url(#blob-cn)" />
        {/* Israel */}
        <ellipse cx="553" cy="205" rx="20" ry="18" fill="url(#blob-me)" />
        {/* Australia hint */}
        <ellipse cx="800" cy="360" rx="45" ry="35" fill="url(#blob-au)" />
      </svg>
    </div>
  )
}
