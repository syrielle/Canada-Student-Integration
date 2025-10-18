# 🇨🇦 Canada Student Integration

> **Application mobile de mentorat et d'intégration pour les étudiants internationaux au Canada**

[![React Native](https://img.shields.io/badge/React%20Native-0.79.5-61DAFB?style=flat-square&logo=react)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-~53.0.17-000020?style=flat-square&logo=expo)](https://expo.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-11.10.0-FFCA28?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-~5.8.3-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

## 📱 Aperçu

Canada Student Integration est une application mobile qui facilite l'intégration des étudiants internationaux au Canada en les connectant avec des mentors expérimentés et en les guidant à travers les procédures administratives nécessaires.

### ✨ Fonctionnalités principales

- 🤝 **Système de mentorat** - Mise en relation étudiants/mentors
- 📋 **Suivi des procédures** - Timeline interactive des démarches administratives
- 💬 **Chat intégré** - Communication en temps réel
- 👥 **Gestion des rôles** - Étudiants, Mentors, Admins
- ✅ **Validation des étapes** - Marquage des tâches accomplies avec animations
- 🎯 **Interface adaptative** - Design responsive pour mobile et web

## 🏗️ Architecture

### Stack technologique

- **Frontend**: React Native + Expo
- **Navigation**: Expo Router (file-based routing)
- **Backend**: Firebase (Auth + Firestore)
- **État**: Redux Toolkit
- **UI**: Composants React Native natifs
- **Plateformes**: iOS, Android, Web

### Structure du projet

```
├── app/                    # Pages principales (Expo Router)
│   ├── (tabs)/            # Navigation par onglets
│   ├── admin/             # Interface administrateur
│   ├── etudiant/          # Interface étudiant
│   ├── mentor/            # Interface mentor
│   └── onboarding/        # Pages d'accueil
├── components/            # Composants réutilisables
├── src/
│   ├── auth/              # Authentification
│   ├── services/          # Services Firebase
│   └── utils/             # Utilitaires
├── assets/                # Images, icônes, polices
└── android/               # Configuration Android
```

## 🚀 Installation

### Prérequis

- Node.js (v18 ou supérieur)
- npm ou yarn
- Expo CLI
- Compte Firebase

### Étapes d'installation

1. **Cloner le repository**
   ```bash
   git clone https://github.com/votre-username/canada-student-integration.git
   cd canada-student-integration
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration Firebase**
   - Créer un projet Firebase
   - Configurer Authentication et Firestore
   - Remplacer `src/services/firebaseConfig.js` avec vos clés

4. **Variables d'environnement**
   ```bash
   # Créer un fichier .env
   GOOGLE_CLIENT_ID=your_google_client_id
   ```

5. **Lancer l'application**
   ```bash
   # Développement
   npm start
   
   # iOS
   npm run ios
   
   # Android
   npm run android
   
   # Web
   npm run web
   ```

## 📱 Utilisation

### Pour les étudiants
1. Créer un compte étudiant
2. Compléter le profil
3. Être jumelé avec un mentor
4. Suivre les étapes du parcours d'intégration
5. Communiquer avec le mentor via le chat

### Pour les mentors
1. Créer un compte mentor
2. Attendre la validation admin
3. Compléter le profil
4. Gérer les étudiants jumelés
5. Suivre leur progression

### Pour les administrateurs
1. Valider les comptes mentors
2. Gérer les demandes de jumelage
3. Superviser la plateforme
4. Accéder aux statistiques

## 🗄️ Base de données

### Collections Firestore

- **`utilisateurs`** - Profils des utilisateurs (étudiants, mentors, admins)
- **`demandesJumelage`** - Relations mentor-étudiant
- **`procedureSteps`** - Étapes du parcours d'intégration
- **`conversations`** - Messages de chat

### Structure des données

```javascript
// Utilisateur
{
  nom: string,
  prenom: string,
  email: string,
  role: 'étudiant' | 'mentor',
  estValide: boolean,
  profilComplet: boolean,
  etapesCompletes: string[],
  // ... autres champs
}

// Demande de jumelage
{
  idEtudiant: string,
  idMentor: string,
  statut: 'en attente' | 'valide' | 'terminé',
  dateCreation: timestamp
}
```

## 🎨 Design

### Palette de couleurs
- **Primaire**: `#377DFF` (Bleu)
- **Fond**: `#E6F0FF` (Bleu clair)
- **Texte**: `#0f172a` (Gris foncé)
- **Succès**: `#22c55e` (Vert)

### Composants UI
- Design mobile-first
- Navigation par onglets
- Modales et overlays
- Animations et transitions
- Feedback visuel (confettis, badges)

## 🔧 Scripts disponibles

```bash
npm start          # Démarrer Expo
npm run android    # Lancer sur Android
npm run ios        # Lancer sur iOS
npm run web        # Lancer sur Web
npm run lint       # Linter le code
npm run reset-project # Reset du projet
```

## 📦 Déploiement

### Build de production

```bash
# Android
eas build --platform android

# iOS
eas build --platform ios

# Web
expo export:web
```

### Configuration EAS

Le fichier `eas.json` contient la configuration pour les builds de production.

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Équipe

- **Développement**: [Votre nom]
- **Design**: [Designer]
- **Backend**: [Backend developer]

## 📞 Support

Pour toute question ou problème :
- Ouvrir une [issue](https://github.com/votre-username/canada-student-integration/issues)
- Contacter l'équipe : [email@example.com]

## 🗺️ Roadmap

- [ ] Notifications push
- [ ] Système de notation des mentors
- [ ] Intégration calendrier
- [ ] Mode hors-ligne
- [ ] Multi-langues (EN/FR)
- [ ] Analytics avancées

---

<div align="center">
  <p>Fait avec ❤️ pour aider les étudiants internationaux au Canada</p>
  <p>🇨🇦 Welcome to Canada! 🇨🇦</p>
</div>