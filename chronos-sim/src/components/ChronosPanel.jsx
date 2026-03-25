import useDeviceStore    from '../store/deviceStore';
import AnalogClock       from './AnalogClock';
import EdisonBulb        from './EdisonBulb';
import GearVisualization from './GearVisualization';
import BudikLights       from './BudikLights';
import SteamSmokePanel   from './SteamSmokePanel';
import MotorStatus       from './MotorStatus';
import MqttStatus        from './MqttStatus';

// Rivet positions matching real prop border
const RIVETS = [
  // corners
  { top:'6px', left:'6px' }, { top:'6px', right:'6px' },
  { bottom:'6px', left:'6px' }, { bottom:'6px', right:'6px' },
  // top
  { top:'6px', left:'calc(20% - 4px)' }, { top:'6px', left:'calc(40% - 4px)' },
  { top:'6px', left:'calc(60% - 4px)' }, { top:'6px', left:'calc(80% - 4px)' },
  // bottom
  { bottom:'6px', left:'calc(20% - 4px)' }, { bottom:'6px', left:'calc(40% - 4px)' },
  { bottom:'6px', left:'calc(60% - 4px)' }, { bottom:'6px', left:'calc(80% - 4px)' },
  // left
  { top:'calc(25% - 4px)', left:'6px' }, { top:'calc(50% - 4px)', left:'6px' }, { top:'calc(75% - 4px)', left:'6px' },
  // right
  { top:'calc(25% - 4px)', right:'6px' }, { top:'calc(50% - 4px)', right:'6px' }, { top:'calc(75% - 4px)', right:'6px' },
];

const Rivet = ({ style }) => (
  <div className="absolute w-[8px] h-[8px] rounded-full pointer-events-none" style={{
    ...style,
    background: 'radial-gradient(circle at 35% 35%, #8a6828, #4a3010)',
    border: '1px solid #2a1c08',
    boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.08)',
  }} />
);

const ChronosPanel = () => {
  const light1 = useDeviceStore((s) => s.outputs.light1); // whole panel backlight

  return (
    <div className="relative overflow-hidden font-mono select-none"
      style={{
        background: light1
          ? 'linear-gradient(160deg, #1c1910 0%, #151208 60%, #100e08 100%)'
          : 'linear-gradient(160deg, #141208 0%, #0e0c07 60%, #0a0906 100%)',
        border: '3px solid #4a3c18',
        borderRadius: '4px',
        maxWidth: '480px',
        width: '100%',
        padding: '12px',
        boxShadow: light1
          ? '0 0 60px rgba(180,130,30,0.15), 0 0 120px rgba(180,130,30,0.05), inset 0 0 40px rgba(0,0,0,0.5)'
          : '0 0 40px rgba(0,0,0,0.8), inset 0 0 60px rgba(0,0,0,0.5)',
        transition: 'all 1s ease',
      }}>

      {/* Rivets */}
      {RIVETS.map((pos, i) => <Rivet key={i} style={pos} />)}

      {/* Subtle scanline texture */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.06) 2px,rgba(0,0,0,0.06) 3px)',
        opacity: 0.5,
      }} />

      {/* Panel backlight indicator strip */}
      <div className="absolute top-0 left-0 right-0 h-[2px] transition-all duration-1000"
        style={{ background: light1 ? 'linear-gradient(90deg,transparent,#c09030,transparent)' : 'transparent' }} />

      {/* Header */}
      <div className="relative text-center text-[7px] tracking-[7px] text-[#2e2414] mb-2 border-b border-[#1a1608] pb-2">
        — CHRONOS CONTROL —
      </div>

      {/* ── CLOCK + GEARS (top main area) ── */}
      <div className="relative flex gap-2">
        {/* Clock takes left 55% */}
        <div className="flex-[0_0_55%]">
          <AnalogClock />
        </div>
        {/* Gears fill the right */}
        <div className="flex-1 min-w-0 border-l border-[#1a1608]">
          <GearVisualization />
        </div>
      </div>

      {/* ── EDISON BULB under clock ── */}
      <div className="relative mt-1 border-t border-[#1a1608] pt-1">
        <EdisonBulb />
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="relative flex items-center justify-between mt-2 pt-2 border-t border-[#1a1608] gap-2 flex-wrap">

        {/* Left: Budík lights */}
        <BudikLights />

        {/* Centre-left: Steam + fire */}
        <SteamSmokePanel />

        {/* Centre-right: Motor bars */}
        <div className="flex-1 min-w-[100px]">
          <MotorStatus />
        </div>

        {/* Right: CHRONOS plate + MQTT */}
        <div className="flex flex-col items-end gap-1.5">
          {/* CHRONOS name plate */}
          <div style={{
            background: '#08070500',
            border: '2px solid #7a6428',
            padding: '4px 10px',
            borderRadius: '2px',
            fontSize: '11px',
            letterSpacing: '5px',
            color: '#907828',
            fontWeight: 'bold',
            textShadow: '0 0 8px #7060200a',
            boxShadow: 'inset 0 0 6px rgba(0,0,0,0.7)',
            whiteSpace: 'nowrap',
          }}>
            CHRONOS
          </div>
          <MqttStatus />
        </div>
      </div>

      {/* ── light1 active label ── */}
      {light1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[6px] tracking-[3px] text-[#5a4820] pointer-events-none">
          PODSVIETENIE AKTÍVNE
        </div>
      )}
    </div>
  );
};

export default ChronosPanel;