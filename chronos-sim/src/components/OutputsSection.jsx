import useDeviceStore from '../store/deviceStore';

const LED = ({ isOn, color = 'amber' }) => {
  const colorClasses = {
    amber: isOn ? 'bg-[#e8820a] shadow-[0_0_5px_#e88020]' : 'bg-[#1e1410]',
    red: isOn ? 'bg-[#cc2222] shadow-[0_0_5px_#cc4040]' : 'bg-[#1e1410]',
    green: isOn ? 'bg-[#28c060] shadow-[0_0_5px_#28c060]' : 'bg-[#1e1410]',
  };

  return (
    <div
      className={`w-2 h-2 rounded-full border border-[#7a5e24] flex-shrink-0 transition-all duration-300 ${colorClasses[color]}`}
    />
  );
};

const OutputRow = ({ label, isOn, ledColor = 'amber' }) => {
  return (
    <div className={`flex items-center gap-1.5 py-0.5 pl-6 text-[10px] transition-colors ${isOn ? 'text-[#e8820a]' : 'text-[#6a5430]'}`}>
      <LED isOn={isOn} color={ledColor} />
      <span className="tracking-wide">{label}</span>
    </div>
  );
};

const EmergencyButton = () => {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" className="absolute left-[-2px] z-10">
      <circle cx="15" cy="15" r="12" fill="#cc2222" stroke="#881010" strokeWidth="1.5" />
      <line x1="4" y1="15" x2="26" y2="15" stroke="#550a0a" strokeWidth="3" />
      <line x1="15" y1="4" x2="15" y2="26" stroke="#550a0a" strokeWidth="3" />
      <circle cx="15" cy="15" r="3.5" fill="#770808" />
    </svg>
  );
};

const OutputsSection = () => {
  const outputs = useDeviceStore((state) => state.outputs);

  return (
    <div className="relative">
      {/* Vertical pipe background */}
      <div className="absolute left-1.5 top-0 bottom-0 w-2.5 bg-[#1e1c17] border-[1.5px] border-[#7a5e24] rounded-[5px]" />

      {/* Top emergency button */}
      <div className="relative" style={{ top: '8px' }}>
        <EmergencyButton />
      </div>

      {/* Section label */}
      <div className="text-[9px] tracking-[2px] text-[#6a5430] mt-6 mb-1 pl-6">VÝSTUPY</div>

      {/* Output rows */}
      <OutputRow label="SMOKE PWR" isOn={outputs.smokePower} ledColor="green" />
      <OutputRow label="LIGHT/FIRE" isOn={outputs.lightFire} ledColor="red" />
      <OutputRow label="LIGHT 1" isOn={outputs.light1} />
      <OutputRow label="LIGHT 2" isOn={outputs.light2} />
      <OutputRow label="LIGHT 3" isOn={outputs.light3} />
      <OutputRow label="LIGHT 4" isOn={outputs.light4} />
      <OutputRow label="LIGHT 5" isOn={outputs.light5} />
      <OutputRow label="SMOKE EFF" isOn={outputs.smokeEffect} />

      {/* Bottom emergency button */}
      <div className="relative" style={{ bottom: '58px', marginTop: '8px' }}>
        <EmergencyButton />
      </div>
    </div>
  );
};

export default OutputsSection;
