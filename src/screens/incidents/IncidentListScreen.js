import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useIncidents } from '../../hooks/useIncidents';
import { colors, spacing, borderRadius } from '../../utils/colors';

export default function IncidentListScreen({ navigation }) {
  const { incidents, categories, filter, setFilter } = useIncidents();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIncidents = incidents.filter(inc => 
    inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inc.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return { bg: 'rgba(186, 50, 19, 0.1)', text: colors.primary };
      case 'medium': return { bg: 'rgba(232, 168, 56, 0.1)', text: '#E8A838' };
      case 'low': return { bg: 'rgba(121, 193, 164, 0.1)', text: colors.secondary };
      default: return { bg: colors.borderLight, text: colors.textMuted };
    }
  };

  const getCategoryIcon = (categoryId) => {
    const cat = categories.find(c => c.id === categoryId);
    return cat ? cat.icon : 'alert-circle';
  };

  const renderIncident = ({ item }) => {
    const priorityStyle = getPriorityColor(item.priority);
    const cat = categories.find(c => c.id === item.category);

    return (
      <TouchableOpacity 
        style={styles.incidentCard}
        onPress={() => navigation.navigate('IncidentDetail', { id: item.id })}
      >
        <View style={styles.incidentHeader}>
          <View style={[styles.priorityBadge, { backgroundColor: priorityStyle.bg }]}>
            <Text style={[styles.priorityText, { color: priorityStyle.text }]}>
              {item.priority === 'high' ? 'URGENT' : item.priority === 'medium' ? 'MOYEN' : 'FAIBLE'}
            </Text>
          </View>
          <Text style={styles.timeText}>{formatTime(item.createdAt)}</Text>
        </View>

        <View style={styles.incidentBody}>
          <Ionicons name={getCategoryIcon(item.category)} size={24} color={cat?.color || colors.textMuted} style={styles.categoryIcon} />
          <View style={styles.incidentContent}>
            <Text style={styles.incidentTitle}>{item.title}</Text>
            <Text style={styles.incidentDescription} numberOfLines={2}>{item.description}</Text>
            <View style={styles.incidentMeta}>
              <Ionicons name="location-outline" size={14} color={colors.textMuted} />
              <Text style={styles.metaText} numberOfLines={1}>{item.address}</Text>
            </View>
          </View>
        </View>

        <View style={styles.incidentFooter}>
          <View style={styles.footerItem}>
            <Ionicons name="eye-outline" size={14} color={colors.textMuted} />
            <Text style={styles.footerText}>{item.views}</Text>
          </View>
          <View style={styles.footerItem}>
            <Ionicons name={item.verified ? 'checkmark-circle' : 'help-circle'} size={14} color={item.verified ? colors.secondary : colors.textMuted} />
            <Text style={styles.footerText}>{item.verified ? 'Vérifié' : 'Non vérifié'}</Text>
          </View>
          <View style={styles.footerItem}>
            <Ionicons name={item.status === 'resolved' ? 'checkmark-done' : 'time-outline'} size={14} color={item.status === 'resolved' ? colors.secondary : colors.warning} />
            <Text style={styles.footerText}>{item.status === 'resolved' ? 'Résolu' : 'Actif'}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diff = Math.floor((now - date) / 60000);
    if (diff < 60) return `${diff} min`;
    if (diff < 1440) return `${Math.floor(diff / 60)} h`;
    return `${Math.floor(diff / 1440)} j`;
  };

  const filters = [
    { key: 'all', label: 'Tous' },
    { key: 'active', label: 'Actifs' },
    { key: 'resolved', label: 'Résolus' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un incident..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterContainer}>
        {filters.map(f => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterButton, filter === f.key && styles.filterButtonActive]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredIncidents}
        renderItem={renderIncident}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, margin: spacing.md, paddingHorizontal: spacing.md, borderRadius: borderRadius.md, borderWidth: 1, borderColor: colors.border },
  searchInput: { flex: 1, height: 44, marginLeft: spacing.sm, color: colors.text, fontSize: 16 },
  filterContainer: { flexDirection: 'row', paddingHorizontal: spacing.md, marginBottom: spacing.sm },
  filterButton: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.full, marginRight: spacing.sm, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  filterButtonActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  filterText: { color: colors.textMuted, fontSize: 13 },
  filterTextActive: { color: colors.background, fontWeight: '600' },
  listContent: { padding: spacing.md, paddingTop: 0 },
  incidentCard: { backgroundColor: colors.card, borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.md, elevation: 2, shadowColor: colors.dark, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  incidentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  priorityBadge: { paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.sm },
  priorityText: { fontSize: 11, fontWeight: 'bold' },
  timeText: { fontSize: 12, color: colors.textMuted },
  incidentBody: { flexDirection: 'row', marginBottom: spacing.sm },
  categoryIcon: { marginRight: spacing.sm, marginTop: 2 },
  incidentContent: { flex: 1 },
  incidentTitle: { fontSize: 16, fontWeight: '600', color: colors.accent, marginBottom: 2 },
  incidentDescription: { fontSize: 13, color: colors.textMuted, lineHeight: 18, marginBottom: spacing.xs },
  incidentMeta: { flexDirection: 'row', alignItems: 'center' },
  metaText: { fontSize: 12, color: colors.textMuted, marginLeft: 4, flex: 1 },
  incidentFooter: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors.borderLight, paddingTop: spacing.sm, marginTop: spacing.xs },
  footerItem: { flexDirection: 'row', alignItems: 'center', marginRight: spacing.lg },
  footerText: { fontSize: 12, color: colors.textMuted, marginLeft: 4 },
});