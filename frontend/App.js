import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import { Camera } from 'expo-camera';

import CameraPage from './containers/CameraPage';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <CameraPage />
    
  );
}

