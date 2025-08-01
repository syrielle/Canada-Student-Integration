import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { db } from '../../src/services/firebaseConfig';

export default function DashboardAdmin() {
  const [mentors, setMentors] = useState([]);
  const [jumelages, setJumelages] = useState([]);

  useEffect(() => {
    fetchMentors();
    fetchJumelages();
  }, []);

  const fetchMentors = async () => {
    const snapshot = await getDocs(collection(db, 'utilisateurs'));
    const data = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(u => u.role === 'mentor' && u.estValide === false);
    setMentors(data);
  };

  const fetchJumelages = async () => {
    const snapshot = await getDocs(collection(db, 'jumelages'));
    const data = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(j => j.status === 'en attente');
    setJumelages(data);
  };

  const validerMentor = async (id) => {
    await updateDoc(doc(db, 'utilisateurs', id), { estValide: true });
    fetchMentors();
  };

  const validerJumelage = async (id) => {
    await updateDoc(doc(db, 'jumelages', id), { status: 'valide' });
    fetchJumelages();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tableau de bord admin</Text>

      <Text style={styles.section}>Mentors en attente de validation :</Text>
      {mentors.length === 0 ? (
        <Text>Aucun mentor à valider.</Text>
      ) : (
        <FlatList
          data={mentors}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text>{item.nom} {item.prenom} ({item.email})</Text>
              <Button title="Valider" onPress={() => validerMentor(item.id)} />
            </View>
          )}
        />
      )}

      <Text style={styles.section}>Demandes de jumelage en attente :</Text>
      {jumelages.length === 0 ? (
        <Text>Aucun jumelage en attente.</Text>
      ) : (
        <FlatList
          data={jumelages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text>Étudiant : {item.idEtudiant}</Text>
              <Text>Mentor : {item.idMentor}</Text>
              <Button title="Valider" onPress={() => validerJumelage(item.id)} />
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  section: { fontSize: 18, marginTop: 20, fontWeight: 'bold' },
  item: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5
  }
});
