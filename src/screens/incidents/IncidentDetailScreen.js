import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useIncidents } from '../../hooks/useIncidents';
import { colors, spacing, borderRadius } from '../../utils/colors';

export default function IncidentDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const { getIncidentById, categories } = useIncidents();
  const incident = getIncidentById(id);

  if (!incident) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color={colors.primary} />
        <Text style={styles.errorText}>Incident non trouvé</Text>
      </View>
    );
  }

  const cat = categories.find(c => c.id === incident.category);
  const priorityColors = { high: colors.primary, medium: '#E8A838', low: colors.secondary };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={[styles.priorityIndicator, { backgroundColor: priorityColors[incident.priority] }]} />
        <View style={styles.headerContent}>
          <Text style={styles.category}>{cat?.label || 'Inconnu'}</Text>
          <Text style={styles.title}>{incident.title}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: incident.status === 'resolved' ? 'rgba(121, 193, 164, 0.2)' : 'rgba(186, 50, 19, 0.2)' }]}>
          <Text style={[styles.statusText, { color: incident.status === 'resolved' ? colors.secondary : colors.primary }]}>
            {incident.status === 'resolved' ? 'RÉSOLU' : 'ACTIF'}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{incident.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Localisation</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location" size={20} color={colors.secondary} />
          <Text style={styles.locationText}>{incident.address}</Text>
        </View>
        <View style={styles.coordsRow}>
          <Text style={styles.coordsText}>Lat: {incident.latitude.toFixed(4)}, Lon: {incident.longitude.toFixed(4)}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations</Text>
        <View style={styles.infoGrid}>
          <InfoItem icon="time-outline" label="Signalé" value={new Date(incident.createdAt).toLocaleString('fr-FR')} />
          <InfoItem icon="eye-outline" label="Vues" value={incident.views.toString()} />
          <InfoItem icon={incident.verified ? 'checkmark-circle' : 'help-circle'} label="Vérification" value={incident.verified ? 'Vérifié par IA' : 'En attente'} />
          {incident.aiFlag && <InfoItem icon="warning-outline" label="Modération" value={incident.aiReason} color={colors.warning} />}
        </View>
      </View>

      <TouchableOpacity style={styles.mapButton} onPress={() => navigation.navigate('Map')}>
        <Ionicons name="map-outline" size={20} color={colors.background} />
        <Text style={styles.mapButtonText}>Voir sur la carte</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function InfoItem({ icon, label, value, color }) {
  return (
    <View style={styles.infoItem}>
      <Ionicons name={icon} size={18} color={color || colors.secondary} />
      <View style={styles.infoTextContainer}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={[styles.infoValue, color && { color }]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  errorText: { marginTop: spacing.md, color: colors.textMuted, fontSize: 16 },
  header: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.lg },
  priorityIndicator: { width: 4, height: 60, borderRadius: 2, marginRight: spacing.md },
  headerContent: { flex: 1 },
  category: { fontSize: 13, color: colors.secondary, textTransform: 'uppercase', fontWeight: '600', marginBottom: 2 },
  title: { fontSize: 22, fontWeight: 'bold', color: colors.accent, lineHeight: 28 },
  statusBadge: { paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: borderRadius.sm },
  statusText: { fontSize: 11, fontWeight: 'bold' },
  section: { marginBottom: spacing.lg },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: colors.accent, marginBottom: spacing.sm, textTransform: 'uppercase' },
  description: { fontSize: 15, color: colors.text, lineHeight: 22 },
  locationRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, padding: spacing.md, borderRadius: borderRadius.md },
  locationText: { marginLeft: spacing.sm, fontSize: 14, color: colors.text, flex: 1 },
  coordsRow: { marginTop: spacing.xs, paddingHorizontal: spacing.md },
  coordsText: { fontSize: 12, color: colors.textMuted },
  infoGrid: { backgroundColor: colors.card, borderRadius: borderRadius.md, padding: spacing.md },
  infoItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  infoTextContainer: { marginLeft: spacing.sm, flex: 1 },
  infoLabel: { fontSize: 12, color: colors.textMuted },
  infoValue: { fontSize: 14, color: colors.text, marginTop: 2 },
  mapButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.accent, borderRadius: borderRadius.md, padding: spacing.md, marginTop: spacing.sm },
  mapButtonText: { color: colors.background, fontSize: 16, fontWeight: '600', marginLeft: spacing.sm },
});