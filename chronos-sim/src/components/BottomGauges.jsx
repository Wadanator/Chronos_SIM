import useDeviceStore from '../store/deviceStore';

const Gauge = ({ label, value }) => {
  const clamped    = Math.min(45, Math.max(-45, value));
  const normalised = (clamped + 45) / 90;           // 0..1
  const angle      = -135 + normalised * 270;        // degrees

  const cx = 34, cy = 36, r = 28;
  const toRad = (d) => (d * Math.PI) / 180;

  const arcStart  = { x: cx + r * Math.cos(toRad(-135)), y: cy + r * Math.sin(toRad(-135)) };
  const arcEnd    = { x: cx + r * Math.cos(toRad( 135)), y: cy + r * Math.sin(toRad( 135)) };
  const activeEnd = { x: cx + r * Math.cos(toRad(angle)), y: cy + r * Math.sin(toRad(angle)) };
  const span      = angle - (-135);
  const largeArc  = span > 180 ? 1 : 0;

  const nLen = 20, nTail = 6;
  const nRad = toRad(angle);
  const nx2  = cx + nLen  * Math.cos(nRad);
  const ny2  = cy + nLen  * Math.sin(nRad);
  const nx1  = cx - nTail * Math.cos(nRad);
  const ny1  = cy - nTail * Math.sin(nRad);

  const ticks = Array.from({ length: 11 }, (_, i) => {
    const t   = i / 10;
    const ta  = toRad(-135 + t * 270);
    const maj = i % 5 === 0;
    const r1  = maj ? r - 6 : r - 3;
    return {
      x1: cx + r1 * Math.cos(ta), y1: cy + r1 * Math.sin(ta),
      x2: cx + r  * Math.cos(ta), y2: cy + r  * Math.sin(ta),
      major: maj,
    };
  });

  return (
    <svg width="68" height="70" viewBox="0 0 68 70">
      {/* Outer bezel */}
      <circle cx={cx} cy={cy} r="33" fill="#0e0d09" stroke="#3a2e14" strokeWidth="1" />
      {/* Bezel rivets */}
      {[0,1,2,3,4,5].map((i) => {
        const a = toRad(-135 + i * 54);
        return <circle key={i}
          cx={(cx + 32 * Math.cos(a)).toFixed(1)}
          cy={(cy + 32 * Math.sin(a)).toFixed(1)}
          r="1.3" fill="#5a4820" />;
      })}
      {/* Face */}
      <circle cx={cx} cy={cy} r="30" fill="#0b0a07" stroke="#6a5424" strokeWidth="1.5" />

      {/* Track arc */}
      <path
        d={`M${arcStart.x.toFixed(2)},${arcStart.y.toFixed(2)} A${r},${r} 0 1 1 ${arcEnd.x.toFixed(2)},${arcEnd.y.toFixed(2)}`}
        fill="none" stroke="#1c1a10" strokeWidth="4" strokeLinecap="round"
      />
      {/* Active arc */}
      {normalised > 0.01 && (
        <path
          d={`M${arcStart.x.toFixed(2)},${arcStart.y.toFixed(2)} A${r},${r} 0 ${largeArc} 1 ${activeEnd.x.toFixed(2)},${activeEnd.y.toFixed(2)}`}
          fill="none" stroke="#b8903c" strokeWidth="2.5" strokeLinecap="round"
          style={{ transition: 'all 0.5s ease-out' }}
        />
      )}
      {/* Ticks */}
      {ticks.map((t, i) => (
        <line key={i}
          x1={t.x1.toFixed(2)} y1={t.y1.toFixed(2)}
          x2={t.x2.toFixed(2)} y2={t.y2.toFixed(2)}
          stroke={t.major ? '#6a5828' : '#302818'}
          strokeWidth={t.major ? '1.3' : '0.7'}
        />
      ))}

      {/* Needle shadow */}
      <line
        x1={(nx1+0.5).toFixed(2)} y1={(ny1+0.5).toFixed(2)}
        x2={(nx2+0.5).toFixed(2)} y2={(ny2+0.5).toFixed(2)}
        stroke="rgba(0,0,0,0.5)" strokeWidth="3" strokeLinecap="round"
        style={{ transition: 'all 0.5s ease-out' }}
      />
      {/* Needle */}
      <line
        x1={nx1.toFixed(2)} y1={ny1.toFixed(2)}
        x2={nx2.toFixed(2)} y2={ny2.toFixed(2)}
        stroke="#d07828" strokeWidth="2" strokeLinecap="round"
        style={{ transition: 'all 0.5s ease-out' }}
      />

      {/* Hub */}
      <circle cx={cx} cy={cy} r="5"   fill="#141210" stroke="#6a5424" strokeWidth="1.2" />
      <circle cx={cx} cy={cy} r="2.5" fill="#c09040" />

      {/* Label */}
      <text x={cx} y="67" textAnchor="middle"
        fill="#5a4820" fontSize="5.5" fontFamily="Courier New, monospace" letterSpacing="1.5">
        {label}
      </text>
    </svg>
  );
};

const BottomGauges = () => {
  const gauges = useDeviceStore((s) => s.gauges);
  return (
    <div className="flex gap-1">
      <Gauge label="PRESS" value={gauges.pressure} />
      <Gauge label="STEAM" value={gauges.steam}    />
      <Gauge label="FLOW"  value={gauges.flow}     />
    </div>
  );
};

export default BottomGauges;