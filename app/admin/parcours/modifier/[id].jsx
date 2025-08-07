// app/admin/parcours/modifier/[id].jsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { auth, db } from '../../../../src/services/firebaseConfig.js';

export default function ModifierEtape() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // id du document procedureSteps
  const docId = useMemo(() => (Array.isArray(id) ? id[0] : id), [id]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Champs Firestore existants
  const [titre, setTitre] = useState('');
  const [descriptionEtape, setDescriptionEtape] = useState('');
  const [listeUtiles, setListeUtiles] = useState([]); // [{titre, url}]
  const [numeroEtape, setNumeroEtape] = useState(null); // optionnel (affiché)
  const [isValide, setIsValide] = useState(true); // optionnel (switch)

  useEffect(() => {
    const load = async () => {
      if (!docId) {
        Alert.alert('Erreur', "Identifiant d'étape manquant.");
        router.back();
        return;
      }
      try {
        const ref = doc(db, 'procedureSteps', String(docId));
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          Alert.alert('Erreur', "Étape introuvable.");
          router.back();
          return;
        }
        const data = snap.data() || {};
        setTitre(data.titre || '');
        setDescriptionEtape(data.descriptionEtape || '');
        setListeUtiles(Array.isArray(data.listeUtiles) ? data.listeUtiles : []);
        setNumeroEtape(typeof data.numeroEtape === 'number' ? data.numeroEtape : null);
        setIsValide(typeof data.isValide === 'boolean' ? data.isValide : true);
      } catch (e) {
        console.error('Load step error:', e);
        Alert.alert('Erreur', "Impossible de charger l'étape.");
        router.back();
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [docId, router]);

  const onChangeLien = (index, key, value) => {
    setListeUtiles(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [key]: value };
      return copy;
    });
  };

  const addLien = () => {
    setListeUtiles(prev => [...prev, { titre: '', url: '' }]);
  };

  const removeLien = (index) => {
    setListeUtiles(prev => prev.filter((_, i) => i !== index));
  };

  const save = async () => {
    if (!titre.trim()) {
      Alert.alert('Validation', 'Le champ "Titre" est obligatoire.');
      return;
    }
    if (!descriptionEtape.trim()) {
      Alert.alert('Validation', 'La description de l’étape est obligatoire.');
      return;
    }

    // Nettoyage simple des liens vides
    const liensPropres = (listeUtiles || []).filter(
      l => (l?.titre?.trim()?.length || 0) > 0 && (l?.url?.trim()?.length || 0) > 0
    );
console.log('uid=', auth.currentUser?.uid);

    setSaving(true);
    try {
      const ref = doc(db, 'procedureSteps', String(docId));
      await updateDoc(doc(db, 'procedureSteps', idEtape), {
  descriptionEtape: `Test ${Date.now()}`
});
      // await updateDoc(ref, {
      //   titre: titre.trim(),
      //   descriptionEtape: descriptionEtape.trim(),
      //   listeUtiles: liensPropres,
      //   ...(numeroEtape !== null ? { numeroEtape } : {}),
      //   isValide,
      // });
      Alert.alert('Succès', 'Étape mise à jour.');
      router.back(); // retour à la liste admin/parcours
    } catch (e) {
      console.error('Save step error:', e);
      Alert.alert('Erreur', "Impossible d'enregistrer les modifications.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Chargement…</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header actions */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Text style={styles.headerBtnText}>← Retour</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()} style={[styles.headerBtn, styles.cancelBtn]}>
          <Text style={[styles.headerBtnText, { color: '#444' }]}>Annuler</Text>
        </TouchableOpacity>
      </View>

      {/* Titre */}
      <Text style={styles.label}>Titre de l’étape</Text>
      <TextInput
        value={titre}
        onChangeText={setTitre}
        placeholder="Ex: Demande d’admission"
        style={styles.input}
      />

      {/* Description */}
      <Text style={styles.label}>Description</Text>
      <TextInput
        value={descriptionEtape}
        onChangeText={setDescriptionEtape}
        placeholder="Décrivez clairement l’étape pour guider l’étudiant…"
        style={[styles.input, styles.textarea]}
        multiline
      />

      {/* Infos additionnelles */}
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.labelSmall}>Numéro d’étape (affichage)</Text>
          <TextInput
            value={numeroEtape === null ? '' : String(numeroEtape)}
            onChangeText={(t) => {
              const n = Number(t);
              setNumeroEtape(Number.isFinite(n) ? n : null);
            }}
            placeholder="Ex: 1"
            keyboardType="numeric"
            style={styles.input}
          />
        </View>

        <View style={[styles.switchWrap, { marginLeft: 12 }]}>
          <Text style={styles.labelSmall}>Étape visible</Text>
          <Switch value={isValide} onValueChange={setIsValide} />
        </View>
      </View>

      {/* Liens utiles */}
      <Text style={[styles.label, { marginTop: 16 }]}>Liens utiles</Text>

      {listeUtiles?.length === 0 && (
        <Text style={{ color: '#666', marginBottom: 8 }}>Aucun lien pour le moment.</Text>
      )}

      {listeUtiles?.map((lien, index) => (
        <View key={`${index}-${lien?.url ?? 'x'}`} style={styles.linkCard}>
          <Text style={styles.labelSmall}>Titre du lien</Text>
          <TextInput
            value={lien?.titre ?? ''}
            onChangeText={(t) => onChangeLien(index, 'titre', t)}
            placeholder="Ex: Portail des admissions"
            style={styles.input}
          />
          <Text style={styles.labelSmall}>URL</Text>
          <TextInput
            value={lien?.url ?? ''}
            onChangeText={(t) => onChangeLien(index, 'url', t)}
            placeholder="https://…"
            autoCapitalize="none"
            style={styles.input}
          />
          <TouchableOpacity onPress={() => removeLien(index)} style={styles.removeBtn}>
            <Text style={styles.removeBtnText}>Supprimer ce lien</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity onPress={addLien} style={styles.addBtn}>
        <Text style={styles.addBtnText}>+ Ajouter un lien</Text>
      </TouchableOpacity>

      {/* Enregistrer */}
      <TouchableOpacity onPress={save} style={[styles.saveBtn, saving && { opacity: 0.6 }]}>
        <Text style={styles.saveBtnText}>{saving ? 'Enregistrement…' : 'Enregistrer'}</Text>
      </TouchableOpacity>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  container: { padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  headerBtn: { paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#eef2ff', borderRadius: 8 },
  headerBtnText: { fontWeight: '600', color: '#1d4ed8' },
  cancelBtn: { backgroundColor: '#f2f2f2' },

  label: { fontSize: 16, fontWeight: '700', marginBottom: 6, marginTop: 8 },
  labelSmall: { fontSize: 13, fontWeight: '600', marginBottom: 6, marginTop: 8 },

  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 10, backgroundColor: 'white',
  },
  textarea: { minHeight: 110, textAlignVertical: 'top' },

  row: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },

  switchWrap: {
    padding: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 8,
    backgroundColor: '#fafafa', alignItems: 'center',
  },

  linkCard: {
    marginTop: 8, padding: 12, borderWidth: 1, borderColor: '#e5e7eb',
    borderRadius: 10, backgroundColor: '#f9fafb',
  },
  removeBtn: { marginTop: 8, alignSelf: 'flex-start', backgroundColor: '#fee2e2', padding: 8, borderRadius: 6 },
  removeBtnText: { color: '#b91c1c', fontWeight: '600' },

  addBtn: {
    marginTop: 10, alignSelf: 'flex-start', backgroundColor: '#e0f2fe',
    paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8,
  },
  addBtnText: { color: '#0369a1', fontWeight: '700' },

  saveBtn: {
    marginTop: 16, alignSelf: 'flex-start', backgroundColor: '#16a34a',
    paddingVertical: 12, paddingHorizontal: 18, borderRadius: 10,
  },
  saveBtnText: { color: 'white', fontWeight: '700' },
});
