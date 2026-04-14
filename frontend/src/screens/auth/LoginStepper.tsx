/**
 * LoginStepper — Login / Register con pasos animados (versión producción)
 *
 * Pasos:
 *   0 — Bienvenida + email
 *   1 — Contraseña (Login) ó Nombre + Contraseña (Register)
 *   2 — Confirmación / loading
 *
 * Hooks usados:
 *   useStepper         → manejo de pasos
 *   useFormField       → validación de campos
 *   useAuth            → login / register reales
 *   useKeyboardOffset  → desplazar UI cuando aparece el teclado
 *
 * NOTA: Esta es la versión de producción. El archivo original en
 * src/experiments/auth/LoginStepper.tsx se mantiene intacto para el sandbox.
 * La diferencia clave: aquí NO se llama navigation.navigate('MainTabs'),
 * ya que el auth guard en AppNavigator maneja la transición automáticamente.
 */
import React, { useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';

import { useStepper } from '../../hooks/useStepper';
import { useFormField } from '../../hooks/useFormField';
import { useKeyboardOffset } from '../../hooks/useKeyboardOffset';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme';

// ─── Validadores ────────────────────────────────────────────────────────────
const emailValidator = (v: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Ingresa un email válido';

const passwordValidator = (v: string) =>
  v.length >= 6 ? '' : 'Mínimo 6 caracteres';

const nameValidator = (v: string) =>
  v.trim().length >= 2 ? '' : 'Mínimo 2 caracteres';

// ─── Constantes ──────────────────────────────────────────────────────────────
const TOTAL_STEPS = 3;

type Mode = 'login' | 'register';

const LoginStepper: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { login, register } = useAuth();
  const stepper = useStepper(TOTAL_STEPS);
  const keyboardOffset = useKeyboardOffset();

  // Estado del modo (login vs register)
  const [mode, setMode] = React.useState<Mode>('login');
  const [isLoading, setIsLoading] = React.useState(false);

  // Campos
  const email = useFormField('', emailValidator);
  const password = useFormField('', passwordValidator);
  const firstName = useFormField('', nameValidator);
  const lastName = useFormField('', nameValidator);

  // Animación de la barra de progreso
  const progressAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: stepper.currentStep / (TOTAL_STEPS - 1),
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [stepper.currentStep]);

  // ─── Lógica por paso ──────────────────────────────────────────────────────

  const canAdvanceStep0 = email.isValid && email.value.length > 0;

  const canAdvanceStep1 =
    mode === 'login'
      ? password.isValid && password.value.length > 0
      : password.isValid &&
        firstName.isValid &&
        lastName.isValid &&
        password.value.length > 0 &&
        firstName.value.length > 0 &&
        lastName.value.length > 0;

  const handleNext = async () => {
    if (stepper.currentStep === 0) {
      email.onBlur();
      if (!canAdvanceStep0) return;
      stepper.next();
    } else if (stepper.currentStep === 1) {
      password.onBlur();
      if (mode === 'register') {
        firstName.onBlur();
        lastName.onBlur();
      }
      if (!canAdvanceStep1) return;
      // Avanzar al paso de carga y ejecutar autenticación
      stepper.next();
      setIsLoading(true);
      try {
        if (mode === 'login') {
          await login(email.value, password.value);
        } else {
          await register(email.value, password.value, firstName.value, lastName.value);
        }
        // ✅ Login exitoso — el auth guard en AppNavigator detecta el token
        // y transiciona a MainTabs automáticamente. No se necesita navigate().
      } catch (err: any) {
        Alert.alert(
          mode === 'login' ? 'Error al iniciar sesión' : 'Error al registrarte',
          err.message || 'Inténtalo de nuevo'
        );
        stepper.back(); // Volver al paso anterior en caso de error
      } finally {
        setIsLoading(false);
      }
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={keyboardOffset}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header con botón volver ── */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => (stepper.isFirst ? navigation.goBack() : stepper.back())}
            style={styles.backBtn}
          >
            <Text style={styles.backBtnText}>
              {stepper.currentStep === 2 ? '' : '←'}
            </Text>
          </TouchableOpacity>

          {/* Indicador de modo */}
          {stepper.currentStep < 2 && (
            <View style={styles.modeToggle}>
              <TouchableOpacity
                onPress={() => setMode('login')}
                style={[styles.modeBtn, mode === 'login' && styles.modeBtnActive]}
              >
                <Text
                  style={[
                    styles.modeBtnText,
                    mode === 'login' && styles.modeBtnTextActive,
                  ]}
                >
                  Entrar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setMode('register')}
                style={[styles.modeBtn, mode === 'register' && styles.modeBtnActive]}
              >
                <Text
                  style={[
                    styles.modeBtnText,
                    mode === 'register' && styles.modeBtnTextActive,
                  ]}
                >
                  Registro
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* ── Barra de progreso ── */}
        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>

        {/* ── Indicadores de pasos ── */}
        <View style={styles.stepDots}>
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i <= stepper.currentStep && styles.dotActive,
                i === stepper.currentStep && styles.dotCurrent,
              ]}
            />
          ))}
        </View>

        {/* ══════════════ PASO 0: Email ══════════════ */}
        {stepper.currentStep === 0 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepLabel}>PASO 1 DE 3</Text>
            <Text style={styles.stepTitle}>
              {mode === 'login' ? '¡Hola de nuevo! 👋' : 'Únete a TURUT 🌍'}
            </Text>
            <Text style={styles.stepSubtitle}>
              {mode === 'login'
                ? 'Ingresa tu email para continuar'
                : 'Empecemos con tu dirección de email'}
            </Text>

            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>Correo electrónico</Text>
              <TextInput
                style={[styles.input, email.error ? styles.inputError : null]}
                placeholder="tu@email.com"
                placeholderTextColor={colors.textMuted}
                value={email.value}
                onChangeText={email.onChange}
                onBlur={email.onBlur}
                autoCapitalize="none"
                keyboardType="email-address"
                autoFocus
              />
              {email.error ? (
                <Text style={styles.fieldError}>{email.error}</Text>
              ) : null}
            </View>
          </View>
        )}

        {/* ══════════════ PASO 1: Datos adicionales ══════════════ */}
        {stepper.currentStep === 1 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepLabel}>PASO 2 DE 3</Text>
            <Text style={styles.stepTitle}>
              {mode === 'login' ? 'Tu contraseña 🔑' : 'Cuéntanos más 📝'}
            </Text>
            <Text style={styles.stepSubtitle}>
              {email.value}
            </Text>

            {mode === 'register' && (
              <>
                <View style={styles.fieldRow}>
                  <View style={[styles.fieldWrap, { flex: 1 }]}>
                    <Text style={styles.fieldLabel}>Nombre</Text>
                    <TextInput
                      style={[
                        styles.input,
                        firstName.error ? styles.inputError : null,
                      ]}
                      placeholder="Ana"
                      placeholderTextColor={colors.textMuted}
                      value={firstName.value}
                      onChangeText={firstName.onChange}
                      onBlur={firstName.onBlur}
                    />
                    {firstName.error ? (
                      <Text style={styles.fieldError}>{firstName.error}</Text>
                    ) : null}
                  </View>

                  <View style={[styles.fieldWrap, { flex: 1 }]}>
                    <Text style={styles.fieldLabel}>Apellido</Text>
                    <TextInput
                      style={[
                        styles.input,
                        lastName.error ? styles.inputError : null,
                      ]}
                      placeholder="García"
                      placeholderTextColor={colors.textMuted}
                      value={lastName.value}
                      onChangeText={lastName.onChange}
                      onBlur={lastName.onBlur}
                    />
                    {lastName.error ? (
                      <Text style={styles.fieldError}>{lastName.error}</Text>
                    ) : null}
                  </View>
                </View>
              </>
            )}

            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>Contraseña</Text>
              <TextInput
                style={[styles.input, password.error ? styles.inputError : null]}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor={colors.textMuted}
                value={password.value}
                onChangeText={password.onChange}
                onBlur={password.onBlur}
                secureTextEntry
                autoFocus
              />
              {password.error ? (
                <Text style={styles.fieldError}>{password.error}</Text>
              ) : null}
            </View>
          </View>
        )}

        {/* ══════════════ PASO 2: Cargando / Confirmación ══════════════ */}
        {stepper.currentStep === 2 && (
          <View style={[styles.stepContent, styles.stepCentered]}>
            {isLoading ? (
              <>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>
                  {mode === 'login' ? 'Iniciando sesión...' : 'Creando tu cuenta...'}
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.successEmoji}>✅</Text>
                <Text style={styles.successTitle}>¡Listo!</Text>
                <Text style={styles.successSubtitle}>Redirigiendo a la app...</Text>
              </>
            )}
          </View>
        )}

        {/* ── Botón principal ── */}
        {stepper.currentStep < 2 && (
          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.primaryBtn,
                !(stepper.currentStep === 0 ? canAdvanceStep0 : canAdvanceStep1) &&
                  styles.primaryBtnDisabled,
              ]}
              onPress={handleNext}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryBtnText}>
                {stepper.isLast
                  ? mode === 'login'
                    ? 'Iniciar Sesión'
                    : 'Crear Cuenta'
                  : 'Continuar →'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// ─── Estilos ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 52,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
    minHeight: 40,
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
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: 20,
    padding: 3,
  },
  modeBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 17,
  },
  modeBtnActive: {
    backgroundColor: colors.primary,
  },
  modeBtnText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  modeBtnTextActive: {
    color: colors.onPrimary,
  },
  // Barra de progreso
  progressTrack: {
    height: 3,
    backgroundColor: colors.surfaceContainerHighest,
    marginHorizontal: 20,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  stepDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
    marginBottom: 32,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surfaceContainerHighest,
  },
  dotActive: {
    backgroundColor: colors.primarySoft,
  },
  dotCurrent: {
    backgroundColor: colors.primary,
    width: 22,
  },
  // Contenido del paso
  stepContent: {
    flex: 1,
    paddingHorizontal: 24,
    gap: 4,
  },
  stepCentered: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    minHeight: 200,
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 6,
    lineHeight: 34,
  },
  stepSubtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 28,
  },
  // Campos
  fieldRow: {
    flexDirection: 'row',
    gap: 12,
  },
  fieldWrap: {
    marginBottom: 16,
    gap: 6,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  input: {
    height: 52,
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.textPrimary,
    borderWidth: 1.5,
    borderColor: colors.outline,
  },
  inputError: {
    borderColor: colors.error,
  },
  fieldError: {
    fontSize: 12,
    color: colors.error,
    marginTop: 2,
  },
  // Footer + botón
  footer: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    borderRadius: 50,
    paddingVertical: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnDisabled: {
    opacity: 0.35,
  },
  primaryBtnText: {
    color: colors.onPrimary,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  // Paso de carga/éxito
  loadingText: {
    color: colors.textMuted,
    fontSize: 15,
    marginTop: 12,
  },
  successEmoji: {
    fontSize: 56,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  successSubtitle: {
    fontSize: 14,
    color: colors.textMuted,
  },
});

export default LoginStepper;
