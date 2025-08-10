import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

// Suspendre = estValide: false
export async function suspendUser(uid) {
  await updateDoc(doc(db, "utilisateurs", uid), { estValide: false });
}

// Réactiver = estValide: true
export async function reactivateUser(uid) {
  await updateDoc(doc(db, "utilisateurs", uid), { estValide: true });
}

// Supprimer le doc Firestore
export async function deleteUserDoc(uid) {
  await deleteDoc(doc(db, "utilisateurs", uid));
}
