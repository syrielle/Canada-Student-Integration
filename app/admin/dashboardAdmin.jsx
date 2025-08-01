// app/admin/dashboardAdmin.jsx

import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function DashboardAdmin() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tableau de bord administrateur</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/admin/validationMentors')}>
        <Text style={styles.buttonText}>Valider les mentors</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/admin/validationJumelages')}>
        <Text style={styles.buttonText}>Valider les jumelages</Text>
      </TouchableOpacity>

      {/* Tu pourras ajouter d'autres sections ici plus tard */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center'
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center'
  }
});
