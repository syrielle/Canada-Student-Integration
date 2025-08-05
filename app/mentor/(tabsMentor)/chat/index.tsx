import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../../../src/services/firebaseConfig';

type Conversation = {
  demandeId: string;     // id du doc "demandesJumelage"
  idEtudiant: string;
  nomEtudiant: string;
};

export default function ListeConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user?.uid) fetchConversations(user.uid);
      else setConversations([]);
    });
    return () => unsub();
  }, []);

  const fetchConversations = async (mentorId: string) => {
    try {
      // ✅ On lit UNIQUEMENT les demandes où le mentor est le courant et statut valide
      const q = query(
        collection(db, 'demandesJumelage'),
        where('idMentor', '==', mentorId),
        where('statut', '==', 'valide')
      );
      const snap = await getDocs(q);

      const demandes = snap.docs.map((d) => ({ firestoreId: d.id, ...(d.data() as any) }));

      const enriched: Conversation[] = await Promise.all(
        demandes.map(async (j) => {
          const etuSnap = await getDoc(doc(db, 'utilisateurs', j.idEtudiant));
          const etu = etuSnap.exists() ? (etuSnap.data() as any) : null;
          return {
            demandeId: j.firestoreId,
            idEtudiant: j.idEtudiant,
            nomEtudiant: etu?.prenom && etu?.nom ? `${etu.prenom} ${etu.nom}` : 'Étudiant',
          };
        })
      );

      setConversations(enriched);
    } catch (e) {
      console.error('Erreur chargement conversations :', e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mes discussions</Text>

      <FlatList
        data={conversations}
        ListEmptyComponent={<Text style={styles.emptyText}>Aucune discussion active.</Text>}
        keyExtractor={(item) => item.demandeId} // ✅ clé unique et stable
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatCard}
            onPress={() =>
              router.push({
                pathname: '/mentor/chat/[idEtudiant]',
                params: { idEtudiant: item.idEtudiant, demandeId: item.demandeId },
              })
            }
          >
            <Text style={styles.nom}>{item.nomEtudiant}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Bouton flottant vers le jumelage */}
      <TouchableOpacity
        onPress={() => router.push('../jumelageEtudiants')}
        style={styles.floatingButton}
      >
        <Ionicons name="person-add" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7', padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  emptyText: { textAlign: 'center', color: '#999' },
  chatCard: { padding: 15, borderRadius: 10, backgroundColor: '#eee', marginBottom: 10 },
  nom: { fontSize: 16 },
  floatingButton: {
    position: 'absolute', bottom: 30, right: 30, backgroundColor: '#007AFF',
    borderRadius: 50, padding: 16, elevation: 5, shadowColor: '#000',
    shadowOpacity: 0.3, shadowOffset: { width: 0, height: 2 }, shadowRadius: 3,
  },
});
