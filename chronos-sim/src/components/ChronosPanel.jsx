import useDeviceStore from '../store/deviceStore';
import AnalogClock from './AnalogClock';
import GearVisualization from './GearVisualization';
import MqttStatusBadge from './MqttStatusBadge';

// Rivet positions
const RIVETS = [
  { top: '12px', left: '12px' }, { top: '12px', right: '12px' },
  { bottom: '12px', left: '12px' }, { bottom: '12px', right: '12px' },
  { top: '12px', left: '25%' }, { top: '12px', left: '50%' }, { top: '12px', left: '75%' },
  { bottom: '12px', left: '25%' }, { bottom: '12px', left: '50%' }, { bottom: '12px', left: '75%' },
  { top: '25%', left: '12px' }, { top: '50%', left: '12px' }, { top: '75%', left: '12px' },
  { top: '25%', right: '12px' }, { top: '50%', right: '12px' }, { top: '75%', right: '12px' },
];

const Rivet = ({ style }) => (
  <div className="absolute w-3 h-3 rounded-full pointer-events-none" style={{
    ...style,
    background: 'radial-gradient(circle at 30% 30%, #5a4820, #2a1c08)',
    border: '1px solid #1a1008',
    boxShadow: 'inset 0.5px 0.5px 1px rgba(255,255,255,0.15)',
  }}>
    <div className="absolute inset-[4px] rounded-full" style={{
      background: 'radial-gradient(circle at 30% 30%, #3a2e14, #1a1208)',
    }} />
  </div>
);

// Steam pipe
const SteamPipe = () => {
  const lightFire = useDeviceStore((s) => s.outputs.lightFire);
  const light4 = useDeviceStore((s) => s.outputs.light4); // Ventily controlled by light4

  return (
    <div className="absolute" style={{ left: '30px', top: '60px', width: '30px', height: '580px', zIndex: 10 }}>
      {/* Main vertical pipe - more visible */}
      <div className="absolute" style={{
        left: '10px',
        width: '12px',
        height: '100%',
        background: 'linear-gradient(90deg, #6a5430 0%, #4a3e28 30%, #2a1e10 70%, #1a1208 100%)',
        boxShadow: 'inset -3px 0 6px rgba(0,0,0,0.7), inset 3px 0 3px rgba(120,90,60,0.2), 0 2px 4px rgba(0,0,0,0.6)',
        border: '1px solid #1a1008',
      }} />

      {/* Pipe segments/joints */}
      {[15, 35, 55, 75].map((pct, i) => (
        <div key={`joint-${i}`} className="absolute" style={{
          left: '6px',
          top: `${pct}%`,
          width: '20px',
          height: '14px',
          background: 'linear-gradient(180deg, #7a6040 0%, #5a4830 40%, #3a2e1a 100%)',
          border: '1px solid #2a1e10',
          borderRadius: '2px',
          boxShadow: 'inset 0 2px 3px rgba(255,200,100,0.1), 0 2px 4px rgba(0,0,0,0.5)',
        }} />
      ))}

      {/* Red valve wheels */}
      {[100, 320].map((top, i) => (
        <svg key={`valve-${i}`} className="absolute" style={{ left: '-10px', top: `${top}px` }}
          width="50" height="50" viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="20" fill="none"
            stroke={light4 ? '#dd2020' : '#8a1010'} strokeWidth="3"
            style={{
              filter: light4 ? 'drop-shadow(0 0 8px #dd2020)' : 'none',
              transition: 'all 0.3s'
            }} />
          {[0, 60, 120, 180, 240, 300].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            return (
              <line key={angle}
                x1="25" y1="25"
                x2={25 + 20 * Math.cos(rad)} y2={25 + 20 * Math.sin(rad)}
                stroke={light4 ? '#dd2020' : '#8a1010'} strokeWidth="3" strokeLinecap="round" />
            );
          })}
          <circle cx="25" cy="25" r="6" fill="#551010" />
        </svg>
      ))}
    </div>
  );
};

