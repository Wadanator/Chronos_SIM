import useDeviceStore from '../store/deviceStore';

const STATUS = {
  offline:    { text: 'OFFLINE',  color: '#9a8868' },
  connecting: { text: 'CONN…',    color: '#b09040' },
  online:     { text: 'ONLINE',   color: '#508040' },
  error:      { text: 'ERROR',    color: '#b04030' },
};

const MqttStatusBadge = () => {
  const status    = useDeviceStore((s) => s.mqttStatus);
  const brokerUrl = useDeviceStore((s) => s.brokerUrl);
  const cfg       = STATUS[status] || STATUS.offline;

  const dotActive = status === 'online';
  const dotPulse  = status === 'connecting';

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      fontFamily: "'Share Tech Mono',monospace",
    }}>
      <div style={{
        width: 7, height: 7, borderRadius: '50%',
        background: cfg.color,
        boxShadow: dotActive ? `0 0 6px ${cfg.color}` : 'none',
        animation: dotPulse ? 'pulse-dot 1s ease-in-out infinite' : 'none',
        border: '1px solid rgba(0,0,0,0.15)',
        flexShrink: 0,
      }}/>
      <span style={{ fontSize: 8, color: cfg.color, letterSpacing: 2 }}>{cfg.text}</span>
      <span style={{ fontSize: 7, color: '#9a8868', letterSpacing: 1 }}>·</span>
      <span style={{ fontSize: 7, color: '#9a8868', letterSpacing: 1 }}>{brokerUrl}</span>
    </div>
  );
};

export default MqttStatusBadge;