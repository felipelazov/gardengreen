import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import type { TeamMemberModel } from '@/database/models/TeamMember';
import { getMemberColor } from '@/components/team/MemberCard';

interface AssignMemberModalProps {
  visible: boolean;
  members: TeamMemberModel[];
  currentAssignedUserId?: string | null;
  loading?: boolean;
  onAssign: (member: TeamMemberModel) => void;
  onUnassign: () => void;
  onClose: () => void;
}

function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length === 1) return (parts[0]?.[0] ?? '?').toUpperCase();
  return ((parts[0]?.[0] ?? '') + (parts[parts.length - 1]?.[0] ?? '')).toUpperCase();
}

export function AssignMemberModal({
  visible,
  members,
  currentAssignedUserId,
  loading = false,
  onAssign,
  onUnassign,
  onClose,
}: AssignMemberModalProps) {
  const activeMembers = members.filter((m) => m.status === 'active');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      />

      <View style={styles.sheet}>
        {/* Handle */}
        <View style={styles.handle} />

        {/* Titulo */}
        <View style={styles.header}>
          <Text style={styles.title}>Atribuir Servico</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#16A34A" />
          </View>
        ) : (
          <>
            {/* Opcao remover atribuicao */}
            {currentAssignedUserId && (
              <TouchableOpacity style={styles.unassignRow} onPress={onUnassign} activeOpacity={0.7}>
                <View style={[styles.avatar, { backgroundColor: '#F3F4F6' }]}>
                  <Text style={{ fontSize: 18 }}>✕</Text>
                </View>
                <Text style={styles.unassignText}>Remover atribuicao</Text>
              </TouchableOpacity>
            )}

            {/* Lista de membros */}
            <FlatList
              data={activeMembers}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingBottom: 24 }}
              renderItem={({ item, index }) => {
                const isSelected = item.userId === currentAssignedUserId;
                const color = getMemberColor(index);
                const initials = getInitials(item.name);

                return (
                  <TouchableOpacity
                    style={[styles.memberRow, isSelected && styles.memberRowSelected]}
                    onPress={() => onAssign(item)}
                    activeOpacity={0.7}
                  >
                    {/* Avatar */}
                    <View style={[styles.avatar, { backgroundColor: color }]}>
                      <Text style={styles.avatarText}>{initials}</Text>
                    </View>

                    {/* Info */}
                    <View style={styles.memberInfo}>
                      <Text style={styles.memberName}>{item.name}</Text>
                      <Text style={styles.memberPhone}>{item.phone}</Text>
                    </View>

                    {/* Indicador de selecao */}
                    {isSelected && (
                      <View style={[styles.checkBadge, { backgroundColor: color }]}>
                        <Text style={styles.checkText}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                <View style={{ paddingHorizontal: 20, paddingVertical: 24 }}>
                  <Text style={{ color: '#9CA3AF', textAlign: 'center', fontSize: 14 }}>
                    Nenhum membro ativo na equipe.
                  </Text>
                </View>
              }
            />
          </>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingTop: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  closeText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  loadingContainer: {
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unassignRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#FEE2E2',
    backgroundColor: '#FFF5F5',
  },
  unassignText: {
    fontSize: 15,
    color: '#DC2626',
    fontWeight: '600',
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  memberRowSelected: {
    backgroundColor: '#F0FDF4',
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
  memberInfo: {
    flex: 1,
    gap: 2,
  },
  memberName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  memberPhone: {
    fontSize: 13,
    color: '#6B7280',
  },
  checkBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
