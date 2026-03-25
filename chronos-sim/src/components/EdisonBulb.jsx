import useDeviceStore from '../store/deviceStore';

const EdisonBulb = () => {
  const on = useDeviceStore((s) => s.outputs.light3);

  return (
    <svg width="100%" viewBox="0 0 400 80" className="block">
      <defs>
        <radialGradient id="edisonGlow" cx="50%" cy="60%" r="50%">
          <stop offset="0%"   stopColor="#f0a820" stopOpacity={on ? 0.55 : 0} />
          <stop offset="60%"  stopColor="#c07010" stopOpacity={on ? 0.25 : 0} />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="bulbFill" cx="38%" cy="35%" r="60%">
          <stop offset="0%"   stopColor={on ? '#ffe080' : '#1a1610'} />
          <stop offset="40%"  stopColor={on ? '#e89020' : '#141208'} />
          <stop offset="100%" stopColor={on ? '#8a4808' : '#0c0a06'} />
        </radialGradient>
        <filter id="edisonBloom">
          <feGaussianBlur stdDeviation="6" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Wide glow behind */}
      {on && (
        <ellipse cx="200" cy="44" rx="120" ry="40" fill="url(#edisonGlow)"
          style={{ transition: 'all 0.6s ease' }} />
      )}

      {/* Hanging wire from centre */}
      <line x1="200" y1="0" x2="200" y2="20" stroke="#3a3028" strokeWidth="1.5" />

      {/* Socket cap */}
      <rect x="188" y="18" width="24" height="10" rx="2"
        fill="#2a2418" stroke="#5a4820" strokeWidth="1" />
      {/* Socket threads */}
      {[0,1,2].map(i => (
        <line key={i} x1="188" y1={21+i*3} x2="212" y2={21+i*3}
          stroke="#3a3020" strokeWidth="0.5" />
      ))}

      {/* Bulb glass */}
      <ellipse cx="200" cy="50" rx="18" ry="22"
        fill="url(#bulbFill)" stroke={on ? '#c08030' : '#2a2010'}
        strokeWidth="1"
        style={{ transition: 'all 0.6s ease', filter: on ? 'drop-shadow(0 0 8px #e89020)' : 'none' }} />

      {/* Filament (visible when on) */}
      {on && (
        <g opacity="0.7">
          <path d="M 193 50 Q 197 44 200 50 Q 203 56 207 50"
            fill="none" stroke="#fff8d0" strokeWidth="1" />
          <path d="M 193 54 Q 197 48 200 54 Q 203 60 207 54"
            fill="none" stroke="#fff0a0" strokeWidth="0.8" />
        </g>
      )}

      {/* Base of bulb */}
      <rect x="195" y="70" width="10" height="5" rx="1"
        fill="#1a1610" stroke="#3a2e14" strokeWidth="0.8" />

      {/* Label */}
      <text x="200" y="79" textAnchor="middle"
        fill={on ? '#8a6830' : '#3a2e18'} fontSize="5" fontFamily="Courier New" letterSpacing="2"
        style={{ transition: 'fill 0.6s' }}>
        EDISONKA
      </text>
    </svg>
  );
};

export default EdisonBulb;