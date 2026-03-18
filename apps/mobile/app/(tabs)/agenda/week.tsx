import { Q } from '@nozbe/watermelondb';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { ServiceModel } from '@/database/models/Service';
import { useAuthStore } from '@/stores/authStore';
import { formatCurrency } from '@shared/utils/formatCurrency';
import {
  formatDateBR,
  getWeekDates,
  getWeekday,
  isToday,
} from '@shared/utils/formatDate';

const PRIMARY = '#16A34A';
const SCREEN_WIDTH = Dimensions.get('window').width;

interface DaySummary {
  date: string;
  count: number;
  totalValue: number;
}

export default function WeekView() {
  const router = useRouter();
  const database = useDatabase();
  const { user } = useAuthStore();
  const userId = user?.id ?? '';

  const [weekOffset, setWeekOffset] = useState(0);
  const [weekDates, setWeekDates] = useState<string[]>([]);
  const [daySummaries, setDaySummaries] = useState<DaySummary[]>([]);
  const [loading, setLoading] = useState(true);

  const scrollRef = useRef<ScrollView>(null);

  // Recalcula datas da semana quando offset muda
  useEffect(() => {
    const dates = getWeekDates(weekOffset);
    setWeekDates(dates);
  }, [weekOffset]);

  // Carrega servicos da semana
  const loadWeek = useCallback(async () => {
    if (!weekDates.length || !userId) return;
    setLoading(true);
    try {
      const weekStart = weekDates[0];
      const weekEnd = weekDates[6];
      const services = await database
        .get<ServiceModel>('services')
        .query(
          Q.where('user_id', userId),
          Q.where('date', Q.gte(weekStart)),
          Q.where('date', Q.lte(weekEnd)),
          Q.where('status', Q.notEq('cancelled')),
        )
        .fetch();

      const summaries: DaySummary[] = weekDates.map((date) => {
        const dayServices = services.filter((s) => s.date === date);
        return {
          date,
          count: dayServices.length,
          totalValue: dayServices.reduce((sum, s) => sum + s.value, 0),
        };
      });

      setDaySummaries(summaries);
    } finally {
      setLoading(false);
    }
  }, [weekDates, database, userId]);

  useEffect(() => {
    loadWeek();
  }, [loadWeek]);

  const weekLabel = weekDates.length
    ? `${formatDateBR(weekDates[0])} — ${formatDateBR(weekDates[6])}`
    : '';

  return (
    <SafeAreaView style={styles.container}>
      {/* Navegacao de semana */}
      <View style={styles.weekNav}>
        <TouchableOpacity
          style={styles.navBtn}
          onPress={() => setWeekOffset((o) => o - 1)}
        >
          <Text style={styles.navBtnText}>{'<'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setWeekOffset(0)}>
          <Text style={styles.weekLabel}>{weekLabel}</Text>
          {weekOffset !== 0 && (
            <Text style={styles.weekReturn}>Voltar para hoje</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navBtn}
          onPress={() => setWeekOffset((o) => o + 1)}
        >
          <Text style={styles.navBtnText}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={PRIMARY} />
        </View>
      ) : (
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.daysRow}
          decelerationRate="fast"
          snapToInterval={SCREEN_WIDTH}
        >
          {daySummaries.map((day) => {
            const todayFlag = isToday(day.date);
            return (
              <TouchableOpacity
                key={day.date}
                style={[styles.dayCard, todayFlag && styles.dayCardToday]}
                onPress={() =>
                  router.push({
                    pathname: '/(tabs)/agenda',
                    params: { date: day.date },
                  })
                }
                activeOpacity={0.75}
              >
                <Text
                  style={[styles.dayWeekday, todayFlag && styles.textToday]}
                >
                  {getWeekday(day.date)}
                </Text>
                <Text
                  style={[styles.dayNumber, todayFlag && styles.textToday]}
                >
                  {parseInt(day.date.split('-')[2], 10)}
                </Text>

                <View style={styles.daySeparator} />

                {day.count > 0 ? (
                  <>
                    <View
                      style={[
                        styles.countBadge,
                        todayFlag && styles.countBadgeToday,
                      ]}
                    >
                      <Text
                        style={[
                          styles.countBadgeText,
                          todayFlag && styles.textToday,
                        ]}
                      >
                        {day.count}
                      </Text>
                    </View>
                    <Text
                      style={[styles.dayValue, todayFlag && styles.textToday]}
                    >
                      {formatCurrency(day.totalValue)}
                    </Text>
                  </>
                ) : (
                  <Text style={styles.emptyDay}>Livre</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* Lista de dias com detalhes */}
      {!loading && (
        <FlatList
          data={daySummaries.filter((d) => d.count > 0)}
          keyExtractor={(item) => item.date}
          style={styles.summaryList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.summaryRow}
              onPress={() =>
                router.push({
                  pathname: '/(tabs)/agenda',
                  params: { date: item.date },
                })
              }
            >
              <View style={styles.summaryLeft}>
                <Text style={styles.summaryWeekday}>
                  {getWeekday(item.date)}
                </Text>
                <Text style={styles.summaryDate}>{formatDateBR(item.date)}</Text>
              </View>
              <View style={styles.summaryRight}>
                <Text style={styles.summaryCount}>
                  {item.count} servico{item.count > 1 ? 's' : ''}
                </Text>
                <Text style={styles.summaryValue}>
                  {formatCurrency(item.totalValue)}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                Nenhum servico nesta semana
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  weekNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  navBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBtnText: {
    fontSize: 18,
    color: '#374151',
    fontWeight: '700',
  },
  weekLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  weekReturn: {
    fontSize: 12,
    color: PRIMARY,
    textAlign: 'center',
    marginTop: 2,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  daysRow: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    gap: 8,
  },
  dayCard: {
    width: (SCREEN_WIDTH - 24 - 8 * 6) / 7,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    minHeight: 110,
  },
  dayCardToday: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },
  dayWeekday: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
  },
  dayNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginTop: 2,
  },
  textToday: {
    color: '#FFFFFF',
  },
  daySeparator: {
    width: '60%',
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 6,
  },
  countBadge: {
    backgroundColor: '#DCFCE7',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: 2,
  },
  countBadgeToday: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  countBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#166534',
  },
  dayValue: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
  },
  emptyDay: {
    fontSize: 10,
    color: '#D1D5DB',
  },
  summaryList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  summaryLeft: {
    gap: 2,
  },
  summaryRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
  summaryWeekday: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  summaryDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  summaryCount: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '700',
    color: PRIMARY,
  },
  emptyState: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#9CA3AF',
  },
});
