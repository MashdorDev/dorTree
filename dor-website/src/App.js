import {Canvas} from '@react-three/fiber';
import Box from './components/Box';
import {OrbitControls} from '@react-three/drei';
import ThreeScene from './components/TressScene';

function App() {
  return (
    <div>
      <ThreeScene />
    </div>
  );
}

export default App;
