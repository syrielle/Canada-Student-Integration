import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../../src/services/firebaseConfig';

export default function ProfilEtudiant() {
  const [utilisateur, setUtilisateur] = useState(null);
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [dateNaissance, setDateNaissance] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [surPlace, setSurPlace] = useState('non');
  const [email, setEmail] = useState('');
  const [chargement, setChargement] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'utilisateurs', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUtilisateur(user);
          setEmail(user.email);  // e-mail affiché mais non modifiable
          setNom(data.nom || '');
          setPrenom(data.prenom || '');
          setTelephone(data.telephone || '');
          setDateNaissance(data.dateNaissance ? new Date(data.dateNaissance) : new Date());
          setSurPlace(data.surPlace || 'non');
        } else {
          Alert.alert("Erreur", "Profil introuvable.");
        }
      }
      setChargement(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSauvegarde = async () => {
    if (!utilisateur) return;

    try {
      await updateDoc(doc(db, 'utilisateurs', utilisateur.uid), {
        nom,
        prenom,
        telephone,
        dateNaissance: dateNaissance.toISOString(),
        surPlace
      });

      Alert.alert("Succès", "Profil mis à jour avec succès !", [
  {
    text: "OK",
    onPress: () => router.replace('/etudiant'), // ou '/etudiant/(tabs)' ou '/etudiant/monParcours' selon ta route
  }
]);
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Échec de la mise à jour.");
    }
  };

  if (chargement) return <Text style={{ padding: 20 }}>Chargement...</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titre}>Modifier mon profil</Text>

      <Text style={styles.label}>Adresse e-mail (non modifiable)</Text>
      <Text style={[styles.input, { backgroundColor: '#f0f0f0' }]}>{email}</Text>

      <Text style={styles.label}>Nom</Text>
      <TextInput style={styles.input} value={nom} onChangeText={setNom} />

      <Text style={styles.label}>Prénom</Text>
      <TextInput style={styles.input} value={prenom} onChangeText={setPrenom} />

      <Text style={styles.label}>Numéro de téléphone</Text>
      <TextInput
        style={styles.input}
        value={telephone}
        onChangeText={setTelephone}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Date de naissance</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
        <Text>{dateNaissance.toLocaleDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={dateNaissance}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDateNaissance(selectedDate);
          }}
        />
      )}

      <Text style={styles.label}>Êtes-vous déjà au Québec ?</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={surPlace}
          onValueChange={(itemValue) => setSurPlace(itemValue)}
        >
          <Picker.Item label="Oui" value="oui" />
          <Picker.Item label="Non" value="non" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.bouton} onPress={handleSauvegarde}>
        <Text style={styles.texteBouton}>Enregistrer</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  titre: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  label: {
    fontWeight: '600',
    marginBottom: 5
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15
  },
  bouton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center'
  },
  texteBouton: {
    color: '#fff',
    fontWeight: 'bold'
  }
});
