import useDeviceStore from '../store/deviceStore';
import AnalogClock from './AnalogClock';
import EdisonBulb from './EdisonBulb';
import GearVisualization from './GearVisualization';
import MqttStatusBadge from './MqttStatusBadge';

// Rivet positions matching real prop border
const RIVETS = [
  // corners
  { top: '8px', left: '8px' }, { top: '8px', right: '8px' },
  { bottom: '8px', left: '8px' }, { bottom: '8px', right: '8px' },
  // top edge
  { top: '8px', left: '20%' }, { top: '8px', left: '40%' },
  { top: '8px', left: '60%' }, { top: '8px', left: '80%' },
  // bottom edge
  { bottom: '8px', left: '20%' }, { bottom: '8px', left: '40%' },
  { bottom: '8px', left: '60%' }, { bottom: '8px', left: '80%' },
  // left edge
  { top: '20%', left: '8px' }, { top: '40%', left: '8px' },
  { top: '60%', left: '8px' }, { top: '80%', left: '8px' },
  // right edge
  { top: '20%', right: '8px' }, { top: '40%', right: '8px' },
  { top: '60%', right: '8px' }, { top: '80%', right: '8px' },
];

const Rivet = ({ style }) => (
  <div className="absolute w-2 h-2 rounded-full pointer-events-none" style={{
    ...style,
    background: 'radial-gradient(circle at 35% 35%, #8a6828, #4a3010)',
    border: '1px solid #2a1c08',
    boxShadow: 'inset 0 0.5px 0.5px rgba(255,255,255,0.1)',
  }} />
);

// Steam pipe with valve wheels
const SteamPipe = () => {
  const lightFire = useDeviceStore((s) => s.outputs.lightFire);

  return (
    <div className="absolute" style={{ left: '23px', top: '100px', width: '24px', height: '540px' }}>
      {/* Vertical pipe */}
      <div className="absolute" style={{
        left: '7px',
        top: 0,
        width: '10px',
        height: '100%',
        background: 'linear-gradient(90deg, #4a3820 0%, #2e2418 40%, #1a1208 100%)',
        boxShadow: 'inset -2px 0 4px rgba(0,0,0,0.5)',
      }} />

      {/* Pipe joints */}
      {[20, 45, 70].map((pct, i) => (
        <div key={`joint-${i}`} className="absolute" style={{
          left: '3px',
          top: `${pct}%`,
          width: '18px',
          height: '10px',
          background: 'linear-gradient(180deg, #5a4830 0%, #3a2e1a 50%, #2a1e10 100%)',
          border: '1px solid #1a1208',
          boxShadow: 'inset 0 1px 2px rgba(255,200,100,0.1)',
        }} />
      ))}

      {/* Valve wheels */}
      {[130, 330].map((top, i) => (
        <svg key={`valve-${i}`} width="40" height="40" className="absolute" style={{
          left: '-8px',
          top: `${top}px`,
        }}>
          <circle cx="20" cy="20" r="16" fill="none"
            stroke={lightFire ? '#cc3020' : '#8a2010'} strokeWidth="2.5"
            style={{ filter: lightFire ? 'drop-shadow(0 0 6px #cc3020)' : 'none' }} />
          {[0, 60, 120, 180, 240, 300].map((angle, j) => {
            const rad = (angle * Math.PI) / 180;
            return (
              <line key={j}
                x1="20" y1="20"
                x2={20 + 16 * Math.cos(rad)} y2={20 + 16 * Math.sin(rad)}
                stroke={lightFire ? '#cc3020' : '#8a2010'} strokeWidth="2.5" strokeLinecap="round" />
            );
          })}
          <circle cx="20" cy="20" r="5" fill="#551010" />
        </svg>
      ))}
    </div>
  );
};

