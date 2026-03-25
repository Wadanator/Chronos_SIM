import useDeviceStore from '../store/deviceStore';

const MotorBar = ({ label, value }) => {
  const displayValue = value > 0 ? `${Math.round(value)}%` : '–%';

  return (
    <div className="mb-2">
      <div className="flex justify-between text-[9px] text-[#6a5430] pl-6 mb-1">
        <span>{label}</span>
        <span className="font-mono">{displayValue}</span>
      </div>
      <div className="pl-6">
        <div className="bg-[#0a0908] border border-[#7a5e24] rounded-sm h-[5px] overflow-hidden">
          <div
            className="h-full bg-[#b8903c] rounded-sm transition-all duration-[400ms] ease-out"
            style={{ width: `${value}%` }}
          />
        </div>
      </div>
    </div>
  );
};

const MotorsSection = () => {
  const motors = useDeviceStore((state) => state.motors);

  return (
    <div>
      {/* Section label */}
      <div className="text-[9px] tracking-[2px] text-[#6a5430] mt-6 mb-3 pl-6">MOTORY</div>

      {/* Motor bars */}
      <MotorBar label="M1" value={motors.m1} />
      <MotorBar label="M2" value={motors.m2} />
    </div>
  );
};

export default MotorsSection;
