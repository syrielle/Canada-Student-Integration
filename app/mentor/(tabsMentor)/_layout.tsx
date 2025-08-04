import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function MentorTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007bff',
      }}
    >
      {/* Onglets visibles */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Mes étudiants',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Dossier chat => on expose seulement chat/index comme onglet */}
      <Tabs.Screen
        name="chat/index"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-ellipses-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profil"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Écrans internes (pas d’icône dans la barre) */}
      <Tabs.Screen name="chat/[idEtudiant]" options={{ href: null }} />
      <Tabs.Screen name="parcours/[idEtudiant]" options={{ href: null }} />
      <Tabs.Screen name="jumelageEtudiants" options={{ href: null }} />
      <Tabs.Screen name="ProcedureScreen" options={{ href: null }} />
      {/* Fichier de test vu dans l’arborescence */}
      <Tabs.Screen name="chatssss" options={{ href: null }} />
    </Tabs>
  );
}
