import { create } from 'zustand';

const useDeviceStore = create((set) => ({
  mqttStatus: 'offline',
  brokerUrl: 'TechMuzeumRoom1.local',

  outputs: {
    smokePower:  false,
    lightFire:   false,
    light1:      false,
    smokeEffect: false,
    light2:      false,
    light3:      false,
    light4:      false,
    light5:      false,
  },

  motors: { m1: 0, m2: 0 },

  setMqttStatus: (status) => set({ mqttStatus: status }),
  setOutput: (name, value) =>
    set((s) => ({ outputs: { ...s.outputs, [name]: value } })),
  updateMotors: (m1, m2) =>
    set({ motors: {
      m1: Math.min(100, Math.max(0, m1)),
      m2: Math.min(100, Math.max(0, m2)),
    }}),
}));

export default useDeviceStore;