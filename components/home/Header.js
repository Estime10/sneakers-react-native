import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';

const Header = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/name.png')}
        style={styles.logo}
      />

      <View style={styles.iconContainer}>
        <TouchableOpacity>
          <Image
            source={require('../../assets/icons/heart-dark.png')}
            style={styles.icon}
          />
        </TouchableOpacity>

        <TouchableOpacity>
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>30</Text>
          </View>
          <Image
            source={require('../../assets/icons/chat-dark.png')}
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
    width: 150,
    height: 85,
    marginLeft: -30,
    resizeMode: 'cover',
  },

  icon: {
    width: 25,
    height: 25,
    marginLeft: 20,
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
