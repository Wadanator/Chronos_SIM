import useDeviceStore from '../store/deviceStore';

const LED = ({ on, color }) => {
  const styles = {
    amber: on ? 'bg-[#e8820a] shadow-[0_0_6px_#e87820,0_0_12px_#a84800]' : 'bg-[#1a1008]',
    red:   on ? 'bg-[#cc2222] shadow-[0_0_6px_#cc3030,0_0_12px_#880000]' : 'bg-[#1a0808]',
    green: on ? 'bg-[#28c060] shadow-[0_0_6px_#28c060,0_0_12px_#008830]' : 'bg-[#081a10]',
  };
  return (
    <div className={`w-2 h-2 rounded-full border border-[#5a4820] flex-shrink-0 transition-all duration-200 ${styles[color]}`} />
  );
};

const Row = ({ label, on, color = 'amber' }) => (
  <div className={`flex items-center gap-1.5 py-[3px] pl-5 text-[9px] tracking-wide transition-colors duration-200 ${on ? 'text-[#d4a050]' : 'text-[#4a3a20]'}`}>
    <LED on={on} color={color} />
    <span>{label}</span>
  </div>
);

// Pipe segment drawn as SVG — matches the vertical pipe on the real prop
const PipeColumn = ({ height }) => (
  <svg width="14" height={height} viewBox={`0 0 14 ${height}`} className="absolute left-0 top-0">
    {/* Pipe body */}
    <rect x="2" y="0" width="10" height={height} rx="5" fill="#141210" stroke="#5a4820" strokeWidth="1.5" />
    {/* Pipe sheen */}
    <rect x="3.5" y="0" width="3" height={height} rx="1.5" fill="#1e1c14" opacity="0.6" />
    {/* Joints every 24px */}
    {Array.from({ length: Math.floor(height / 24) }).map((_, i) => (
      <rect key={i} x="1" y={i * 24 + 10} width="12" height="5" rx="2" fill="#1e1a10" stroke="#6a5828" strokeWidth="1" />
    ))}
  </svg>
);

const EmergencyValve = ({ top }) => (
  <svg width="22" height="22" viewBox="0 0 22 22"
    className="absolute left-[-4px]" style={{ top }}>
    <circle cx="11" cy="11" r="9"  fill="#8a1010" stroke="#550808" strokeWidth="1.5" />
    <circle cx="11" cy="11" r="5"  fill="#6a0808" />
    <line x1="3"  y1="11" x2="19" y2="11" stroke="#3a0404" strokeWidth="2.5" />
    <line x1="11" y1="3"  x2="11" y2="19" stroke="#3a0404" strokeWidth="2.5" />
    <circle cx="11" cy="11" r="2.5" fill="#4a0606" />
  </svg>
);

const OutputsSection = () => {
  const o = useDeviceStore((s) => s.outputs);

  return (
    <div className="relative" style={{ minHeight: 220 }}>
      <PipeColumn height={220} />
      <EmergencyValve top={4} />

      <div className="text-[8px] tracking-[3px] text-[#4a3a20] mt-[32px] mb-1 pl-5">VÝSTUPY</div>

      <Row label="SMOKE PWR"  on={o.smokePower}  color="green" />
      <Row label="LIGHT/FIRE" on={o.lightFire}   color="red"   />
      <Row label="LIGHT 1"    on={o.light1}                    />
      <Row label="LIGHT 2"    on={o.light2}                    />
      <Row label="LIGHT 3"    on={o.light3}                    />
      <Row label="LIGHT 4"    on={o.light4}                    />
      <Row label="LIGHT 5"    on={o.light5}                    />
      <Row label="SMOKE EFF"  on={o.smokeEffect}               />

      <EmergencyValve top={148} />
    </div>
  );
};

export default OutputsSection;