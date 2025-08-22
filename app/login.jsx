import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useState } from 'react';

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput, TouchableOpacity, View
} from 'react-native';
import { auth, db } from '../src/services/firebaseConfig';

export default function Login() {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !motDePasse) {
      Alert.alert('Erreur', 'Tous les champs sont obligatoires.');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, motDePasse);
      const user = userCredential.user;

      const userDocRef = doc(db, 'utilisateurs', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        Alert.alert('Erreur', 'Profil utilisateur introuvable.');
        return;
      }

      const userData = userDocSnap.data();

      if (userData.isSuperAdmin) {
        router.replace('/admin/dashboardSuperAdmin');
      } else if (userData.isAdmin) {
        router.replace('/admin/dashboardAdmin');
      } else if (userData.role === 'mentor') {
        if (!userData.estValide) {
          Alert.alert('Compte en attente', 'Votre compte de mentor doit être validé par un administrateur.');
          return;
        }
        if (!userData.profilComplet) {
          router.replace('/completerProfil');
          return;
        }
        router.replace('/mentor/');
      } else if (userData.role === 'étudiant') {
        if (!userData.profilComplet) {
          router.replace('etudiant/completerProfilEtudiant');
          return;
        }
        router.replace('/etudiant');
      } else {
        Alert.alert('Erreur', 'Rôle utilisateur non reconnu.');
      }
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/user-not-found') {
        Alert.alert('Erreur', 'Aucun compte trouvé avec cet e-mail.');
      } else if (error.code === 'auth/wrong-password') {
        Alert.alert('Erreur', 'Mot de passe incorrect.');
      } else {
        Alert.alert('Erreur', error.message);
      }
    }
  };

  return (
  <View style={{ flex: 1 }}>
    <TouchableOpacity
      onPress={() => router.replace('/')}style={{ position: 'absolute', top: 40, left: 20, zIndex: 10 }}>
      <Ionicons name="arrow-back" size={24} color="black" />
    </TouchableOpacity>
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={100}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Connexion</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Mot de passe"
              value={motDePasse}
              onChangeText={setMotDePasse}
              secureTextEntry={!showPassword}
            />
            <Feather
              name={showPassword ? 'eye' : 'eye-off'}
              size={20}
              onPress={() => setShowPassword(!showPassword)}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Se connecter</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  </View>


  );
}

const styles = StyleSheet.create({

    scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#E6F0FF', // fond doux
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
    marginBottom: 25,
    textAlign: 'center',
    color: '#377DFF',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 5,
    paddingRight: 10,
    marginBottom: 15
  },
  passwordInput: {
    flex: 1,
    padding: 10
  },
  button: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});