// Analog gauge
const AnalogGauge = ({ value, radius = 28, lit = false }) => {
  const needleAngle = -135 + (value * 270);
  const size = radius * 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <radialGradient id={`gaugeGrad-${radius}`} cx="50%" cy="50%">
          <stop offset="0%" stopColor="#0d0c0a" />
          <stop offset="100%" stopColor="#0a0908" />
        </radialGradient>
      </defs>

      {/* Outer bezel */}
      <circle cx={radius} cy={radius} r={radius - 2} fill={`url(#gaugeGrad-${radius})`}
        stroke="#7a6030" strokeWidth="1.5" />

      {/* Inner track */}
      <path
        d={`M ${radius - (radius * 0.6)} ${radius + (radius * 0.4)} A ${radius * 0.7} ${radius * 0.7} 0 1 1 ${radius + (radius * 0.6)} ${radius + (radius * 0.4)}`}
        fill="none" stroke="#2e2518" strokeWidth="1.5" />

      {/* Tick marks */}
      {Array.from({ length: 11 }, (_, i) => {
        const angle = -135 + (i * 27);
        const rad = (angle * Math.PI) / 180;
        const r1 = radius - 5;
        const r2 = radius - 9;
        return (
          <line key={i}
            x1={radius + r1 * Math.cos(rad)} y1={radius + r1 * Math.sin(rad)}
            x2={radius + r2 * Math.cos(rad)} y2={radius + r2 * Math.sin(rad)}
            stroke={lit ? '#c07030' : '#3a2e18'} strokeWidth="0.8" />
        );
      })}

      {/* Needle */}
      <line
        x1={radius} y1={radius}
        x2={radius + (radius - 8) * Math.cos((needleAngle * Math.PI) / 180)}
        y2={radius + (radius - 8) * Math.sin((needleAngle * Math.PI) / 180)}
        stroke={lit ? '#e8a040' : '#8a6030'} strokeWidth="1.5" strokeLinecap="round"
        style={{ transition: 'all 0.5s ease-out' }} />

      {/* Center hub */}
      <circle cx={radius} cy={radius} r="3" fill="#c09040" />
    </svg>
  );
};

// Fire effect panel
const FirePanel = () => {
  const lightFire = useDeviceStore((s) => s.outputs.lightFire);

  return (
    <div className="absolute" style={{
      right: '16px',
      top: '140px',
      width: '52px',
      height: '80px',
      background: '#0d0c0a',
      border: '2px solid #4a3820',
      borderRadius: '4px',
      padding: '6px',
    }}>
      <svg width="40" height="68" viewBox="0 0 40 68">
        <defs>
          <radialGradient id="fireFill" cx="50%" cy="80%">
            <stop offset="0%" stopColor="#ff6010" />
            <stop offset="70%" stopColor="#e04000" />
            <stop offset="100%" stopColor="#800000" />
          </radialGradient>
        </defs>

        {lightFire ? (
          <>
            <g style={{ animation: 'fireFlicker 0.15s ease-in-out infinite alternate' }}>
              {/* Three flames */}
              {[-8, 0, 8].map((offset, i) => (
                <path key={i}
                  d={`M ${20 + offset} 58 C ${14 + offset} 48 ${12 + offset} 32 ${18 + offset} 20 C ${19 + offset} 16 ${20 + offset} 14 ${20 + offset} 14 C ${20 + offset} 14 ${21 + offset} 16 ${22 + offset} 20 C ${28 + offset} 32 ${26 + offset} 48 ${20 + offset} 58 Z`}
                  fill="url(#fireFill)" opacity={i === 1 ? "0.95" : "0.75"} />
              ))}
              {/* Glow base */}
              <ellipse cx="20" cy="52" rx="16" ry="7" fill="#ff4000" opacity="0.3" />
            </g>
          </>
        ) : (
          <path
            d="M 20 58 C 14 48 12 32 18 20 C 19 16 20 14 20 14 C 20 14 21 16 22 20 C 28 32 26 48 20 58 Z"
            fill="#2a1810" stroke="#3a2414" strokeWidth="1" />
        )}
      </svg>

      <style>{`
        @keyframes fireFlicker {
          0% { transform: scaleX(1) scaleY(1) translateY(0); }
          100% { transform: scaleX(0.92) scaleY(1.06) translateY(-1px); }
        }
      `}</style>
    </div>
  );
};

// Smoke machine indicator
const SmokeMachineIndicator = () => {
  const smokePower = useDeviceStore((s) => s.outputs.smokePower);

  return (
    <div className="absolute" style={{
      right: '304px',
      top: '478px',
      width: '52px',
      height: '42px',
      background: smokePower ? 'rgba(30,42,56,0.7)' : 'transparent',
      border: smokePower ? '1px solid #4a6888' : '1px solid transparent',
      borderRadius: '3px',
      padding: '4px',
      transition: 'all 0.3s',
    }}>
      {smokePower && (
        <>
          <div className="text-[6px] text-center tracking-wide leading-tight" style={{ color: '#4a8898' }}>
            SMOKE<br />POWER
          </div>
          <div className="flex justify-center mt-1">
            <div className="w-2 h-2 rounded-full" style={{
              background: '#00d0a0',
              boxShadow: '0 0 6px #00d0a0',
            }} />
          </div>
        </>
      )}
    </div>
  );
};

