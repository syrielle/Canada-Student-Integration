import { StyleSheet, View } from 'react-native';
import ProcedureScreen from './ProcedureScreen';

export default function DashboardEtudiant() {
  return (
    <View style={styles.container}>
      <ProcedureScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
