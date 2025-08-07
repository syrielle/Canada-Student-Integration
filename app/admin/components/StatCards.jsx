// app/admin/components/StatCards.jsx
import { FontAwesome } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

export default function StatCards() {
  return (
    <View style={styles.grid}>
      <View style={styles.card}>
        <Text style={styles.number}>134</Text>
        <Text style={styles.label}>Total étudiants</Text>
      </View>
      <View style={styles.card}>
        <FontAwesome name="handshake-o" size={24} color="#007bff" />
        <Text style={styles.number}>5</Text>
        <Text style={styles.label}>Jumelages en attente</Text>
      </View>
      <View style={styles.card}>
        <FontAwesome name="exclamation-triangle" size={24} color="#dc3545" />
        <Text style={styles.number}>1</Text>
        <Text style={styles.label}>Étudiants signalés</Text>
      </View>
      <View style={styles.card}>
        <FontAwesome name="clock-o" size={24} color="#6c757d" />
        <Text style={styles.label}>Dernière activité</Text>
        <Text style={styles.number}>1h 2min</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  number: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  label: {
    fontSize: 14,
    color: '#555',
  },
});
