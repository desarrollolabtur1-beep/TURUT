/**
 * CountdownTimer — 30-minute countdown with urgency effect
 */
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, textStyles } from '../../theme';
import { GlassCard } from './GlassCard';

interface CountdownTimerProps {
  /** Duration in seconds (default 30 minutes) */
  duration?: number;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ duration = 30 * 60 }) => {
  const [seconds, setSeconds] = useState(duration);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isUrgent = seconds <= 300; // < 5 minutes

  useEffect(() => {
    setSeconds(duration);
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 0) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [duration]);

  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');

  return (
    <GlassCard
      style={[styles.widget, isUrgent && styles.widgetUrgent]}
    >
      <Text style={styles.label}>OFERTA EXCLUSIVA</Text>
      <Text
        style={[
          styles.clock,
          isUrgent && styles.clockUrgent,
        ]}
      >
        {seconds <= 0 ? '¡Expiró!' : `${mins}:${secs}`}
      </Text>
      <Text style={styles.hint}>
        Llega antes de que expire el tiempo para obtener tu{' '}
        <Text style={styles.discountHighlight}>descuento</Text>.
      </Text>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  widget: {
    padding: 24,
    marginBottom: 32,
    alignItems: 'center',
  },
  widgetUrgent: {
    borderColor: 'rgba(249,112,102,0.25)',
    shadowColor: colors.accentUrgent,
    shadowOpacity: 0.3,
    shadowRadius: 25,
  },
  label: {
    color: colors.primary,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2.4,
    fontSize: 11.2,
  },
  clock: {
    ...textStyles.timer,
    color: colors.primary,
    textShadowColor: colors.primaryGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    marginVertical: 12,
  },
  clockUrgent: {
    color: colors.accentUrgent,
    textShadowColor: 'rgba(249,112,102,0.5)',
  },
  hint: {
    color: colors.textSecondary,
    fontSize: 13.6,
    textAlign: 'center',
    lineHeight: 20,
  },
  discountHighlight: {
    color: colors.secondary,
    fontWeight: '800',
  },
});
