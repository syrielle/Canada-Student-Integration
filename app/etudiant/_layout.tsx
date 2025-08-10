// app/etudiant/_layout.jsx
import { Stack } from 'expo-router';

export default function EtudiantLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // cache l'entête sur toutes les pages
        headerBackVisible: false,  // Supprime la flèche retour si jamais un header est affiché

      }}
    />
  );
}
