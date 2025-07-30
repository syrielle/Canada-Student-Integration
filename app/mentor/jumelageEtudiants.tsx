import { Ionicons } from '@expo/vector-icons';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../src/services/firebaseConfig';

export default function JumelageEtudiants() {
const [etudiants, setEtudiants] = useState<Etudiant[]>([]);
  const [loading, setLoading] = useState(true);
  type Etudiant = {
  id: string;
  idEtudiant: string;
  nom: string;
  prenom: string;
};
const [demandesEnvoyees, setDemandesEnvoyees] = useState<string[]>([]);

const liste: Etudiant[] = [];
const idMentor = auth.currentUser?.uid;

if (!idMentor) {
  Alert.alert("Erreur", "Mentor non authentifié");
  return;
}


  const fetchEtudiants = async () => {
    try {
      const q = query(
        collection(db, 'utilisateurs'),
        where('role', '==', 'étudiant'),
        where('profilComplet', '==', true)
      );

      const querySnapshot = await getDocs(q);
      

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data() as Omit<Etudiant, "id">; // on suppose que Firestore contient nom et prenom
        liste.push({ id: docSnap.id, ...data });
     });


      setEtudiants(liste);
      setLoading(false);
    } catch (error) {
      console.error('Erreur de chargement des étudiants :', error);
      setLoading(false);
    }
  };
const proposerJumelage = async (idEtudiant: string) => {
  try {
    const idMentor = auth.currentUser?.uid;
    if (!idMentor) throw new Error("Mentor non authentifié");

    await addDoc(collection(db, 'demandesJumelage'), {
      idMentor,
      idEtudiant,
      statut: 'en_attente',
      dateDemande: new Date(),
    });

    // Marquer l’étudiant comme ayant reçu une demande
    setDemandesEnvoyees((prev) => [...prev, idEtudiant]);

    Alert.alert('Demande envoyée', 'Votre demande de jumelage a été soumise à l’administrateur.');
  } catch (error) {
    console.error("Erreur lors de la demande de jumelage :", error);
    Alert.alert('Erreur', "Impossible de proposer un jumelage.");
  }
};


  useEffect(() => {
    fetchEtudiants();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Chargement des étudiants...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Étudiants disponibles</Text>

      <FlatList
        data={etudiants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nom}>{item.prenom} {item.nom}</Text>
            <TouchableOpacity
                style={[
                  styles.bouton,
                  demandesEnvoyees.includes(item.id) && { backgroundColor: 'gray' }
                ]}
                disabled={demandesEnvoyees.includes(item.id)}
                onPress={() => proposerJumelage(item.id)}
              >
                <Ionicons name="person-add" size={20} color="white" />
                <Text style={styles.boutonText}>
                  {demandesEnvoyees.includes(item.id) ? "Demande de jumelage envoyée" : "Proposer un jumelage"}
                </Text>
            </TouchableOpacity>

          </View>
        )}
        ListEmptyComponent={<Text>Aucun étudiant disponible pour l’instant.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f7f7f7' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 3,
  },
  nom: { fontSize: 16, marginBottom: 8 },
  bouton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  boutonText: { color: 'white', marginLeft: 6 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
