import { router } from 'expo-router';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MemberCard } from '@/components/team/MemberCard';
import { useIsAdmin, useRemoveMember, useTeam, useTeamMembers } from '@/hooks/useTeam';
import { useAuthStore } from '@/stores/authStore';

export default function TeamScreen() {
  const { user } = useAuthStore();
  const teamId = user?.team_id ?? null;
  const userId = user?.id ?? null;
  const isTeamPlan = user?.plan === 'team';

  const { team, loading: teamLoading } = useTeam(isTeamPlan ? teamId : null);
  const { members, loading: membersLoading, refetch } = useTeamMembers(isTeamPlan ? teamId : null);
  const { isAdmin } = useIsAdmin(teamId, userId);
  const { removeMember, loading: removing } = useRemoveMember();

  const loading = teamLoading || membersLoading;

  async function handleRemoveMember(memberId: string) {
    try {
      await removeMember(memberId);
      refetch();
    } catch (e) {
      console.error('Erro ao remover membro:', e);
    }
  }

  // Gate de plano
  if (!isTeamPlan) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F0FDF4' }}>
        {/* Cabecalho */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12, padding: 4 }}>
            <Text style={{ fontSize: 24, color: '#16A34A' }}>‹</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 22, fontWeight: '700', color: '#14532D' }}>Minha Equipe</Text>
        </View>

        {/* Upgrade call-to-action */}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 }}>
          <Text style={{ fontSize: 48, marginBottom: 16 }}>👥</Text>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#14532D', textAlign: 'center', marginBottom: 8 }}>
            Recurso do Plano Equipe
          </Text>
          <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 22 }}>
            Faca upgrade para o plano Equipe para adicionar membros, delegar servicos e acompanhar sua equipe.
          </Text>
          <TouchableOpacity
            style={{
              marginTop: 24,
              backgroundColor: '#16A34A',
              borderRadius: 12,
              paddingHorizontal: 28,
              paddingVertical: 14,
            }}
            activeOpacity={0.8}
            onPress={() => {}}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '700' }}>Fazer Upgrade</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F0FDF4', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#16A34A" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F0FDF4' }}>
      {/* Cabecalho */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 12,
      }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12, padding: 4 }}>
          <Text style={{ fontSize: 24, color: '#16A34A' }}>‹</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 22, fontWeight: '700', color: '#14532D' }}>
            {team?.name ?? 'Minha Equipe'}
          </Text>
          <Text style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>
            {members.length} {members.length === 1 ? 'membro' : 'membros'}
          </Text>
        </View>

        {isAdmin && (
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/more/team/invite')}
            style={{
              backgroundColor: '#16A34A',
              borderRadius: 10,
              paddingHorizontal: 14,
              paddingVertical: 8,
            }}
            activeOpacity={0.8}
            disabled={removing}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '700' }}>+ Convidar</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Lista de membros */}
      {members.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 }}>
          <Text style={{ fontSize: 40, marginBottom: 12 }}>👤</Text>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151', textAlign: 'center' }}>
            Nenhum membro ainda
          </Text>
          <Text style={{ fontSize: 14, color: '#9CA3AF', textAlign: 'center', marginTop: 8 }}>
            Convide membros para comecar a delegar servicos.
          </Text>
        </View>
      ) : (
        <FlatList
          data={members}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 32, paddingTop: 8 }}
          renderItem={({ item, index }) => (
            <MemberCard
              id={item.id}
              name={item.name}
              phone={item.phone}
              role={item.role}
              status={item.status}
              colorIndex={index}
              isAdmin={isAdmin}
              onRemove={handleRemoveMember}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}
