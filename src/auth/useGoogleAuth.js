// src/auth/useGoogleAuth.js
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { useEffect } from 'react';
import { auth } from '../services/firebaseConfig';

WebBrowser.maybeCompleteAuthSession();

const { GOOGLE_CLIENT_ID } = Constants.expoConfig.extra;

export default function useGoogleAuth() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: GOOGLE_CLIENT_ID,
    expoClientId: GOOGLE_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(() => {
          console.log('✅ Connecté avec Google');
        })
        .catch((error) => {
          console.error('❌ Erreur Firebase :', error);
        });
    }
  }, [response]);

  return { promptAsync };
}
