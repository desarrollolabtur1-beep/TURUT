/**
 * TermsScreen — Términos y Condiciones de TURUT
 *
 * Pantalla modal con el documento legal completo.
 * Se abre desde el checkbox en el paso 2 del registro.
 */
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors, textStyles } from '../../theme';

const TermsScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Términos y Condiciones</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.closeBtn}
          activeOpacity={0.7}
        >
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        indicatorStyle="white"
      >
        <Text style={styles.lastUpdated}>Última actualización: 23 de abril de 2026</Text>

        {/* ─── 1. Aceptación ─── */}
        <Text style={styles.sectionTitle}>1. Aceptación de los Términos</Text>
        <Text style={styles.paragraph}>
          Al acceder, descargar o utilizar la aplicación TURUT (en adelante, "la Aplicación"),
          usted acepta quedar vinculado por estos Términos y Condiciones de Uso (en adelante,
          "los Términos"). Si no está de acuerdo con alguno de estos Términos, le solicitamos
          que no utilice la Aplicación.
        </Text>
        <Text style={styles.paragraph}>
          TURUT se reserva el derecho de modificar estos Términos en cualquier momento. Las
          modificaciones entrarán en vigor a partir de su publicación en la Aplicación. El uso
          continuado de la Aplicación después de dichas modificaciones constituirá su aceptación
          de los nuevos Términos.
        </Text>

        {/* ─── 2. Descripción del servicio ─── */}
        <Text style={styles.sectionTitle}>2. Descripción del Servicio</Text>
        <Text style={styles.paragraph}>
          TURUT es una plataforma digital de turismo experiencial que conecta a los usuarios con
          destinos, experiencias y actividades turísticas en la región del Tolima, Colombia.
          La Aplicación permite:
        </Text>
        <Text style={styles.listItem}>• Descubrir destinos turísticos y experiencias locales.</Text>
        <Text style={styles.listItem}>• Guardar y gestionar destinos favoritos.</Text>
        <Text style={styles.listItem}>• Personalizar preferencias de viaje y exploración.</Text>
        <Text style={styles.listItem}>• Acceder a información detallada sobre cada experiencia.</Text>
        <Text style={styles.listItem}>• Gestionar un perfil de usuario personalizado.</Text>

        {/* ─── 3. Registro y cuenta ─── */}
        <Text style={styles.sectionTitle}>3. Registro y Cuenta de Usuario</Text>
        <Text style={styles.subTitle}>3.1. Requisitos de Registro</Text>
        <Text style={styles.paragraph}>
          Para utilizar las funcionalidades completas de la Aplicación, usted deberá crear una
          cuenta proporcionando información veraz, completa y actualizada, incluyendo: nombre,
          apellido, dirección de correo electrónico y una contraseña segura (mínimo 6 caracteres).
        </Text>
        <Text style={styles.subTitle}>3.2. Seguridad de la Cuenta</Text>
        <Text style={styles.paragraph}>
          Usted es el único responsable de mantener la confidencialidad de sus credenciales de
          acceso. Cualquier actividad realizada bajo su cuenta se considerará realizada por usted.
          Deberá notificarnos de inmediato si sospecha de cualquier uso no autorizado de su cuenta.
        </Text>
        <Text style={styles.subTitle}>3.3. Veracidad de la Información</Text>
        <Text style={styles.paragraph}>
          Usted garantiza que la información proporcionada durante el registro y en cualquier
          actualización posterior es veraz y exacta. TURUT se reserva el derecho de suspender
          o cancelar cuentas que contengan información falsa o engañosa.
        </Text>

        {/* ─── 4. Uso aceptable ─── */}
        <Text style={styles.sectionTitle}>4. Uso Aceptable</Text>
        <Text style={styles.paragraph}>
          Al utilizar la Aplicación, usted se compromete a:
        </Text>
        <Text style={styles.listItem}>• No utilizar la Aplicación para fines ilícitos o no autorizados.</Text>
        <Text style={styles.listItem}>• No intentar acceder a áreas restringidas del sistema o a cuentas de otros usuarios.</Text>
        <Text style={styles.listItem}>• No reproducir, duplicar, copiar, vender o explotar ninguna parte de la Aplicación sin autorización expresa.</Text>
        <Text style={styles.listItem}>• No transmitir virus, malware o cualquier código de naturaleza destructiva.</Text>
        <Text style={styles.listItem}>• No realizar ingeniería inversa, descompilar o desensamblar el software de la Aplicación.</Text>
        <Text style={styles.listItem}>• No publicar contenido ofensivo, difamatorio, obsceno o que viole derechos de terceros.</Text>

        {/* ─── 5. Privacidad y datos ─── */}
        <Text style={styles.sectionTitle}>5. Privacidad y Protección de Datos</Text>
        <Text style={styles.subTitle}>5.1. Datos Recopilados</Text>
        <Text style={styles.paragraph}>
          TURUT recopila y procesa los siguientes datos personales para el funcionamiento del servicio:
        </Text>
        <Text style={styles.listItem}>• Datos de identificación: nombre, apellido, correo electrónico.</Text>
        <Text style={styles.listItem}>• Datos de perfil: foto de perfil, biografía, ciudad, teléfono, fecha de nacimiento, género.</Text>
        <Text style={styles.listItem}>• Preferencias: tipos de experiencia, preferencias de viaje, intereses.</Text>
        <Text style={styles.listItem}>• Datos de uso: destinos visitados, favoritos, historial de interacción.</Text>

        <Text style={styles.subTitle}>5.2. Uso de los Datos</Text>
        <Text style={styles.paragraph}>
          Sus datos serán utilizados exclusivamente para:
        </Text>
        <Text style={styles.listItem}>• Proveer y personalizar el servicio de la Aplicación.</Text>
        <Text style={styles.listItem}>• Mejorar la experiencia del usuario y las recomendaciones.</Text>
        <Text style={styles.listItem}>• Comunicar actualizaciones, novedades y ofertas relevantes.</Text>
        <Text style={styles.listItem}>• Generar estadísticas anónimas para mejorar el servicio.</Text>

        <Text style={styles.subTitle}>5.3. Protección de Datos</Text>
        <Text style={styles.paragraph}>
          TURUT implementa medidas de seguridad técnicas y organizativas para proteger sus datos
          personales contra acceso no autorizado, alteración, divulgación o destrucción. Los datos
          se almacenan en servidores seguros con cifrado y se procesan de acuerdo con la normativa
          colombiana de protección de datos (Ley 1581 de 2012 y Decreto 1377 de 2013).
        </Text>

        <Text style={styles.subTitle}>5.4. Derechos del Titular</Text>
        <Text style={styles.paragraph}>
          De acuerdo con la legislación colombiana, usted tiene derecho a:
        </Text>
        <Text style={styles.listItem}>• Conocer, actualizar y rectificar sus datos personales.</Text>
        <Text style={styles.listItem}>• Solicitar prueba de la autorización otorgada para el tratamiento.</Text>
        <Text style={styles.listItem}>• Ser informado sobre el uso dado a sus datos.</Text>
        <Text style={styles.listItem}>• Revocar la autorización y/o solicitar la supresión de sus datos.</Text>
        <Text style={styles.listItem}>• Acceder de forma gratuita a sus datos personales.</Text>

        {/* ─── 6. Propiedad intelectual ─── */}
        <Text style={styles.sectionTitle}>6. Propiedad Intelectual</Text>
        <Text style={styles.paragraph}>
          Todo el contenido de la Aplicación, incluyendo pero no limitado a: diseños, logotipos,
          marcas, textos, imágenes, gráficos, iconos, software, código fuente, bases de datos y
          la estructura de la Aplicación, son propiedad exclusiva de TURUT o de sus licenciantes
          y están protegidos por las leyes colombianas e internacionales de propiedad intelectual.
        </Text>
        <Text style={styles.paragraph}>
          Queda estrictamente prohibida la reproducción, distribución, transformación, comunicación
          pública o cualquier otra actividad que se pueda realizar con los contenidos de la Aplicación
          sin la autorización previa y por escrito de TURUT.
        </Text>

        {/* ─── 7. Contenido de terceros ─── */}
        <Text style={styles.sectionTitle}>7. Contenido de Terceros y Destinos</Text>
        <Text style={styles.paragraph}>
          La Aplicación presenta información sobre destinos, experiencias y servicios turísticos
          ofrecidos por terceros. TURUT actúa como plataforma de información y descubrimiento,
          y no es responsable de:
        </Text>
        <Text style={styles.listItem}>• La veracidad o exactitud de la información proporcionada por operadores turísticos.</Text>
        <Text style={styles.listItem}>• La calidad, seguridad o legalidad de los servicios ofrecidos por terceros.</Text>
        <Text style={styles.listItem}>• Cambios en la disponibilidad, precios o condiciones de los destinos o experiencias.</Text>
        <Text style={styles.listItem}>• Daños o perjuicios derivados de la relación entre el usuario y los proveedores de servicios turísticos.</Text>

        {/* ─── 8. Limitación de responsabilidad ─── */}
        <Text style={styles.sectionTitle}>8. Limitación de Responsabilidad</Text>
        <Text style={styles.paragraph}>
          TURUT proporciona la Aplicación "tal cual" y "según disponibilidad". No garantizamos que
          la Aplicación esté libre de errores, interrupciones, virus u otros componentes dañinos.
        </Text>
        <Text style={styles.paragraph}>
          En la máxima medida permitida por la ley, TURUT no será responsable por:
        </Text>
        <Text style={styles.listItem}>• Daños directos, indirectos, incidentales o consecuentes derivados del uso de la Aplicación.</Text>
        <Text style={styles.listItem}>• Pérdida de datos, beneficios o interrupciones del servicio.</Text>
        <Text style={styles.listItem}>• Acciones de terceros que utilicen la información publicada en la Aplicación.</Text>
        <Text style={styles.listItem}>• Situaciones de fuerza mayor o caso fortuito que afecten el servicio.</Text>

        {/* ─── 9. Cancelación ─── */}
        <Text style={styles.sectionTitle}>9. Cancelación y Suspensión</Text>
        <Text style={styles.paragraph}>
          Usted puede cancelar su cuenta en cualquier momento desde la configuración de su perfil.
          Al cancelar, sus datos personales serán eliminados de acuerdo con nuestra política de
          retención de datos, salvo aquellos que debamos conservar por obligación legal.
        </Text>
        <Text style={styles.paragraph}>
          TURUT se reserva el derecho de suspender o cancelar su cuenta sin previo aviso si:
        </Text>
        <Text style={styles.listItem}>• Viola estos Términos y Condiciones.</Text>
        <Text style={styles.listItem}>• Proporciona información falsa o engañosa.</Text>
        <Text style={styles.listItem}>• Realiza actividades que perjudiquen a otros usuarios o al servicio.</Text>
        <Text style={styles.listItem}>• Utiliza la Aplicación para fines ilegales.</Text>

        {/* ─── 10. Comunicaciones ─── */}
        <Text style={styles.sectionTitle}>10. Comunicaciones</Text>
        <Text style={styles.paragraph}>
          Al crear una cuenta, usted acepta recibir comunicaciones electrónicas de TURUT,
          incluyendo correos electrónicos informativos y notificaciones dentro de la Aplicación.
          Puede optar por no recibir comunicaciones de marketing en cualquier momento desde la
          configuración de su perfil.
        </Text>

        {/* ─── 11. Ley aplicable ─── */}
        <Text style={styles.sectionTitle}>11. Legislación Aplicable y Jurisdicción</Text>
        <Text style={styles.paragraph}>
          Estos Términos se regirán e interpretarán de acuerdo con las leyes de la República de
          Colombia. Para cualquier controversia derivada de estos Términos o del uso de la
          Aplicación, las partes se someterán a la jurisdicción de los tribunales competentes
          de la ciudad de Ibagué, Tolima, Colombia.
        </Text>

        {/* ─── 12. Contacto ─── */}
        <Text style={styles.sectionTitle}>12. Contacto</Text>
        <Text style={styles.paragraph}>
          Para cualquier consulta, reclamo o solicitud relacionada con estos Términos y Condiciones,
          o con el tratamiento de sus datos personales, puede comunicarse con nosotros a través de:
        </Text>
        <Text style={styles.listItem}>📧 Correo electrónico: soporte@turut.app</Text>
        <Text style={styles.listItem}>🌐 Sitio web: www.turut.app</Text>

        <View style={styles.divider} />

        <Text style={styles.footerText}>
          Al registrarte en TURUT, confirmas que has leído, comprendido y aceptado estos
          Términos y Condiciones en su totalidad.
        </Text>

        {/* Botón cerrar al final */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.acceptBtn}
          activeOpacity={0.8}
        >
          <Text style={styles.acceptBtnText}>Entendido</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.outline,
  },
  headerTitle: {
    ...textStyles.headlineSmall,
    color: colors.textPrimary,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  lastUpdated: {
    ...textStyles.meta,
    color: colors.textMuted,
    marginBottom: 28,
  },
  sectionTitle: {
    ...textStyles.headlineMedium,
    color: colors.primary,
    fontSize: 17,
    marginTop: 28,
    marginBottom: 12,
  },
  subTitle: {
    ...textStyles.bodySemiBold,
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    ...textStyles.body,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 12,
  },
  listItem: {
    ...textStyles.body,
    color: colors.textSecondary,
    lineHeight: 24,
    paddingLeft: 12,
    marginBottom: 6,
  },
  divider: {
    height: 1,
    backgroundColor: colors.outline,
    marginVertical: 28,
  },
  footerText: {
    ...textStyles.bodySemiBold,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  acceptBtn: {
    backgroundColor: colors.primary,
    borderRadius: 50,
    paddingVertical: 17,
    alignItems: 'center',
    justifyContent: 'center',
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
  acceptBtnText: {
    ...textStyles.bodyBold,
    color: colors.onPrimary,
    fontSize: 16,
    letterSpacing: 0.3,
  },
});

export default TermsScreen;
