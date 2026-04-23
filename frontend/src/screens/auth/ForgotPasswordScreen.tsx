/**
 * ForgotPasswordScreen — Flujo de recuperación de contraseña
 *
 * Pasos:
 *   0 — Ingresar email
 *   1 — Ingresar código de 6 dígitos
 *   2 — Nueva contraseña
 *   3 — Éxito
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { authService } from '../../services/api.service';
import { useAuth } from '../../context/AuthContext';
import { colors, textStyles } from '../../theme';
import { TurutLogo } from '../../components/header/TurutLogo';

type Step = 0 | 1 | 2 | 3;

const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation();
  const { login } = useAuth();

  const [step, setStep] = useState<Step>(0);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // ─── Paso 0: Enviar código ─────────────────────────────────────────────────
  const handleSendCode = async () => {
    setError('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Ingresa un email válido');
      return;
    }

    setIsLoading(true);
    try {
      await authService.forgotPassword(email);
      setStep(1);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al enviar el código');
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Paso 1: Verificar código → ir directo a nueva contraseña ──────────────
  const handleVerifyCode = () => {
    setError('');
    if (code.length !== 6) {
      setError('El código debe tener 6 dígitos');
      return;
    }
    setStep(2);
  };

  // ─── Paso 2: Cambiar contraseña ────────────────────────────────────────────
  const handleResetPassword = async () => {
    setError('');
    if (newPassword.length < 6) {
      setError('Mínimo 6 caracteres');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.resetPassword(email, code, newPassword);
      if (response.data.success) {
        setStep(3);
        // Auto-login después de 2 segundos
        setTimeout(async () => {
          try {
            await login(email, newPassword);
          } catch {
            navigation.goBack();
          }
        }, 2000);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Código inválido o expirado');
      // Si falla, volver al paso del código
      setStep(1);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            {step < 3 && (
              <TouchableOpacity
                onPress={() => {
                  if (step === 0) navigation.goBack();
                  else setStep((step - 1) as Step);
                }}
                style={styles.backBtn}
              >
                <Text style={styles.backBtnText}>←</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Logo */}
          <View style={styles.logoContainer}>
            <TurutLogo />
          </View>

          {/* ═══ Paso 0: Email ═══ */}
          {step === 0 && (
            <View style={styles.stepContent}>
              <Text style={styles.stepIcon}>🔐</Text>
              <Text style={styles.stepTitle}>¿Olvidaste tu contraseña?</Text>
              <Text style={styles.stepSubtitle}>
                Te enviaremos un código de 6 dígitos para recuperar tu cuenta.
              </Text>

              <View style={styles.fieldWrap}>
                <Text style={styles.fieldLabel}>Correo electrónico</Text>
                <TextInput
                  style={styles.input}
                  placeholder="tu@email.com"
                  placeholderTextColor={colors.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoFocus
                />
              </View>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <TouchableOpacity
                style={[styles.primaryBtn, isLoading && styles.primaryBtnDisabled]}
                onPress={handleSendCode}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <ActivityIndicator color={colors.onPrimary} />
                ) : (
                  <Text style={styles.primaryBtnText}>Enviar Código</Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* ═══ Paso 1: Código ═══ */}
          {step === 1 && (
            <View style={styles.stepContent}>
              <Text style={styles.stepIcon}>📬</Text>
              <Text style={styles.stepTitle}>Revisa tu correo</Text>
              <Text style={styles.stepSubtitle}>
                Ingresa el código de 6 dígitos que enviamos a{'\n'}
                <Text style={{ color: colors.primary, fontWeight: '700' }}>
                  {email}
                </Text>
              </Text>

              <View style={styles.fieldWrap}>
                <Text style={styles.fieldLabel}>Código de verificación</Text>
                <TextInput
                  style={[styles.input, styles.codeInput]}
                  placeholder="000000"
                  placeholderTextColor={colors.textMuted}
                  value={code}
                  onChangeText={(text) => setCode(text.replace(/[^0-9]/g, '').slice(0, 6))}
                  keyboardType="number-pad"
                  maxLength={6}
                  autoFocus
                />
              </View>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <TouchableOpacity
                style={[styles.primaryBtn, code.length !== 6 && styles.primaryBtnDisabled]}
                onPress={handleVerifyCode}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryBtnText}>Verificar Código</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSendCode}
                style={styles.resendBtn}
                activeOpacity={0.7}
              >
                <Text style={styles.resendBtnText}>¿No recibiste el código? Reenviar</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ═══ Paso 2: Nueva contraseña ═══ */}
          {step === 2 && (
            <View style={styles.stepContent}>
              <Text style={styles.stepIcon}>🔑</Text>
              <Text style={styles.stepTitle}>Nueva contraseña</Text>
              <Text style={styles.stepSubtitle}>
                Crea una nueva contraseña para tu cuenta.
              </Text>

              <View style={styles.fieldWrap}>
                <Text style={styles.fieldLabel}>Nueva contraseña</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor={colors.textMuted}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                  autoFocus
                />
              </View>

              <View style={styles.fieldWrap}>
                <Text style={styles.fieldLabel}>Confirmar contraseña</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Repite tu contraseña"
                  placeholderTextColor={colors.textMuted}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              </View>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <TouchableOpacity
                style={[styles.primaryBtn, isLoading && styles.primaryBtnDisabled]}
                onPress={handleResetPassword}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <ActivityIndicator color={colors.onPrimary} />
                ) : (
                  <Text style={styles.primaryBtnText}>Cambiar Contraseña</Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* ═══ Paso 3: Éxito ═══ */}
          {step === 3 && (
            <View style={[styles.stepContent, styles.stepCentered]}>
              <Text style={styles.successEmoji}>✅</Text>
              <Text style={styles.stepTitle}>¡Contraseña actualizada!</Text>
              <Text style={styles.stepSubtitle}>
                Iniciando sesión automáticamente...
              </Text>
              <ActivityIndicator
                size="small"
                color={colors.primary}
                style={{ marginTop: 16 }}
              />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    minHeight: 52,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    color: colors.textPrimary,
    fontSize: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  stepContent: {
    flex: 1,
    paddingHorizontal: 24,
    gap: 4,
  },
  stepCentered: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    minHeight: 200,
  },
  stepIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  stepTitle: {
    ...textStyles.headlineLarge,
    fontSize: 26,
    color: colors.textPrimary,
    marginBottom: 8,
    lineHeight: 32,
  },
  stepSubtitle: {
    ...textStyles.body,
    color: colors.textMuted,
    marginBottom: 28,
    lineHeight: 22,
  },
  fieldWrap: {
    marginBottom: 16,
    gap: 6,
  },
  fieldLabel: {
    ...textStyles.meta,
    fontSize: 12,
    color: colors.textSecondary,
  },
  input: {
    ...textStyles.bodyMedium,
    height: 52,
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.textPrimary,
    borderWidth: 1.5,
    borderColor: colors.outline,
  },
  codeInput: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 12,
  },
  errorText: {
    ...textStyles.body,
    color: colors.error,
    fontSize: 13,
    marginBottom: 12,
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    borderRadius: 50,
    paddingVertical: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    ...Platform.select({
      web: {
        boxShadow: '0 0 18px rgba(160, 32, 240, 0.4)',
      } as any,
      default: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 6,
      },
    }),
  },
  primaryBtnDisabled: {
    opacity: 0.35,
  },
  primaryBtnText: {
    ...textStyles.bodyBold,
    color: colors.onPrimary,
    fontSize: 16,
    letterSpacing: 0.3,
  },
  resendBtn: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  resendBtnText: {
    ...textStyles.bodySemiBold,
    color: colors.primary,
    fontSize: 13,
  },
  successEmoji: {
    fontSize: 56,
  },
});

export default ForgotPasswordScreen;
