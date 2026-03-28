import useDeviceStore from '../store/deviceStore';
import AnalogClock from './AnalogClock';
import GearVisualization from './GearVisualization';
import MqttStatusBadge from './MqttStatusBadge';

// ── Rivet ──────────────────────────────────────────────────────────────────
const Rivet = ({ style }) => (
  <div style={{
    position: 'absolute', width: 10, height: 10, borderRadius: '50%',
    background: 'radial-gradient(circle at 35% 35%, #e0d4bc, #a89878)',
    border: '1px solid #b8a880',
    boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.6), 0 1px 3px rgba(40,24,8,0.2)',
    pointerEvents: 'none',
    ...style,
  }}/>
);

const RIVETS = [
  { top:12, left:12 }, { top:12, right:12 },
  { bottom:12, left:12 }, { bottom:12, right:12 },
  { top:12, left:'25%' }, { top:12, left:'50%' }, { top:12, left:'75%' },
  { bottom:12, left:'25%' }, { bottom:12, left:'50%' }, { bottom:12, left:'75%' },
  { top:'25%', left:12 }, { top:'50%', left:12 }, { top:'75%', left:12 },
  { top:'25%', right:12 }, { top:'50%', right:12 }, { top:'75%', right:12 },
];

// ── LED indicator dot ──────────────────────────────────────────────────────
const Led = ({ active, color = 'amber', label }) => {
  const colors = {
    amber: { on:'radial-gradient(circle at 35% 35%, #f8e080, #d09020)', shadow:'rgba(208,144,32,0.7)' },
    red:   { on:'radial-gradient(circle at 35% 35%, #ff9090, #d03020)', shadow:'rgba(208,48,32,0.7)'  },
    green: { on:'radial-gradient(circle at 35% 35%, #90e890, #30a040)', shadow:'rgba(48,160,64,0.7)'  },
  };
  const c = colors[color] || colors.amber;
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
      <div style={{
        width:10, height:10, borderRadius:'50%',
        background: active ? c.on : '#c8c0b0',
        border: '1.5px solid #a89868',
        boxShadow: active ? `0 0 8px ${c.shadow}, 0 0 16px ${c.shadow.replace('0.7','0.3')}` : 'inset 0 1px 2px rgba(0,0,0,0.2)',
        transition: 'all 0.3s',
      }}/>
      {label && <span style={{
        fontFamily:"'Share Tech Mono',monospace", fontSize:7,
        color:'#8a7860', letterSpacing:1, textTransform:'uppercase',
      }}>{label}</span>}
    </div>
  );
};

// ── Section header line ────────────────────────────────────────────────────
const SectionLabel = ({ children }) => (
  <div style={{
    fontFamily:"'Share Tech Mono',monospace",
    fontSize: 8, letterSpacing: 3,
    color: '#9a8870', textTransform:'uppercase',
    marginBottom: 6,
  }}>
    {children}
  </div>
);

// ── Edison bulb (light3) ───────────────────────────────────────────────────
const EdisonBulb = ({ on }) => (
  <svg width="36" height="52" viewBox="0 0 36 52">
    <defs>
      <radialGradient id="edisonGrad" cx="38%" cy="35%" r="65%">
        <stop offset="0%"  stopColor={on ? '#fff8d0' : '#ccc4b0'}/>
        <stop offset="60%" stopColor={on ? '#f0a820' : '#b0a888'}/>
        <stop offset="100%"stopColor={on ? '#c07010' : '#908878'}/>
      </radialGradient>
    </defs>
    {/* Wire */}
    <line x1="18" y1="0" x2="18" y2="10" stroke="#b8a880" strokeWidth="1.2"/>
    {/* Socket */}
    <rect x="12" y="9" width="12" height="7" rx="1.5"
      fill="#c8b888" stroke="#a89060" strokeWidth="0.8"/>
    {[0,1,2].map(i=><line key={i} x1="12" y1={11+i*2} x2="24" y2={11+i*2}
      stroke="#a09060" strokeWidth="0.4"/>)}
    {/* Glass */}
    <ellipse cx="18" cy="30" rx="13" ry="15"
      fill="url(#edisonGrad)"
      stroke={on ? '#d0a030' : '#b0a070'} strokeWidth="1"
      style={{ transition:'all 0.6s', filter: on?'drop-shadow(0 0 8px rgba(220,160,20,0.6))':'none' }}/>
    {/* Filament */}
    {on && <path d="M 13 30 Q 15 25 18 30 Q 21 35 23 30" fill="none"
      stroke="#fff8c0" strokeWidth="1" opacity="0.8"/>}
    {/* Base */}
    <rect x="15" y="44" width="6" height="4" rx="1"
      fill="#c0b080" stroke="#a09060" strokeWidth="0.6"/>
    {/* Label */}
    <text x="18" y="52" textAnchor="middle"
      fill={on ? '#8a6020' : '#9a8868'} fontSize="5"
      fontFamily="'Share Tech Mono',monospace" letterSpacing="1"
      style={{transition:'fill 0.6s'}}>EDIS.</text>
  </svg>
);

