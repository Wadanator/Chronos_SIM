import useDeviceStore from '../store/deviceStore';

const gearPath = (cx, cy, ro, ri, n) => {
  const pts = [];
  const s = (Math.PI * 2) / n;
  const h = s * 0.33;
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + i * s;
    pts.push(`${(cx + ri * Math.cos(a - h)).toFixed(2)},${(cy + ri * Math.sin(a - h)).toFixed(2)}`);
    pts.push(`${(cx + ro * Math.cos(a - h*0.3)).toFixed(2)},${(cy + ro * Math.sin(a - h*0.3)).toFixed(2)}`);
    pts.push(`${(cx + ro * Math.cos(a + h*0.3)).toFixed(2)},${(cy + ro * Math.sin(a + h*0.3)).toFixed(2)}`);
    pts.push(`${(cx + ri * Math.cos(a + h)).toFixed(2)},${(cy + ri * Math.sin(a + h)).toFixed(2)}`);
  }
  return 'M' + pts.join('L') + 'Z';
};

const SingleGear = ({ cx, cy, ro, ri, hub, teeth, dir, baseDur, speed, lit }) => {
  const running = speed > 0.5;
  const dur = running ? (baseDur * 100) / Math.max(speed, 1) : 0;
  const anim = dir === 'cw' ? 'spin-cw' : 'spin-ccw';

  const fill   = lit ? '#e0d4b8' : '#ccc4b0';
  const stroke = lit ? '#b08830' : '#9a8460';
  const hubFill= lit ? '#c8a840' : '#b09868';

  const spokes = teeth > 20 ? 6 : 5;

  return (
    <g style={{
      transformOrigin: `${cx}px ${cy}px`,
      animation: running ? `${anim} ${dur.toFixed(2)}s linear infinite` : 'none',
    }}>
      <path d={gearPath(cx, cy, ro, ri, teeth)} fill={fill} stroke={stroke} strokeWidth="0.8"/>
      <circle cx={cx} cy={cy} r={ri-4} fill="none" stroke={stroke} strokeWidth="0.5" opacity="0.5"/>
      {Array.from({length: spokes}).map((_,i) => {
        const a = (i * Math.PI * 2) / spokes;
        return <line key={i}
          x1={(cx+(hub+3)*Math.cos(a)).toFixed(1)} y1={(cy+(hub+3)*Math.sin(a)).toFixed(1)}
          x2={(cx+(ri-6)*Math.cos(a)).toFixed(1)} y2={(cy+(ri-6)*Math.sin(a)).toFixed(1)}
          stroke={stroke} strokeWidth="2.2" strokeLinecap="round"/>;
      })}
      <circle cx={cx} cy={cy} r={hub+2} fill="#d0c4a8" stroke={stroke} strokeWidth="0.8"/>
      <circle cx={cx} cy={cy} r={hub}   fill={hubFill}/>
      <circle cx={cx} cy={cy} r="3"     fill="#4a3820"/>
    </g>
  );
};

// Three interlocking gears layout:
// Large center gear meshes with two smaller ones
const GearVisualization = () => {
  const m2  = useDeviceStore((s) => s.motors.m2);
  const lit4= useDeviceStore((s) => s.outputs.light4);
  const lit5= useDeviceStore((s) => s.outputs.light5);

  // Indicator dots for budík lights (light4, light5)
  const DotIndicator = ({ active, label }) => (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
      <div style={{
        width: 12, height: 12,
        borderRadius: '50%',
        background: active ? 'radial-gradient(circle at 35% 35%, #f0c060, #c88020)' : '#c0b090',
        border: '1.5px solid #a08858',
        boxShadow: active ? '0 0 10px rgba(200,128,20,0.7), 0 0 20px rgba(200,128,20,0.3)' : 'inset 0 1px 2px rgba(0,0,0,0.2)',
        transition: 'all 0.3s',
      }}/>
      <span style={{ fontFamily:'Share Tech Mono,monospace', fontSize:7, color:'#8a7860', letterSpacing:1 }}>{label}</span>
    </div>
  );

  return (
    <div style={{ position:'relative' }}>
      <svg width="160" height="200" viewBox="0 0 160 200">
        {/* Large gear - center */}
        <SingleGear cx={80} cy={90} ro={52} ri={42} hub={10} teeth={22}
          dir="cw" baseDur={14} speed={m2} lit={lit4||lit5}/>
        {/* Small top-right */}
        <SingleGear cx={135} cy={48} ro={28} ri={21} hub={6} teeth={12}
          dir="ccw" baseDur={7} speed={m2} lit={lit4}/>
        {/* Small bottom-right */}
        <SingleGear cx={138} cy={140} ro={22} ri={16} hub={5} teeth={10}
          dir="ccw" baseDur={5.5} speed={m2} lit={lit5}/>
        {/* Tiny accent gear bottom-left */}
        <SingleGear cx={24} cy={138} ro={18} ri={13} hub={4} teeth={9}
          dir="cw" baseDur={4} speed={m2} lit={lit4&&lit5}/>

        {/* Axle lines - visual connectors */}
        <line x1="80" y1="90" x2="135" y2="48" stroke="#b8a880" strokeWidth="0.4" strokeDasharray="3,3" opacity="0.4"/>
        <line x1="80" y1="90" x2="138" y2="140" stroke="#b8a880" strokeWidth="0.4" strokeDasharray="3,3" opacity="0.4"/>

        {/* Motor 2 label */}
        <text x="80" y="188" textAnchor="middle"
          fill="#8a7860" fontSize="7" fontFamily="'Share Tech Mono',monospace" letterSpacing="2">
          MTR-2 · {Math.round(m2)}%
        </text>
      </svg>

      {/* Budík indicator dots */}
      <div style={{
        position: 'absolute', bottom: 20, left: 0,
        display: 'flex', gap: 10,
      }}>
        <DotIndicator active={lit4} label="L4"/>
        <DotIndicator active={lit5} label="L5"/>
      </div>
    </div>
  );
};

export default GearVisualization;