import { create } from 'zustand';

const useDeviceStore = create((set) => ({
  // MQTT Connection state
  mqttStatus: 'offline', // 'offline', 'connecting', 'online'
  brokerUrl: 'room1.local:1883',

  // Outputs state (LEDs)
  outputs: {
    smokePower: false,
    lightFire: false,
    light1: false,
    light2: false,
    light3: false,
    light4: false,
    light5: false,
    smokeEffect: false,
  },

  // Motors state
  motors: {
    m1: 0, // 0-100%
    m2: 0, // 0-100%
  },

  // Gauges state
  gauges: {
    pressure: 0, // -45 to 45 degrees
    steam: 0,
    flow: 0,
  },

  // Actions
  setMqttStatus: (status) => set({ mqttStatus: status }),

  setOutput: (outputName, value) =>
    set((state) => ({
      outputs: { ...state.outputs, [outputName]: value },
    })),

  setMotor: (motorName, value) =>
    set((state) => ({
      motors: { ...state.motors, [motorName]: Math.min(100, Math.max(0, value)) },
    })),

  setGauge: (gaugeName, value) =>
    set((state) => ({
      gauges: { ...state.gauges, [gaugeName]: value },
    })),

  // Update all motor values at once (for MQTT updates)
  updateMotors: (m1, m2) =>
    set({
      motors: { m1: Math.min(100, Math.max(0, m1)), m2: Math.min(100, Math.max(0, m2)) },
    }),
}));

export default useDeviceStore;