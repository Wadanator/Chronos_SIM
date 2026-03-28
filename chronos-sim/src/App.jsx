import { useMqtt } from './hooks/useMqtt';
import ChronosPanel from './components/ChronosPanel';
import FireBox from './components/FireBox';
import SmokeBox from './components/SmokeBox';

function App() {
  useMqtt();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 16px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 20,
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        {/* Main panel */}
        <ChronosPanel />

        {/* External boxes - fire and smoke */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          paddingTop: 40,
        }}>
          <FireBox />
          <SmokeBox />
        </div>
      </div>
    </div>
  );
}

export default App;