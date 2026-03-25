import { useEffect } from 'react';
import ChronosPanel from './components/ChronosPanel';
import useDeviceStore from './store/deviceStore';

function App() {
  // Demo mode - simulate motor movement for testing
  // Remove this in production when MQTT is connected
  useEffect(() => {
    const demoMode = true; // Set to false when connecting to real MQTT

    if (demoMode) {
      // Simulate MQTT connection after 600ms
      setTimeout(() => {
        useDeviceStore.getState().setMqttStatus('connecting');
      }, 600);

      setTimeout(() => {
        useDeviceStore.getState().setMqttStatus('online');
      }, 1500);

      // Simulate motor speed changes
      let m1Target = 0;
      let m2Target = 0;
      let m1Current = 0;
      let m2Current = 0;

      const motorSimulation = setInterval(() => {
        // Randomly change target speeds occasionally
        if (Math.random() < 0.01) {
          m1Target = 20 + Math.floor(Math.random() * 75);
        }
        if (Math.random() < 0.01) {
          m2Target = 20 + Math.floor(Math.random() * 75);
        }

        // Smoothly transition to target speeds
        m1Current += (m1Target - m1Current) * 0.04;
        m2Current += (m2Target - m2Current) * 0.04;

        useDeviceStore.getState().updateMotors(m1Current, m2Current);

        // Update gauges based on motor speeds
        useDeviceStore.getState().setGauge('pressure', (m1Current / 100) * 45 - 22);
        useDeviceStore.getState().setGauge('steam', (m2Current / 100) * 45 - 10);
        useDeviceStore
          .getState()
          .setGauge('flow', ((m1Current + m2Current) / 200) * 45 - 15);
      }, 50);

      return () => clearInterval(motorSimulation);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <ChronosPanel />
    </div>
  );
}

export default App;