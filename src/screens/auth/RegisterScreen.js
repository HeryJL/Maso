import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { colors, spacing, borderRadius } from '../../utils/colors';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { register, isLoading, error } = useAuth();

  const handleRegister = async () => {
    if (!name || !email || !password) return;
    if (password !== confirmPassword) return;
    const result = await register(name, email, password, phone);
    if (result.success) navigation.navigate('Login');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Créer un compte</Text>
        
        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={20} color={colors.primary} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {[
          { icon: 'person-outline', placeholder: 'Nom complet', value: name, onChange: setName },
          { icon: 'mail-outline', placeholder: 'Email', value: email, onChange: setEmail, keyboard: 'email-address' },
          { icon: 'call-outline', placeholder: 'Téléphone (optionnel)', value: phone, onChange: setPhone, keyboard: 'phone-pad' },
        ].map((field, i) => (
          <View key={i} style={styles.inputContainer}>
            <Ionicons name={field.icon} size={20} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={field.placeholder}
              placeholderTextColor={colors.textMuted}
              value={field.value}
              onChangeText={field.onChange}
              keyboardType={field.keyboard || 'default'}
              autoCapitalize={field.keyboard === 'email-address' ? 'none' : 'words'}
            />
          </View>
        ))}

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
          <TextInput style={styles.input} placeholder="Mot de passe" placeholderTextColor={colors.textMuted} value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
          <TextInput style={styles.input} placeholder="Confirmer le mot de passe" placeholderTextColor={colors.textMuted} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={!showPassword} />
        </View>

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color={colors.background} /> : <Text style={styles.registerButtonText}>S'inscrire</Text>}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Déjà un compte ?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerLink}>Se connecter</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { flexGrow: 1, padding: spacing.lg, paddingTop: spacing.xxl },
  title: { fontSize: 28, fontWeight: 'bold', color: colors.accent, marginBottom: spacing.lg },
  errorContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(186, 50, 19, 0.1)', padding: spacing.sm, borderRadius: borderRadius.sm, marginBottom: spacing.md },
  errorText: { color: colors.primary, marginLeft: spacing.sm, fontSize: 14 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: borderRadius.md, paddingHorizontal: spacing.md, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border },
  inputIcon: { marginRight: spacing.sm },
  input: { flex: 1, height: 50, color: colors.text, fontSize: 16 },
  registerButton: { backgroundColor: colors.accent, borderRadius: borderRadius.md, height: 50, justifyContent: 'center', alignItems: 'center', marginTop: spacing.sm },
  registerButtonText: { color: colors.background, fontSize: 16, fontWeight: '600' },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: spacing.lg },
  footerText: { color: colors.textMuted, fontSize: 14 },
  footerLink: { color: colors.secondary, fontSize: 14, fontWeight: '600', marginLeft: spacing.xs },
});