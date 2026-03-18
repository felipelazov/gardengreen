import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import type { TeamMemberModel } from '@/database/models/TeamMember';
import type { ServiceModel } from '@/database/models/Service';
import { AssignMemberModal } from '@/components/agenda/AssignMemberModal';
import { TeamServiceCard } from '@/components/team/TeamServiceCard';
import { useTeamMembers } from '@/hooks/useTeam';
import { useAssignService, useReassignService, useTeamServiceStats, useTeamTodayServices } from '@/hooks/useTeamServices';
import { getMemberColor } from '@/components/team/MemberCard';

interface TeamAgendaViewProps {
  teamId: string;
  isAdmin: boolean;
}

export function TeamAgendaView({ teamId, isAdmin }: TeamAgendaViewProps) {
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [assigningServiceId, setAssigningServiceId] = useState<string | null>(null);

  const { services, loading: servicesLoading, refetch: refetchServices } = useTeamTodayServices(teamId);
  const { members, loading: membersLoading } = useTeamMembers(teamId);
  const { stats } = useTeamServiceStats(teamId);
  const { assignService, loading: assigning } = useAssignService();
  const { reassignService, loading: reassigning } = useReassignService();

  const loading = servicesLoading || membersLoading;

  // Mapa userId -> indice do membro (para cores)
  const memberColorMap = new Map<string, number>();
  members.forEach((m, index) => {
    if (m.userId) memberColorMap.set(m.userId, index);
  });

  // Mapa userId -> nome do membro
  const memberNameMap = new Map<string, string>();
  members.forEach((m) => {
    if (m.userId) memberNameMap.set(m.userId, m.name);
  });

  // Filtragem por membro
  const filteredServices: ServiceModel[] = selectedMemberId
    ? services.filter((s) => {
        const member = members.find((m) => m.id === selectedMemberId);
        return member?.userId ? s.assignedTo === member.userId : s.assignedTo === null;
      })
    : services;

  // Servico sendo atribuido (para obter assignedTo atual)
  const currentService = assigningServiceId
    ? services.find((s) => s.id === assigningServiceId)
    : null;

  async function handleAssign(member: TeamMemberModel) {
    if (!assigningServiceId || !member.userId) return;
    const service = services.find((s) => s.id === assigningServiceId);
    if (!service) return;

    try {
      if (service.assignedTo) {
        // Reatribuicao
        const oldMember = members.find((m) => m.userId === service.assignedTo);
        if (oldMember) {
          await reassignService({
            serviceId: assigningServiceId,
            oldMemberId: oldMember.id,
            newMemberId: member.id,
            newMemberUserId: member.userId,
            clientName: service.clientId, // substitui por clientName quando disponivel
            serviceDate: service.date,
          });
        }
      } else {
        await assignService({
          serviceId: assigningServiceId,
          memberId: member.id,
          memberUserId: member.userId,
          clientName: service.clientId,
          serviceDate: service.date,
        });
      }
      setAssigningServiceId(null);
      refetchServices();
    } catch (e) {
      console.error('Erro ao atribuir servico:', e);
    }
  }

  async function handleUnassign() {
    if (!assigningServiceId) return;
    const service = services.find((s) => s.id === assigningServiceId);
    if (!service || !service.assignedTo) return;

    const oldMember = members.find((m) => m.userId === service.assignedTo);
    if (!oldMember) return;

    try {
      await reassignService({
        serviceId: assigningServiceId,
        oldMemberId: oldMember.id,
        newMemberId: oldMember.id,
        newMemberUserId: '',
        clientName: service.clientId,
        serviceDate: service.date,
      });
      setAssigningServiceId(null);
      refetchServices();
    } catch (e) {
      console.error('Erro ao remover atribuicao:', e);
    }
  }

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#16A34A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Barra de resumo */}
      <View style={styles.statsBar}>
        <StatPill label="Total" value={stats.total} color="#374151" />
        <View style={styles.statDivider} />
        <StatPill label="Atribuidos" value={stats.assigned} color="#16A34A" />
        <View style={styles.statDivider} />
        <StatPill label="Sem atrib." value={stats.unassigned} color="#DC2626" />
      </View>

      {/* Filtro por membro */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
      >
        <TouchableOpacity
          style={[styles.filterChip, !selectedMemberId && styles.filterChipActive]}
          onPress={() => setSelectedMemberId(null)}
        >
          <Text style={[styles.filterChipText, !selectedMemberId && styles.filterChipTextActive]}>
            Todos
          </Text>
        </TouchableOpacity>

        {members.map((member, index) => {
          const isSelected = selectedMemberId === member.id;
          const color = getMemberColor(index);
          return (
            <TouchableOpacity
              key={member.id}
              style={[
                styles.filterChip,
                isSelected && { backgroundColor: color, borderColor: color },
              ]}
              onPress={() => setSelectedMemberId(isSelected ? null : member.id)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  isSelected && styles.filterChipTextActive,
                ]}
              >
                {member.name.split(' ')[0]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Lista de servicos */}
      {filteredServices.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            {selectedMemberId ? 'Nenhum servico para este membro hoje.' : 'Nenhum servico da equipe hoje.'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredServices}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 32, paddingTop: 4 }}
          renderItem={({ item }) => {
            const memberColorIndex = item.assignedTo
              ? (memberColorMap.get(item.assignedTo) ?? null)
              : null;
            const memberName = item.assignedTo
              ? (memberNameMap.get(item.assignedTo) ?? null)
              : null;

            return (
              <TeamServiceCard
                id={item.id}
                time={item.time}
                clientName={item.clientId} // substituir por nome do cliente quando disponivel
                type={item.type}
                value={item.value}
                status={item.status}
                assignedMemberName={memberName}
                memberColorIndex={memberColorIndex}
                isAdmin={isAdmin}
                onPress={() => {}}
                onAssignPress={(id) => setAssigningServiceId(id)}
              />
            );
          }}
        />
      )}

      {/* Modal de atribuicao */}
      <AssignMemberModal
        visible={!!assigningServiceId}
        members={members}
        currentAssignedUserId={currentService?.assignedTo ?? null}
        loading={assigning || reassigning}
        onAssign={handleAssign}
        onUnassign={handleUnassign}
        onClose={() => setAssigningServiceId(null)}
      />
    </View>
  );
}

interface StatPillProps {
  label: string;
  value: number;
  color: string;
}

function StatPill({ label, value, color }: StatPillProps) {
  return (
    <View style={styles.statPill}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statPill: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 4,
  },
  filterScroll: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  filterChip: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  filterChipActive: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 40,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
