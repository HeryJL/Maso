import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useIncidents } from '../../hooks/useIncidents';
import { colors, spacing, borderRadius } from '../../utils/colors';

const INITIAL_REGION = {
  latitude: 48.8566,
  longitude: 2.3522,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function MapScreen({ navigation }) {
  const [region, setRegion] = useState(INITIAL_REGION);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const { incidents, categories } = useIncidents();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        let location = await Location.getCurrentPositionAsync({});
        const newRegion = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };
        setRegion(newRegion);
        setUserLocation(location.coords);
      }
      setLoading(false);
    })();
  }, []);

  const getMarkerColor = (priority) => {
    switch (priority) {
      case 'high': return colors.primary;
      case 'medium': return '#E8A838';
      case 'low': return colors.secondary;
      default: return colors.textMuted;
    }
  };

  const getCategoryIcon = (categoryId) => {
    const cat = categories.find(c => c.id === categoryId);
    return cat ? cat.icon : 'alert-circle';
  };

  const centerOnUser = useCallback(async () => {
    let location = await Location.getCurrentPositionAsync({});
    setRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    setUserLocation(location.coords);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.loadingText}>Chargement de la carte...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {userLocation && (
          <Marker coordinate={userLocation} pinColor={colors.secondary}>
            <Callout><Text>Votre position</Text></Callout>
          </Marker>
        )}
        
        {incidents.map(incident => (
          <Marker
            key={incident.id}
            coordinate={{ latitude: incident.latitude, longitude: incident.longitude }}
            pinColor={getMarkerColor(incident.priority)}
          >
            <Callout onPress={() => navigation.navigate('IncidentDetail', { id: incident.id })}>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>{incident.title}</Text>
                <Text style={styles.calloutCategory}>{categories.find(c => c.id === incident.category)?.label}</Text>
                <Text style={styles.calloutAddress}>{incident.address}</Text>
                <Text style={styles.calloutTap}>Tap pour voir les détails →</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <TouchableOpacity style={styles.fab} onPress={centerOnUser}>
        <Ionicons name="locate" size={24} color={colors.background} />
      </TouchableOpacity>

      <View style={styles.legend}>
        <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: colors.primary }]} /><Text style={styles.legendText}>Urgent</Text></View>
        <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#E8A838' }]} /><Text style={styles.legendText}>Moyen</Text></View>
        <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: colors.secondary }]} /><Text style={styles.legendText}>Faible</Text></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  loadingText: { marginTop: spacing.md, color: colors.textMuted, fontSize: 16 },
  calloutContainer: { width: 200, padding: spacing.sm },
  calloutTitle: { fontWeight: 'bold', fontSize: 14, color: colors.accent, marginBottom: 2 },
  calloutCategory: { fontSize: 12, color: colors.secondary, marginBottom: 2 },
  calloutAddress: { fontSize: 11, color: colors.textMuted, marginBottom: 4 },
  calloutTap: { fontSize: 11, color: colors.primary, fontStyle: 'italic' },
  fab: { position: 'absolute', right: spacing.lg, bottom: spacing.xxl, width: 56, height: 56, borderRadius: 28, backgroundColor: colors.accent, justifyContent: 'center', alignItems: 'center', elevation: 6, shadowColor: colors.dark, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 4 },
  legend: { position: 'absolute', left: spacing.lg, top: spacing.lg, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: borderRadius.md, padding: spacing.sm, elevation: 3 },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginVertical: 2 },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: spacing.sm },
  legendText: { fontSize: 11, color: colors.text },
});