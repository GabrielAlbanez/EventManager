import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Mapbox, { Camera, LocationPuck } from '@rnmapbox/maps';
import * as Location from 'expo-location';

Mapbox.setAccessToken('pk.eyJ1IjoiZ2FicmllbGxiYW5leiIsImEiOiJjbWEyaTB2YTEyNDBmMnJxMW9kaGg1OGQzIn0.psAHWxarUpQbkKvrVZh8KA');

export default function EventMap() {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [isAnimating, setIsAnimating] = useState(true);

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

  return (
    <View style={styles.container}>
      <Mapbox.MapView
        style={styles.map}
        styleURL="mapbox://styles/mapbox/dark-v11"
        scrollEnabled={!isAnimating}
        zoomEnabled={!isAnimating}
        pitchEnabled={!isAnimating}
        rotateEnabled={!isAnimating}
        logoEnabled={false}
      >
        {location && (
          <>
            <Camera
              centerCoordinate={[location.longitude, location.latitude]}
              zoomLevel={15}
              animationMode="flyTo"
              animationDuration={2000}
            />
            <LocationPuck />
          </>
        )}
      </Mapbox.MapView>
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
});
