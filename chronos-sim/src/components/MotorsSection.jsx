import useDeviceStore from '../store/deviceStore';

const MotorBar = ({ label, value }) => {
  const pct = Math.round(value);
  return (
    <div className="mb-2 pl-5">
      <div className="flex justify-between text-[8px] text-[#4a3a20] mb-[3px]">
        <span className="tracking-wider">{label}</span>
        <span className="font-mono">{pct > 0 ? `${pct}%` : '—'}</span>
      </div>
      <div className="bg-[#080706] border border-[#4a3820] rounded-sm h-[4px] overflow-hidden">
        <div
          className="h-full rounded-sm transition-all duration-500 ease-out"
          style={{
            width: `${pct}%`,
            background: pct > 70
              ? 'linear-gradient(90deg, #b8903c, #e8a030)'
              : 'linear-gradient(90deg, #7a5820, #b8903c)',
          }}
        />
      </div>
    </div>
  );
};

const MotorsSection = () => {
  const motors = useDeviceStore((s) => s.motors);

  return (
    <div className="mt-4">
      <div className="text-[8px] tracking-[3px] text-[#4a3a20] mb-2 pl-5">MOTORY</div>
      <MotorBar label="M1" value={motors.m1} />
      <MotorBar label="M2" value={motors.m2} />
    </div>
  );
};

export default MotorsSection;