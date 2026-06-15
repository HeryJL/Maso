import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { colors, spacing, borderRadius } from '../../utils/colors';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) return;
    await login(email, password);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Ionicons name="shield-checkmark" size={64} color={colors.primary} />
          </View>
          <Text style={styles.logoText}>MASO</Text>
          <Text style={styles.tagline}>Sécurité collective, alerte citoyenne</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Connexion</Text>
          
          {error && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={20} color={colors.primary} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Mot de passe"
              placeholderTextColor={colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color={colors.background} /> : <Text style={styles.loginButtonText}>Se connecter</Text>}
          </TouchableOpacity>

          <View style={styles.demoContainer}>
            <Text style={styles.demoText}>Compte démo : demo@maso.app / demo123</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Pas encore de compte ?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.footerLink}>S'inscrire</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: spacing.lg },
  logoContainer: { alignItems: 'center', marginBottom: spacing.xl },
  logoCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: colors.card, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.md, elevation: 5 },
  logoText: { fontSize: 36, fontWeight: 'bold', color: colors.accent, letterSpacing: 4 },
  tagline: { fontSize: 14, color: colors.textMuted, marginTop: spacing.xs },
  formContainer: { backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: spacing.lg, elevation: 3 },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.accent, marginBottom: spacing.lg, textAlign: 'center' },
  errorContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(186, 50, 19, 0.1)', padding: spacing.sm, borderRadius: borderRadius.sm, marginBottom: spacing.md },
  errorText: { color: colors.primary, marginLeft: spacing.sm, fontSize: 14 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background, borderRadius: borderRadius.md, paddingHorizontal: spacing.md, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border },
  inputIcon: { marginRight: spacing.sm },
  input: { flex: 1, height: 50, color: colors.text, fontSize: 16 },
  loginButton: { backgroundColor: colors.accent, borderRadius: borderRadius.md, height: 50, justifyContent: 'center', alignItems: 'center', marginTop: spacing.sm },
  loginButtonText: { color: colors.background, fontSize: 16, fontWeight: '600' },
  demoContainer: { marginTop: spacing.md, alignItems: 'center' },
  demoText: { color: colors.textMuted, fontSize: 12 },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: spacing.lg },
  footerText: { color: colors.textMuted, fontSize: 14 },
  footerLink: { color: colors.secondary, fontSize: 14, fontWeight: '600', marginLeft: spacing.xs },
});