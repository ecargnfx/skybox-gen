// components/Skybox.tsx
import { Environment } from '@react-three/drei';

const Skybox = () => {
  return (
    <Environment 
        background={true} 
        path="/assets/skybox/" 
        files={['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']} />
  );
};

export default Skybox;
