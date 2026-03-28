import { useEffect } from 'react';
import mqtt from 'mqtt';
import useDeviceStore from '../store/deviceStore';

const BROKER_WS_URL = 'ws://TechMuzeumRoom1.local:9001';

const parseBool = (v) => {
  const s = v.trim().toUpperCase();
  return s === 'ON' || s === '1' || s === 'TRUE';
};

const parseMotorSpeed = (payload) => {
  const s = payload.trim().toUpperCase();
  if (s === 'OFF') return 0;
  const parts = s.split(':');
  if (parts[0] === 'ON' && parts.length >= 2) {
    return Math.min(100, Math.max(0, parseInt(parts[1]) || 0));
  }
  if (parts[0] === 'SPEED' && parts.length >= 2) {
    return Math.min(100, Math.max(0, parseInt(parts[1]) || 0));
  }
  return null;
};

export function useMqtt() {
  useEffect(() => {
    const store = useDeviceStore.getState();
    store.setMqttStatus('connecting');

    const client = mqtt.connect(BROKER_WS_URL, {
      reconnectPeriod: 4000,
      connectTimeout: 10000,
      keepalive: 30,
    });

    client.on('connect', () => {
      store.setMqttStatus('online');
      client.subscribe('room1/#', { qos: 0 });
    });

    client.on('error',   () => store.setMqttStatus('error'));
    client.on('offline', () => store.setMqttStatus('offline'));
    client.on('reconnect', () => store.setMqttStatus('connecting'));

    client.on('message', (topic, message) => {
      const val = message.toString().trim();
      if (!topic.startsWith('room1/')) return;
      const sub = topic.slice('room1/'.length);

      const s = useDeviceStore.getState();

      if (sub === 'motor1') {
        const spd = parseMotorSpeed(val);
        if (spd !== null) s.updateMotors(spd, s.motors.m2);
        return;
      }
      if (sub === 'motor2') {
        const spd = parseMotorSpeed(val);
        if (spd !== null) s.updateMotors(s.motors.m1, spd);
        return;
      }

      const deviceMap = {
        'power/smoke_ON': 'smokePower',
        'light/fire':     'lightFire',
        'light/1':        'light1',
        'effect/smoke':   'smokeEffect',
        'light/2':        'light2',
        'light/3':        'light3',
        'light/4':        'light4',
        'light/5':        'light5',
      };

      if (deviceMap[sub] !== undefined) {
        s.setOutput(deviceMap[sub], parseBool(val));
      }
    });

    return () => {
      client.end(true);
      useDeviceStore.getState().setMqttStatus('offline');
    };
  }, []);
}