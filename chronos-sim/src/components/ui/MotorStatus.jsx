import useDeviceStore from '../../store/deviceStore';

const MotorBar = ({ label, value }) => {
  const pct = Math.round(value);
  const active = pct > 0.5;
  return (
    <div className="flex items-center gap-2">
      <span className="text-[8px] font-mono text-[#4a3a20] tracking-wider w-6">{label}</span>
      <div className="flex-1 bg-[#080706] border border-[#3a2e14] rounded-sm h-[4px] overflow-hidden">
        <div className="h-full rounded-sm transition-all duration-500 ease-out"
          style={{
            width: `${pct}%`,
            background: pct > 70
              ? 'linear-gradient(90deg,#a07828,#e09030)'
              : 'linear-gradient(90deg,#5a3e18,#a07828)',
          }} />
      </div>
      <span className="text-[8px] font-mono w-8 text-right"
        style={{ color: active ? '#a08030' : '#3a2e18' }}>
        {active ? `${pct}%` : '—'}
      </span>
    </div>
  );
};

const MotorStatus = () => {
  const motors = useDeviceStore((s) => s.motors);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="text-[7px] tracking-[3px] text-[#3a2e18] mb-0.5">MOTORY</div>
      <MotorBar label="M1" value={motors.m1} />
      <MotorBar label="M2" value={motors.m2} />
    </div>
  );
};

export default MotorStatus;