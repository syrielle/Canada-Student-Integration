import { Link } from 'expo-router';
import { Button, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Bienvenue 👋</Text>

       
      
      {/* Bouton pour créer un compte */}
      <Link href="/register" asChild>
        <Button title="Créer un compte" />
      </Link>

      {/* Espace entre les boutons */}
      <View style={{ height: 10 }} />

      {/* Bouton pour se connecter */}
      <Link href="/login" asChild>
        <Button title="Se connecter" />
      </Link>
      
    </View>
  );
}
