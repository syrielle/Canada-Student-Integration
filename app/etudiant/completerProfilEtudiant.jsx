import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { doc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { Alert, Button, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../src/services/firebaseConfig';

export default function completerProfilEtudiant() {
  const router = useRouter();
  const user = auth.currentUser;

  const [nomComplet, setNomComplet] = useState('');
  const [pays, setPays] = useState('');
  const [typeEtudiant, setTypeEtudiant] = useState('');
  const [objectifVoyage, setObjectifVoyage] = useState('');
  const [programme, setProgramme] = useState('');
  const [ecole, setEcole] = useState('');
  const [image, setImage] = useState(null);

  const choisirImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission requise', 'Autorisez l’accès à la galerie.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!nomComplet || !pays || !typeEtudiant || !objectifVoyage || !programme) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires.');
      return;
    }

    try {
      const userRef = doc(db, 'utilisateurs', user.uid);
      await updateDoc(userRef, {
        nomComplet,
        pays,
        typeEtudiant,
        objectifVoyage,
        programme,
        ecole,
        imageProfil: image || '',
        profilComplet: true
      });

      router.replace('/etudiant/dashboardEtudiant');
    } catch (error) {
      Alert.alert('Erreur', 'Échec lors de la sauvegarde du profil.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Compléter votre profil</Text>

      <TextInput
        style={styles.input}
        placeholder="Nom complet"
        value={nomComplet}
        onChangeText={setNomComplet}
      />
      <TextInput
        style={styles.input}
        placeholder="Pays d’origine"
        value={pays}
        onChangeText={setPays}
      />
      <TextInput
        style={styles.input}
        placeholder="Objectif du voyage"
        value={objectifVoyage}
        onChangeText={setObjectifVoyage}
      />
      <TextInput
        style={styles.input}
        placeholder="Programme d’études visé"
        value={programme}
        onChangeText={setProgramme}
      />
      <TextInput
        style={styles.input}
        placeholder="Établissement visé (optionnel)"
        value={ecole}
        onChangeText={setEcole}
      />

      <Text style={styles.label}>Type d’étudiant :</Text>
      <Picker
        selectedValue={typeEtudiant}
        onValueChange={(itemValue) => setTypeEtudiant(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Sélectionnez..." value="" />
        <Picker.Item label="Déjà au Québec" value="au_quebec" />
        <Picker.Item label="À l’étranger" value="a_etranger" />
      </Picker>

      <TouchableOpacity onPress={choisirImage} style={styles.imageButton}>
        <Text style={styles.imageButtonText}>Choisir une photo (facultatif)</Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image }} style={styles.image} />}

      <Button title="Enregistrer" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 },
  label: { fontWeight: 'bold', marginBottom: 5 },
  picker: { borderWidth: 1, borderColor: '#ccc', marginBottom: 20 },
  imageButton: { backgroundColor: '#007bff', padding: 10, marginBottom: 10, borderRadius: 5 },
  imageButtonText: { color: 'white', textAlign: 'center' },
  image: { width: 100, height: 100, alignSelf: 'center', borderRadius: 50, marginBottom: 15 }
});
