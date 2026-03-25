import { useEffect, useState } from 'react';

const AnalogClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes() + seconds / 60;
  const hours = (time.getHours() % 12) + minutes / 60;

  const hourAngle = (hours / 12) * 360 - 90;
  const minuteAngle = (minutes / 60) * 360 - 90;

  const cx = 200;
  const cy = 105;
  const hourLength = 55;
  const minuteLength = 68;

  const hourX = cx + hourLength * Math.cos((hourAngle * Math.PI) / 180);
  const hourY = cy + hourLength * Math.sin((hourAngle * Math.PI) / 180);
  const minuteX = cx + minuteLength * Math.cos((minuteAngle * Math.PI) / 180);
  const minuteY = cy + minuteLength * Math.sin((minuteAngle * Math.PI) / 180);

  const romans = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];

  // Generate gear path
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

  return (
    <svg width="100%" viewBox="0 0 400 210" className="block max-h-[190px]">
      {/* Background housing */}
      <rect x="60" y="4" width="280" height="202" rx="140" ry="105" fill="#0e0d0a" />

      {/* Clock face */}
      <circle cx="200" cy="105" r="97" fill="#0c0b09" stroke="#665030" strokeWidth="2.5" />
      <circle cx="200" cy="105" r="89" fill="none" stroke="#2e2410" strokeWidth="1" />

      {/* Roman numerals */}
      {romans.map((numeral, i) => {
        const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
        const radius = 74;
        const x = 200 + radius * Math.cos(angle);
        const y = 105 + radius * Math.sin(angle);
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#7a6030"
            fontSize="13"
            fontFamily="serif"
          >
            {numeral}
          </text>
        );
      })}

      {/* Tick marks */}
      {Array.from({ length: 60 }).map((_, i) => {
        const angle = (i / 60) * Math.PI * 2 - Math.PI / 2;
        const r1 = i % 5 === 0 ? 82 : 85;
        const r2 = 88;
        const x1 = 200 + r1 * Math.cos(angle);
        const y1 = 105 + r1 * Math.sin(angle);
        const x2 = 200 + r2 * Math.cos(angle);
        const y2 = 105 + r2 * Math.sin(angle);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={i % 5 === 0 ? '#7a6030' : '#3a2e18'}
            strokeWidth={i % 5 === 0 ? '1.5' : '0.8'}
          />
        );
      })}

      {/* Center decorative gear */}
      <g className="animate-spin-slow" style={{ transformOrigin: '200px 105px' }}>
        <path d={gearPath(200, 105, 36, 28, 16)} fill="#252218" stroke="#4a3c1a" strokeWidth="0.5" />
        {[0, 1, 2, 3].map((i) => {
          const angle = (i * Math.PI) / 2;
          const x1 = 200 + 6 * Math.cos(angle);
          const y1 = 105 + 6 * Math.sin(angle);
          const x2 = 200 + 22 * Math.cos(angle);
          const y2 = 105 + 22 * Math.sin(angle);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#4a3c1a" strokeWidth="2" />;
        })}
      </g>

      {/* Clock hands */}
      <line x1={cx} y1={cy} x2={hourX} y2={hourY} stroke="#e0d8b8" strokeWidth="5" strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={minuteX} y2={minuteY} stroke="#c8bc98" strokeWidth="3" strokeLinecap="round" />

      {/* Center cap */}
      <circle cx="200" cy="105" r="6" fill="#c8a050" stroke="#8a6830" strokeWidth="1" />
    </svg>
  );
};

export default AnalogClock;
