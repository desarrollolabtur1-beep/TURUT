/**
 * ProfileHeader — Avatar with neon glow, user info, and photo edit overlay
 * Uses TURUT design system exclusively
 */
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { colors, textStyles, radii, shadows, spacing } from '../../theme';

interface ProfileHeaderProps {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  profileImage?: string;
  onEditPhoto: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  firstName,
  lastName,
  email,
  role,
  profileImage,
  onEditPhoto,
}) => {
  const initials = `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase() || 'U';
  const hasImage = !!profileImage && profileImage.length > 0;

  return (
    <View style={styles.container}>
      {/* Avatar with neon border */}
      <TouchableOpacity style={styles.avatarOuter} onPress={onEditPhoto} activeOpacity={0.8}>
        <View style={styles.avatarGlow}>
          <View style={styles.avatarBorder}>
            {hasImage ? (
              <Image source={{ uri: profileImage }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitials}>{initials}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Camera overlay */}
        <View style={styles.cameraOverlay}>
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={colors.white} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
            <Circle cx="12" cy="13" r="4" />
          </Svg>
        </View>
      </TouchableOpacity>

      {/* User info */}
      <Text style={styles.userName}>{firstName} {lastName}</Text>
      <Text style={styles.userEmail}>{email}</Text>
      <View style={styles.roleBadge}>
        <Text style={styles.roleText}>
          {role === 'admin' ? '⚡ Administrador' : '🌍 Explorador'}
        </Text>
      </View>
    </View>
  );
};

const AVATAR_SIZE = 110;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  avatarOuter: {
    position: 'relative',
    marginBottom: spacing.lg,
  },
  avatarGlow: {
    width: AVATAR_SIZE + 8,
    height: AVATAR_SIZE + 8,
    borderRadius: (AVATAR_SIZE + 8) / 2,
    ...shadows.neonPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBorder: {
    width: AVATAR_SIZE + 4,
    height: AVATAR_SIZE + 4,
    borderRadius: (AVATAR_SIZE + 4) / 2,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
  },
  avatarPlaceholder: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: colors.surfaceContainerHighest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    ...textStyles.headlineLarge,
    fontSize: 36,
    color: colors.primary,
    letterSpacing: 1,
  },
  cameraOverlay: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
  userName: {
    ...textStyles.headlineLarge,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  userEmail: {
    ...textStyles.body,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  roleBadge: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: 'rgba(160, 32, 240, 0.2)',
  },
  roleText: {
    ...textStyles.chipLabel,
    color: colors.primary,
    fontSize: 11,
    letterSpacing: 1.2,
  },
});

export default ProfileHeader;
