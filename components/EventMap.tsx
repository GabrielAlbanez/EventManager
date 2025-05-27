import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import Mapbox, { Camera, LocationPuck } from '@rnmapbox/maps';
import * as Location from 'expo-location';
import { ACESSTOKEN } from '~/global/urlReq';

Mapbox.setAccessToken(ACESSTOKEN);

export default function EventMap() {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [isAnimating, setIsAnimating] = useState(true);
  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permissão de localização negada!');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);

      setTimeout(() => {
        setIsAnimating(false);
      }, 2000);
    })();
  }, []);

  const handleRecenter = () => {
    if (location && cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: [location.longitude, location.latitude],
        zoomLevel: 16,
        pitch: 50,
        animationMode: 'flyTo',
        animationDuration: 500,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Mapbox.MapView
        style={styles.map}
        styleURL="mapbox://styles/mapbox/streets-v11"
        scaleBarEnabled={false}
        scrollEnabled={!isAnimating}
        zoomEnabled={!isAnimating}
        pitchEnabled={!isAnimating}
        rotateEnabled={!isAnimating}
        logoEnabled={false}
      >
        {location && (
          <>
            <Camera
              ref={cameraRef}
              centerCoordinate={[location.longitude, location.latitude]}
              zoomLevel={16}
              pitch={50}
              animationMode="flyTo"
              animationDuration={500}
            />
            <LocationPuck
              pulsing="default"
              scale={1.5}
            />

            <Mapbox.FillExtrusionLayer
              id="3d-buildings"
              sourceID="composite"
              sourceLayerID="building"
              filter={['==', 'extrude', 'true']}
              style={{
                fillExtrusionColor: '#aaa',
                fillExtrusionHeight: ['get', 'height'],
                fillExtrusionBase: ['get', 'min_height'],
                fillExtrusionOpacity: 0.6,
              }}
              minZoomLevel={15}
              maxZoomLevel={22}
            />
          </>
        )}
      </Mapbox.MapView>

      {/* Botão flutuante de localização */}
      <TouchableOpacity style={styles.locateButton} onPress={handleRecenter}>
        <Text style={styles.buttonText}>📍</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  locateButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 30,
    elevation: 5,
    zIndex: 999, // <- garante que fique acima
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  buttonText: {
    fontSize: 20,
  },
});
