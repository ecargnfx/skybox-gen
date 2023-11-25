// components/Skybox.tsx
import { Environment } from '@react-three/drei';

const Skybox = () => {
  return (
    <Environment 
        background={true} 
        path="/assets/skybox/fantasy-room/" 
        files={['cube_right.png', 'cube_left.png', 'cube_up.png', 'cube_down.png', 'cube_back.png', 'cube_front.png']} />
  );
};

export default Skybox;
