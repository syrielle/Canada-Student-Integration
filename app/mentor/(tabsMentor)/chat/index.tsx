import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Conversation = {
  id: string;         // id de conversation (ou doc Firestore)
  nomEtudiant: string;
  idEtudiant: string; // pour ouvrir le chat dynamique
};

export default function ListeConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        // TODO: remplacer par Firestore si nécessaire
        const fetched: Conversation[] = [
          { id: 'conv1', nomEtudiant: 'Alice Dupont', idEtudiant: 'etu1' },
          { id: 'conv2', nomEtudiant: 'Jean Lefebvre', idEtudiant: 'etu2' },
        ];
        setConversations(fetched);
      } catch (error) {
        console.error('Erreur lors du chargement des conversations', error);
      }
    };
    fetchConversations();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mes discussions</Text>

      <FlatList
        data={conversations}
        ListEmptyComponent={<Text style={styles.emptyText}>Aucune discussion active.</Text>}
        // ✅ clé unique et stable (utilise id; fallback sur idEtudiant au cas où)
        keyExtractor={(item) => item.id ?? item.idEtudiant}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatCard}
            onPress={() =>
              router.push({
                pathname: '/mentor/chat/[idEtudiant]',
                params: { idEtudiant: item.idEtudiant },
              })
            }
          >
            <Text style={styles.nom}>{item.nomEtudiant}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Bouton flottant vers le jumelage */}
      <TouchableOpacity
        onPress={() => router.push('../jumelageEtudiants')}
        style={styles.floatingButton}
      >
        <Ionicons name="person-add" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7', padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  emptyText: { textAlign: 'center', color: '#999' },
  chatCard: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#eee',
    marginBottom: 10,
  },
  nom: { fontSize: 16 },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#007AFF',
    borderRadius: 50,
    padding: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
});
