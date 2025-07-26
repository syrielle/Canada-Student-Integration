import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../../src/services/firebaseConfig';

export default function ProcedureScreen() {
  const [etapes, setEtapes] = useState([]);
  const [etapesCompletes, setEtapesCompletes] = useState([]);
  const router = useRouter();
  const auth = getAuth();

  // Récupère les étapes valides
  const recupererEtapes = async () => {
    const q = query(
      collection(db, 'procedureSteps'),
     // where('estValide', '==', false),
      orderBy('numeroEtape', 'asc')
    );

    const querySnapshot = await getDocs(q);
    const etapesData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log("Contenu brut récupéré :", querySnapshot.docs.map(doc => doc.data()));

    console.log('Étapes récupérées :', etapesData); // ← Ajoute ceci


    setEtapes(etapesData);
  };

  // Récupère les étapes déjà complétées par l’utilisateur
  const recupererEtapesCompletes = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, 'utilisateurs', user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      setEtapesCompletes(data.etapesCompletes || []);
    }
  };

  // Ajouter une étape dans etapesCompletes
  const completerEtape = async (idEtape) => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, 'utilisateurs', user.uid);

    const nouvellesEtapes = [...etapesCompletes, idEtape];
    await updateDoc(userRef, {
      etapesCompletes: nouvellesEtapes,
    });

    setEtapesCompletes(nouvellesEtapes);
  };

  // Gère le clic sur une étape
  const handleEtapeClick = (etape) => {
    if (etapesCompletes.includes(etape.idEtape)) return;

    Alert.alert(
      'Étape complétée ?',
      `Avez-vous terminé cette étape : "${etape.descriptionEtape}" ?`,
      [
        {
          text: 'Non',
          style: 'cancel',
        },
        {
          text: 'Oui',
          onPress: () => completerEtape(etape.idEtape),
        },
      ]
    );
  };

  useEffect(() => {
    recupererEtapes();
    recupererEtapesCompletes();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titre}>Suivi de votre parcours</Text>
{etapes.length === 0 && (
  <Text style={{ textAlign: 'center', color: 'gray' }}>
    Aucune étape à afficher pour le moment.
  </Text>
)}

      <FlatList
        data={etapes}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({ item }) => {
          const estComplete = etapesCompletes.includes(item.idEtape);
          return (
            <TouchableOpacity
              onPress={() => handleEtapeClick(item)}
              style={[
                styles.etape,
                estComplete && styles.etapeGrisee
              ]}
            >
              <Text style={styles.numero}>{item.numeroEtape}</Text>
              <Text style={styles.texte}>{item.descriptionEtape}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  titre: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  etape: {
    backgroundColor: '#cce5ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flex: 1,
    marginHorizontal: 4,
  },
  etapeGrisee: {
    backgroundColor: '#d3d3d3',
  },
  numero: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  texte: {
    fontSize: 14,
  },
});
