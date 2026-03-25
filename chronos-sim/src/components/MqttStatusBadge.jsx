import useDeviceStore from '../store/deviceStore';

const MqttStatusBadge = () => {
  const mqttStatus = useDeviceStore((state) => state.mqttStatus);
  const brokerUrl = useDeviceStore((state) => state.brokerUrl);

  const statusConfig = {
    offline: {
      text: 'OFFLINE',
      color: '#444',
    },
    connecting: {
      text: 'CONN...',
      color: '#aa7020',
    },
    online: {
      text: 'ONLINE',
      color: '#28c060',
    },
  };

  const config = statusConfig[mqttStatus] || statusConfig.offline;

  return (
    <div className="text-right text-[9px] font-mono">
      <div className="text-[#6a5430]">MQTT</div>
      <div className="tracking-wider font-bold" style={{ color: config.color }}>
        {config.text}
      </div>
      <div className="text-[#6a5430] mt-1">BROKER</div>
      <div className="text-[#554030] text-[8px]">{brokerUrl}</div>
    </div>
  );
};

export default MqttStatusBadge;