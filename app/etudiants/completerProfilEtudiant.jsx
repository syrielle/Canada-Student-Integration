import { useRouter } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator, Alert, Button, Keyboard, KeyboardAvoidingView,
  Platform,
  ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View
} from 'react-native';
//import { auth, db } from '../src/services/firebaseConfig';
import { auth, db } from '../../src/services/firebaseConfig';


export default function completerProfilEtudiant() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dateNaissance, setDateNaissance] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [dateDeNaissance, setDateDeNaissance] = useState('');
  const [telephone, setTelephone] = useState('');
  const [estSurLeTerritoire, setEstSurLeTerritoire] = useState(false);
  const [email, setEmail] = useState('');
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
        setDateDeNaissance(data.dateDeNaissance || '');
        setTelephone(data.telephone || '');
        setEstSurLeTerritoire(data.estSurLeTerritoire || false);
        setEmail(data.email || user.email);
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const handleSave = async () => {
    if (!nom || !prenom || !dateDeNaissance || !telephone) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires.');
      return;
    }

    const user = auth.currentUser;
    if (!user) return;

    try {
      await updateDoc(doc(db, 'utilisateurs', user.uid), {
        nom,
        prenom,
        dateDeNaissance,
        telephone,
        estSurLeTerritoire,
        profilComplet: true,
        mentorID: role === 'étudiant' ? '' : null,
      });

      Alert.alert('Profil complété',
      'Votre profil a été complété avec succès.',
      [
        {
         text: "Continuer",
      // onPress: (){ 
      //   //router.push('/etudiant/procedure');

      // } // vers ta page d’étapes
        },
      ]);

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
        <ScrollView contentContainerStyle={styles.scroll}>
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
            <TextInput
              style={styles.input}
              placeholder="Date de naissance (AAAA-MM-JJ)"
              value={dateDeNaissance}
              onChangeText={setDateDeNaissance}
            />
            
            
            <TextInput
              style={styles.input}
              placeholder="Téléphone"
              keyboardType="phone-pad"
              value={telephone}
              onChangeText={setTelephone}
            />
            <TextInput
              style={[styles.input, { backgroundColor: '#eee' }]}
              value={email}
              editable={false}
              placeholder="Adresse e-mail"
            />

            <View style={styles.radioGroup}>
              <Text style={{ marginBottom: 10 }}>
                Êtes-vous déjà sur le territoire (au Québec) ?
              </Text>
              <View style={styles.radioContainer}>
                <Button
                  title="Oui"
                  onPress={() => setEstSurLeTerritoire(true)}
                  color={estSurLeTerritoire ? '#4CAF50' : '#aaa'}
                />
                <Button
                  title="Non"
                  onPress={() => setEstSurLeTerritoire(false)}
                  color={!estSurLeTerritoire ? '#F44336' : '#aaa'}
                />
              </View>
            </View>

            <Button title="Enregistrer" onPress={handleSave} />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
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
  radioGroup: {
    marginBottom: 20,
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});
