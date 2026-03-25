import AnalogClock from './AnalogClock';
import OutputsSection from './OutputsSection';
import MotorsSection from './MotorsSection';
import GearVisualization from './GearVisualization';
import BottomGauges from './BottomGauges';
import MqttStatusBadge from './MqttStatusBadge';

const Rivet = ({ style }) => {
  return (
    <div
      className="absolute w-[9px] h-[9px] bg-[#7a5e24] rounded-full border-[1.5px] border-[#6a5430]"
      style={style}
    />
  );
};

const ChronosPanel = () => {
  return (
    <div className="bg-[#1a1814] border-[3px] border-[#665030] rounded-md p-3.5 max-w-[440px] mx-auto relative overflow-hidden font-mono shadow-2xl">
      {/* Corner rivets */}
      <Rivet style={{ top: '5px', left: '5px' }} />
      <Rivet style={{ top: '5px', right: '5px' }} />
      <Rivet style={{ bottom: '5px', left: '5px' }} />
      <Rivet style={{ bottom: '5px', right: '5px' }} />

      {/* Decorative rivets top */}
      <Rivet style={{ top: '5px', left: 'calc(25% - 4px)' }} />
      <Rivet style={{ top: '5px', left: 'calc(50% - 4px)' }} />
      <Rivet style={{ top: '5px', left: 'calc(75% - 4px)' }} />

      {/* Decorative rivets bottom */}
      <Rivet style={{ bottom: '5px', left: 'calc(25% - 4px)' }} />
      <Rivet style={{ bottom: '5px', left: 'calc(50% - 4px)' }} />
      <Rivet style={{ bottom: '5px', left: 'calc(75% - 4px)' }} />

      {/* Header */}
      <div className="text-center text-[9px] tracking-[5px] text-[#6a5430] mb-2.5 border-b border-[#2a2218] pb-2">
        — CHRONOS CONTROL SIMULATION —
      </div>

      {/* Clock */}
      <AnalogClock />

      {/* Main body */}
      <div className="flex gap-2.5 mt-2.5">
        {/* Left column - Outputs & Motors */}
        <div className="flex-[0_0_148px]">
          <OutputsSection />
          <MotorsSection />
        </div>

        {/* Right column - Gears */}
        <div className="flex-1 min-w-0">
          <GearVisualization />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between mt-2.5 border-t border-[#2a2218] pt-2 gap-2">
        {/* Gauges */}
        <BottomGauges />

        {/* Chronos plate */}
        <div className="bg-[#0a0908] border-2 border-[#b8903c] px-3.5 py-1.5 rounded-sm text-[13px] tracking-[4px] text-[#b8903c] font-bold whitespace-nowrap">
          CHRONOS
        </div>

        {/* MQTT status */}
        <MqttStatusBadge />
      </div>
    </div>
  );
};

export default ChronosPanel;