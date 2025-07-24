import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { Button, Text, View } from 'react-native';
import { db } from '../../src/services/firebaseConfig';

export default function AdminUpdateUtilisateurs() {
  const [done, setDone] = useState(false);
  const [updatedCount, setUpdatedCount] = useState(0);

  const mettreAJourUtilisateurs = async () => {
    const querySnapshot = await getDocs(collection(db, 'utilisateurs'));
    let count = 0;

    for (const utilisateurDoc of querySnapshot.docs) {
      const data = utilisateurDoc.data();
      const ref = doc(db, 'utilisateurs', utilisateurDoc.id);

      const updates = {};

      if (!data.hasOwnProperty('estValide')) {
        updates.estValide = data.role === 'mentor' ? false : true;
      }

      if (!data.hasOwnProperty('estConfirme')) {
        updates.estConfirme = data.role === 'mentor' ? false : true;
      }

      if (!data.hasOwnProperty('estSurLeTerritoire')) {
        updates.estSurLeTerritoire = null;
      }

      if (!data.hasOwnProperty('etapesCompletes')) {
        updates.etapesCompletes = [];
      }

      if (!data.hasOwnProperty('mentorID')) {
        updates.mentorID = '';
      }

      if (!data.hasOwnProperty('profilComplet')) {
        updates.profilComplet = false;
      }

      if (!data.hasOwnProperty('isAdmin')) {
        updates.isAdmin = false;
      }

      if (!data.hasOwnProperty('isSuperAdmin')) {
        updates.isSuperAdmin = false;
      }

      if (!data.hasOwnProperty('preuveMentorat')) {
        updates.preuveMentorat = '';
      }

      if (Object.keys(updates).length > 0) {
        await updateDoc(ref, updates);
        count++;
      }
    }

    setUpdatedCount(count);
    setDone(true);
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Mettre à jour les utilisateurs" onPress={mettreAJourUtilisateurs} />
      {done && (
        <Text style={{ marginTop: 20 }}>{updatedCount} utilisateur(s) mis à jour avec succès.</Text>
      )}
    </View>
  );
}
