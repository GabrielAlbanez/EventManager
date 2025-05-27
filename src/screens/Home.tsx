import React from 'react';
import { StyleSheet, View } from 'react-native';
import Mapbox from '@rnmapbox/maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import EventMap from 'components/EventMap';

Mapbox.setAccessToken('pk.eyJ1IjoiZ2FicmllbGxiYW5leiIsImEiOiJjbWEyaTB2YTEyNDBmMnJxMW9kaGg1OGQzIn0.psAHWxarUpQbkKvrVZh8KA');

export default function HomeScreen() {
  return (
    <EventMap />
  );
}

