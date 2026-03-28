import useDeviceStore from '../store/deviceStore';

// The external fire box - shown OUTSIDE the main panel
const FireBox = () => {
  const lightFire = useDeviceStore((s) => s.outputs.lightFire);

  const flames = [
    { x: 30, delay: '0s',    h: 54, w: 18 },
    { x: 48, delay: '0.09s', h: 68, w: 22 },
    { x: 68, delay: '0.18s', h: 58, w: 20 },
  ];

  return (
    <div style={{
      background: '#ddd6c8',
      border: '2px solid #b8a88c',
      borderRadius: 8,
      padding: '16px 20px',
      width: 148,
      boxShadow: '0 4px 16px rgba(40,24,8,0.15), inset 0 1px 0 rgba(255,255,255,0.5)',
      position: 'relative',
    }}>
      {/* Label */}
      <div style={{
        fontFamily: "'Share Tech Mono',monospace",
        fontSize: 8,
        letterSpacing: 3,
        color: '#8a7860',
        textAlign: 'center',
        marginBottom: 10,
        textTransform: 'uppercase',
      }}>Fire · Light</div>

      {/* Fire window */}
      <div style={{
        background: lightFire ? '#1a1008' : '#2a2418',
        border: '2px solid #a08860',
        borderRadius: 4,
        height: 90,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: lightFire
          ? 'inset 0 0 30px rgba(220,100,20,0.4), 0 0 20px rgba(220,80,10,0.3)'
          : 'inset 0 0 10px rgba(0,0,0,0.4)',
        transition: 'box-shadow 0.6s',
      }}>
        {/* Grid overlay like the real prop */}
        <svg style={{
          position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.35,
        }}>
          <defs>
            <pattern id="fg" width="8" height="8" patternUnits="userSpaceOnUse">
              <rect width="8" height="8" fill="none" stroke="#8a7050" strokeWidth="0.6"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#fg)"/>
        </svg>

        {/* Flames */}
        {lightFire && flames.map((f, i) => (
          <svg key={i} style={{
            position: 'absolute',
            bottom: 0,
            left: f.x,
            width: f.w,
            height: f.h,
            animation: `fire-flicker 0.${12+i*3}s ease-in-out infinite alternate`,
            animationDelay: f.delay,
          }} viewBox={`0 0 ${f.w} ${f.h}`}>
            <defs>
              <linearGradient id={`fg${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#fff0a0" stopOpacity="0.9"/>
                <stop offset="30%"  stopColor="#ff9020"/>
                <stop offset="70%"  stopColor="#dd4010"/>
                <stop offset="100%" stopColor="#991500" stopOpacity="0.7"/>
              </linearGradient>
            </defs>
            <path
              d={`M ${f.w/2} ${f.h}
                  C ${f.w*0.2} ${f.h*0.75} ${f.w*0.1} ${f.h*0.5} ${f.w*0.4} ${f.h*0.2}
                  C ${f.w*0.45} ${f.h*0.05} ${f.w*0.5} 0 ${f.w*0.5} 0
                  C ${f.w*0.5} 0 ${f.w*0.55} ${f.h*0.05} ${f.w*0.6} ${f.h*0.2}
                  C ${f.w*0.9} ${f.h*0.5} ${f.w*0.8} ${f.h*0.75} ${f.w/2} ${f.h} Z`}
              fill={`url(#fg${i})`}
              style={{ filter: 'blur(0.5px)' }}
            />
          </svg>
        ))}

        {/* Ember glow on floor */}
        {lightFire && (
          <div style={{
            position:'absolute', bottom:0, left:0, right:0, height:8,
            background:'radial-gradient(ellipse at 50% 100%, rgba(255,80,10,0.6), transparent)',
          }}/>
        )}

        {/* Off state - just a cross mark */}
        {!lightFire && (
          <svg style={{position:'absolute',inset:0,width:'100%',height:'100%',opacity:0.2}}>
            <line x1="40%" y1="40%" x2="60%" y2="60%" stroke="#8a7060" strokeWidth="1.5"/>
            <line x1="60%" y1="40%" x2="40%" y2="60%" stroke="#8a7060" strokeWidth="1.5"/>
          </svg>
        )}
      </div>

      {/* Status pill */}
      <div style={{
        marginTop: 8,
        textAlign: 'center',
        fontFamily: "'Share Tech Mono',monospace",
        fontSize: 8,
        letterSpacing: 2,
        color: lightFire ? '#c07820' : '#9a8868',
        textTransform: 'uppercase',
        transition: 'color 0.3s',
      }}>
        {lightFire ? '● ACTIVE' : '○ OFF'}
      </div>
    </div>
  );
};

export default FireBox;