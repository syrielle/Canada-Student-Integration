import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../../src/services/firebaseConfig.js';

export default function SuspendedScreen() {
  const router = useRouter();

  const onLogout = async () => {
    try { await signOut(auth); } catch {}
    router.replace('/'); // écran d’accueil / login
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Votre compte a été suspendu</Text>
      <Text style={styles.text}>
        Si vous pensez qu'il s'agit d'une erreur, contactez l'administration.
      </Text>
      <TouchableOpacity onPress={onLogout} style={styles.btn}>
        <Text style={styles.btnTxt}>Se déconnecter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, alignItems:'center', justifyContent:'center', padding:24, backgroundColor:'#fff' },
  title:{ fontSize:20, fontWeight:'800', marginBottom:12, textAlign:'center' },
  text:{ color:'#374151', textAlign:'center', marginBottom:20 },
  btn:{ backgroundColor:'#1d4ed8', paddingVertical:12, paddingHorizontal:18, borderRadius:10 },
  btnTxt:{ color:'#fff', fontWeight:'700' },
});