// Budík indicator light
const BudikIndicator = ({ active, style }) => (
  <div className="absolute" style={style}>
    <div className="w-3 h-3 rounded-full border border-[#3a2e14] transition-all duration-300" style={{
      background: active ? 'radial-gradient(circle, #ff9020, #ff6010)' : '#0a0906',
      boxShadow: active ? '0 0 10px #ff6010, 0 0 5px #ff9020' : 'inset 0 0 2px rgba(0,0,0,0.8)',
    }} />
  </div>
);

// Main panel component
const ChronosPanel = () => {
  const light1 = useDeviceStore((s) => s.outputs.light1);
  const light2 = useDeviceStore((s) => s.outputs.light2);
  const light3 = useDeviceStore((s) => s.outputs.light3);
  const light4 = useDeviceStore((s) => s.outputs.light4);
  const light5 = useDeviceStore((s) => s.outputs.light5);
  const motors = useDeviceStore((s) => s.motors);

  return (
    <div className="relative overflow-hidden font-mono select-none" style={{
      background: light1
        ? 'linear-gradient(160deg, #1c1910 0%, #151208 60%, #100e08 100%)'
        : 'linear-gradient(160deg, #141208 0%, #0e0c07 60%, #0a0906 100%)',
      border: '3px solid #4a3c18',
      borderRadius: '4px',
      width: '380px',
      height: '720px',
      padding: '8px',
      boxShadow: light1
        ? '0 0 60px rgba(180,130,30,0.15), inset 0 0 40px rgba(0,0,0,0.5)'
        : '0 0 40px rgba(0,0,0,0.8), inset 0 0 60px rgba(0,0,0,0.5)',
      transition: 'all 1s ease',
    }}>

      {/* Rivets */}
      {RIVETS.map((pos, i) => <Rivet key={i} style={pos} />)}

      {/* Scanline texture */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 3px)',
        opacity: 0.5,
      }} />

      {/* Panel backlight indicator */}
      {light1 && (
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{
          background: 'linear-gradient(90deg, transparent, #c09030, transparent)',
        }} />
      )}

      {/* Header */}
      <div className="relative text-center text-[7px] tracking-[5px] text-[#2e2414] mb-2 pb-2 border-b border-[#1a1608]">
        — CHRONOS CONTROL —
      </div>

      {/* Steam pipe & valves */}
      <SteamPipe />

      {/* Left gauges */}
      <div className="absolute" style={{ left: '68px', top: '190px' }}>
        <div className="mb-3"><AnalogGauge value={motors.m1 / 100} radius={28} lit={light4} /></div>
        <div className="mb-3"><AnalogGauge value={motors.m2 / 100} radius={28} lit={light4} /></div>
        <div><AnalogGauge value={0.5} radius={28} lit={light5} /></div>
      </div>

      {/* Budík indicator lights */}
      <BudikIndicator active={light4} style={{ left: '72px', top: '370px' }} />
      <BudikIndicator active={light5} style={{ left: '90px', top: '380px' }} />

      {/* Main clock - positioned properly with light2 backlight */}
      <div className="absolute" style={{ left: '120px', top: '50px', width: '216px', height: '216px' }}>
        <div style={{ transform: 'scale(1.4)', transformOrigin: 'center center' }}>
          <AnalogClock />
        </div>
      </div>

      {/* Edison bulb below clock */}
      <div className="absolute" style={{ left: '180px', top: '280px' }}>
        <EdisonBulb />
      </div>

      {/* Gears on right side */}
      <div className="absolute" style={{ right: '20px', top: '300px', width: '160px', height: '280px' }}>
        <GearVisualization />
      </div>

      {/* Fire panel */}
      <FirePanel />

      {/* Smoke machine indicator */}
      <SmokeMachineIndicator />

      {/* Bottom gauges */}
      <div className="absolute flex gap-4" style={{ left: '68px', bottom: '86px' }}>
        <AnalogGauge value={0.42} radius={18} />
        <AnalogGauge value={0.65} radius={18} />
        <AnalogGauge value={0.28} radius={18} />
      </div>

      {/* CHRONOS nameplate */}
      <div className="absolute" style={{
        bottom: '36px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#0a0908',
        border: '2px solid #b8903c',
        padding: '6px 24px',
        borderRadius: '2px',
        fontSize: '15px',
        letterSpacing: '6px',
        color: '#b8903c',
        fontWeight: 'bold',
        boxShadow: 'inset 0 0 8px rgba(0,0,0,0.8), 0 0 12px rgba(184,144,60,0.2)',
      }}>
        CHRONOS
      </div>

      {/* MQTT status */}
      <div className="absolute" style={{ bottom: '10px', right: '10px', fontSize: '6px', opacity: 0.4 }}>
        <MqttStatusBadge />
      </div>
    </div>
  );
};

export default ChronosPanel;
