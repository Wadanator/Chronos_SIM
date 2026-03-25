import useMqttStore from '../store/useMqttStore';

const Gauge = ({ label, value }) => {
  // Value is expected to be between -45 and 45 degrees
  const angle = Math.min(45, Math.max(-45, value));

  return (
    <svg width="52" height="52" viewBox="0 0 52 52">
      {/* Outer circle */}
      <circle cx="26" cy="26" r="23" fill="#0c0b09" stroke="#7a5e24" strokeWidth="1.5" />

      {/* Arc gauge background */}
      <path d="M 8 38 A 20 20 0 1 1 44 38" fill="none" stroke="#2a2218" strokeWidth="2" />

      {/* Needle */}
      <line
        x1="26"
        y1="26"
        x2="26"
        y2="10"
        stroke="#c07835"
        strokeWidth="2"
        strokeLinecap="round"
        style={{
          transformOrigin: '26px 26px',
          transform: `rotate(${angle}deg)`,
          transition: 'transform 0.4s ease-out',
        }}
      />

      {/* Center cap */}
      <circle cx="26" cy="26" r="3" fill="#b8903c" />

      {/* Label */}
      <text x="26" y="47" textAnchor="middle" fill="#6a5430" fontSize="6" fontFamily="Courier New">
        {label}
      </text>
    </svg>
  );
};

const BottomGauges = () => {
  const gauges = useMqttStore((state) => state.gauges);

  return (
    <div className="flex gap-2">
      <Gauge label="PRESS" value={gauges.pressure} />
      <Gauge label="STEAM" value={gauges.steam} />
      <Gauge label="FLOW" value={gauges.flow} />
    </div>
  );
};

export default BottomGauges;
