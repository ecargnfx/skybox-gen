import React, { useState } from 'react';
import { Canvas } from 'react-three-fiber';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import Skybox from '../components/Skybox';
import UploadCapture from '../components/UploadCapture';
import LoadCapture from '../components/LoadCapture';

const Home: React.FC = () => {

  const [captureUrl, setCaptureUrl] = useState(null);

  const handleCaptureReady = (url) => {
      setCaptureUrl(url); // Save the URL when the capture is ready
  };  
  
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <div style={{ width: '100vw', height: '20vh' }}>
        <UploadCapture onCaptureReady={handleCaptureReady} />            
      </div>      
      <Canvas style={{ width: '100vw', height: '80vh' }}>
        <ambientLight />
        {/* <pointLight position={[10, 10, 10]} /> */}
        <OrbitControls />
        {captureUrl && <LoadCapture url={captureUrl} />} 
        <Skybox />
      </Canvas>
    </div>
  );
}

export default Home;


