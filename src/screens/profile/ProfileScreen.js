import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { useIncidents } from '../../hooks/useIncidents';
import { colors, spacing, borderRadius } from '../../utils/colors';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { allIncidents } = useIncidents();

  const userIncidents = allIncidents.filter(inc => inc.userId === user?.id);
  const stats = {
    total: userIncidents.length,
    active: userIncidents.filter(i => i.status === 'active').length,
    resolved: userIncidents.filter(i => i.status === 'resolved').length,
    verified: userIncidents.filter(i => i.verified).length,
  };

  const menuItems = [
    { icon: 'document-text-outline', label: 'Mes signalements', value: `${stats.total}`, action: null },
    { icon: 'shield-checkmark-outline', label: 'Vérifiés', value: `${stats.verified}`, color: colors.secondary },
    { icon: 'settings-outline', label: 'Paramètres', action: null },
    { icon: 'help-circle-outline', label: 'Aide & Support', action: null },
    { icon: 'information-circle-outline', label: 'À propos de MASO', action: null },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={40} color={colors.background} />
        </View>
        <Text style={styles.name}>{user?.name || 'Utilisateur'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        {user?.phone && <Text style={styles.phone}>{user.phone}</Text>}
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.primary }]}>{stats.active}</Text>
          <Text style={styles.statLabel}>Actifs</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.secondary }]}>{stats.resolved}</Text>
          <Text style={styles.statLabel}>Résolus</Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem} onPress={item.action}>
            <View style={styles.menuItemLeft}>
              <Ionicons name={item.icon} size={22} color={item.color || colors.accent} />
              <Text style={styles.menuItemLabel}>{item.label}</Text>
            </View>
            <View style={styles.menuItemRight}>
              {item.value && <Text style={styles.menuItemValue}>{item.value}</Text>}
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Ionicons name="log-out-outline" size={20} color={colors.primary} />
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>

      <Text style={styles.version}>MASO v1.0.0 - MVP</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  header: { alignItems: 'center', marginBottom: spacing.lg },
  avatarContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.accent, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.md },
  name: { fontSize: 22, fontWeight: 'bold', color: colors.accent },
  email: { fontSize: 14, color: colors.textMuted, marginTop: 2 },
  phone: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  statsContainer: { flexDirection: 'row', backgroundColor: colors.card, borderRadius: borderRadius.md, padding: spacing.lg, marginBottom: spacing.lg, elevation: 2 },
  statItem: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, backgroundColor: colors.border },
  statValue: { fontSize: 24, fontWeight: 'bold', color: colors.accent },
  statLabel: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  menuContainer: { backgroundColor: colors.card, borderRadius: borderRadius.md, marginBottom: spacing.lg, elevation: 2 },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center' },
  menuItemLabel: { marginLeft: spacing.md, fontSize: 15, color: colors.text },
  menuItemRight: { flexDirection: 'row', alignItems: 'center' },
  menuItemValue: { fontSize: 14, color: colors.textMuted, marginRight: spacing.sm },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(186, 50, 19, 0.1)', borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.lg },
  logoutText: { color: colors.primary, fontSize: 16, fontWeight: '600', marginLeft: spacing.sm },
  version: { textAlign: 'center', fontSize: 12, color: colors.textMuted },
});