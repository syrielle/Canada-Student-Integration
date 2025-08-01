import {
    collection,
    doc,
    getDoc,
    getDocs,
    updateDoc
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Alert, Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { db } from '../../src/services/firebaseConfig';

export default function ValidationJumelages() {
  const [jumelages, setJumelages] = useState([]);

  useEffect(() => {
    const fetchJumelages = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'demandesJumelage'));
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const enAttente = data.filter(j => j.statut === 'en_attente');

        const enriched = await Promise.all(
          enAttente.map(async (j) => {
            let nomEtudiant = 'Étudiant inconnu';
            let nomMentor = 'Mentor inconnu';

            try {
              const etudiantSnap = await getDoc(doc(db, 'utilisateurs', j.idEtudiant));
              if (etudiantSnap.exists()) {
                const d = etudiantSnap.data();
                nomEtudiant = `${d.prenom} ${d.nom}`;
              }

              const mentorSnap = await getDoc(doc(db, 'utilisateurs', j.idMentor));
              if (mentorSnap.exists()) {
                const d = mentorSnap.data();
                nomMentor = `${d.prenom} ${d.nom}`;
              }
            } catch (e) {
              console.error("Erreur lors de la récupération des utilisateurs :", e);
            }

            return {
              ...j,
              nomEtudiant,
              nomMentor
            };
          })
        );

        setJumelages(enriched);
      } catch (error) {
        console.error('Erreur lors du chargement des jumelages :', error);
      }
    };

    fetchJumelages();
  }, []);

  const valider = async (id) => {
    try {
      await updateDoc(doc(db, 'demandesJumelage', id), { statut: 'valide' });
      setJumelages(prev => prev.filter(j => j.id !== id));
    } catch (error) {
      console.error('Erreur lors de la validation :', error);
    }
  };

  const refuser = async (id) => {
    try {
      await updateDoc(doc(db, 'demandesJumelage', id), { statut: 'refusé' });
      setJumelages(prev => prev.filter(j => j.id !== id));
    } catch (error) {
      console.error('Erreur lors du refus :', error);
    }
  };

  const confirmerValidation = (item) => {
    Alert.alert(
      'Confirmation',
      `Valider le jumelage entre ${item.nomEtudiant} et ${item.nomMentor} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Valider', onPress: () => valider(item.id) }
      ]
    );
  };

  const confirmerRefus = (item) => {
    Alert.alert(
      'Confirmation',
      `Refuser le jumelage entre ${item.nomEtudiant} et ${item.nomMentor} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Refuser', onPress: () => refuser(item.id), style: 'destructive' }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Validation des demandes de jumelage</Text>

      {jumelages.length === 0 ? (
        <Text style={styles.emptyText}>Aucune demande de jumelage en attente.</Text>
      ) : (
        <FlatList
          data={jumelages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.label}>Étudiant : {item.nomEtudiant}</Text>
              <Text style={styles.label}>Mentor : {item.nomMentor}</Text>
              <View style={styles.actions}>
                <Button title="Valider" onPress={() => confirmerValidation(item)} />
                <View style={{ width: 10 }} />
                <Button title="Refuser" color="red" onPress={() => confirmerRefus(item)} />
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
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  emptyText: { fontStyle: 'italic', color: '#666' },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10
  },
  actions: {
    flexDirection: 'row',
    marginTop: 10
  },
  label: {
    fontSize: 16,
    marginBottom: 5
  }
});
