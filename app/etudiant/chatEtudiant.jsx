// app/etudiant/chatEtudiant.jsx
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../src/services/firebaseConfig';

const BG = '#EAF3FF';
const BLUE = '#CFEFFF';   // bulles envoyées
const GREEN = '#E6F8EA';  // bulles reçues

export default function ChatEtudiant() {
  const { demandeId, nom = 'Discussion' } = useLocalSearchParams();
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState('');
  const listRef = useRef(null);

  // écoute temps réel (inchangé)
  useEffect(() => {
    if (!demandeId) return;
    const q = query(
      collection(db, 'demandesJumelage', String(demandeId), 'messages'),
      orderBy('createdAt', 'asc')
    );
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...(d.data() || {}) }));
      setMsgs(data);
      // auto-scroll en bas
      requestAnimationFrame(() => listRef.current?.scrollToEnd?.({ animated: true }));
    });
    return unsub;
  }, [demandeId]);

  const send = async () => {
    const me = auth.currentUser?.uid;
    const content = text.trim();
    if (!me || !content || !demandeId) return;

    try {
      await addDoc(
        collection(db, 'demandesJumelage', String(demandeId), 'messages'),
        { senderId: me, text: content, createdAt: serverTimestamp(), type: 'text' }
      );
      setText('');
    } catch (e) {
      console.log('addDoc error:', e?.code, e?.message);
    }
  };

  const renderItem = ({ item }) => {
    const isMine = item.senderId === auth.currentUser?.uid;
    return (
      <View style={[styles.row, isMine ? styles.rowMine : styles.rowTheirs]}>
        <View style={[styles.bubble, isMine ? styles.bubbleMine : styles.bubbleTheirs]}>
          <Text style={styles.bubbleText}>{item.text}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{ title: String(nom), headerTitleAlign: 'center' }}
      />

      <FlatList
        ref={listRef}
        data={msgs}
        keyExtractor={(m) => m.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 96 }}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.inputBar}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Votre message…"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          onSubmitEditing={send}
          returnKeyType="send"
        />
        <TouchableOpacity onPress={send} activeOpacity={0.7} style={styles.sendBtn}>
          <Ionicons name="send" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  row: { flexDirection: 'row', marginBottom: 10, paddingHorizontal: 16 },
  rowMine: { justifyContent: 'flex-end' },
  rowTheirs: { justifyContent: 'flex-start' },
  bubble: {
    maxWidth: '78%',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
  },
  bubbleMine: {
    backgroundColor: BLUE,
    borderTopRightRadius: 6,
  },
  bubbleTheirs: {
    backgroundColor: GREEN,
    borderTopLeftRadius: 6,
  },
  bubbleText: { color: '#111827' },

  inputBar: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    paddingLeft: 14,
    paddingRight: 8,
    minHeight: 46,
  },
  input: { flex: 1, paddingVertical: 10, color: '#111827' },
  sendBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
    marginLeft: 8,
  },
});
