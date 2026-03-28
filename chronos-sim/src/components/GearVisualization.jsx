import useDeviceStore from '../store/deviceStore';

const gearPath = (cx, cy, ro, ri, n) => {
  const pts = [];
  const s = (Math.PI * 2) / n;
  const h = s * 0.34;
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + i * s;
    pts.push(`${(cx + ri * Math.cos(a - h)).toFixed(1)},${(cy + ri * Math.sin(a - h)).toFixed(1)}`);
    pts.push(`${(cx + ro * Math.cos(a - h*.3)).toFixed(1)},${(cy + ro * Math.sin(a - h*.3)).toFixed(1)}`);
    pts.push(`${(cx + ro * Math.cos(a + h*.3)).toFixed(1)},${(cy + ro * Math.sin(a + h*.3)).toFixed(1)}`);
    pts.push(`${(cx + ri * Math.cos(a + h)).toFixed(1)},${(cy + ri * Math.sin(a + h)).toFixed(1)}`);
  }
  return 'M' + pts.join('L') + 'Z';
};

const Gear = ({ cx, cy, ro, ri, hub, teeth, fill, stroke, dir, baseDur, speed }) => {
  const running = speed > 0.5;
  const dur = running ? (baseDur * 100) / Math.max(speed, 1) : 0;
  const spokes = Math.min(6, teeth > 18 ? 6 : 5);
  return (
    <g style={{
      transformOrigin: `${cx}px ${cy}px`,
      animation: running ? `${dir === 'cw' ? 'gcw' : 'gccw'} ${dur.toFixed(2)}s linear infinite` : 'none',
    }}>
      <path d={gearPath(cx, cy, ro, ri, teeth)} fill={fill} stroke={stroke} strokeWidth="0.6" />
      <circle cx={cx} cy={cy} r={ri - 6} fill="none" stroke={stroke} strokeWidth="0.4" />
      {Array.from({ length: spokes }).map((_, i) => {
        const a = (i * Math.PI * 2) / spokes;
        return <line key={i}
          x1={(cx + (hub+2) * Math.cos(a)).toFixed(1)} y1={(cy + (hub+2) * Math.sin(a)).toFixed(1)}
          x2={(cx + (ri-7) * Math.cos(a)).toFixed(1)} y2={(cy + (ri-7) * Math.sin(a)).toFixed(1)}
          stroke={stroke} strokeWidth="2" />;
      })}
      <circle cx={cx} cy={cy} r={hub+2} fill="#0e0d09" stroke={stroke} strokeWidth="0.8" />
      <circle cx={cx} cy={cy} r={hub}   fill="#161410" stroke={stroke} strokeWidth="0.4" />
    </g>
  );
};

// Two gears stacked vertically
const GEARS = [
  { cx:100, cy: 80, ro:55, ri:44, hub:11, teeth:22, fill:'#2a2416', stroke:'#6a5828', dir:'cw',  baseDur:12 },
  { cx:100, cy:180, ro:48, ri:38, hub:10, teeth:20, fill:'#342a18', stroke:'#7a6830', dir:'ccw', baseDur:10 },
];

const GearVisualization = () => {
  const motors = useDeviceStore((s) => s.motors);
  const speed  = motors.m2; // Motor 2 riadi kolesá

  return (
    <svg width="100%" viewBox="0 0 200 260" className="block">
      <style>{`
        @keyframes gcw  { to { transform: rotate( 360deg); } }
        @keyframes gccw { to { transform: rotate(-360deg); } }
      `}</style>
      {GEARS.map((g, i) => <Gear key={i} {...g} speed={speed} />)}
    </svg>
  );
};

export default GearVisualization;