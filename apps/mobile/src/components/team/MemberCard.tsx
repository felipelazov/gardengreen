import { useRef } from 'react';
import {
  Alert,
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import type { TeamMemberRole, TeamMemberStatus } from '@/database/models/TeamMember';

export const MEMBER_COLORS = [
  '#16A34A',
  '#2563EB',
  '#DC2626',
  '#D97706',
  '#7C3AED',
  '#0891B2',
  '#BE185D',
  '#059669',
] as const;

export function getMemberColor(index: number): string {
  return MEMBER_COLORS[index % MEMBER_COLORS.length] ?? MEMBER_COLORS[0]!;
}

interface MemberCardProps {
  id: string;
  name: string;
  phone: string;
  role: TeamMemberRole;
  status: TeamMemberStatus;
  colorIndex: number;
  isAdmin: boolean;
  onRemove?: (id: string) => void;
}

const STATUS_LABEL: Record<TeamMemberStatus, string> = {
  invited: 'Convidado',
  active: 'Ativo',
  inactive: 'Inativo',
};

const STATUS_COLOR: Record<TeamMemberStatus, string> = {
  invited: '#D97706',
  active: '#16A34A',
  inactive: '#9CA3AF',
};

const ROLE_LABEL: Record<TeamMemberRole, string> = {
  admin: 'Admin',
  member: 'Membro',
};

function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length === 1) return (parts[0]?.[0] ?? '?').toUpperCase();
  return ((parts[0]?.[0] ?? '') + (parts[parts.length - 1]?.[0] ?? '')).toUpperCase();
}

export function MemberCard({
  id,
  name,
  phone,
  role,
  status,
  colorIndex,
  isAdmin,
  onRemove,
}: MemberCardProps) {
  const translateX = useRef(new Animated.Value(0)).current;
  const memberColor = getMemberColor(colorIndex);
  const initials = getInitials(name);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return isAdmin && Math.abs(gestureState.dx) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          translateX.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -80) {
          Animated.spring(translateX, {
            toValue: -80,
            useNativeDriver: true,
          }).start();
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  function handleRemovePress() {
    Alert.alert(
      'Remover membro',
      `Deseja remover ${name} da equipe? Os servicos futuros atribuidos a ele serao desatribuidos.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => {
            Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
            onRemove?.(id);
          },
        },
      ],
    );
  }

  return (
    <View style={styles.container}>
      {/* Acao de remover revelada pelo swipe */}
      {isAdmin && role !== 'admin' && (
        <TouchableOpacity style={styles.removeAction} onPress={handleRemovePress} activeOpacity={0.8}>
          <Text style={styles.removeActionText}>Remover</Text>
        </TouchableOpacity>
      )}

      <Animated.View
        style={[styles.card, { transform: [{ translateX }] }]}
        {...(isAdmin && role !== 'admin' ? panResponder.panHandlers : {})}
      >
        {/* Avatar com iniciais */}
        <View style={[styles.avatar, { backgroundColor: memberColor }]}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        {/* Info do membro */}
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {name}
            </Text>
            <View style={[styles.roleBadge, { borderColor: memberColor }]}>
              <Text style={[styles.roleText, { color: memberColor }]}>{ROLE_LABEL[role]}</Text>
            </View>
          </View>
          <Text style={styles.phone}>{phone}</Text>
        </View>

        {/* Indicador de status */}
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: STATUS_COLOR[status] }]} />
          <Text style={[styles.statusText, { color: STATUS_COLOR[status] }]}>
            {STATUS_LABEL[status]}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 4,
    position: 'relative',
  },
  removeAction: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 80,
    backgroundColor: '#DC2626',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeActionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  roleBadge: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '600',
  },
  phone: {
    fontSize: 13,
    color: '#6B7280',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