// ── Pipe segment ───────────────────────────────────────────────────────────
const PipeColumn = ({ light1 }) => (
  <svg width="28" height="560" viewBox="0 0 28 560"
    style={{ position:'absolute', left:16, top:60, pointerEvents:'none' }}>
    {/* Main pipe */}
    <rect x="10" y="0" width="8" height="560" rx="1"
      fill={light1 ? '#c8b888' : '#b8a878'} style={{transition:'fill 0.8s'}}/>
    <rect x="11" y="0" width="3" height="560"
      fill="rgba(255,255,255,0.15)"/>
    <rect x="15" y="0" width="2" height="560"
      fill="rgba(0,0,0,0.1)"/>
    {/* Joints */}
    {[80,180,290,400,490].map((y,i) => (
      <rect key={i} x="6" y={y} width="16" height="10" rx="2"
        fill={light1 ? '#d0c090' : '#c0b080'} stroke="#a89060" strokeWidth="0.5"
        style={{transition:'fill 0.8s'}}/>
    ))}
    {/* Valve wheels */}
    {[140, 360].map((cy,i) => (
      <g key={i}>
        <circle cx="14" cy={cy} r="14" fill="none"
          stroke={light1 ? '#c07820' : '#b09060'} strokeWidth="2.5"
          style={{transition:'stroke 0.6s'}}/>
        {[0,60,120,180,240,300].map(a => {
          const r = (a*Math.PI)/180;
          return <line key={a}
            x1="14" y1={cy}
            x2={(14+14*Math.cos(r)).toFixed(1)} y2={(cy+14*Math.sin(r)).toFixed(1)}
            stroke={light1 ? '#c07820' : '#b09060'} strokeWidth="2.5" strokeLinecap="round"
            style={{transition:'stroke 0.6s'}}/>;
        })}
        <circle cx="14" cy={cy} r="4" fill={light1?'#d09030':'#b09060'}/>
      </g>
    ))}
  </svg>
);

// ── Circuit underlight (light1) ────────────────────────────────────────────
const CircuitOverlay = ({ active }) => {
  if (!active) return null;
  return (
    <svg style={{
      position:'absolute', inset:0, width:'100%', height:'100%',
      pointerEvents:'none', opacity:0.18, zIndex:1,
    }}>
      <defs>
        <pattern id="cp" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <line x1="0" y1="15" x2="60" y2="15" stroke="#c8a040" strokeWidth="1"/>
          <line x1="0" y1="45" x2="60" y2="45" stroke="#c8a040" strokeWidth="1"/>
          <line x1="15" y1="0" x2="15" y2="60" stroke="#c8a040" strokeWidth="1"/>
          <line x1="45" y1="0" x2="45" y2="60" stroke="#c8a040" strokeWidth="1"/>
          <circle cx="15" cy="15" r="2.5" fill="#d8b050"/>
          <circle cx="45" cy="15" r="2.5" fill="#d8b050"/>
          <circle cx="15" cy="45" r="2.5" fill="#d8b050"/>
          <circle cx="45" cy="45" r="2.5" fill="#d8b050"/>
          <line x1="8" y1="30" x2="22" y2="30" stroke="#b89040" strokeWidth="0.7"/>
          <line x1="38" y1="30" x2="52" y2="30" stroke="#b89040" strokeWidth="0.7"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#cp)"/>
    </svg>
  );
};

