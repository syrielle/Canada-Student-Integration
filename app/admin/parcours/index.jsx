import { useRouter } from 'expo-router';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../../../src/services/firebaseConfig';

export default function Parcours() {
  const [etapes, setEtapes] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchEtapes = async () => {
      try {
        const q = query(collection(db, 'procedureSteps'), orderBy('numeroEtape'));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEtapes(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des étapes:', error);
      }
    };

    fetchEtapes();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Parcours de l'étudiant</Text>

      {etapes.map((etape) => (
        <View key={etape.id} style={styles.card}>
          <Text style={styles.etapeTitle}>Étape {etape.numeroEtape} : {etape.descriptionEtape}</Text>

          {etape.listeUtiles && etape.listeUtiles.length > 0 && (
            <View style={styles.linksContainer}>
              <Text style={styles.subtitle}>Liens utiles :</Text>
              {etape.listeUtiles.map((lien, index) => (
                <TouchableOpacity key={index} onPress={() => Linking.openURL(lien.url)}>
                  <Text style={styles.link}>• {lien.titre}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push(`/admin/parcours/modifier/${etape.id}`)}
          >
            <Text style={styles.buttonText}>Modifier</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  etapeTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  linksContainer: {
    marginBottom: 10,
  },
  link: {
    color: '#007bff',
    marginBottom: 4,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
