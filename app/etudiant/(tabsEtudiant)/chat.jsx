import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../../src/services/firebaseConfig';

export default function ChatEtudiantListe() {
  const [items, setItems] = useState([]); // {demandeId, idMentor, nomMentor}
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
      <Text style={styles.title}>Mes discussions</Text>

      <FlatList
        data={items}
        ListEmptyComponent={<Text style={styles.empty}>Aucune discussion.</Text>}
        keyExtractor={(it) => it.demandeId}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push({ pathname: '/etudiant/chatEtudiant', params: { demandeId: item.demandeId } })}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={20} />
            <Text style={styles.nom}>{item.nomMentor}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7', padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  empty: { textAlign: 'center', color: '#999' },
  card: {
    backgroundColor: '#eee', borderRadius: 10, padding: 14, marginBottom: 10,
    flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  nom: { fontSize: 16 },
});
