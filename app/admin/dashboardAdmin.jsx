// app/admin/dashboardAdmin.jsx
import { ScrollView, StyleSheet } from 'react-native';
import SideMenuAdmin from './components/SideMenuAdmin';
import StatCards from './components/StatCards';

export default function DashboardAdmin() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatCards />
      <SideMenuAdmin />
      {/* Tu peux ajouter ici plus tard la section de jumelages */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
});