// Analog gauge
const AnalogGauge = ({ value, radius = 24, lit = false }) => {
  const needleAngle = -135 + (value * 270);
  const size = radius * 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Outer ring */}
      <circle cx={radius} cy={radius} r={radius - 1.5} fill="#0a0908"
        stroke="#7a6030" strokeWidth="1.5" />

      {/* Inner dark circle */}
      <circle cx={radius} cy={radius} r={radius - 3} fill="#080706" />

      {/* Arc path for scale */}
      <path
        d={`M ${radius - radius * 0.55} ${radius + radius * 0.5} A ${radius * 0.75} ${radius * 0.75} 0 1 1 ${radius + radius * 0.55} ${radius + radius * 0.5}`}
        fill="none" stroke="#2e2518" strokeWidth="1.5" />

      {/* Tick marks */}
      {Array.from({ length: 11 }, (_, i) => {
        const angle = -135 + (i * 27);
        const rad = (angle * Math.PI) / 180;
        const r1 = radius - 4;
        const r2 = radius - 8;
        return (
          <line key={i}
            x1={radius + r1 * Math.cos(rad)} y1={radius + r1 * Math.sin(rad)}
            x2={radius + r2 * Math.cos(rad)} y2={radius + r2 * Math.sin(rad)}
            stroke={lit ? '#e89040' : '#3a2e18'} strokeWidth="1" />
        );
      })}

      {/* Needle */}
      <line
        x1={radius} y1={radius}
        x2={radius + (radius - 7) * Math.cos((needleAngle * Math.PI) / 180)}
        y2={radius + (radius - 7) * Math.sin((needleAngle * Math.PI) / 180)}
        stroke={lit ? '#ffcc50' : '#8a6030'} strokeWidth="2" strokeLinecap="round"
        style={{
          filter: lit ? 'drop-shadow(0 0 4px #ffaa30)' : 'none',
        }} />

      {/* Center hub */}
      <circle cx={radius} cy={radius} r="3" fill="#c09040" />
    </svg>
  );
};

// Fire indicator
const FireIndicator = () => {
  const lightFire = useDeviceStore((s) => s.outputs.lightFire);

  return (
    <div className="absolute" style={{
      right: '20px',
      top: '130px',
      width: '50px',
      height: '90px',
      background: '#0d0b09',
      border: '2px solid #4a3820',
      borderRadius: '4px',
      padding: '8px',
      boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)',
    }}>
      <svg width="34" height="74" viewBox="0 0 34 74">
        <defs>
          <radialGradient id="fireFill">
            <stop offset="0%" stopColor="#ff7720" />
            <stop offset="50%" stopColor="#ff4010" />
            <stop offset="100%" stopColor="#8a1000" />
          </radialGradient>
        </defs>

        {lightFire ? (
          <g style={{ animation: 'fireFlicker 0.12s ease-in-out infinite alternate' }}>
            {[-7, 0, 7].map((offset, i) => (
              <path key={i}
                d={`M ${17 + offset} 64 C ${12 + offset} 52 ${10 + offset} 36 ${16 + offset} 22 C ${17 + offset} 18 ${17 + offset} 16 ${17 + offset} 16 C ${17 + offset} 16 ${18 + offset} 18 ${19 + offset} 22 C ${25 + offset} 36 ${23 + offset} 52 ${17 + offset} 64 Z`}
                fill="url(#fireFill)" opacity={i === 1 ? 0.95 : 0.7}
                style={{ filter: 'drop-shadow(0 0 4px #ff4010)' }} />
            ))}
            <ellipse cx="17" cy="58" rx="14" ry="6" fill="#ff4010" opacity="0.4" />
          </g>
        ) : (
          <path
            d="M 17 64 C 12 52 10 36 16 22 C 17 18 17 16 17 16 C 17 16 18 18 19 22 C 25 36 23 52 17 64 Z"
            fill="#1a1208" stroke="#2a1e10" strokeWidth="1" />
        )}
      </svg>

      <style>{`
        @keyframes fireFlicker {
          0% { transform: scaleY(1) translateY(0); }
          100% { transform: scaleY(1.05) translateY(-1px); }
        }
      `}</style>
    </div>
  );
};

