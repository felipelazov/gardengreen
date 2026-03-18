import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useClientNotes, useCreateNote } from '@/hooks/useClients';
import { useAuthStore } from '@/stores/authStore';
import type { NoteModel } from '@/database/models/Note';

// ─── Note Item ─────────────────────────────────────────────────────────────────

function NoteItem({ note }: { note: NoteModel }) {
  function formatDate(date: Date): string {
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  return (
    <View
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 1 },
        elevation: 1,
      }}
    >
      <Text style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 6 }}>
        {formatDate(note.createdAt)}
      </Text>
      <Text style={{ fontSize: 15, color: '#111827', lineHeight: 22 }}>{note.content}</Text>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ClientNotesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const user = useAuthStore((s) => s.user);

  const { notes, loading } = useClientNotes(id ?? '');
  const { createNote, loading: saving } = useCreateNote();

  const [noteText, setNoteText] = useState('');

  async function handleSave() {
    const trimmed = noteText.trim();
    if (!trimmed) return;

    try {
      await createNote({
        clientId: id!,
        userId: user!.id,
        content: trimmed,
      });
      setNoteText('');
    } catch {
      Alert.alert('Erro', 'Nao foi possivel salvar a nota. Tente novamente.');
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F0FDF4' }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 14,
          borderBottomWidth: 1,
          borderBottomColor: '#E5E7EB',
          backgroundColor: '#FFFFFF',
        }}
      >
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={{ padding: 4 }}>
          <Text style={{ fontSize: 18, color: '#16A34A' }}>← Voltar</Text>
        </TouchableOpacity>
        <Text
          style={{
            flex: 1,
            textAlign: 'center',
            fontSize: 17,
            fontWeight: '700',
            color: '#14532D',
          }}
        >
          Notas do Cliente
        </Text>
        <View style={{ width: 72 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        {/* Notes list */}
        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#16A34A" />
          </View>
        ) : (
          <FlatList
            data={notes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <NoteItem note={item} />}
            contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={{ alignItems: 'center', paddingTop: 60 }}>
                <Text style={{ fontSize: 40, marginBottom: 12 }}>📝</Text>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151' }}>
                  Nenhuma nota ainda
                </Text>
                <Text style={{ fontSize: 14, color: '#9CA3AF', marginTop: 6, textAlign: 'center' }}>
                  Adicione observacoes importantes sobre este cliente
                </Text>
              </View>
            }
          />
        )}

        {/* Add note input */}
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: '#E5E7EB',
            padding: 12,
          }}
        >
          <TextInput
            value={noteText}
            onChangeText={setNoteText}
            placeholder="Escreva uma nota sobre este cliente..."
            placeholderTextColor="#9CA3AF"
            style={{
              backgroundColor: '#F9FAFB',
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#E5E7EB',
              paddingHorizontal: 14,
              paddingVertical: 10,
              fontSize: 15,
              color: '#111827',
              minHeight: 48,
              maxHeight: 120,
              textAlignVertical: 'top',
              marginBottom: 10,
            }}
            multiline
            returnKeyType="done"
            blurOnSubmit
          />

          <TouchableOpacity
            onPress={handleSave}
            disabled={saving || !noteText.trim()}
            activeOpacity={0.8}
            style={{
              backgroundColor:
                saving || !noteText.trim() ? '#86EFAC' : '#16A34A',
              borderRadius: 10,
              paddingVertical: 13,
              alignItems: 'center',
            }}
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#FFFFFF' }}>Salvar Nota</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
