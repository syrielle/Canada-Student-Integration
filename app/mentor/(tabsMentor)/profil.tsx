import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../../src/services/firebaseConfig';

export default function ProfilMentor() {
  const router = useRouter();
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [dateNaissance, setDateNaissance] = useState('');
  const [surPlace, setSurPlace] = useState('oui'); // ou 'non'
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const chargerProfil = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userDoc = await getDoc(doc(db, 'utilisateurs', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setNom(data.nom || '');
        setPrenom(data.prenom || '');
        setTelephone(data.telephone || '');
        setDateNaissance(data.dateNaissance || '');
        setSurPlace(data.surPlace || 'oui');
      }
    };

    chargerProfil();
  }, []);
   const doSignOut = async () => {
     try {
       setLoading(true);
       await signOut(auth);
       router.replace('/');
     } catch (error) {
       console.error('Erreur lors de la déconnexion', error);
       setLoading(false);
     }
   };

  const handleSauvegarde = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await updateDoc(doc(db, 'utilisateurs', user.uid), {
        nom,
        prenom,
        telephone,
        dateNaissance,
        surPlace
      });

      Alert.alert("Succès", "Profil mis à jour avec succès", [
        { text: "OK", onPress: () => router.replace('/mentor') } // retourne à l'accueil mentor
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Impossible de mettre à jour le profil.");
    }
  };

  return (
    <View style={styles.container}>
            <Text style={styles.titre}>Modifier mon profil</Text>

      <Text style={styles.label}>Nom</Text>
      <TextInput style={styles.input} value={nom} onChangeText={setNom} />

      <Text style={styles.label}>Prénom</Text>
      <TextInput style={styles.input} value={prenom} onChangeText={setPrenom} />

      <Text style={styles.label}>Téléphone</Text>
      <TextInput style={styles.input} value={telephone} onChangeText={setTelephone} keyboardType="phone-pad" />

      <Text style={styles.label}>Date de naissance</Text>
      <TextInput style={styles.input} value={dateNaissance} onChangeText={setDateNaissance} placeholder="YYYY-MM-DD" />

     
      <TouchableOpacity style={styles.button} onPress={handleSauvegarde}>
        <Text style={styles.buttonText}>Enregistrer</Text>
      </TouchableOpacity>
      {/* Bouton Déconnexion */}
      <TouchableOpacity style={styles.logoutButton} onPress={doSignOut}>
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 5,
    marginBottom: 15,
    padding: 10
  },
  radioContainer: {
    flexDirection: 'row',
    marginBottom: 20
  },
  radio: {
    marginRight: 20,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5
  },
  radioSelected: {
    backgroundColor: '#007bff',
    color: '#fff'
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold'
  },
titre: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  footerText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666'
  },
    texteBouton: { color: '#fff', fontWeight: '900', fontSize: 17 },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#ff4d4d',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },

});
