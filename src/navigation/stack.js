import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterScreen from '../screens/RegisterScreen';
// Tu ajouteras LoginScreen et HomeScreen plus tard

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Register">
        <Stack.Screen name="Register" component={RegisterScreen} />
        {/* Tu ajouteras les autres écrans ici */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
