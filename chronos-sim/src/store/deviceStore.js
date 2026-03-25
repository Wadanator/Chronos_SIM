import { create } from 'zustand';

const useDeviceStore = create((set) => ({
  mqttStatus: 'offline', // 'offline' | 'connecting' | 'online' | 'error'
  brokerUrl: 'TechMuzeumRoom1.local',

  // Exact device names from RELAY config.cpp DEVICES[]
  outputs: {
    smokePower:  false,  // power/smoke_ON  - warms up smoke machine
    lightFire:   false,  // light/fire      - fire effect on boiler
    light1:      false,  // light/1         - podsvietenie podstavy
    smokeEffect: false,  // effect/smoke    - triggers smoke
    light2:      false,  // light/2         - podsvietenie hodín
    light3:      false,  // light/3         - Edisonka
    light4:      false,  // light/4         - budíky/wheels light A
    light5:      false,  // light/5         - budíky/wheels light B
  },

  // Motor speeds 0-100 from MOTORS firmware
  motors: { m1: 0, m2: 0 },

  // Actions — called ONLY by MQTT handler
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