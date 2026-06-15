import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { MOCK_INCIDENTS, MOCK_NOTIFICATIONS, INCIDENT_CATEGORIES } from '../data/mockData';

const IncidentContext = createContext();

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function moderateContent(data) {
  const { title, description } = data;
  const fullText = `${title} ${description}`.toLowerCase();
  
  if (!title || title.length < 5) {
    return { verified: false, flag: 'incomplete', reason: 'Titre trop court ou manquant' };
  }
  if (!description || description.length < 10) {
    return { verified: false, flag: 'incomplete', reason: 'Description trop courte' };
  }
  const spamPatterns = ['http', 'www.', 'click here', 'gagnez', 'gratuit', 'promo'];
  const hasSpam = spamPatterns.some(pattern => fullText.includes(pattern));
  if (hasSpam) {
    return { verified: false, flag: 'spam', reason: 'Contenu suspect détecté' };
  }
  if (!data.latitude || !data.longitude) {
    return { verified: false, flag: 'incomplete', reason: 'Localisation manquante' };
  }
  return { verified: true, flag: null, reason: null };
}

export function IncidentProvider({ children }) {
  const [incidents, setIncidents] = useState(MOCK_INCIDENTS);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const randomIncident = incidents[Math.floor(Math.random() * incidents.length)];
        const newNotif = {
          id: `notif-${Date.now()}`,
          type: 'nearby', title: 'Nouvelle alerte',
          message: `${randomIncident.title} à proximité`,
          incidentId: randomIncident.id,
          read: false, createdAt: new Date().toISOString(),
        };
        setNotifications(prev => [newNotif, ...prev]);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [incidents]);

  const addIncident = useCallback(async (incidentData) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const moderationResult = moderateContent(incidentData);
    const newIncident = {
      id: `inc-${Date.now()}`,
      ...incidentData,
      status: 'active',
      verified: moderationResult.verified,
      aiFlag: moderationResult.flag,
      aiReason: moderationResult.reason,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setIncidents(prev => [newIncident, ...prev]);
    setIsLoading(false);
    return { success: true, incident: newIncident, moderation: moderationResult };
  }, []);

  const getIncidentById = useCallback((id) => {
    return incidents.find(inc => inc.id === id);
  }, [incidents]);

  const getNearbyIncidents = useCallback((lat, lon, radiusKm = 1) => {
    return incidents.filter(inc => {
      const distance = calculateDistance(lat, lon, inc.latitude, inc.longitude);
      return distance <= radiusKm && inc.status === 'active';
    });
  }, [incidents]);

  const markNotificationAsRead = useCallback((notifId) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredIncidents = incidents.filter(inc => {
    if (filter === 'all') return true;
    if (filter === 'active') return inc.status === 'active';
    if (filter === 'resolved') return inc.status === 'resolved';
    return true;
  });

  return (
    <IncidentContext.Provider value={{
      incidents: filteredIncidents, allIncidents: incidents,
      notifications, categories: INCIDENT_CATEGORIES,
      isLoading, filter, setFilter, unreadCount,
      addIncident, getIncidentById, getNearbyIncidents,
      markNotificationAsRead, markAllNotificationsAsRead,
    }}>
      {children}
    </IncidentContext.Provider>
  );
}

export const useIncidents = () => {
  const context = useContext(IncidentContext);
  if (!context) throw new Error('useIncidents doit être utilisé dans un IncidentProvider');
  return context;
};