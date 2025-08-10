// app/admin/utilisateurs/index.jsx
import { useRouter } from "expo-router";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { deleteUserDoc, reactivateUser, suspendUser } from "../../../src/services/adminUsers";
import { db } from "../../../src/services/firebaseConfig.js";

// Rôles (on gère la variante avec et sans accent pour les étudiants)
const ROLES = { ETUDIANT: "etudiant", MENTOR: "mentor" };

export default function AdminUtilisateurs() {
  const router = useRouter();

  const [tab, setTab] = useState(ROLES.ETUDIANT);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger en temps réel selon l’onglet
  useEffect(() => {
    setLoading(true);

    const isMentor = tab === ROLES.MENTOR;
    const q = isMentor
      ? query(collection(db, "utilisateurs"), where("role", "==", "mentor"))
      : query(collection(db, "utilisateurs"), where("role", "in", ["étudiant", "etudiant"])); // accepte les 2 écritures

    const unsub = onSnapshot(
      q,
      (snap) => {
        const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setUsers(rows);
        setLoading(false);
      },
      (err) => {
        console.error("users load error:", err);
        setLoading(false);
      }
    );

    return unsub;
  }, [tab]);

  const onSuspend = async (uid) => {
    try {
      await suspendUser(uid); // met estValide: false
      Alert.alert("OK", "Utilisateur suspendu.");
    } catch (e) {
      console.error(e);
      Alert.alert("Erreur", "Impossible de suspendre l’utilisateur.");
    }
  };

  const onReactivate = async (uid) => {
    try {
      await reactivateUser(uid); // met estValide: true
      Alert.alert("OK", "Utilisateur réactivé.");
    } catch (e) {
      console.error(e);
      Alert.alert("Erreur", "Impossible de réactiver l’utilisateur.");
    }
  };

  const onDelete = (uid) => {
    Alert.alert(
      "Supprimer l’utilisateur",
      "Cette action supprime le document Firestore (pas le compte Auth). Continuer ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteUserDoc(uid);
              Alert.alert("OK", "Utilisateur supprimé (Firestore).");
            } catch (e) {
              console.error(e);
              Alert.alert("Erreur", "Suppression impossible.");
            }
          },
        },
      ]
    );
  };

  const renderUser = ({ item }) => {
    const isSuspended = item?.estValide === false; // on base l’UI sur estValide
    const statutTexte = isSuspended ? "suspendu" : "actif";

    return (
      <View style={styles.card}>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.displayName || item.nom || "(sans nom)"}</Text>
          <Text style={styles.email}>{item.email || "(sans email)"}</Text>
          <Text style={styles.meta}>
            Rôle: {item.role} • Statut: {statutTexte}
          </Text>
        </View>

        <View style={styles.actions}>
          {isSuspended ? (
            <TouchableOpacity onPress={() => onReactivate(item.id)} style={[styles.btn, styles.btnOk]}>
              <Text style={styles.btnTxt}>Réactiver</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => onSuspend(item.id)} style={[styles.btn, styles.btnWarn]}>
              <Text style={styles.btnTxt}>Suspendre</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => onDelete(item.id)} style={[styles.btn, styles.btnDanger]}>
            <Text style={styles.btnTxt}>Supprimer</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header + Tabs */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backTxt}>← Retour</Text>
        </TouchableOpacity>

        <View style={styles.tabs}>
          <TouchableOpacity
            onPress={() => setTab(ROLES.ETUDIANT)}
            style={[styles.tab, tab === ROLES.ETUDIANT && styles.tabActive]}
          >
            <Text style={[styles.tabTxt, tab === ROLES.ETUDIANT && styles.tabTxtActive]}>Étudiants</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setTab(ROLES.MENTOR)}
            style={[styles.tab, tab === ROLES.MENTOR && styles.tabActive]}
          >
            <Text style={[styles.tabTxt, tab === ROLES.MENTOR && styles.tabTxtActive]}>Mentors</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Liste */}
      {loading ? (
        <Text style={{ textAlign: "center", marginTop: 16 }}>Chargement…</Text>
      ) : users.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 16 }}>Aucun utilisateur.</Text>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(it) => it.id}
          contentContainerStyle={{ paddingVertical: 8 }}
          renderItem={renderUser}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 12 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  backBtn: { paddingVertical: 6, paddingHorizontal: 10, backgroundColor: "#eef2ff", borderRadius: 8 },
  backTxt: { color: "#1d4ed8", fontWeight: "700" },

  tabs: { flexDirection: "row", gap: 8 },
  tab: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, backgroundColor: "#f3f4f6" },
  tabActive: { backgroundColor: "#1d4ed8" },
  tabTxt: { fontWeight: "700", color: "#111827" },
  tabTxtActive: { color: "#fff" },

  card: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  name: { fontSize: 16, fontWeight: "700" },
  email: { color: "#6b7280" },
  meta: { color: "#374151", marginTop: 4 },

  actions: { flexDirection: "row", gap: 8 },
  btn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  btnTxt: { color: "#fff", fontWeight: "700" },
  btnWarn: { backgroundColor: "#f59e0b" },
  btnOk: { backgroundColor: "#10b981" },
  btnDanger: { backgroundColor: "#ef4444" },
});
