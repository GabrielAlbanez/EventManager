import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Mapbox, { Camera, LocationPuck } from '@rnmapbox/maps';
import * as Location from 'expo-location';
import { ACESSTOKEN } from '~/global/urlReq';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import { useThemeContext } from 'context/ThemeProvider';

Mapbox.setAccessToken(ACESSTOKEN);

export default function EventMap() {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [isAnimating, setIsAnimating] = useState(true);
  const cameraRef = useRef<Camera>(null);
  const isDark = useThemeContext();
  const theme = useTheme();

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
        zoomLevel: 17,
        pitch: 60,
        animationMode: 'flyTo',
        animationDuration: 500,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Mapbox.MapView
        style={styles.map}
        styleURL={theme.dark ? "mapbox://styles/mapbox/dark-v11" : "mapbox://styles/mapbox/streets-v12"}
        scaleBarEnabled={false}
        scrollEnabled={!isAnimating}
        zoomEnabled={!isAnimating}
        pitchEnabled={!isAnimating}
        rotateEnabled={!isAnimating}
        logoEnabled={false}>
        {location && (
          <>
            <Camera
              ref={cameraRef}
              centerCoordinate={[location.longitude, location.latitude]}
              animationMode="flyTo"
              animationDuration={500}
              zoomLevel={17}
              pitch={60}
              heading={20}
            />
            <LocationPuck pulsing="default" scale={1.5} />
          </>
        )}
      </Mapbox.MapView>

      <TouchableOpacity
        style={[
          styles.locateButton,
          {
            backgroundColor: theme.colors.elevation?.level2 ?? theme.colors.background,
            shadowColor: theme.dark ? '#000' : '#aaa',
          },
        ]}
        onPress={handleRecenter}>
        <MaterialIcons
          name="location-searching"
          size={20}
          color={theme.colors.primary}
        />
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
    left: 10,
    top: 60,
    padding: 12,
    borderRadius: 30,
    elevation: 5,
    zIndex: 999,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});
