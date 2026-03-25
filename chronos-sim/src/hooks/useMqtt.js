import { useEffect } from 'react';
import mqtt from 'mqtt';
import useDeviceStore from '../store/deviceStore';

/**
 * Topic structure matching ESP32 firmware (BASE_TOPIC_PREFIX = "room1/")
 *
 * Motors (esp32_mqtt_controller_MOTORS):
 *   room1/motor1   payload: "ON:75:L" or "OFF"  → we read currentSpeed from feedback
 *   room1/motor2   payload: same
 *
 *   For digital twin we subscribe to feedback topics to know actual speed:
 *   room1/motor1/feedback  → not reliable for speed
 *
 *   Better: The ESP publishes device status. We subscribe to a status topic
 *   OR we just mirror the command topics (receive the same commands Pi sends).
 *   Since this is a READ-ONLY twin, subscribe to same topics Pi publishes to.
 *
 * Relays (esp32_mqtt_controller_RELAY):
 *   room1/power/smoke_ON  → ON / OFF
 *   room1/light/fire      → ON / OFF
 *   room1/light/1         → ON / OFF
 *   room1/effect/smoke    → ON / OFF
 *   room1/light/2         → ON / OFF
 *   room1/light/3         → ON / OFF
 *   room1/light/4         → ON / OFF
 *   room1/light/5         → ON / OFF
 *
 * BROKER: WebSocket port 9001 (browsers cannot use raw TCP 1883)
 * Make sure your Mosquitto has:
 *   listener 9001
 *   protocol websockets
 */

const BROKER_WS_URL = 'ws://TechMuzeumRoom1.local:9001';

const parseBool = (v) => {
  const s = v.trim().toUpperCase();
  return s === 'ON' || s === '1' || s === 'TRUE';
};

// Parse motor command: "ON:75:L" or "ON:75:L:5000" → speed number
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
  return null; // not a motor topic
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
      // Subscribe to all room1 commands (same messages Pi sends to ESPs)
      client.subscribe('room1/#', { qos: 0 });
    });

    client.on('error',   () => store.setMqttStatus('error'));
    client.on('offline', () => store.setMqttStatus('offline'));
    client.on('reconnect', () => store.setMqttStatus('connecting'));

    client.on('message', (topic, message) => {
      const val = message.toString().trim();
      // Strip "room1/" prefix
      if (!topic.startsWith('room1/')) return;
      const sub = topic.slice('room1/'.length); // e.g. "light/3", "motor1"

      const s = useDeviceStore.getState();

      // Motors
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

      // Relay devices — match DEVICES[] names exactly
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