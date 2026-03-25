import useDeviceStore from '../store/deviceStore';

const STATUS = {
  offline:    { text: 'OFFLINE',  color: '#3a2e1a', dot: '#2a2010' },
  connecting: { text: 'CONN...', color: '#a07020', dot: '#c08828' },
  online:     { text: 'ONLINE',  color: '#28a050', dot: '#30c060' },
  error:      { text: 'ERROR',   color: '#882020', dot: '#cc2828' },
};

const MqttStatusBadge = () => {
  const status    = useDeviceStore((s) => s.mqttStatus);
  const brokerUrl = useDeviceStore((s) => s.brokerUrl);
  const cfg       = STATUS[status] || STATUS.offline;

  return (
    <div className="text-right font-mono">
      <div className="text-[7px] tracking-[2px] text-[#3a2e18]">MQTT</div>
      <div className="flex items-center justify-end gap-1 mt-0.5">
        {/* Pulsing dot */}
        <div className="w-1.5 h-1.5 rounded-full" style={{
          background: cfg.dot,
          boxShadow: status === 'online' ? `0 0 4px ${cfg.dot}` : 'none',
          animation: status === 'connecting' ? 'pulse 1s ease-in-out infinite' : 'none',
        }} />
        <div className="text-[9px] font-bold tracking-wider" style={{ color: cfg.color }}>
          {cfg.text}
        </div>
      </div>
      <div className="text-[7px] tracking-[1px] text-[#3a2e18] mt-1">BROKER</div>
      <div className="text-[7px] text-[#2a2010] mt-0.5">{brokerUrl}</div>
      <style>{`@keyframes pulse { 0%,100%{opacity:.3} 50%{opacity:1} }`}</style>
    </div>
  );
};

export default MqttStatusBadge;