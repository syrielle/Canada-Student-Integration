import { useLocalSearchParams } from 'expo-router';
import {
    addDoc,
    collection,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Button, FlatList, Text, TextInput, View } from 'react-native';
import { auth, db } from '../../src/services/firebaseConfig';

export default function ChatEtudiant() {
  const { demandeId } = useLocalSearchParams();
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState('');

  // écoute temps réel
  useEffect(() => {
    if (!demandeId) return;
    const q = query(
      collection(db, 'demandesJumelage', String(demandeId), 'messages'),
      orderBy('createdAt', 'asc')
    );
    const unsub = onSnapshot(q, (snap) => {
      setMsgs(snap.docs.map(d => ({ id: d.id, ...(d.data() || {}) })));
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
        {
          senderId: me,
          text: content,
          createdAt: serverTimestamp(),
          type: 'text',
        }
      );
      setText('');
    } catch (e) {
      console.log('addDoc error:', e?.code, e?.message);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={msgs}
        keyExtractor={(m) => m.id}
        renderItem={({ item }) => (
          <Text
            style={{
              marginVertical: 4,
              alignSelf: item.senderId === auth.currentUser?.uid ? 'flex-end' : 'flex-start',
              backgroundColor: item.senderId === auth.currentUser?.uid ? '#d1e7ff' : '#eee',
              padding: 8,
              borderRadius: 8,
              maxWidth: '80%',
            }}
          >
            {item.text}
          </Text>
        )}
      />

      <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Votre message…"
          style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10 }}
        />
        <Button title="Envoyer" onPress={send} />
      </View>
    </View>
  );
}
