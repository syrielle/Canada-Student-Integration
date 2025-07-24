// src/utils/ajouterEtapes.js
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';

const etapes = [
  {
    idEtape: 'choixEtablissement',
    numeroEtape: 1,
    descriptionEtape: "Choix de l’établissement d’accueil"
  },
  {
    idEtape: 'demandeAdmission',
    numeroEtape: 2,
    descriptionEtape: "Demande d’admission"
  },
  {
    idEtape: 'caq',
    numeroEtape: 3,
    descriptionEtape: "Demande du CAQ (Certificat d’acceptation du Québec)"
  },
  {
    idEtape: 'visaPermisEtudes',
    numeroEtape: 4,
    descriptionEtape: "Demande de permis d’études et visa"
  },
  {
    idEtape: 'logement',
    numeroEtape: 5,
    descriptionEtape: "Recherche de logement"
  }
];

export const ajouterEtapesFirestore = async () => {
  for (const etape of etapes) {
    await setDoc(doc(db, 'procedureSteps', etape.idEtape), {
      idProcedure: 'etudQC2025',
      numeroEtape: etape.numeroEtape,
      idEtape: etape.idEtape,
      descriptionEtape: etape.descriptionEtape,
      estValide: true
    });
  }
};
