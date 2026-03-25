import { useEffect, useState } from 'react';
import useMqttStore from '../store/useMqttStore';

const gearPath = (cx, cy, outerR, innerR, teeth) => {
  const points = [];
  const step = (Math.PI * 2) / teeth;
  const hookSize = step * 0.34;

  for (let i = 0; i < teeth; i++) {
    const angle = -Math.PI / 2 + i * step;
    points.push(`${(cx + innerR * Math.cos(angle - hookSize)).toFixed(1)},${(cy + innerR * Math.sin(angle - hookSize)).toFixed(1)}`);
    points.push(`${(cx + outerR * Math.cos(angle - hookSize * 0.3)).toFixed(1)},${(cy + outerR * Math.sin(angle - hookSize * 0.3)).toFixed(1)}`);
    points.push(`${(cx + outerR * Math.cos(angle + hookSize * 0.3)).toFixed(1)},${(cy + outerR * Math.sin(angle + hookSize * 0.3)).toFixed(1)}`);
    points.push(`${(cx + innerR * Math.cos(angle + hookSize)).toFixed(1)},${(cy + innerR * Math.sin(angle + hookSize)).toFixed(1)}`);
  }
  return 'M' + points.join('L') + 'Z';
};

const Gear = ({ cx, cy, outerR, innerR, hubR, teeth, fill, stroke, direction, duration, motorSpeed }) => {
  const spokeCount = Math.min(6, teeth > 18 ? 6 : 5);

  // Calculate animation duration based on motor speed
  const adjustedDuration = motorSpeed > 0 ? (duration * 100) / Math.max(motorSpeed, 1) : duration * 100;
  const animationClass = direction === 'cw' ? 'animate-spin' : 'animate-spin-reverse';

  return (
    <g
      className={motorSpeed > 0 ? animationClass : ''}
      style={{
        transformOrigin: `${cx}px ${cy}px`,
        animationDuration: `${adjustedDuration}s`,
        animationTimingFunction: 'linear',
      }}
    >
      {/* Gear body */}
      <path d={gearPath(cx, cy, outerR, innerR, teeth)} fill={fill} stroke={stroke} strokeWidth="0.5" />

      {/* Inner ring */}
      <circle cx={cx} cy={cy} r={innerR - 5} fill="none" stroke={stroke} strokeWidth="0.4" />

      {/* Spokes */}
      {Array.from({ length: spokeCount }).map((_, i) => {
        const angle = (i * Math.PI * 2) / spokeCount;
        const x1 = cx + (hubR + 1) * Math.cos(angle);
        const y1 = cy + (hubR + 1) * Math.sin(angle);
        const x2 = cx + (innerR - 5) * Math.cos(angle);
        const y2 = cy + (innerR - 5) * Math.sin(angle);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth="1.8" />;
      })}

      {/* Hub */}
      <circle cx={cx} cy={cy} r={hubR} fill="#1a1814" stroke={stroke} strokeWidth="1" />
    </g>
  );
};

const GearVisualization = () => {
  const motors = useMqttStore((state) => state.motors);
  const motorSpeed = Math.max(motors.m1, motors.m2);

  const gears = [
    { cx: 115, cy: 105, outerR: 70, innerR: 57, hubR: 11, teeth: 27, fill: '#4a3e22', stroke: '#8a7030', direction: 'cw', duration: 12 },
    { cx: 205, cy: 50, outerR: 40, innerR: 31, hubR: 8, teeth: 16, fill: '#4a3e22', stroke: '#8a7030', direction: 'ccw', duration: 7.1 },
    { cx: 47, cy: 175, outerR: 32, innerR: 25, hubR: 6, teeth: 12, fill: '#544530', stroke: '#9a8540', direction: 'ccw', duration: 5.7 },
    { cx: 195, cy: 175, outerR: 26, innerR: 20, hubR: 5, teeth: 11, fill: '#544530', stroke: '#9a8540', direction: 'cw', duration: 3.4 },
    { cx: 83, cy: 190, outerR: 16, innerR: 12, hubR: 4, teeth: 8, fill: '#625a38', stroke: '#b09048', direction: 'ccw', duration: 2.2 },
  ];

  return (
    <svg width="100%" viewBox="0 0 230 215" className="block">
      {gears.map((gear, index) => (
        <Gear key={index} {...gear} motorSpeed={motorSpeed} />
      ))}
    </svg>
  );
};

export default GearVisualization;
