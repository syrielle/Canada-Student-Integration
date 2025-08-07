import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { FlatList, Linking, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../../../src/services/firebaseConfig';
export default function MesEtudiants() {
   const [etapes, setEtapes] = useState([]);
  const [etapesCompletes, setEtapesCompletes] = useState([]);
  const [etapeSelectionnee, setEtapeSelectionnee] = useState(null); // étapée affichée en détail
  const router = useRouter();
  const auth = getAuth();

  // Récupère les étapes valides
  const recupererEtapes = async () => {
    const q = query(
      collection(db, 'procedureSteps'),
      orderBy('numeroEtape', 'asc')
      // where('estValide', '==', true), ← à réactiver plus tard
    );

    const querySnapshot = await getDocs(q);
    const etapesData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setEtapes(etapesData);
  };

  // Récupère les étapes déjà complétées
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

  const completerEtape = async (idEtape) => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, 'utilisateurs', user.uid);
    const nouvellesEtapes = [...etapesCompletes, idEtape];
    await updateDoc(userRef, {
      etapesCompletes: nouvellesEtapes,
    });
    setEtapesCompletes(nouvellesEtapes);
    setEtapeSelectionnee(null); // Fermer la modale
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
          const estComplete = etapesCompletes.includes(item.id);
          return (
            <TouchableOpacity
              onPress={() => setEtapeSelectionnee(item)}
              style={[styles.etape, estComplete && styles.etapeGrisee]}
            >
              <Text style={styles.numero}>{item.titre}</Text>
              <Text style={styles.texte}>{item.descriptionEtape}</Text>
            </TouchableOpacity>
          );
        }}
      />

      {/* MODALE DÉTAILLÉE POUR UNE ÉTAPE */}
        <Modal
  visible={etapeSelectionnee !== null}
  animationType="slide"
  transparent={true}
  onRequestClose={() => setEtapeSelectionnee(null)}
>
  <View style={styles.modalBackground}>
    <View style={styles.modalContainer}>
      <ScrollView>
        <Text style={styles.modalTitre}>
          {etapeSelectionnee?.titreEtape || `Étape ${etapeSelectionnee?.numeroEtape}`}
        </Text>

        {/* Liens utiles */}
        {etapeSelectionnee?.liensUtiles?.length > 0 && (
          <View style={styles.liensContainer}>

            {etapeSelectionnee.liensUtiles.map((lien, index) => {
              const titre = lien.titre || "Lien utile";
              const url = Object.entries(lien).find(([key]) => key !== 'titre')?.[1];

              return (
                <View key={index} style={{ marginBottom: 12 }}>
                  <Text style={{ fontWeight: '600', fontSize: 14, marginBottom: 4 }}>{titre}</Text>
                  {url && (
                    <TouchableOpacity onPress={() => Linking.openURL(url)}>
                      <Text style={styles.lien}>{url}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Boutons */}
      <View style={styles.boutonsContainer}>
        <TouchableOpacity
          style={styles.boutonConfirmer}
          onPress={() => completerEtape(etapeSelectionnee.id)}
        >
          <Text style={{ color: 'white' }}>J’ai terminé cette étape</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.boutonAnnuler}
          onPress={() => setEtapeSelectionnee(null)}
        >
          <Text style={{ color: '#333' }}>Fermer</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>


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
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    maxHeight: '80%',
  },
  modalTitre: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  liensContainer: {
    marginTop: 8,
  },
  lien: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginTop: 4,
  },
  boutonsContainer: {
    marginTop: 16,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
  },
  boutonConfirmer: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
  },
  boutonAnnuler: {
    backgroundColor: '#ddd',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
});

