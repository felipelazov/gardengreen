import { useEffect, useRef } from 'react';
import { Animated, Easing, Text, View } from 'react-native';

import type { UploadStatus } from '@/services/photoService';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PhotoStatusIconProps {
  status: UploadStatus;
  size?: number;
}

// ─── Status configuration ─────────────────────────────────────────────────────

interface StatusConfig {
  emoji: string;
  label: string;
  color: string;
}

const STATUS_CONFIG: Record<UploadStatus, StatusConfig> = {
  pending: {
    emoji: '☁️',
    label: 'Aguardando upload',
    color: '#9CA3AF', // gray-400
  },
  uploading: {
    emoji: '🔄',
    label: 'Enviando...',
    color: '#3B82F6', // blue-500
  },
  uploaded: {
    emoji: '✅',
    label: 'Enviado',
    color: '#22C55E', // green-500
  },
  failed: {
    emoji: '⚠️',
    label: 'Falhou',
    color: '#EF4444', // red-500
  },
};

// ─── Spinner wrapper ──────────────────────────────────────────────────────────

interface SpinnerProps {
  children: React.ReactNode;
  active: boolean;
}

function SpinnerWrapper({ children, active }: SpinnerProps) {
  const rotation = useRef(new Animated.Value(0)).current;
  const animRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (active) {
      rotation.setValue(0);
      animRef.current = Animated.loop(
        Animated.timing(rotation, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      );
      animRef.current.start();
    } else {
      animRef.current?.stop();
      rotation.setValue(0);
    }

    return () => {
      animRef.current?.stop();
    };
  }, [active, rotation]);

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={active ? { transform: [{ rotate }] } : undefined}>
      {children}
    </Animated.View>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Displays an icon that reflects the current upload status of a photo.
 *
 * - pending  → gray cloud
 * - uploading → blue spinner
 * - uploaded  → green check
 * - failed    → red warning
 */
export function PhotoStatusIcon({ status, size = 16 }: PhotoStatusIconProps) {
  const config = STATUS_CONFIG[status];
  const isUploading = status === 'uploading';

  return (
    <View
      accessible
      accessibilityLabel={config.label}
      accessibilityRole="image"
      style={{
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <SpinnerWrapper active={isUploading}>
        <Text
          style={{ fontSize: size, lineHeight: size + 4 }}
          accessibilityElementsHidden
        >
          {config.emoji}
        </Text>
      </SpinnerWrapper>
    </View>
  );
}
