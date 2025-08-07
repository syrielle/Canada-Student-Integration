import { useLocalSearchParams } from 'expo-router';
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../../../src/services/firebaseConfig.js';


// On utilise firestoreId pour l'id Firestore du message (évite le conflit "id" en double)
type Msg = {
  firestoreId: string;
  senderId: string;
  text: string;
  createdAt?: any;
  type?: 'text';
};

export default function ChatEtudiant() {
  const { idEtudiant, demandeId } = useLocalSearchParams<{
    idEtudiant: string;
    demandeId: string;
  }>();

  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState('');

  // Debug visible + console
  useEffect(() => {
    console.log('params -> idEtudiant:', idEtudiant, 'demandeId:', demandeId);
  }, [idEtudiant, demandeId]);

  // Écoute temps réel
  useEffect(() => {
    if (!demandeId) return; // Pas de demandeId -> pas d'écoute
    const q = query(
      collection(db, 'demandesJumelage', String(demandeId), 'messages'),
      orderBy('createdAt', 'asc')
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const items: Msg[] = snap.docs.map((d) => {
          const data = d.data() as Omit<Msg, 'firestoreId'>;
          return { firestoreId: d.id, ...data };
        });
        setMsgs(items);
      },
      (err) => {
        console.log('onSnapshot error:', err?.code, err?.message);
      }
    );
    return unsub;
  }, [demandeId]);

  const send = async () => {
    console.log('send clicked');
    const me = auth.currentUser?.uid;
    if (!me || !text.trim() || !demandeId) {
      console.log('send blocked ->', { me, text, demandeId });
      return;
    }

    try {
      await addDoc(
        collection(db, 'demandesJumelage', String(demandeId), 'messages'),
        {
          senderId: me,
          text: text.trim(),
          createdAt: serverTimestamp(),
          type: 'text',
        }
      );
      setText('');
    } catch (e: any) {
      console.log('addDoc error:', e?.code, e?.message);
      Alert.alert('Envoi impossible', e?.message ?? 'Erreur inconnue');
    } 
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {/* Debug visible : retire cette ligne quand tout marche */}
      {/* <Text style={{ color: 'grey', marginBottom: 8 }}>
        demandeId: {String(demandeId || '')}
      </Text> */}

      <FlatList
        data={msgs}
        keyExtractor={(m) => m.firestoreId}
        renderItem={({ item }) => (
          <Text
            style={{
              marginVertical: 4,
              alignSelf:
                item.senderId === auth.currentUser?.uid ? 'flex-end' : 'flex-start',
              backgroundColor:
                item.senderId === auth.currentUser?.uid ? '#d1e7ff' : '#eee',
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
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            padding: 10,
          }}
        />
        <TouchableOpacity
          onPress={send}
          style={{
            backgroundColor: '#007AFF',
            paddingHorizontal: 16,
            justifyContent: 'center',
            borderRadius: 8,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Envoyer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
