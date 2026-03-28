import { useEffect, useState } from 'react';
import useDeviceStore from '../store/deviceStore';

// Generate gear-tooth path
const gearPath = (cx, cy, ro, ri, n) => {
  const pts = [];
  const s = (Math.PI * 2) / n;
  const h = s * 0.32;
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + i * s;
    pts.push(`${(cx + ri * Math.cos(a - h)).toFixed(2)},${(cy + ri * Math.sin(a - h)).toFixed(2)}`);
    pts.push(`${(cx + ro * Math.cos(a - h * 0.3)).toFixed(2)},${(cy + ro * Math.sin(a - h * 0.3)).toFixed(2)}`);
    pts.push(`${(cx + ro * Math.cos(a + h * 0.3)).toFixed(2)},${(cy + ro * Math.sin(a + h * 0.3)).toFixed(2)}`);
    pts.push(`${(cx + ri * Math.cos(a + h)).toFixed(2)},${(cy + ri * Math.sin(a + h)).toFixed(2)}`);
  }
  return 'M' + pts.join('L') + 'Z';
};

const ROMANS = ['XII','I','II','III','IV','V','VI','VII','VIII','IX','X','XI'];

const AnalogClock = () => {
  const [time, setTime] = useState(new Date());
  const light2 = useDeviceStore((s) => s.outputs.light2);
  const m1     = useDeviceStore((s) => s.motors.m1);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const sec  = time.getSeconds();
  const min  = time.getMinutes() + sec / 60;
  const hour = (time.getHours() % 12) + min / 60;
  const hA   = (hour / 12) * 360 - 90;
  const mA   = (min  / 60) * 360 - 90;

  const cx = 110, cy = 110, R = 90;
  const toXY = (angle, len) => ({
    x: cx + len * Math.cos((angle * Math.PI) / 180),
    y: cy + len * Math.sin((angle * Math.PI) / 180),
  });
  const hp = toXY(hA, 52);
  const mp = toXY(mA, 70);

  // Skeleton gear spin speed based on motor 1
  const gearRunning = m1 > 0.5;
  const gearDur = gearRunning ? (20 * 100) / Math.max(m1, 1) : 0;

  // Color scheme: lit vs unlit
  const faceColor   = light2 ? '#f5efe0' : '#ddd6c8';
  const numColor    = light2 ? '#8a5c18' : '#a09080';
  const rimColor    = light2 ? '#c8941c' : '#a08a6a';
  const handColor   = light2 ? '#2c1a08' : '#6a5a48';
  const handColor2  = light2 ? '#3a2010' : '#7a6a58';
  const glowFilter  = light2 ? 'drop-shadow(0 0 6px rgba(200,148,28,0.4))' : 'none';

  return (
    <svg width="220" height="220" viewBox="0 0 220 220">
      <defs>
        <radialGradient id="clockFace" cx="40%" cy="35%" r="65%">
          <stop offset="0%"   stopColor={light2 ? '#fffdf5' : '#e8e0d4'} />
          <stop offset="100%" stopColor={light2 ? '#f0e8d0' : '#d0c8bc'} />
        </radialGradient>
        <radialGradient id="clockGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#f0c060" stopOpacity={light2 ? 0.25 : 0} />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
        <filter id="handShadow">
          <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodOpacity="0.25"/>
        </filter>
      </defs>

      {/* Outer glow ring when lit */}
      <circle cx={cx} cy={cy} r={R+14} fill="url(#clockGlow)"
        style={{ transition: 'all 0.8s' }} />

      {/* Outer bezel */}
      <circle cx={cx} cy={cy} r={R+10} fill="#c8b898" stroke="#a89070" strokeWidth="1.5" />
      {/* Bezel knurling marks */}
      {Array.from({length:36}).map((_,i) => {
        const a = (i/36)*Math.PI*2;
        const r1 = R+7, r2 = R+11;
        return <line key={i}
          x1={(cx+r1*Math.cos(a)).toFixed(1)} y1={(cy+r1*Math.sin(a)).toFixed(1)}
          x2={(cx+r2*Math.cos(a)).toFixed(1)} y2={(cy+r2*Math.sin(a)).toFixed(1)}
          stroke="#9a8060" strokeWidth="1.2"/>;
      })}

      {/* Main face */}
      <circle cx={cx} cy={cy} r={R+4} fill="#b8a888" stroke="#906840" strokeWidth="1"/>
      <circle cx={cx} cy={cy} r={R+1} fill="url(#clockFace)"
        stroke={rimColor} strokeWidth="1.5"
        style={{ transition: 'all 0.8s', filter: glowFilter }} />

      {/* Minute ring decoration */}
      <circle cx={cx} cy={cy} r={R-4} fill="none" stroke={light2 ? '#d8c090' : '#c0b090'} strokeWidth="0.5" />

      {/* Tick marks */}
      {Array.from({length:60}).map((_,i) => {
        const a   = (i/60)*Math.PI*2 - Math.PI/2;
        const big = i%5 === 0;
        const r1  = big ? R-6 : R-4;
        const r2  = R-1;
        return <line key={i}
          x1={(cx+r1*Math.cos(a)).toFixed(1)} y1={(cy+r1*Math.sin(a)).toFixed(1)}
          x2={(cx+r2*Math.cos(a)).toFixed(1)} y2={(cy+r2*Math.sin(a)).toFixed(1)}
          stroke={big ? (light2 ? '#a07028' : '#9a8868') : (light2 ? '#c8a870' : '#b8a888')}
          strokeWidth={big ? '1.8' : '0.8'}/>;
      })}

      {/* Roman numerals */}
      {ROMANS.map((num, i) => {
        const a = (i/12)*Math.PI*2 - Math.PI/2;
        return <text key={i}
          x={(cx+70*Math.cos(a)).toFixed(1)} y={(cy+70*Math.sin(a)).toFixed(1)}
          textAnchor="middle" dominantBaseline="middle"
          fill={numColor} fontSize="11" fontFamily="Georgia, serif" fontWeight="bold"
          style={{ transition: 'fill 0.8s', userSelect: 'none' }}>
          {num}
        </text>;
      })}

      {/* Skeleton gear (rotates with m1) */}
      <g style={{
        transformOrigin: `${cx}px ${cy}px`,
        animation: gearRunning ? `spin-cw ${gearDur.toFixed(1)}s linear infinite` : 'none',
        transition: 'animation 0.5s',
      }}>
        <path d={gearPath(cx, cy, 30, 22, 14)}
          fill={light2 ? '#e0d4b8' : '#ccc4b0'}
          stroke={light2 ? '#b89040' : '#a08a60'} strokeWidth="0.8"/>
        <circle cx={cx} cy={cy} r="16" fill="none" stroke={light2?'#c8a050':'#b09878'} strokeWidth="0.5"/>
        {[0,1,2,3].map(i => {
          const a = (i*Math.PI)/2;
          return <line key={i}
            x1={(cx+5*Math.cos(a)).toFixed(1)} y1={(cy+5*Math.sin(a)).toFixed(1)}
            x2={(cx+17*Math.cos(a)).toFixed(1)} y2={(cy+17*Math.sin(a)).toFixed(1)}
            stroke={light2?'#b89040':'#a08060'} strokeWidth="2.5" strokeLinecap="round"/>;
        })}
        <circle cx={cx} cy={cy} r="5" fill={light2?'#d0b870':'#b8a878'}/>
      </g>

      {/* Hour hand */}
      <line x1={cx} y1={cy} x2={hp.x.toFixed(1)} y2={hp.y.toFixed(1)}
        stroke={handColor} strokeWidth="5.5" strokeLinecap="round"
        filter="url(#handShadow)"
        style={{ transition: 'stroke 0.8s' }}/>
      {/* Minute hand */}
      <line x1={cx} y1={cy} x2={mp.x.toFixed(1)} y2={mp.y.toFixed(1)}
        stroke={handColor2} strokeWidth="3" strokeLinecap="round"
        filter="url(#handShadow)"
        style={{ transition: 'stroke 0.8s' }}/>
      {/* Centre boss */}
      <circle cx={cx} cy={cy} r="7" fill="#c8b070" stroke="#906830" strokeWidth="1.2"/>
      <circle cx={cx} cy={cy} r="3" fill="#4a3010"/>
    </svg>
  );
};

export default AnalogClock;