// Budík lights
const BudikLight = ({ active, style }) => (
  <div className="absolute" style={style}>
    <div style={{
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      border: '1px solid #3a2e18',
      background: active ? 'radial-gradient(circle, #ffcc60, #ff8020)' : '#0a0806',
      boxShadow: active ? '0 0 20px #ff8020, 0 0 10px #ffaa40, inset 0 0 6px rgba(255,200,80,0.8)' : 'inset 0 0 3px rgba(0,0,0,0.9)',
      transition: 'all 0.3s',
    }} />
  </div>
);

// Main panel
const ChronosPanel = () => {
  const light1 = useDeviceStore((s) => s.outputs.light1);
  const light2 = useDeviceStore((s) => s.outputs.light2);
  const light3 = useDeviceStore((s) => s.outputs.light3);
  const light4 = useDeviceStore((s) => s.outputs.light4);
  const light5 = useDeviceStore((s) => s.outputs.light5);
  const motors = useDeviceStore((s) => s.motors);

  return (
    <div className="relative overflow-hidden font-mono select-none" style={{
      background: '#0a0906',
      border: '4px solid #3a2e18',
      borderRadius: '6px',
      width: '380px',
      height: '720px',
      padding: '8px',
      boxShadow: '0 0 50px rgba(0,0,0,0.9), inset 0 0 80px rgba(0,0,0,0.7)',
      transition: 'all 1s ease',
    }}>

      {/* Rivets */}
      {RIVETS.map((pos, i) => <Rivet key={i} style={pos} />)}

      {/* Circuit board pattern for light1 */}
      {light1 && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" style={{ zIndex: 1 }}>
          <defs>
            <pattern id="circuitPattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              {/* Horizontal traces */}
              <line x1="0" y1="20" x2="80" y2="20" stroke="#c8a050" strokeWidth="1.5" opacity="0.6" />
              <line x1="0" y1="60" x2="80" y2="60" stroke="#c8a050" strokeWidth="1.5" opacity="0.6" />
              {/* Vertical traces */}
              <line x1="20" y1="0" x2="20" y2="80" stroke="#c8a050" strokeWidth="1.5" opacity="0.6" />
              <line x1="60" y1="0" x2="60" y2="80" stroke="#c8a050" strokeWidth="1.5" opacity="0.6" />
              {/* Connection pads */}
              <circle cx="20" cy="20" r="3" fill="#e8b060" opacity="0.8" />
              <circle cx="60" cy="20" r="3" fill="#e8b060" opacity="0.8" />
              <circle cx="20" cy="60" r="3" fill="#e8b060" opacity="0.8" />
              <circle cx="60" cy="60" r="3" fill="#e8b060" opacity="0.8" />
              {/* Small detail traces */}
              <line x1="10" y1="40" x2="30" y2="40" stroke="#b89040" strokeWidth="1" opacity="0.5" />
              <line x1="50" y1="40" x2="70" y2="40" stroke="#b89040" strokeWidth="1" opacity="0.5" />
            </pattern>
            <filter id="circuitGlow">
              <feGaussianBlur stdDeviation="2" />
            </filter>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuitPattern)" filter="url(#circuitGlow)" />
        </svg>
      )}

      {/* Subtle texture */}
      <div className="absolute inset-0 pointer-events-none opacity-30" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 3px)',
      }} />

      {/* Steam pipe system */}
      <SteamPipe />

      {/* Large clock at top center */}
      <div className="absolute" style={{
        left: '50%',
        top: '30px',
        transform: 'translateX(-50%)',
        width: '240px',
        height: '240px',
      }}>
        <div style={{ transform: 'scale(1.6)' }}>
          <AnalogClock />
        </div>
      </div>

      {/* Left panel area - gauges */}
      <div className="absolute" style={{ left: '75px', top: '290px' }}>
        <AnalogGauge value={motors.m1 / 100} radius={26} lit={light4} />
      </div>

      <div className="absolute" style={{ left: '75px', top: '350px' }}>
        <AnalogGauge value={motors.m2 / 100} radius={26} lit={light4} />
      </div>

      {/* Small Edison bulb below clock */}
      <div className="absolute" style={{
        left: '50%',
        top: '260px',
        transform: 'translateX(-50%)',
      }}>
        <svg width="30" height="40" viewBox="0 0 30 40">
          <defs>
            <radialGradient id="miniEdisonGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={light3 ? '#fff8d0' : '#1a1610'} />
              <stop offset="100%" stopColor={light3 ? '#ffb030' : '#0c0a06'} />
            </radialGradient>
          </defs>
          {/* Hanging wire */}
          <line x1="15" y1="0" x2="15" y2="8" stroke="#3a3028" strokeWidth="1" />
          {/* Socket */}
          <rect x="11" y="7" width="8" height="4" rx="1" fill="#2a2418" stroke="#5a4820" strokeWidth="0.5" />
          {/* Bulb */}
          <circle cx="15" cy="20" r="8"
            fill="url(#miniEdisonGlow)"
            stroke={light3 ? '#ffcc50' : '#2a2010'}
            strokeWidth="1"
            style={{
              transition: 'all 0.6s ease',
              filter: light3 ? 'drop-shadow(0 0 12px #ffb030) drop-shadow(0 0 6px #ffe080)' : 'none'
            }}
          />
          {/* Filament when lit */}
          {light3 && (
            <path d="M 12 20 Q 15 17 18 20" fill="none" stroke="#fff8d0" strokeWidth="0.8" />
          )}
          {/* Base */}
          <rect x="13" y="27" width="4" height="2" rx="0.5" fill="#1a1610" stroke="#3a2e14" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Control panel with budík lights */}
      <div className="absolute" style={{
        left: '70px',
        top: '420px',
        width: '70px',
        height: '50px',
        background: '#1a1610',
        border: '1px solid #4a3820',
        borderRadius: '2px',
        padding: '6px',
      }}>
        {/* Small LED display area */}
        <div style={{
          width: '100%',
          height: '18px',
          background: '#0a0906',
          border: '1px solid #2a1e10',
          marginBottom: '4px',
          display: 'flex',
          gap: '2px',
          padding: '2px',
        }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{
              flex: 1,
              height: '100%',
              background: light5 ? '#ffcc50' : '#1a1208',
              boxShadow: light5 ? '0 0 6px #ffaa30' : 'none',
            }} />
          ))}
        </div>

        {/* Budík indicator lights */}
        <div className="flex gap-2 justify-center mt-2">
          <BudikLight active={light4} style={{}} />
          <BudikLight active={light5} style={{}} />
        </div>
      </div>

      {/* Gears - right side, smaller and positioned higher */}
      <div className="absolute" style={{
        right: '20px',
        top: '250px',
        width: '150px',
        height: '400px',
      }}>
        <GearVisualization />
      </div>

      {/* Fire indicator */}
      <FireIndicator />

      {/* Bottom gauges */}
      <div className="absolute flex gap-5" style={{ left: '75px', bottom: '75px' }}>
        <AnalogGauge value={0.42} radius={20} />
        <AnalogGauge value={0.65} radius={20} />
        <AnalogGauge value={0.28} radius={20} />
      </div>

      {/* CHRONOS nameplate on pipe */}
      <div className="absolute" style={{
        bottom: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '140px',
        height: '32px',
        background: 'linear-gradient(180deg, #2a2418 0%, #1a1410 50%, #0d0c09 100%)',
        border: '2px solid #b8943c',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        letterSpacing: '8px',
        color: '#c0a040',
        fontWeight: 'bold',
        boxShadow: 'inset 0 0 10px rgba(0,0,0,0.9), 0 0 16px rgba(192,160,64,0.15)',
        textShadow: '0 0 8px rgba(192,160,64,0.3)',
      }}>
        CHRONOS
      </div>

      {/* MQTT badge - tiny in corner */}
      <div className="absolute opacity-30" style={{ bottom: '8px', right: '8px', fontSize: '5px' }}>
        <MqttStatusBadge />
      </div>
    </div>
  );
};

export default ChronosPanel;
