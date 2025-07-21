import { StyleSheet, Text, View } from 'react-native';

export default function DashboardMentor() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur le tableau de bord Mentor</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  }
});
