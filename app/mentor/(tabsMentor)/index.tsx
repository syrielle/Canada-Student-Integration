import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { auth, db } from '../../../src/services/firebaseConfig';

type Jumelage = {
  idEtudiant: string;
  idMentor: string;
  statut: string;
  firestoreId: string; // id du doc Firestore
};

type EtudiantEnrichi = Jumelage & {
  nomEtudiant: string;
};

export default function ListeEtudiantsJumeles() {
  const [etudiants, setEtudiants] = useState<EtudiantEnrichi[]>([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.uid) fetchEtudiants(user.uid);
      else setEtudiants([]);
    });
    return () => unsubscribe();
  }, []);

  const fetchEtudiants = async (mentorId: string) => {
    try {
      // ✅ Requête filtrée (compatible avec les règles)
      const q = query(
        collection(db, 'demandesJumelage'),
        where('idMentor', '==', mentorId),
        where('statut', '==', 'valide')
      );
      const snapshot = await getDocs(q);

      const data: Jumelage[] = await Promise.all(
        snapshot.docs.map(async (d) => {
          const j = d.data() as any;
          return { ...j, firestoreId: d.id } as Jumelage;
        })
      );

      const enriched: EtudiantEnrichi[] = await Promise.all(
        data.map(async (j) => {
          const etuSnap = await getDoc(doc(db, 'utilisateurs', j.idEtudiant));
          const etuData: any = etuSnap.exists() ? etuSnap.data() : {};
          return {
            ...j,
            nomEtudiant: etuData?.prenom && etuData?.nom ? `${etuData.prenom} ${etuData.nom}` : 'Inconnu',
          };
        })
      );

      setEtudiants(enriched);
    } catch (err) {
      console.error('Erreur fetchEtudiants :', err);
    }
  };

  const ouvrirChat = (idEtudiant: string, demandeId: string) => {
    router.push({
      pathname: '/mentor/chat/[idEtudiant]',
      params: { idEtudiant, demandeId }, // ✅ on passe aussi la conversation (doc de jumelage)
    });
  };

  const voirParcours = (idEtudiant: string) => {
    router.push({
      pathname: '/mentor/parcours/[idEtudiant]',
      params: { idEtudiant },
    });
  };

  const confirmerFinJumelage = (demandeId: string, nom: string) => {
    Alert.alert(
      'Confirmation',
      `Mettre fin au jumelage avec ${nom} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Confirmer', style: 'destructive', onPress: () => mettreFinJumelage(demandeId) },
      ]
    );
  };

  const mettreFinJumelage = async (demandeId: string) => {
    try {
      await updateDoc(doc(db, 'demandesJumelage', demandeId), { statut: 'terminé' });
      setEtudiants((prev) => prev.filter((e) => e.firestoreId !== demandeId));
    } catch (error) {
      console.error('Erreur fin jumelage :', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mes étudiants jumelés</Text>

      <FlatList
        data={etudiants}
        ListEmptyComponent={<Text style={styles.emptyText}>Aucun jumelage actif pour le moment.</Text>}
        keyExtractor={(item) => item.firestoreId} // ✅ clé unique Firestore
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nom}>{item.nomEtudiant}</Text>
            <View style={styles.actions}>
              <Button title="💬 Chat" onPress={() => ouvrirChat(item.idEtudiant, item.firestoreId)} />
              <Button title="📄 Parcours" onPress={() => voirParcours(item.idEtudiant)} />
              <Button title="❌ Fin" color="red" onPress={() => confirmerFinJumelage(item.firestoreId, item.nomEtudiant)} />
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  emptyText: { fontStyle: 'italic', color: '#666' },
  card: { backgroundColor: '#f2f2f2', padding: 15, borderRadius: 8, marginBottom: 15 },
  nom: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  actions: { gap: 10 },
});