// ── Main ChronosPanel ──────────────────────────────────────────────────────
const ChronosPanel = () => {
  const { light1, light2, light3, light4, light5, lightFire } = useDeviceStore((s) => s.outputs);
  const motors = useDeviceStore((s) => s.motors);

  // Panel background shifts subtly when light1 (underlight) is on
  const panelBg = light1
    ? 'linear-gradient(160deg, #ede6d4 0%, #e4dbc8 50%, #ddd4c0 100%)'
    : 'linear-gradient(160deg, #e4ddd2 0%, #dcd4c8 50%, #d4ccc0 100%)';

  return (
    <div style={{
      background: panelBg,
      border: '2.5px solid #b8a88c',
      borderRadius: 10,
      width: 440,
      minHeight: 680,
      position: 'relative',
      padding: '28px 24px 24px',
      boxShadow: [
        '0 12px 48px rgba(40,24,8,0.22)',
        'inset 0 1px 0 rgba(255,255,255,0.65)',
        'inset 0 0 80px rgba(40,24,8,0.05)',
        light1 ? '0 0 40px rgba(200,160,40,0.12)' : '',
      ].filter(Boolean).join(', '),
      transition: 'background 0.8s, box-shadow 0.8s',
      overflow: 'hidden',
    }}>

      {/* Circuit overlay */}
      <CircuitOverlay active={light1} />

      {/* Rivets */}
      {RIVETS.map((pos,i) => <Rivet key={i} style={pos}/>)}

      {/* Pipe column (left side) */}
      <PipeColumn light1={light1}/>

      {/* ── TITLE ── */}
      <div style={{
        textAlign: 'center',
        fontFamily: "'Orbitron',monospace",
        fontSize: 10, letterSpacing: 8,
        color: '#8a7860', textTransform: 'uppercase',
        marginBottom: 16, paddingBottom: 12,
        borderBottom: '1px solid #c8b898',
        position: 'relative', zIndex: 2,
      }}>
        Chronos · Room 1
      </div>

      {/* ── CLOCK SECTION ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginLeft: 24,
        position: 'relative', zIndex: 2,
        marginBottom: 4,
      }}>
        {/* Clock backlight ring */}
        <div style={{
          borderRadius: '50%',
          padding: 4,
          background: light2
            ? 'radial-gradient(circle, rgba(220,180,80,0.18), transparent 70%)'
            : 'transparent',
          boxShadow: light2
            ? '0 0 30px rgba(200,160,40,0.2), 0 0 60px rgba(200,140,20,0.1)'
            : 'none',
          border: light2 ? '1px solid rgba(200,160,40,0.25)' : '1px solid transparent',
          transition: 'all 0.8s',
        }}>
          <AnalogClock />
        </div>
      </div>

      {/* Clock motor label */}
      <div style={{
        textAlign:'center', marginLeft:24,
        fontFamily:"'Share Tech Mono',monospace",
        fontSize:8, color:'#9a8870', letterSpacing:2,
        marginBottom:12, position:'relative', zIndex:2,
      }}>
        MTR-1 · {Math.round(motors.m1)}%
      </div>

      {/* ── MIDDLE ROW: Lights + Gears ── */}
      <div style={{
        display:'flex', gap:0, marginLeft:50,
        position:'relative', zIndex:2, alignItems:'flex-start',
      }}>

        {/* Left column: Edison + indicators */}
        <div style={{
          display:'flex', flexDirection:'column', gap:12,
          alignItems:'center', width:80,
        }}>
          <div>
            <SectionLabel>L3 · Bulb</SectionLabel>
            <EdisonBulb on={light3}/>
          </div>

          <div style={{ height:1, background:'linear-gradient(90deg,transparent,#c0b090,transparent)', width:'100%', margin:'4px 0'}}/>

          <div>
            <SectionLabel>Indicators</SectionLabel>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              <Led active={light1} label="L1 · Gnd"/>
              <Led active={light2} label="L2 · Clk"/>
              <Led active={light3} label="L3 · Bul"/>
              <Led active={light4} label="L4 · Bud"/>
              <Led active={light5} label="L5 · Bud"/>
              <Led active={lightFire} color="red" label="Fire"/>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ width:1, background:'linear-gradient(180deg,transparent,#c0b090,transparent)', margin:'0 12px', alignSelf:'stretch'}}/>

        {/* Right column: Gears */}
        <div style={{ flex:1 }}>
          <SectionLabel>M2 · Gear Drive</SectionLabel>
          <GearVisualization />
        </div>
      </div>

      {/* ── BOTTOM NAMEPLATE ── */}
      <div style={{
        marginTop: 16,
        marginLeft: 50,
        display:'flex', alignItems:'center', justifyContent:'space-between',
        position:'relative', zIndex:2,
      }}>
        <div style={{
          fontFamily:"'Orbitron',monospace",
          fontSize:14, letterSpacing:6,
          color: '#8a6830',
          textShadow: light1 ? '0 0 12px rgba(200,140,30,0.4)' : 'none',
          background:'linear-gradient(135deg,#d4c090,#c0a060,#d0b070)',
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
          fontWeight:700,
          transition:'text-shadow 0.8s',
        }}>CHRONOS</div>

        <MqttStatusBadge />
      </div>

      {/* Bottom border detail */}
      <div style={{
        position:'absolute', bottom:0, left:0, right:0, height:3,
        background:'linear-gradient(90deg,transparent,#c8a860,transparent)',
        opacity:0.4,
      }}/>
    </div>
  );
};

export default ChronosPanel;