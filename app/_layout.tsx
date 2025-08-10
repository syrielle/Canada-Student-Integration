import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Href, Stack, usePathname, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

// Firebase
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../src/services/firebaseConfig.js';

// Onboarding flag
import { hasSeenOnboarding } from '../src/utils/onboarding';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const router = useRouter();
  const pathname = usePathname();
  const unsubUserRef = useRef<null | (() => void)>(null);

  // 1) Redirection vers /onboarding si jamais vu
  useEffect(() => {
    let mounted = true;
    (async () => {
      // ne pas interférer avec la page "suspended"
      if (pathname?.startsWith('/suspended')) return;
      const seen = await hasSeenOnboarding();
      if (mounted && !seen && pathname !== '/onboarding') {
        router.replace('/onboarding' as Href);
      }
    })();
    return () => { mounted = false; };
  }, [pathname, router]);

  // 2) Garde: compte suspendu (estValide === false)
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      // nettoyer ancienne souscription
      if (unsubUserRef.current) {
        unsubUserRef.current();
        unsubUserRef.current = null;
      }
      if (!user) return;

      const ref = doc(db, 'utilisateurs', user.uid);
      unsubUserRef.current = onSnapshot(ref, (snap) => {
        const estValide = (snap.data() as any)?.estValide ?? true;

        // si suspendu -> /suspended
        if (estValide === false && pathname !== '/suspended') {
          router.replace('/suspended' as Href);
        }
        // si réactivé alors qu'on est sur /suspended -> accueil (ou dashboard)
        if (estValide !== false && pathname === '/suspended') {
          router.replace('/' as Href);
        }
      });
    });

    return () => {
      unsubAuth();
      if (unsubUserRef.current) unsubUserRef.current();
    };
  }, [pathname, router]);

  if (!loaded) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Onboarding & Suspended */}
        <Stack.Screen name="onboarding/index" options={{ headerShown: false }} />
        <Stack.Screen name="suspended/index" options={{ headerShown: false }} />

        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
