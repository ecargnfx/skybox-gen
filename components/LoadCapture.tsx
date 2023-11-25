import React from 'react';
import { useGLTF } from '@react-three/drei';

const LoadCapture = ({ url }: { url: string }) => {
  const gltf = useGLTF(url);

  return (
    <primitive object={gltf.scene} dispose={null} />
  );
};

export default LoadCapture;
