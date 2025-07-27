import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function EtudiantTabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="dashboardEtudiant"
        options={{
          title: 'Mon parcours',
          tabBarIcon: ({ color, size }) => <Ionicons name="map-outline" size={size} color={color} />,
        }}
      />
       <Tabs.Screen
        name="chatEtudiant"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size }) => <Ionicons name="chatbubbles-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="completerProfilEtudiant"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />
       
      {/* <Tabs.Screen
        name="chatEtudiant"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size }) => <Ionicons name="map-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profilEtudiant"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      /> */}
    </Tabs>
  );
}
