import useDeviceStore from '../store/deviceStore';

// Represents the two analog gauge/budík lights on the real prop
const BudikLight = ({ on, label }) => (
  <svg width="48" height="48" viewBox="0 0 48 48">
    <defs>
      <radialGradient id={`bg-${label}`} cx="50%" cy="50%" r="50%">
        <stop offset="0%"  stopColor={on ? '#d09040' : '#1a1408'} />
        <stop offset="70%" stopColor={on ? '#804808' : '#100e06'} />
        <stop offset="100%" stopColor="#080604" />
      </radialGradient>
    </defs>
    {/* Outer ring */}
    <circle cx="24" cy="24" r="22" fill="#0a0906" stroke="#4a3c18" strokeWidth="1.5" />
    {/* Rivet dots */}
    {[0,1,2,3,4,5].map(i => {
      const a = (i / 6) * Math.PI * 2;
      return <circle key={i}
        cx={(24 + 21 * Math.cos(a)).toFixed(1)} cy={(24 + 21 * Math.sin(a)).toFixed(1)}
        r="1.2" fill="#4a3818" />;
    })}
    {/* Glass face */}
    <circle cx="24" cy="24" r="18"
      fill={`url(#bg-${label})`}
      stroke={on ? '#b07830' : '#2a2010'} strokeWidth="1"
      style={{ transition: 'all 0.5s ease', filter: on ? 'drop-shadow(0 0 6px #c07820)' : 'none' }} />
    {/* Inner ring */}
    <circle cx="24" cy="24" r="13" fill="none"
      stroke={on ? '#6a4818' : '#1a1408'} strokeWidth="0.6"
      style={{ transition: 'all 0.5s' }} />
    {/* Spokes */}
    {[0,1,2,3].map(i => {
      const a = (i * Math.PI) / 2 + Math.PI / 4;
      return <line key={i}
        x1={(24 + 4 * Math.cos(a)).toFixed(1)} y1={(24 + 4 * Math.sin(a)).toFixed(1)}
        x2={(24 + 11 * Math.cos(a)).toFixed(1)} y2={(24 + 11 * Math.sin(a)).toFixed(1)}
        stroke={on ? '#9a6828' : '#2a2010'} strokeWidth="1"
        style={{ transition: 'all 0.5s' }} />;
    })}
    {/* Centre */}
    <circle cx="24" cy="24" r="3.5" fill={on ? '#e8a040' : '#1a1408'}
      style={{ transition: 'all 0.5s', filter: on ? 'drop-shadow(0 0 3px #e8a040)' : 'none' }} />
    {/* Label */}
    <text x="24" y="45" textAnchor="middle"
      fill={on ? '#7a5828' : '#3a2e18'} fontSize="5" fontFamily="Courier New" letterSpacing="1"
      style={{ transition: 'fill 0.5s' }}>
      {label}
    </text>
  </svg>
);

const BudikLights = () => {
  const light4 = useDeviceStore((s) => s.outputs.light4);
  const light5 = useDeviceStore((s) => s.outputs.light5);

  return (
    <div className="flex gap-2 items-center">
      <BudikLight on={light4} label="BUD.L" />
      <BudikLight on={light5} label="BUD.R" />
    </div>
  );
};

export default BudikLights;