import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ParcoursEtudiant() {
  const { idEtudiant } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Parcours de l'étudiant</Text>
      <Text>ID de l'étudiant : {idEtudiant}</Text>
      {/* Tu peux ajouter ici les infos à récupérer depuis Firestore */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
});
