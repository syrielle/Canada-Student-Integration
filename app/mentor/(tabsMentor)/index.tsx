import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { auth, db } from '../../../src/services/firebaseConfig';

type Jumelage = {
  id: string;
  idEtudiant: string;
  idMentor: string;
  statut: string;
};

export default function ListeEtudiantsJumeles() {
  const [etudiants, setEtudiants] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchEtudiants(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchEtudiants = async (mentorId: string) => {
    try {
      const snapshot = await getDocs(collection(db, 'demandesJumelage'));
      const data = snapshot.docs
        .map(doc => {
          const d = doc.data() as Jumelage;
          return { ...d, firestoreId: doc.id };
        })
        .filter(j => j.idMentor === mentorId && j.statut === 'valide');

      const enriched = await Promise.all(
        data.map(async (j) => {
          const etuSnap = await getDoc(doc(db, 'utilisateurs', j.idEtudiant));
          const etuData = etuSnap.exists() ? etuSnap.data() : {};
          return {
            ...j,
            nomEtudiant: etuData.prenom && etuData.nom ? `${etuData.prenom} ${etuData.nom}` : 'Inconnu',
          };
        })
      );

      setEtudiants(enriched);
    } catch (err) {
      console.error('Erreur fetchEtudiants :', err);
    }
  };

  const ouvrirChat = (idEtudiant: string) => {
    router.push({
      pathname: '/mentor/chat/[idEtudiant]',
      params: { idEtudiant },
    });
  };

  const voirParcours = (idEtudiant: string) => {
    router.push({
      pathname: '/mentor/parcours/[idEtudiant]',
      params: { idEtudiant },
    });
  };

  const confirmerFinJumelage = (id: string, nom: string) => {
    Alert.alert(
      'Confirmation',
      `Mettre fin au jumelage avec ${nom} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          style: 'destructive',
          onPress: () => mettreFinJumelage(id),
        },
      ]
    );
  };

  const mettreFinJumelage = async (id: string) => {
    try {
      await updateDoc(doc(db, 'demandesJumelage', id), { statut: 'terminé' });
      setEtudiants(prev => prev.filter(e => e.id !== id));
    } catch (error) {
      console.error('Erreur fin jumelage :', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mes étudiants jumelés</Text>

      {etudiants.length === 0 ? (
        <Text style={styles.emptyText}>Aucun jumelage actif pour le moment.</Text>
      ) : (
        <FlatList
          data={etudiants}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.nom}>{item.nomEtudiant}</Text>
              <View style={styles.actions}>
                <Button title="💬 Chat" onPress={() => ouvrirChat(item.idEtudiant)} />
                <Button title="📄 Parcours" onPress={() => voirParcours(item.idEtudiant)} />
                <Button title="❌ Fin" color="red" onPress={() => confirmerFinJumelage(item.id, item.nomEtudiant)} />
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  emptyText: { fontStyle: 'italic', color: '#666' },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  nom: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  actions: {
    gap: 10,
  },
});
