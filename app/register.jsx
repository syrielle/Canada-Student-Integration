import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../src/services/firebaseConfig';

export default function Register() {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [role, setRole] = useState('étudiant');
  const router = useRouter();

  const handleRegister = async () => {
    if (!nom || !email || !motDePasse) {
      Alert.alert('Erreur', 'Tous les champs sont obligatoires.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, motDePasse);
      const user = userCredential.user;

      await setDoc(doc(db, 'utilisateurs', user.uid), {
        nom: nom,
        email: email,
        role: role,
        estValide: role === 'mentor' ? false : true
      });

      Alert.alert('Succès', 'Compte créé avec succès !');
      router.push('/'); // Redirige vers l'accueil ou une autre page

    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créer un compte</Text>

      <TextInput
        style={styles.input}
        placeholder="Nom"
        value={nom}
        onChangeText={setNom}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={motDePasse}
        onChangeText={setMotDePasse}
        secureTextEntry
      />

      <Text style={styles.label}>Type de compte :</Text>
      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={[
            styles.roleOption,
            role === 'étudiant' && styles.selected
          ]}
          onPress={() => setRole('étudiant')}
        >
          <Text>Étudiant</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.roleOption,
            role === 'mentor' && styles.selected
          ]}
          onPress={() => setRole('mentor')}
        >
          <Text>Mentor</Text>
        </TouchableOpacity>
      </View>

      <Button title="S'inscrire" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20
  },
  title: {
    fontSize: 24,
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
  label: {
    fontSize: 16,
    marginBottom: 8
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20
  },
  roleOption: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 5
  },
  selected: {
    backgroundColor: '#cce5ff'
  }
});
