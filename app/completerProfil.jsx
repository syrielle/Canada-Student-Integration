import { useRouter } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator, Alert, Button, Keyboard, KeyboardAvoidingView,
  Platform,
  ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View
} from 'react-native';
import { auth, db } from '../src/services/firebaseConfig';

export default function CompleterProfil() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const docRef = doc(db, 'utilisateurs', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setRole(data.role || (data.isAdmin ? 'admin' : data.isSuperAdmin ? 'superAdmin' : null));
        setNom(data.nom || '');
        setPrenom(data.prenom || '');
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const handleSave = async () => {
    if (!nom || !prenom) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    const user = auth.currentUser;
    if (!user) return;

    try {
      await updateDoc(doc(db, 'utilisateurs', user.uid), {
        nom,
        prenom,
        profilComplet: true
      });

      Alert.alert('Succès', 'Profil complété avec succès.');

      // Redirection selon le rôle
      if (role === 'étudiant') {
        router.replace('/etudiant/dashboardEtudiant');
      } else if (role === 'mentor') {
        router.replace('/mentor/dashboardMentor');
      } else if (role === 'admin') {
        router.replace('/admin/dashboardAdmin');
      } else if (role === 'superAdmin') {
        router.replace('/admin/dashboardSuperAdmin');
      } else {
        router.replace('/');
      }

    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', "Une erreur est survenue lors de l'enregistrement.");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  style={{ flex: 1 }}
>
  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <ScrollView contentContainerStyle={{
  flexGrow: 1,
  justifyContent: 'center',
  padding: 20,
}}>
      <View style={styles.container}>
        <Text style={styles.title}>Compléter votre profil</Text>

        <TextInput
          style={styles.input}
          placeholder="Nom"
          value={nom}
          onChangeText={setNom}
        />
        <TextInput
          style={styles.input}
          placeholder="Prénom"
          value={prenom}
          onChangeText={setPrenom}
        />

        <Button title="Enregistrer" onPress={handleSave} />
      </View>

    </ScrollView>
  </TouchableWithoutFeedback>
</KeyboardAvoidingView> 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20
  },
  center: {
    flex: 1,
    justifyContent: 'center'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5
  },
  
});
