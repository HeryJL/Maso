import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useIncidents } from '../../hooks/useIncidents';
import { colors, spacing, borderRadius } from '../../utils/colors';

export default function NotificationsScreen({ navigation }) {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useIncidents();

  const getIcon = (type) => {
    switch (type) {
      case 'nearby': return 'location';
      case 'update': return 'refresh-circle';
      default: return 'notifications';
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'nearby': return colors.primary;
      case 'update': return colors.secondary;
      default: return colors.warning;
    }
  };

  const renderNotification = ({ item }) => (
    <TouchableOpacity
      style={[styles.notificationCard, !item.read && styles.unreadCard]}
      onPress={() => {
        markNotificationAsRead(item.id);
        if (item.incidentId) {
          navigation.navigate('IncidentDetail', { id: item.incidentId });
        }
      }}
    >
      <View style={[styles.iconContainer, { backgroundColor: getIconColor(item.type) + '20' }]}>
        <Ionicons name={getIcon(item.type)} size={24} color={getIconColor(item.type)} />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{item.title}</Text>
          {!item.read && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.time}>{formatTime(item.createdAt)}</Text>
      </View>
    </TouchableOpacity>
  );

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' });
  };

  return (
    <View style={styles.container}>
      {notifications.length > 0 && (
        <TouchableOpacity style={styles.markAllButton} onPress={markAllNotificationsAsRead}>
          <Text style={styles.markAllText}>Tout marquer comme lu</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyText}>Aucune notification</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  markAllButton: { alignSelf: 'flex-end', padding: spacing.md },
  markAllText: { color: colors.secondary, fontSize: 14, fontWeight: '600' },
  listContent: { padding: spacing.md },
  notificationCard: { flexDirection: 'row', backgroundColor: colors.card, borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.md, elevation: 2 },
  unreadCard: { backgroundColor: '#FFFFFF', borderLeftWidth: 3, borderLeftColor: colors.primary },
  iconContainer: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  contentContainer: { flex: 1 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  title: { fontSize: 15, fontWeight: '600', color: colors.accent, flex: 1 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginLeft: spacing.sm },
  message: { fontSize: 14, color: colors.text, marginBottom: 4, lineHeight: 20 },
  time: { fontSize: 12, color: colors.textMuted },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 },
  emptyText: { marginTop: spacing.md, color: colors.textMuted, fontSize: 16 },
});