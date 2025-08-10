import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../../src/services/firebaseConfig';

export default function ChatEtudiantListe() {
  const [items, setItems] = useState([]); 
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user?.uid) fetchConversations(user.uid);
      else setItems([]);
    });
    return () => unsub();
  }, []);

  const fetchConversations = async (etudiantId) => {
    try {
      const q = query(
        collection(db, 'demandesJumelage'),
        where('idEtudiant', '==', etudiantId),
        where('statut', '==', 'valide')
      );
      const snap = await getDocs(q);

      const demandes = snap.docs.map(d => ({ firestoreId: d.id, ...(d.data() || {}) }));

      const enriched = await Promise.all(
        demandes.map(async (j) => {
          const mentorSnap = await getDoc(doc(db, 'utilisateurs', j.idMentor));
          const m = mentorSnap.exists() ? mentorSnap.data() : null;
          return {
            demandeId: j.firestoreId,
            idMentor: j.idMentor,
            nomMentor: m?.prenom && m?.nom ? `${m.prenom} ${m.nom}` : 'Mentor',
          };
        })
      );

      setItems(enriched);
    } catch (e) {
      console.log('Erreur fetchConversations étudiant :', e?.code, e?.message);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Mes discussions',
          headerTitleAlign: 'center',
        }}
      />

      <FlatList
        data={items}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Ionicons name="chatbubbles-outline" size={28} color="#6B7280" />
            <Text style={styles.empty}>Aucune discussion…</Text>
          </View>
        }
        keyExtractor={(it) => it.demandeId}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => router.push({ pathname: '/etudiant/chatEtudiant', params: { demandeId: item.demandeId, nom: item.nomMentor } })}
          >
            <View style={styles.avatar}>
              <Ionicons name="person" size={20} color="#1F2937" />
            </View>
            <View style={styles.info}>
              <Text style={styles.nom}>{item.nomMentor}</Text>
              <Text style={styles.preview}>Dernier message…</Text>
            </View>
            <Text style={styles.time}>10:30</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const BG = '#EAF3FF';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG, padding: 16 },
  emptyWrap: { marginTop: 24, alignItems: 'center', gap: 8 },
  empty: { color: '#6B7280' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  info: { flex: 1 },
  nom: { fontWeight: '700', color: '#111827', fontSize: 16 },
  preview: { color: '#6B7280', fontSize: 14 },
  time: { fontSize: 12, color: '#9CA3AF' },
});
