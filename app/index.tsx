import { useRouter } from 'expo-router';
import React from 'react';
import {
  Alert, Dimensions,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';

const { width } = Dimensions.get('window');
const BG = '#E6F0FF';
 const router = useRouter();

  const handleLogin = async () => {
    

    try {
        

      // Rediriger vers la page de connexion
      router.replace('/login');
    } catch (error) {
      console.error(error);
      
      Alert.alert('Erreur', 'Impossible de se connecter. Veuillez réessayer.');
      
    }

  };

  const handleRegister = async () => {
    try {
      // Rediriger vers la page d'inscription
      router.replace('/register');
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'Impossible de s\'inscrire. Veuillez réessayer.');
    }};



export default function Welcome() {
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Illustration */}
        <View style={styles.hero}>
          <Image
            source={require('../assets/onboarding/home.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        {/* Titre / Sous-titre */}
        <Text style={styles.title}>Bienvenue 👋</Text>
        <Text style={styles.subtitle}>Choisis une option pour démarrer.</Text>

        {/* Actions principales */}
        <View style={styles.actions}>
          <Pressable style={styles.boutonCreer} onPress={handleRegister}>
            <Text style={styles.texteBoutonCreer}>Créer un compte</Text>
          </Pressable>
          <Pressable style={styles.boutonConnecter} onPress={handleLogin}>
            <Text style={styles.texteBoutonConnecter}>Se connecter</Text>
          </Pressable>
        </View>

        {/* Séparateur */}
        <View style={styles.separator}>
          <View style={styles.line} />
          <Text style={styles.sepText}>ou continuer avec</Text>
          <View style={styles.line} />
        </View>

        {/* Google (placeholder) */}
        <Pressable style={styles.btnGoogle} onPress={() => {}}>
          <View style={styles.googleRow}>
            <Image
              source={require('../assets/icons/google.png')}
              style={styles.googleIcon}
              resizeMode="contain"
            />
            <Text style={styles.btnTextGoogle}>Continuer avec Google</Text>
          </View>
        </Pressable>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Conditions • Confidentialité</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },

  // ⬇️ centre verticalement toute la colonne
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },

  // ⬇️ image un peu plus petite et SANS marginTop
  hero: {
    width: '100%',
    height: width * 0.9 * 0.45, // avant 0.55
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: { width: '100%', height: '100%' },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
    marginTop: 0,
  },
  subtitle: {
    fontSize: 16,
    color: '#334155',
    textAlign: 'center',
    marginTop: 2,
  },

  actions: { width: '100%', gap: 12, marginTop: 6 },
  boutonCreer: {
    backgroundColor: '#377DFF',
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  texteBoutonCreer: { color: '#fff', fontWeight: '700', fontSize: 16 },

  boutonConnecter: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  texteBoutonConnecter: { color: '#0f172a', fontWeight: '700', fontSize: 16 },

  separator: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 6,
    paddingHorizontal: 4,
  },
  line: { flex: 1, height: 1, backgroundColor: '#E2E8F0' },
  sepText: { color: '#64748B', fontSize: 14 },

  btnGoogle: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 4,
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  googleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  googleIcon: { width: 18, height: 18 },
  btnTextGoogle: { color: '#0f172a', fontWeight: '700', fontSize: 16 },

  footer: { alignItems: 'center', paddingVertical: 12 },
  footerText: { fontSize: 12, color: '#64748B' },
});
