import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';

const LOGO_NAME =
  '/Users/Estime/Desktop/private/react_native/sneakers/assets/images/name.png';
const PLUS =
  '/Users/Estime/Desktop/private/react_native/sneakers/assets/icons/plusHeader.png';
const HEART =
  '/Users/Estime/Desktop/private/react_native/sneakers/assets/icons/heart-dark.png';
const CHAT =
  '/Users/Estime/Desktop/private/react_native/sneakers/assets/icons/chat-dark.png';

const Header = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: LOGO_NAME }}
        style={styles.logo}
      />

      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => navigation.push('AddNewPost')}>
          <Image
            source={{ uri: PLUS }}
            style={styles.icon}
          />
        </TouchableOpacity>

        <TouchableOpacity>
          <Image
            source={{ uri: HEART }}
            style={styles.icon}
          />
        </TouchableOpacity>

        <TouchableOpacity>
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>30</Text>
          </View>
          <Image
            source={{ uri: CHAT }}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },

  iconContainer: {
    flexDirection: 'row',
  },

  logo: {
    width: 250,
    height: 85,
    marginLeft: -50,
    marginTop: 10,
    resizeMode: 'cover',
  },

  icon: {
    width: 25,
    height: 25,
    marginLeft: 20,
    marginTop: -20,

    resizeMode: 'contain',
  },

  unreadBadge: {
    backgroundColor: '#CB3A3A',
    position: 'absolute',
    left: 32,
    bottom: 16,
    borderRadius: 25,
    width: 20,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  unreadBadgeText: {
    color: 'white',
    fontWeight: '600',
    padding: 1,
  },
});

export default Header;
