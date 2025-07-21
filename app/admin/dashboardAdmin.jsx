import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Button, ScrollView, Text, View } from 'react-native';
import { db } from '../../src/services/firebaseConfig';

export default function DashboardAdmin() {
  const [mentors, setMentors] = useState([]);

  useEffect(() => {
    const fetchMentors = async () => {
      const q = query(collection(db, 'utilisateurs'), where('role', '==', 'mentor'), where('estValide', '==', false));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMentors(data);
    };

    fetchMentors();
  }, []);

  const validerCompte = async (id) => {
    await updateDoc(doc(db, 'utilisateurs', id), { estValide: true });
    setMentors(prev => prev.filter(m => m.id !== id));
  };

  return (
    <ScrollView>
      <Text style={{ fontSize: 20, fontWeight: 'bold', margin: 10 }}>Mentors en attente de validation :</Text>
      {mentors.length === 0 ? (
        <Text style={{ marginLeft: 10 }}>Aucun mentor à valider.</Text>
      ) : (
        mentors.map((mentor) => (
          <View key={mentor.id} style={{ margin: 10, padding: 10, borderWidth: 1, borderRadius: 5 }}>
            <Text>Nom : {mentor.nom}</Text>
            <Text>Email : {mentor.email}</Text>
            <Button title="Valider ce compte" onPress={() => validerCompte(mentor.id)} />
          </View>
        ))
      )}
    </ScrollView>
  );
}
