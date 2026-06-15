import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView,
  ActivityIndicator, Alert, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { useIncidents } from '../../hooks/useIncidents';
import { useAuth } from '../../hooks/useAuth';
import { colors, spacing, borderRadius } from '../../utils/colors';

export default function ReportScreen({ navigation }) {
  const [category, setCategory] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const { categories, addIncident } = useIncidents();
  const { user } = useAuth();

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    setLocationLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        let loc = await Location.getCurrentPositionAsync({});
        setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
        // Géocodage inverse simulé
        setAddress('Position actuelle (adresse approximative)');
      }
    } catch (e) {
      console.error(e);
    }
    setLocationLoading(false);
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const pickPhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!category || !title || !description || !location) {
      Alert.alert('Champs manquants', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    const result = await addIncident({
      userId: user.id,
      category,
      title,
      description,
      latitude: location.latitude,
      longitude: location.longitude,
      address: address || 'Adresse non précisée',
      photo,
    });
    setLoading(false);

    if (result.success) {
      const moderationMsg = result.moderation.flag 
        ? `\n\n⚠️ Modération IA : ${result.moderation.reason}` 
        : '\n\n✅ Contenu vérifié par IA';
      
      Alert.alert(
        'Signalement envoyé !',
        `Votre incident a été enregistré.${moderationMsg}`,
        [{ text: 'OK', onPress: () => {
          setCategory(null);
          setTitle('');
          setDescription('');
          setPhoto(null);
          navigation.navigate('Map');
        }}]
      );
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Nouveau signalement</Text>

      <Text style={styles.label}>Catégorie *</Text>
      <View style={styles.categoriesGrid}>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.categoryButton, category === cat.id && styles.categoryButtonActive]}
            onPress={() => setCategory(cat.id)}
          >
            <Ionicons 
              name={cat.icon} 
              size={24} 
              color={category === cat.id ? colors.background : cat.color} 
            />
            <Text style={[styles.categoryText, category === cat.id && styles.categoryTextActive]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Titre *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Accident de circulation"
        placeholderTextColor={colors.textMuted}
        value={title}
        onChangeText={setTitle}
        maxLength={100}
      />

      <Text style={styles.label}>Description *</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Décrivez la situation en détail..."
        placeholderTextColor={colors.textMuted}
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        maxLength={500}
      />
      <Text style={styles.charCount}>{description.length}/500</Text>

      <Text style={styles.label}>Localisation</Text>
      <View style={styles.locationContainer}>
        <Ionicons name="location" size={20} color={colors.secondary} />
        <View style={styles.locationTextContainer}>
          {locationLoading ? (
            <ActivityIndicator size="small" color={colors.secondary} />
          ) : (
            <>
              <Text style={styles.locationText}>{address || 'Position non détectée'}</Text>
              <Text style={styles.coordsText}>
                {location ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : ''}
              </Text>
            </>
          )}
        </View>
        <TouchableOpacity onPress={getCurrentLocation} disabled={locationLoading}>
          <Ionicons name="refresh" size={20} color={colors.secondary} />
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Photo (optionnel)</Text>
      <View style={styles.photoContainer}>
        {photo ? (
          <View style={styles.photoPreviewContainer}>
            <Image source={{ uri: photo }} style={styles.photoPreview} />
            <TouchableOpacity style={styles.removePhoto} onPress={() => setPhoto(null)}>
              <Ionicons name="close-circle" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.photoButtons}>
            <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
              <Ionicons name="camera" size={24} color={colors.accent} />
              <Text style={styles.photoButtonText}>Appareil photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.photoButton} onPress={pickPhoto}>
              <Ionicons name="images" size={24} color={colors.accent} />
              <Text style={styles.photoButtonText}>Galerie</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color={colors.background} /> : (
          <>
            <Ionicons name="send" size={20} color={colors.background} />
            <Text style={styles.submitButtonText}>Envoyer le signalement</Text>
          </>
        )}
      </TouchableOpacity>

      <View style={styles.aiNotice}>
        <Ionicons name="shield-checkmark" size={16} color={colors.secondary} />
        <Text style={styles.aiNoticeText}>
          Votre signalement sera analysé par notre système de modération automatique pour garantir la qualité des informations.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.accent, marginBottom: spacing.lg },
  label: { fontSize: 14, fontWeight: '600', color: colors.accent, marginBottom: spacing.sm, marginTop: spacing.md },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -spacing.xs },
  categoryButton: { width: '31%', margin: '1%', backgroundColor: colors.card, borderRadius: borderRadius.md, padding: spacing.md, alignItems: 'center', borderWidth: 2, borderColor: 'transparent', elevation: 2 },
  categoryButtonActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  categoryText: { fontSize: 11, color: colors.text, marginTop: spacing.xs, textAlign: 'center' },
  categoryTextActive: { color: colors.background, fontWeight: '600' },
  input: { backgroundColor: colors.card, borderRadius: borderRadius.md, padding: spacing.md, fontSize: 16, color: colors.text, borderWidth: 1, borderColor: colors.border },
  textArea: { height: 100, textAlignVertical: 'top' },
  charCount: { textAlign: 'right', fontSize: 12, color: colors.textMuted, marginTop: 2 },
  locationContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: borderRadius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  locationTextContainer: { flex: 1, marginLeft: spacing.sm },
  locationText: { fontSize: 14, color: colors.text },
  coordsText: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  photoContainer: { marginBottom: spacing.md },
  photoButtons: { flexDirection: 'row', justifyContent: 'space-around' },
  photoButton: { alignItems: 'center', backgroundColor: colors.card, borderRadius: borderRadius.md, padding: spacing.lg, width: '45%', borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed' },
  photoButtonText: { marginTop: spacing.sm, fontSize: 13, color: colors.accent },
  photoPreviewContainer: { position: 'relative', alignSelf: 'center' },
  photoPreview: { width: 200, height: 150, borderRadius: borderRadius.md },
  removePhoto: { position: 'absolute', top: -10, right: -10, backgroundColor: colors.card, borderRadius: 12 },
  submitButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary, borderRadius: borderRadius.md, padding: spacing.md, marginTop: spacing.lg, elevation: 3 },
  submitButtonText: { color: colors.background, fontSize: 16, fontWeight: '600', marginLeft: spacing.sm },
  aiNotice: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: 'rgba(121, 193, 164, 0.15)', borderRadius: borderRadius.md, padding: spacing.md, marginTop: spacing.lg },
  aiNoticeText: { flex: 1, marginLeft: spacing.sm, fontSize: 12, color: colors.textMuted, lineHeight: 18 },
});