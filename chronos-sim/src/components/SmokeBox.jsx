import useDeviceStore from '../store/deviceStore';

// Smoke particle
const SmokeParticle = ({ index }) => {
  const delay  = index * 0.4;
  const xOff   = (index % 3 - 1) * 12;
  const dur    = 2.5 + (index % 3) * 0.5;
  return (
    <div style={{
      position: 'absolute',
      bottom: 8,
      left: `calc(50% + ${xOff}px)`,
      width: 18,
      height: 18,
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(180,170,160,0.7), rgba(160,150,140,0))',
      animation: `smoke-rise ${dur}s ease-out ${delay}s infinite`,
      pointerEvents: 'none',
    }}/>
  );
};

const SmokeBox = () => {
  const smokePower  = useDeviceStore((s) => s.outputs.smokePower);
  const smokeEffect = useDeviceStore((s) => s.outputs.smokeEffect);

  return (
    <div style={{
      background: '#ddd6c8',
      border: '2px solid #b8a88c',
      borderRadius: 8,
      padding: '16px 20px',
      width: 148,
      boxShadow: '0 4px 16px rgba(40,24,8,0.15), inset 0 1px 0 rgba(255,255,255,0.5)',
    }}>
      <div style={{
        fontFamily: "'Share Tech Mono',monospace",
        fontSize: 8,
        letterSpacing: 3,
        color: '#8a7860',
        textAlign: 'center',
        marginBottom: 12,
        textTransform: 'uppercase',
      }}>Smoke Machine</div>

      {/* Two status rows */}
      <div style={{ display:'flex', flexDirection:'column', gap: 8 }}>
        {/* POWER row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: '#cec8bc',
          border: '1px solid #b8a88c',
          borderRadius: 4,
          padding: '6px 10px',
        }}>
          {/* Heating coil icon */}
          <svg width="20" height="20" viewBox="0 0 20 20">
            <path d="M 4 14 Q 4 10 8 10 Q 12 10 12 6 Q 12 2 16 2"
              fill="none" stroke={smokePower ? '#c07820' : '#a09070'} strokeWidth="1.8" strokeLinecap="round"/>
            <circle cx="16" cy="2" r="2.5" fill={smokePower ? '#e09030' : '#b0a080'}
              style={{ animation: smokePower ? 'warm-pulse 1.2s ease-in-out infinite' : 'none' }}/>
          </svg>
          <div>
            <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:7, color:'#8a7860', letterSpacing:2 }}>POWER</div>
            <div style={{
              fontFamily:"'Share Tech Mono',monospace", fontSize:9,
              color: smokePower ? '#c07820' : '#9a8868',
              letterSpacing: 1,
              transition: 'color 0.3s',
            }}>
              {smokePower ? 'WARMING' : 'STANDBY'}
            </div>
          </div>
          {/* Indicator dot */}
          <div style={{
            marginLeft: 'auto',
            width: 8, height: 8, borderRadius:'50%',
            background: smokePower ? 'radial-gradient(circle,#f0c060,#c88020)' : '#b0a080',
            boxShadow: smokePower ? '0 0 8px rgba(200,128,20,0.6)' : 'none',
            border: '1px solid #a08858',
            transition: 'all 0.3s',
            animation: smokePower ? 'warm-pulse 1.2s ease-in-out infinite' : 'none',
          }}/>
        </div>

        {/* SMOKE EFFECT row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: '#cec8bc',
          border: '1px solid #b8a88c',
          borderRadius: 4,
          padding: '6px 10px',
          position: 'relative',
          overflow: 'hidden',
          minHeight: 52,
        }}>
          {/* Smoke animation area */}
          <div style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
            {smokeEffect && [0,1,2,3,4].map(i => <SmokeParticle key={i} index={i}/>)}
          </div>

          {/* Nozzle icon */}
          <svg width="20" height="20" viewBox="0 0 20 20" style={{flexShrink:0}}>
            <rect x="2" y="8" width="10" height="4" rx="1"
              fill={smokeEffect ? '#a09060' : '#b0a480'} stroke={smokeEffect?'#906820':'#a09070'} strokeWidth="0.8"/>
            <path d="M 12 7 L 18 5 L 18 15 L 12 13 Z"
              fill={smokeEffect ? '#c0a860' : '#c0b890'} stroke={smokeEffect?'#906820':'#a09070'} strokeWidth="0.8"/>
            {/* Smoke puffs from nozzle */}
            {smokeEffect && [0,1,2].map(i => (
              <circle key={i} cx={16} cy={10} r={3+i*1.5}
                fill="rgba(180,170,155,0.2)" stroke="rgba(160,150,135,0.3)" strokeWidth="0.5"
                style={{ animation: `smoke-rise ${1+i*0.3}s ease-out ${i*0.3}s infinite`}}/>
            ))}
          </svg>

          <div style={{zIndex:1}}>
            <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:7, color:'#8a7860', letterSpacing:2 }}>EFFECT</div>
            <div style={{
              fontFamily:"'Share Tech Mono',monospace", fontSize:9,
              color: smokeEffect ? '#6a9060' : '#9a8868',
              letterSpacing:1,
              transition: 'color 0.3s',
            }}>
              {smokeEffect ? 'ACTIVE' : 'IDLE'}
            </div>
          </div>

          <div style={{
            marginLeft: 'auto', zIndex:1,
            width: 8, height: 8, borderRadius:'50%',
            background: smokeEffect ? 'radial-gradient(circle,#90d070,#408030)' : '#b0a080',
            boxShadow: smokeEffect ? '0 0 8px rgba(64,128,40,0.6)' : 'none',
            border: '1px solid #a08858',
            transition: 'all 0.3s',
          }}/>
        </div>
      </div>

      {/* Note: smoke auto-off after 12s per firmware */}
      {smokeEffect && (
        <div style={{
          marginTop:6, textAlign:'center',
          fontFamily:"'Share Tech Mono',monospace", fontSize:7,
          color:'#a09070', letterSpacing:1,
        }}>auto-off 12s</div>
      )}
    </div>
  );
};

export default SmokeBox;