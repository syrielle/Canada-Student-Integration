import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { arrayUnion, collection, doc, getDoc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon'; // confettis
import { db } from '../../../src/services/firebaseConfig';

const { width } = Dimensions.get('window');

export default function MesEtudiants() {
  const [etapes, setEtapes] = useState([]);
  const [etapesCompletes, setEtapesCompletes] = useState([]);
  const [etapeSelectionnee, setEtapeSelectionnee] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false); // confettis
  const router = useRouter();
  const auth = getAuth();

  // --- Récupérations (inchangé)
  const recupererEtapes = async () => {
    const q = query(collection(db, 'procedureSteps'), orderBy('numeroEtape', 'asc'));
    const querySnapshot = await getDocs(q);
    const etapesData = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    setEtapes(etapesData);
  };

  const recupererEtapesCompletes = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const userRef = doc(db, 'utilisateurs', user.uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data();
      setEtapesCompletes(data.etapesCompletes || []);
    }
  };

  const completerEtape = async (idEtape) => {
    const user = auth.currentUser;
    if (!user) return;

    // Si déjà complétée, on ne fait rien
    if (etapesCompletes.includes(idEtape)) {
      setEtapeSelectionnee(null);
      return;
    }

    const userRef = doc(db, 'utilisateurs', user.uid);

    // Empêche les doublons en base
    await updateDoc(userRef, {
      etapesCompletes: arrayUnion(idEtape),
    });

    // Mets à jour l'état local (sans doublon)
    setEtapesCompletes(prev => (prev.includes(idEtape) ? prev : [...prev, idEtape]));

    setEtapeSelectionnee(null);
  };

  // confirmation avant complétion + confettis
  const confirmAndComplete = (id) => {
    Alert.alert(
      'Confirmer',
      "Es-tu sûr·e d’avoir terminé cette étape ?",
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Oui, terminer',
          onPress: async () => {
            try {
              await completerEtape(id); // ta logique existante
              setShowConfetti(true);    // lance confettis
              setTimeout(() => setShowConfetti(false), 1800);
            } catch (e) {
              Alert.alert('Erreur', e?.message ?? 'Impossible de compléter.');
            }
          },
        },
      ],
    );
  };

  useEffect(() => {
    recupererEtapes();
    recupererEtapesCompletes();
  }, []);

  // pictos simples (tu peux remplacer par tes images plus tard)
  const iconFor = (titre = '') => {
    const t = titre.toLowerCase();
    if (t.includes('recherche') && t.includes('établ')) return '🔍';
    if (t.includes('admission')) return '✉️';
    if (t.includes('caq')) return '✅';
    if (t.includes('permis') || t.includes('visa')) return '🧳';
    if (t.includes('logement')) return '🏠';
    return '⭐️';
  };

  // ⬇️ déplacé ici (calcul au rendu, pas en haut du fichier)
  const dejaFait = !!etapeSelectionnee && etapesCompletes.includes(etapeSelectionnee.id);

  return (
    <View style={styles.screen}>
      <Text style={styles.header}>Suivi de votre parcours</Text>

      {etapes.length === 0 && (
        <Text style={{ textAlign: 'center', color: '#64748B' }}>
          Aucune étape à afficher pour le moment.
        </Text>
      )}

      {/* Timeline (bande jaune centrale supprimée) */}
      <ScrollView contentContainerStyle={styles.timelineContent}>
        {etapes.map((item, idx) => {
          const gauche = idx % 2 === 0; // alterne gauche/droite
          const complete = etapesCompletes.includes(item.id);

          return (
            <View key={item.id} style={styles.row}>
              {/* Colonne gauche */}
              <View style={[styles.side, { alignItems: 'flex-end' }]}>
                {gauche && (
                  <View style={styles.nodeWrap}>
                    <Pressable
                      onPress={() => setEtapeSelectionnee(item)}
                      style={[
                        styles.node,
                        complete && styles.nodeCompleted, // style “terminé”
                        { backgroundColor: complete ? '#22c55e' : '#f97316' },
                      ]}
                    >
                      <Text style={styles.nodeIcon}>{iconFor(item.titreEtape || item.titre)}</Text>

                      {complete && (
                        <View style={styles.badge}>
                          <Text style={styles.badgeTxt}>✓</Text>
                        </View>
                      )}
                    </Pressable>

                    <View style={[styles.connector, { marginRight: 10 }]} />
                    <Text style={[styles.nodeTitle, { textAlign: 'right' }]}>
                      {item.titreEtape || item.titre}
                    </Text>
                  </View>
                )}
              </View>

              {/* centre */}
              <View style={{ width: 24 }} />

              {/* Colonne droite */}
              <View style={[styles.side, { alignItems: 'flex-start' }]}>
                {!gauche && (
                  <View style={styles.nodeWrap}>
                    <Text style={[styles.nodeTitle, { textAlign: 'left' }]}>
                      {item.titreEtape || item.titre}
                    </Text>

                    <View style={[styles.connector, { marginLeft: 10 }]} />

                    <Pressable
                      onPress={() => setEtapeSelectionnee(item)}
                      style={[
                        styles.node,
                        complete && styles.nodeCompleted, // style “terminé”
                        { backgroundColor: complete ? '#22c55e' : '#ef4444' },
                      ]}
                    >
                      <Text style={styles.nodeIcon}>{iconFor(item.titreEtape || item.titre)}</Text>

                      {complete && (
                        <View style={styles.badge}>
                          <Text style={styles.badgeTxt}>✓</Text>
                        </View>
                      )}
                    </Pressable>
                  </View>
                )}
              </View>
            </View>
          );
        })}

        {etapes.length > 0 && <View style={{ height: 16 }} />}
      </ScrollView>

      {/* MODALE */}
<Modal
  visible={etapeSelectionnee !== null}
  animationType="fade"
  transparent
  onRequestClose={() => setEtapeSelectionnee(null)}
>
  <View style={styles.modalBackground}>
    <View style={styles.sheet}>
      {/* HEADER bleu */}
      <View style={styles.sheetHeader}>
        <Text style={styles.stepCount}>
          Étape {etapeSelectionnee?.numeroEtape ?? ''} sur {etapes.length}
        </Text>
        <Text style={styles.sheetTitle}>
          {etapeSelectionnee?.titreEtape || etapeSelectionnee?.titre || 'Étape'}
        </Text>
      </View>

      {/* CORPS blanc arrondi */}
      <View style={styles.sheetBody}>
        {Boolean(etapeSelectionnee?.descriptionEtape) && (
          <Text style={styles.bodyText}>{etapeSelectionnee?.descriptionEtape}</Text>
        )}

        {etapeSelectionnee?.liensUtiles?.length > 0 && (
          <View style={styles.liensBloc}>
            {etapeSelectionnee.liensUtiles.map((lien, index) => {
              const titre = lien.titre || 'Lien utile';
              const url = Object.entries(lien).find(([k]) => k !== 'titre')?.[1];
              return (
                <View key={index} style={{ marginBottom: 10 }}>
                  <Text style={styles.lienTitre}>{titre}</Text>
                  {url && (
                    <TouchableOpacity onPress={() => Linking.openURL(url)}>
                      <Text style={styles.lienUrl}>{url}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {/* Boutons */}
        <View style={styles.modalActions}>
          <TouchableOpacity style={styles.btnGhost} onPress={() => setEtapeSelectionnee(null)}>
            <Text style={styles.btnGhostTxt}>Fermer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={dejaFait}
            style={[styles.btnPrimaryBlue, dejaFait && styles.btnDisabled]}
            onPress={() => {
              if (!etapeSelectionnee?.id) return;
              confirmAndComplete(etapeSelectionnee.id);
            }}
          >
            <Text style={styles.btnPrimaryTxt}>
              {dejaFait ? 'Déjà complétée' : 'Compléter'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </View>
</Modal>


      {/* Confettis (optionnel) */}
      {showConfetti && (
        <ConfettiCannon count={60} origin={{ x: width / 2, y: 0 }} fadeOut />
      )}
    </View>
  );
}

const BG = '#E6F0FF';

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BG, paddingTop: 8 },
  header: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    paddingHorizontal: 16,
    marginBottom: 4,
  },

  // timeline
  timelineContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 140,
  },
  side: { flex: 1 },
  nodeWrap: { maxWidth: width * 0.38, alignItems: 'center' },
  node: {
    width: 84,
    height: 84,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  nodeCompleted: { // étape finie
    opacity: 0.96,
    borderWidth: 2,
    borderColor: '#22c55e',
  },
  nodeIcon: { fontSize: 32 },
  badge: { // badge ✓
    position: 'absolute',
    right: -2,
    top: -2,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#181b19',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  badgeTxt: { color: '#fff', fontWeight: '800', fontSize: 12 },
  connector: {
    height: 6,
    backgroundColor: '#FACC15',
    borderRadius: 999,
    width: '100%',
    marginVertical: 8,
  },
  nodeTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 6,
    textAlign: 'center',
  },

  // modal
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    maxHeight: '86%',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  modalStep: {
    textAlign: 'center',
    color: '#1e500aff',
    marginBottom: 4,
    fontWeight: '600',
  },
  modalTitre: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalDescription: {
    fontSize: 16,
    color: '#334155',
    textAlign: 'center',
    marginBottom: 12,
  },
  liensBloc: {
    marginTop: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  lienTitre: { fontWeight: '700', marginBottom: 4, color: '#0f172a' },
  lienUrl: { color: '#2563EB', textDecorationLine: 'underline', fontSize: 14 },

  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  btnGhost: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnGhostTxt: { color: '#0f172a', fontWeight: '800' },
  btnPrimary: {
    backgroundColor: '#808080',  // gris
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  btnPrimaryTxt: {
    color: '#fff',
    fontSize: 18, // plus grand
    fontWeight: 'bold',
  },
  btnDisabled: {
    opacity: 0.6,
  },
  // Carte entière
sheet: {
  borderRadius: 24,
  overflow: 'hidden',
  backgroundColor: '#DCEBFF', // bleu très doux pour le header
  shadowColor: '#000',
  shadowOpacity: 0.2,
  shadowRadius: 20,
  shadowOffset: { width: 0, height: 10 },
  elevation: 10,
},
sheetHeader: {
  paddingTop: 16,
  paddingBottom: 12,
  paddingHorizontal: 16,
  backgroundColor: '#DCEBFF',
},
stepCount: {
  textAlign: 'center',
  color: '#1e293b',
  fontWeight: '600',
},
sheetTitle: {
  textAlign: 'center',
  fontSize: 22,
  fontWeight: '800',
  color: '#0f172a',
  marginTop: 4,
},
sheetBody: {
  backgroundColor: '#fff',
  borderTopLeftRadius: 24,
  borderTopRightRadius: 24,
  padding: 16,
},
bodyText: {
  fontSize: 16,
  color: '#334155',
  textAlign: 'center',
  marginBottom: 12,
},

// Bouton bleu "Compléter"
btnPrimaryBlue: {
  backgroundColor: '#377DFF',
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderRadius: 12,
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
},
// (garde btnPrimaryTxt et btnDisabled tels quels)

});
