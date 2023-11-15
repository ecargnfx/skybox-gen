import { Canvas } from 'react-three-fiber';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import Skybox from '../components/Skybox';

const Home: React.FC = () => {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas>
        <ambientLight />
        {/* <pointLight position={[10, 10, 10]} /> */}
        <OrbitControls />
        <Skybox />
      </Canvas>
    </div>
  );
}

export default Home;


