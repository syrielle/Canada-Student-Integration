import { Picker } from '@react-native-picker/picker';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { auth, db } from '../services/firebaseConfig';

const RegisterScreen = ({ navigation }) => {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [confirmMotDePasse, setConfirmMotDePasse] = useState('');
  const [role, setRole] = useState('');

  const handleRegister = async () => {
    if (!nom || !prenom || !email || !motDePasse || !confirmMotDePasse || !role) {
      Alert.alert('Erreur', 'Tous les champs sont obligatoires.');
      return;
    }

    if (motDePasse !== confirmMotDePasse) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, motDePasse);
      const user = userCredential.user;

      await setDoc(doc(db, 'utilisateurs', user.uid), {
        nom,
        prenom,
        email,
        role
      });

      Alert.alert('Succès', 'Compte créé avec succès !');
      navigation.navigate('Home');
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
        placeholder="Prénom"
        value={prenom}
        onChangeText={setPrenom}
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

      <TextInput
        style={styles.input}
        placeholder="Confirmer mot de passe"
        value={confirmMotDePasse}
        onChangeText={setConfirmMotDePasse}
        secureTextEntry
      />

      <Picker
        selectedValue={role}
        onValueChange={(itemValue) => setRole(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="-- Sélectionner un rôle --" value="" />
        <Picker.Item label="Étudiant" value="étudiant" />
        <Picker.Item label="Mentor" value="mentor" />
      </Picker>

      <Button title="S'inscrire" onPress={handleRegister} />
    </View>
  );
};

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
  picker: {
    height: 50,
    marginBottom: 20
  }
});

export default RegisterScreen;
