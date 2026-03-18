import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useSyncStore } from '@/stores/syncStore';

interface Props {
  /** Called when the user manually dismisses the banner. */
  onDismiss?: () => void;
}

/**
 * InitialSyncProgress
 *
 * Displays a non-blocking progress banner while the first sync is running
 * after a user logs in on a new device. Auto-hides once sync completes.
 * The user can also dismiss it manually at any time.
 */
export function InitialSyncProgress({ onDismiss }: Props) {
  const { syncStatus } = useSyncStore();
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(false);

  // Track whether this is the first sync cycle of the session
  const hasSeenSyncing = useRef(false);
  const autoHideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Animated values
  const translateY = useRef(new Animated.Value(-120)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const progressLoopRef = useRef<Animated.CompositeAnimation | null>(null);

  // --- Visibility logic ---
  useEffect(() => {
    if (dismissed) return;

    if (syncStatus === 'syncing') {
      hasSeenSyncing.current = true;
      setVisible(true);
    }

    if (syncStatus === 'completed' && hasSeenSyncing.current) {
      // Auto-hide with a short delay so the user can see the "completed" state
      autoHideTimer.current = setTimeout(() => {
        hide();
      }, 1500);
    }

    return () => {
      if (autoHideTimer.current) clearTimeout(autoHideTimer.current);
    };
  }, [syncStatus, dismissed]);

  // --- Slide-in / slide-out animation ---
  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: -120,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, translateY]);

  // --- Indeterminate progress bar animation ---
  useEffect(() => {
    if (syncStatus === 'syncing') {
      progressAnim.setValue(0);
      progressLoopRef.current = Animated.loop(
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: false,
        }),
      );
      progressLoopRef.current.start();
    } else {
      progressLoopRef.current?.stop();
      // Snap the bar to full on completion, empty on error/idle
      Animated.timing(progressAnim, {
        toValue: syncStatus === 'completed' ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }

    return () => {
      progressLoopRef.current?.stop();
    };
  }, [syncStatus, progressAnim]);

  const hide = () => {
    setVisible(false);
    // After the slide-out animation finishes, reset the "seen syncing" flag
    // so the component reacts to future sync sessions if needed.
    setTimeout(() => {
      hasSeenSyncing.current = false;
    }, 300);
  };

  const handleDismiss = () => {
    setDismissed(true);
    hide();
    onDismiss?.();
  };

  if (!visible && !dismissed) return null;
  if (dismissed) return null;

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const config = getConfig(syncStatus);

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateY }] }]}
      accessibilityLiveRegion="polite"
      accessibilityLabel={config.label}
    >
      <View style={styles.content}>
        <View style={styles.textRow}>
          <Text style={styles.label}>{config.label}</Text>
          <Pressable
            onPress={handleDismiss}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Fechar"
          >
            <Text style={styles.dismiss}>✕</Text>
          </Pressable>
        </View>

        <View style={styles.trackOuter}>
          <Animated.View
            style={[
              styles.trackFill,
              { width: progressWidth, backgroundColor: config.fillColor },
            ]}
          />
        </View>

        {syncStatus === 'completed' && (
          <Text style={styles.subtitle}>Tudo pronto!</Text>
        )}
        {syncStatus === 'error' && (
          <Text style={[styles.subtitle, styles.errorText]}>
            Falha na sincronização. Tentaremos novamente em breve.
          </Text>
        )}
      </View>
    </Animated.View>
  );
}

interface Config {
  label: string;
  fillColor: string;
}

function getConfig(status: string): Config {
  switch (status) {
    case 'completed':
      return { label: 'Dados sincronizados', fillColor: '#22C55E' };
    case 'error':
      return { label: 'Erro ao sincronizar', fillColor: '#EF4444' };
    default:
      return { label: 'Baixando seus dados...', fillColor: '#3B82F6' };
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 6,
  },
  content: {
    paddingTop: 52, // account for status bar on most devices
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  dismiss: {
    fontSize: 14,
    color: '#6B7280',
  },
  trackOuter: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  trackFill: {
    height: 4,
    borderRadius: 2,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 12,
    color: '#6B7280',
  },
  errorText: {
    color: '#DC2626',
  },
});
