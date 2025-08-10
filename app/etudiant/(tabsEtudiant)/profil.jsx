// app/etudiant/(tabsEtudiant)/profil.jsx  (adapte le chemin si besoin)
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { db } from '../../../src/services/firebaseConfig';

const BG = '#EAF3FF';

export default function ProfilEtudiant() {
  const [utilisateur, setUtilisateur] = useState(null);
  const [email, setEmail] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [dateNaissance, setDateNaissance] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [surPlace, setSurPlace] = useState('non');
  const [chargement, setChargement] = useState(true);
  const router = useRouter();
  const auth = getAuth();
  const [loading, setLoading] = useState(false);


  // Récupération du profil (inchangée)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'utilisateurs', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUtilisateur(user);
          setEmail(user.email); // e-mail affiché mais non modifiable
          setNom(data.nom || '');
          setPrenom(data.prenom || '');
          setTelephone(data.telephone || '');
          setDateNaissance(data.dateNaissance ? new Date(data.dateNaissance) : new Date());
          setSurPlace(data.surPlace || 'non');
        } else {
          Alert.alert('Erreur', 'Profil introuvable.');
        }
      }
      setChargement(false);
    });

    return () => unsubscribe();
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
  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Voulez-vous vraiment vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Se déconnecter', style: 'destructive', onPress: doSignOut },
      ]
    );
  };
  // Sauvegarde (inchangée)
  const handleSauvegarde = async () => {
    if (!utilisateur) return;

    try {
      await updateDoc(doc(db, 'utilisateurs', utilisateur.uid), {
        nom,
        prenom,
        telephone,
        dateNaissance: dateNaissance.toISOString(),
        surPlace,
      });

      Alert.alert('Succès', 'Profil mis à jour avec succès !', [
        { text: 'OK', onPress: () => router.replace('/etudiant') },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'Échec de la mise à jour.');
    }
  };

  // Progression dynamique (0–100)
  const progress = useMemo(() => {
    let done = 0;
    if (nom?.trim()) done++;
    if (prenom?.trim()) done++;
    if (telephone?.trim()) done++;
    if (dateNaissance instanceof Date && !isNaN(dateNaissance.getTime())) done++;
    if (surPlace === 'oui' || surPlace === 'non') done++;
    return Math.round((done / 5) * 100);
  }, [nom, prenom, telephone, dateNaissance, surPlace]);

  if (chargement) return <Text style={{ padding: 20 }}>Chargement...</Text>;

  return (
    <ScrollView style={{ backgroundColor: BG }} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Carte progression */}
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Complétion du profil</Text>
          <Text style={styles.progressValue}>{progress}%</Text>
        </View>
        <View style={styles.progressTrack} accessibilityRole="progressbar" accessibilityValue={{ now: progress, min: 0, max: 100 }}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressHint}>
          {Math.round((progress / 100) * 5)}/5 champs essentiels remplis
        </Text>
      </View>

      {/* Formulaire (un seul bloc) */}
      <View style={styles.card}>
        <Text style={styles.label}>Adresse e-mail (non modifiable)</Text>
        <Text style={[styles.input, styles.inputDisabled]}>{email}</Text>

        <Text style={styles.label}>Nom</Text>
        <TextInput style={styles.input} value={nom} onChangeText={setNom} placeholder="Votre nom" />

        <Text style={styles.label}>Prénom</Text>
        <TextInput style={styles.input} value={prenom} onChangeText={setPrenom} placeholder="Votre prénom" />

        <Text style={styles.label}>Numéro de téléphone</Text>
        <TextInput
          style={styles.input}
          value={telephone}
          onChangeText={setTelephone}
          keyboardType="phone-pad"
          placeholder="Ex : 514-123-4567"
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
        {/* Toggle segmenté compact Oui/Non */}
        <View style={styles.segment}>
          <TouchableOpacity
            onPress={() => setSurPlace('oui')}
            style={[styles.segmentBtn, surPlace === 'oui' && styles.segmentBtnActive]}
            activeOpacity={0.8}
          >
            <Text style={[styles.segmentTxt, surPlace === 'oui' && styles.segmentTxtActive]}>Oui</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSurPlace('non')}
            style={[styles.segmentBtn, surPlace === 'non' && styles.segmentBtnActive]}
            activeOpacity={0.8}
          >
            <Text style={[styles.segmentTxt, surPlace === 'non' && styles.segmentTxtActive]}>Non</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* CTA */}
      <View style={styles.ctaWrap}>
        <TouchableOpacity style={styles.bouton} onPress={handleSauvegarde} activeOpacity={0.9}>
          <Text style={styles.texteBouton}>Enregistrer</Text>
        </TouchableOpacity>
      </View>

        <View style={styles.container}>
      <Text style={styles.title}>Mon Profil</Text>
      
      {/* Bouton Déconnexion */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 16, paddingBottom: 40 },

  // Progress
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    gap: 10,
  },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressTitle: { fontWeight: '800', color: '#111827' },
  progressValue: { fontWeight: '800', color: '#2563EB' },
  progressTrack: {
    height: 12,
    backgroundColor: '#E7ECFF',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 999,
  },
  progressHint: { color: '#6B7280', fontSize: 12 },

  // Card + inputs
  card: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  label: { fontWeight: '800', marginBottom: 8, color: '#111827' },
  input: {
    backgroundColor: '#F8FAFF',
    borderWidth: 1,
    borderColor: '#E6EAF5',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 16,
    marginBottom: 14,
  },
  inputDisabled: { backgroundColor: '#F2F4F7', color: '#6B7280' },

  // Segment toggle
  segment: {
    flexDirection: 'row',
    backgroundColor: '#EEF2FF',
    borderRadius: 16,
    padding: 6,
    gap: 8,
    marginBottom: 6,
  },
  segmentBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  segmentBtnActive: {
    backgroundColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  segmentTxt: { color: '#6B7280', fontWeight: '800' },
  segmentTxtActive: { color: '#fff' },

  // CTA
  ctaWrap: { marginTop: 8 },
  bouton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  texteBouton: { color: '#fff', fontWeight: '900', fontSize: 17 },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
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
