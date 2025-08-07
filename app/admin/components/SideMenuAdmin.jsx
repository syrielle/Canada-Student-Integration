// app/admin/components/SideMenuAdmin.jsx
import { FontAwesome, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SideMenuAdmin() {
  const router = useRouter();

  return (
    <View style={styles.menu}>
      <TouchableOpacity style={styles.item} onPress={() => router.push('/admin/utilisateurs')}>
        <FontAwesome name="users" size={20} color="#007bff" />
        <Text style={styles.text}>Utilisateurs</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.item, styles.selected]} onPress={() => router.push('/admin/validationJumelages')}>
        <FontAwesome name="handshake-o" size={20} color="#fff" />
        <Text style={[styles.text, styles.selectedText]}>Jumelages</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.item]} onPress={() => router.push('/admin/validationMentors')}>
        <FontAwesome5 name="user-check" size={20} color="#007bff" />
        <Text style={styles.text}>Valider Mentors</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.item]} onPress={() => router.push('/admin/parcours')}>
        <FontAwesome5 name="road" size={20} color="#007bff" />
        <Text style={styles.text}>Parcours</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.item}>
        <MaterialIcons name="bar-chart" size={20} color="#007bff" />
        <Text style={styles.text}>Statistiques</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item}>
        <FontAwesome name="bell" size={20} color="#007bff" />
        <Text style={styles.text}>Notifications</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item}>
        <FontAwesome name="cog" size={20} color="#007bff" />
        <Text style={styles.text}>Paramètres</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  menu: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  text: {
    marginLeft: 10,
    fontSize: 16,
    color: '#007bff',
  },
  selected: {
    backgroundColor: '#007bff',
    borderRadius: 6,
    paddingHorizontal: 10,
  },
  selectedText: {
    color: '#fff',
  },
});
