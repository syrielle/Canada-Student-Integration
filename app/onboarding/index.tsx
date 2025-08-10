import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  GestureResponderEvent,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { markOnboardingSeen } from '../../src/utils/onboarding';

const { width } = Dimensions.get('window');

// Nom & slogan de l’app
const APP_NAME = 'Pas-à-pas Canada';
const TAGLINE = 'Ton compagnon d’intégration au Québec';

type Slide = {
  title: string;
  text: string;
  img: any; // require(...)
  primary: string;
  secondary: string | null;
};

const slides: Slide[] = [
  {
    title: 'Bienvenue sur Nom de l’App',
    text: "L’application qui t’accompagne dans chaque étape de ton processus d'immigration et d'integration au Canada et plus particulierement Québec.",
    img: require('../../assets/onboarding/slide1.png'),
    primary: 'Suivant',
    secondary: 'Ignorer',
  },
  {
    title: 'Suis ton parcours vers le succès de ton intégration au canada',
    text: "Recherche d'établissement, Admissions, visa, CAQ, logement … tout est centralisérien que pour toi!",
    img: require('../../assets/onboarding/slide2.png'),
    primary: 'Suivant',
    secondary: 'Ignorer',
  },
  {
    title: 'Crée du lien avant même d’arriver et même après ton arrivée',
    text: 'fais toi Jumelé avec un mentor, échange au sujet de ta procedure et reste motivé·e.',
    img: require('../../assets/onboarding/slide3.png'),
    primary: 'Commencer',
    secondary: null,
  },
];

export default function Onboarding() {
  const router = useRouter();
  const scRef = useRef<ScrollView | null>(null);
  const [index, setIndex] = useState(0);

  const goLogin = async () => {
    await markOnboardingSeen();
    router.replace('/index' as any);
  };

  const onNext = async () => {
    if (index === slides.length - 1) {
      return goLogin(); // dernière slide -> login
    }
    scRef.current?.scrollTo({ x: (index + 1) * width, animated: true });
    setIndex((i) => i + 1);
  };

  const onIgnore = () => goLogin();

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    if (i !== index) setIndex(i);
  };

  const handleIgnorePress = (e: GestureResponderEvent) => {
    e.stopPropagation();
    onIgnore();
  };

  const handlePrimaryPress = (e: GestureResponderEvent) => {
    e.stopPropagation();
    onNext();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {slides.map((s, i) => (
          <View key={i} style={[styles.slide, { width }]}>
            {/* Header pour combler le vide haut */}
            
            {/* Image héro plus grande */}
            <View style={styles.hero}>
              <Image source={s.img} style={styles.image} resizeMode="contain" />
            </View>

            <Text style={styles.title}>{s.title.replace('Nom de l’App', APP_NAME)}</Text>
            <Text style={styles.text}>{s.text}</Text>

            <View style={styles.dots}>
              {slides.map((_, di) => (
                <View key={di} style={[styles.dot, di === index && styles.dotActive]} />
              ))}
            </View>

            <View style={styles.actions}>
              {s.secondary && (
                <TouchableOpacity onPress={handleIgnorePress} style={[styles.btn, styles.btnGhost]}>
                  <Text style={[styles.btnTxt, { color: '#111827' }]}>Ignorer</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity onPress={handlePrimaryPress} style={[styles.btn, styles.btnPrimary]}>
                <Text style={styles.btnTxt}>{s.primary}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#a2daf2ff',alignItems: 'center',
  justifyContent: 'center', // Centre verticalement
  paddingHorizontal: 30, },

  slide: { flex: 1, padding: 24, justifyContent: 'flex-end' },

  // plus de header
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 0 },
  image: { width: '100%', height: '78%' }, // plus grand

  title: { 
    fontSize: 26, 
    fontWeight: '800', 
    color: '#0f172a', 
    textAlign: 'center', 
    marginBottom: 6,
    marginTop: -40 // remonte le titre
  },
  text: { 
    fontSize: 15, 
    color: '#334155', 
    textAlign: 'center', 
    marginBottom: 16 
  },

  dots: { flexDirection: 'row', justifyContent: 'center', marginBottom: 12, gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 999, backgroundColor: '#cbd5e1' },
  dotActive: { backgroundColor: '#3794ffff', width: 18 },

  actions: { flexDirection: 'row', gap: 12, justifyContent: 'center', marginBottom: 8 },
  btn: { paddingVertical: 12, paddingHorizontal: 18, borderRadius: 12 },
  btnGhost: { backgroundColor: '#ffffff' },
  btnPrimary: { backgroundColor: '#254791ff' },
  btnTxt: { color: '#fff', fontWeight: '700' },
});


