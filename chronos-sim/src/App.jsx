import { useMqtt } from './hooks/useMqtt';
import ChronosPanel from './components/ChronosPanel';

function App() {
  useMqtt();
  return (
    <div className="min-h-screen flex items-center justify-center p-2 bg-[#060504]">
      <ChronosPanel />
    </div>
  );
}

export default App;