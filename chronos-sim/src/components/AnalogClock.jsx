import { useEffect, useState } from 'react';
import useDeviceStore from '../store/deviceStore';

const gearPath = (cx, cy, ro, ri, n) => {
  const pts = [];
  const s = (Math.PI * 2) / n;
  const h = s * 0.34;
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + i * s;
    pts.push(`${(cx + ri * Math.cos(a - h)).toFixed(1)},${(cy + ri * Math.sin(a - h)).toFixed(1)}`);
    pts.push(`${(cx + ro * Math.cos(a - h * .3)).toFixed(1)},${(cy + ro * Math.sin(a - h * .3)).toFixed(1)}`);
    pts.push(`${(cx + ro * Math.cos(a + h * .3)).toFixed(1)},${(cy + ro * Math.sin(a + h * .3)).toFixed(1)}`);
    pts.push(`${(cx + ri * Math.cos(a + h)).toFixed(1)},${(cy + ri * Math.sin(a + h)).toFixed(1)}`);
  }
  return 'M' + pts.join('L') + 'Z';
};

const ROMANS = ['XII','I','II','III','IV','V','VI','VII','VIII','IX','X','XI'];

const AnalogClock = () => {
  const [time, setTime] = useState(new Date());
  const light2   = useDeviceStore((s) => s.outputs.light2);
  const motors   = useDeviceStore((s) => s.motors);
  const motorSpd = motors.m1; // Motor 1 riadi hodiny

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const sec  = time.getSeconds();
  const min  = time.getMinutes() + sec / 60;
  const hour = (time.getHours() % 12) + min / 60;
  const hA   = (hour / 12) * 360 - 90;
  const mA   = (min  / 60) * 360 - 90;

  const cx = 200, cy = 108, hLen = 56, mLen = 72;
  const toXY = (angle, len) => ({
    x: cx + len * Math.cos((angle * Math.PI) / 180),
    y: cy + len * Math.sin((angle * Math.PI) / 180),
  });
  const hp = toXY(hA, hLen);
  const mp = toXY(mA, mLen);

  // Gear speed: motor 100% → 18s, motor 10% → 180s
  const gearDur = motorSpd > 0.5 ? (18 * 100) / Math.max(motorSpd, 1) : 0;

  return (
    <svg width="100%" viewBox="0 0 400 216" className="block">
      <defs>
        {/* Clock face backlight glow when light2 is ON */}
        <radialGradient id="clockGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor={light2 ? '#e8c060' : '#2a2010'} stopOpacity={light2 ? 0.4 : 0.05} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <filter id="softGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Clock backlight */}
      <circle cx={cx} cy={cy} r="104" fill="url(#clockGlow)"
        style={{ transition: 'all 0.8s ease', filter: light2 ? 'drop-shadow(0 0 20px rgba(232,192,96,0.3))' : 'none' }} />

      {/* Outer bezel with rivets */}
      <circle cx={cx} cy={cy} r="103" fill="#0b0a07" stroke="#4a3c18" strokeWidth="3" />
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i / 24) * Math.PI * 2;
        return <circle key={i}
          cx={(cx + 102 * Math.cos(a)).toFixed(1)} cy={(cy + 102 * Math.sin(a)).toFixed(1)}
          r="1.8" fill="#5a4020" stroke="#2a1808" strokeWidth="0.4" />;
      })}

      {/* Clock face */}
      <circle cx={cx} cy={cy} r="97" fill="#0d0c08" stroke="#5a4520" strokeWidth="2" />
      <circle cx={cx} cy={cy} r="91" fill="none"    stroke="#261e0e" strokeWidth="0.8" />
      <circle cx={cx} cy={cy} r="78" fill="none"    stroke="#1e1808" strokeWidth="0.5" />

      {/* Segment lines matching real prop */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a1 = ( i      / 12) * Math.PI * 2 - Math.PI / 2;
        const a2 = ((i+0.5) / 12) * Math.PI * 2 - Math.PI / 2;
        return <line key={i}
          x1={(cx + 79 * Math.cos(a1)).toFixed(1)} y1={(cy + 79 * Math.sin(a1)).toFixed(1)}
          x2={(cx + 79 * Math.cos(a2)).toFixed(1)} y2={(cy + 79 * Math.sin(a2)).toFixed(1)}
          stroke="#1a1608" strokeWidth="0.6" />;
      })}

      {/* Roman numerals */}
      {ROMANS.map((num, i) => {
        const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
        return <text key={i}
          x={(cx + 68 * Math.cos(a)).toFixed(1)} y={(cy + 68 * Math.sin(a)).toFixed(1)}
          textAnchor="middle" dominantBaseline="middle"
          fill={light2 ? '#c09050' : '#5a3e18'}
          fontSize="13" fontFamily="Georgia, serif" fontWeight="bold"
          style={{ transition: 'fill 0.8s ease', filter: light2 ? 'drop-shadow(0 0 2px #c09050)' : 'none' }}>
          {num}
        </text>;
      })}

      {/* Tick marks */}
      {Array.from({ length: 60 }).map((_, i) => {
        const a  = (i / 60) * Math.PI * 2 - Math.PI / 2;
        const r1 = i % 5 === 0 ? 80 : 85;
        return <line key={i}
          x1={(cx + r1 * Math.cos(a)).toFixed(1)} y1={(cy + r1 * Math.sin(a)).toFixed(1)}
          x2={(cx + 90 * Math.cos(a)).toFixed(1)} y2={(cy + 90 * Math.sin(a)).toFixed(1)}
          stroke={i % 5 === 0 ? '#5a4020' : '#261e0e'}
          strokeWidth={i % 5 === 0 ? '1.5' : '0.6'} />;
      })}

      {/* Skeleton gear - spins with motor speed */}
      {gearDur > 0 ? (
        <g style={{
          transformOrigin: `${cx}px ${cy}px`,
          animation: `spin ${gearDur.toFixed(1)}s linear infinite`,
        }}>
          <path d={gearPath(cx, cy, 34, 26, 16)} fill="#191710" stroke="#3a2e14" strokeWidth="0.8" />
          {[0,1,2,3].map((i) => {
            const a = (i * Math.PI) / 2;
            return <line key={i}
              x1={(cx + 5 * Math.cos(a)).toFixed(1)} y1={(cy + 5 * Math.sin(a)).toFixed(1)}
              x2={(cx + 21 * Math.cos(a)).toFixed(1)} y2={(cy + 21 * Math.sin(a)).toFixed(1)}
              stroke="#3a2e14" strokeWidth="2.5" />;
          })}
        </g>
      ) : (
        <g>
          <path d={gearPath(cx, cy, 34, 26, 16)} fill="#191710" stroke="#3a2e14" strokeWidth="0.8" />
          {[0,1,2,3].map((i) => {
            const a = (i * Math.PI) / 2;
            return <line key={i}
              x1={(cx + 5 * Math.cos(a)).toFixed(1)} y1={(cy + 5 * Math.sin(a)).toFixed(1)}
              x2={(cx + 21 * Math.cos(a)).toFixed(1)} y2={(cy + 21 * Math.sin(a)).toFixed(1)}
              stroke="#3a2e14" strokeWidth="2.5" />;
          })}
        </g>
      )}

      {/* Hour hand */}
      <line x1={cx} y1={cy} x2={hp.x.toFixed(1)} y2={hp.y.toFixed(1)}
        stroke={light2 ? '#fff8e0' : '#8a8070'} strokeWidth="6" strokeLinecap="round"
        style={{
          transition: 'stroke 0.8s',
          filter: light2 ? 'drop-shadow(0 0 4px #e8d0a0) drop-shadow(0 1px 2px rgba(0,0,0,0.9))' : 'drop-shadow(0 1px 2px rgba(0,0,0,0.9))'
        }} />
      {/* Minute hand */}
      <line x1={cx} y1={cy} x2={mp.x.toFixed(1)} y2={mp.y.toFixed(1)}
        stroke={light2 ? '#e8d8b0' : '#706858'} strokeWidth="3.5" strokeLinecap="round"
        style={{
          transition: 'stroke 0.8s',
          filter: light2 ? 'drop-shadow(0 0 3px #d8c090) drop-shadow(0 1px 2px rgba(0,0,0,0.9))' : 'drop-shadow(0 1px 2px rgba(0,0,0,0.9))'
        }} />
      {/* Centre */}
      <circle cx={cx} cy={cy} r="7"   fill="#141210" stroke="#6a5424" strokeWidth="1.5" />
      <circle cx={cx} cy={cy} r="3.5" fill="#c8a050" />

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
  );
};

export default AnalogClock;