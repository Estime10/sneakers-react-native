import { View, StyleSheet, Image } from 'react-native';
import React from 'react';
import SignupForm from '../components/auth/SignupForm';

const LOGO =
  '/Users/Estime/Desktop/private/react_native/sneakers/assets/images/logo.png';

const SignupScreen = ({ navigation }) => (
  <View style={styles.container}>
    <View style={styles.logoContainer}>
      <Image
        source={{ uri: LOGO }}
        style={styles.logo}
      />
    </View>
    <SignupForm navigation={navigation} />
  </View>
);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingTop: 50,
    paddingHorizontal: 12,
  },
  logoContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 60,
  },
  logo: {
    width: 200,
    height: 200,
  },
});

export default SignupScreen;
