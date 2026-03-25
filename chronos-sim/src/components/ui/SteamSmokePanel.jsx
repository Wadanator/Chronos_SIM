import useDeviceStore from '../store/deviceStore';

// Animated smoke particles
const SmokeParticle = ({ x, delay, size }) => (
  <circle cx={x} cy="0" r={size} fill="rgba(180,160,140,0.15)"
    style={{
      animation: `smokeRise 2.5s ease-out ${delay}s infinite`,
      transformOrigin: `${x}px 0px`,
    }} />
);

// Fire flicker animation for lightFire
const FireEffect = ({ on }) => {
  if (!on) return null;
  return (
    <g style={{ animation: 'fireFlicker 0.15s ease-in-out infinite alternate' }}>
      {/* Outer flame */}
      <path d="M 24 40 C 18 30 14 20 20 12 C 22 8 24 6 24 6 C 24 6 26 8 28 12 C 34 20 30 30 24 40 Z"
        fill="url(#fireFill)" opacity="0.9" />
      {/* Inner flame */}
      <path d="M 24 36 C 20 28 18 20 22 14 C 23 11 24 10 24 10 C 24 10 25 11 26 14 C 30 20 28 28 24 36 Z"
        fill="url(#fireInner)" opacity="0.8" />
    </g>
  );
};

const StatusIndicator = ({ on, label, color, pulseColor }) => (
  <div className="flex flex-col items-center gap-1">
    <div className="relative">
      <div
        className="w-3 h-3 rounded-full border border-[#4a3820] transition-all duration-300"
        style={{
          background: on ? color : '#100e08',
          boxShadow: on ? `0 0 6px ${pulseColor}, 0 0 12px ${pulseColor}40` : 'none',
        }}
      />
      {on && (
        <div
          className="absolute inset-0 rounded-full animate-ping"
          style={{ background: pulseColor, opacity: 0.3 }}
        />
      )}
    </div>
    <span className="text-[7px] font-mono tracking-wider"
      style={{ color: on ? color : '#3a2e18', transition: 'color 0.3s' }}>
      {label}
    </span>
  </div>
);

const SteamSmokePanel = () => {
  const smokePower  = useDeviceStore((s) => s.outputs.smokePower);
  const smokeEffect = useDeviceStore((s) => s.outputs.smokeEffect);
  const lightFire   = useDeviceStore((s) => s.outputs.lightFire);

  return (
    <div className="flex items-center gap-3">
      {/* Fire / boiler effect */}
      <svg width="48" height="48" viewBox="0 0 48 48">
        <defs>
          <radialGradient id="fireFill" cx="50%" cy="80%" r="70%">
            <stop offset="0%"   stopColor="#ff6010" />
            <stop offset="50%"  stopColor="#e04000" />
            <stop offset="100%" stopColor="#800000" />
          </radialGradient>
          <radialGradient id="fireInner" cx="50%" cy="70%" r="60%">
            <stop offset="0%"   stopColor="#fff080" />
            <stop offset="60%"  stopColor="#ff9020" />
            <stop offset="100%" stopColor="#c04000" />
          </radialGradient>
        </defs>
        {/* Boiler body */}
        <circle cx="24" cy="24" r="22" fill="#0a0906" stroke="#4a3c18" strokeWidth="1.5" />
        <circle cx="24" cy="24" r="18" fill="#0e0d09" stroke="#3a2e14" strokeWidth="1" />
        {/* Boiler rivets */}
        {[0,2,4,6,8,10].map(i => {
          const a = (i / 12) * Math.PI * 2;
          return <circle key={i}
            cx={(24 + 17 * Math.cos(a)).toFixed(1)} cy={(24 + 17 * Math.sin(a)).toFixed(1)}
            r="1" fill="#3a2e14" />;
        })}
        {/* Boiler window */}
        <ellipse cx="24" cy="26" rx="9" ry="10"
          fill={lightFire ? '#1a0c04' : '#0c0a06'}
          stroke={lightFire ? '#802010' : '#1e1808'} strokeWidth="1"
          style={{ transition: 'all 0.3s' }} />
        {/* Fire inside window */}
        <clipPath id="fireClip">
          <ellipse cx="24" cy="26" rx="8" ry="9" />
        </clipPath>
        <g clipPath="url(#fireClip)">
          {lightFire && <FireEffect on={lightFire} />}
          {/* Glow base */}
          {lightFire && (
            <ellipse cx="24" cy="34" rx="7" ry="3"
              fill="#ff4000" opacity="0.4"
              style={{ animation: 'fireFlicker 0.2s ease-in-out infinite alternate' }} />
          )}
        </g>
        {/* Label */}
        <text x="24" y="45" textAnchor="middle"
          fill={lightFire ? '#8a3010' : '#3a2e18'} fontSize="5" fontFamily="Courier New" letterSpacing="1">
          FIRE
        </text>
        <style>{`
          @keyframes fireFlicker {
            0%   { transform: scaleX(1) scaleY(1) translateY(0); }
            100% { transform: scaleX(0.9) scaleY(1.08) translateY(-1px); }
          }
        `}</style>
      </svg>

      {/* Smoke system */}
      <div className="flex flex-col gap-2">
        {/* Smoke machine power (warm-up) */}
        <div className="flex items-center gap-1.5">
          <div
            className="w-2.5 h-2.5 rounded-full border border-[#3a2e14] transition-all duration-300"
            style={{
              background: smokePower ? '#28c060' : '#081408',
              boxShadow: smokePower ? '0 0 5px #28c060' : 'none',
            }}
          />
          <span className="text-[7px] font-mono tracking-wide"
            style={{ color: smokePower ? '#28c060' : '#3a2e18' }}>
            SMOKE PWR
          </span>
        </div>

        {/* Smoke effect with animated smoke when active */}
        <div className="flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 14 14" className="flex-shrink-0">
            <defs>
              <radialGradient id="smokeG" cx="50%" cy="50%" r="50%">
                <stop offset="0%"  stopColor="#c0b0a0" stopOpacity="0.8" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
            {smokeEffect ? (
              <>
                <circle cx="7" cy="10" r="3" fill="url(#smokeG)"
                  style={{ animation: 'smokePuff 1s ease-out infinite' }} />
                <circle cx="5" cy="6" r="2.5" fill="url(#smokeG)"
                  style={{ animation: 'smokePuff 1s ease-out 0.3s infinite' }} />
                <circle cx="9" cy="3" r="2" fill="url(#smokeG)"
                  style={{ animation: 'smokePuff 1s ease-out 0.6s infinite' }} />
              </>
            ) : (
              <circle cx="7" cy="7" r="4" fill="#1a1610" stroke="#2e2418" strokeWidth="0.8" />
            )}
          </svg>
          <span className="text-[7px] font-mono tracking-wide"
            style={{ color: smokeEffect ? '#c0b090' : '#3a2e18' }}>
            SMOKE EFF
          </span>
        </div>
      </div>

      <style>{`
        @keyframes smokePuff {
          0%   { transform: translateY(0)   scale(1);   opacity: 0.7; }
          100% { transform: translateY(-8px) scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default SteamSmokePanel;