import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { auth, db } from '../src/services/firebaseConfig';

export default function Register() {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [confirmMotDePasse, setConfirmMotDePasse] = useState('');
  const [role, setRole] = useState('étudiant');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (!nom || !prenom || !email || !motDePasse || !confirmMotDePasse) {
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
  role,
  estValide: role === 'mentor' ? false : true,
  estConfirme: role === 'mentor' ? false : true,
  estSurLeTerritoire: null, // sera rempli plus tard dans le profil
  etapesCompletes: [],
  mentorID: '',
  profilComplet: false,
  preuveMentorat: '', // ← ce champ est vide au départ, à remplir plus tard
  isAdmin: false,
  isSuperAdmin: false
});


      Alert.alert('Succès', 'Compte créé avec succès !');
      router.push('/');
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', error.message);
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

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Mot de passe"
                value={motDePasse}
                onChangeText={setMotDePasse}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.icon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={20} color="gray" />
              </TouchableOpacity>
            </View>

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirmer le mot de passe"
                value={confirmMotDePasse}
                onChangeText={setConfirmMotDePasse}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                style={styles.icon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons name={showConfirmPassword ? 'eye' : 'eye-off'} size={20} color="gray" />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Type de compte :</Text>
            <View style={styles.roleContainer}>
              <TouchableOpacity
                style={[styles.roleOption, role === 'étudiant' && styles.selected]}
                onPress={() => setRole('étudiant')}
              >
                <Text>Étudiant</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.roleOption, role === 'mentor' && styles.selected]}
                onPress={() => setRole('mentor')}
              >
                <Text>Mentor</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>S'inscrire</Text>
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
    backgroundColor: '#ffffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
    color: '#377DFF',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#fafafa',
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '600',
    color: '#333',
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 25,
  },
  roleOption: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  selected: {
    backgroundColor: '#007bff20',
    borderColor: '#007bff',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fafafa',
  },
  icon: {
    marginLeft: 'auto',
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#377DFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
