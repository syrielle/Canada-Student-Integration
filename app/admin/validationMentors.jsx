// app/admin/validationMentors.jsx
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Alert, Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { db } from '../../src/services/firebaseConfig';

export default function ValidationMentors() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMentors = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'utilisateurs'));
      const pendingMentors = [];

      querySnapshot.forEach(docSnap => {
        const data = docSnap.data();
        if (data.role === 'mentor' && data.estValide === false) {
          pendingMentors.push({ id: docSnap.id, ...data });
        }
      });

      setMentors(pendingMentors);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des mentors :', error);
      Alert.alert('Erreur', 'Impossible de charger les mentors.');
    }
  };

  const validerMentor = async (mentorId) => {
    try {
      const userRef = doc(db, 'utilisateurs', mentorId);
      await updateDoc(userRef, { estValide: true });

      Alert.alert('Succès', 'Mentor validé avec succès.');
      fetchMentors(); // refresh list
    } catch (error) {
      console.error('Erreur validation :', error);
      Alert.alert('Erreur', "Impossible de valider ce mentor.");
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Validation des mentors</Text>

      {loading ? (
        <Text>Chargement...</Text>
      ) : mentors.length === 0 ? (
        <Text>Aucun mentor à valider</Text>
      ) : (
        <FlatList
          data={mentors}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.nom} {item.prenom}</Text>
              <Text>Email : {item.email}</Text>
              <Button
                title="Valider"
                onPress={() => validerMentor(item.id)}
              />
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20
  },
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold'
  }
});
