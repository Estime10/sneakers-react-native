import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';

const Header = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <Image
          source={require('../../assets/images/logo-small.png')}
          style={styles.logo}
        />
      </TouchableOpacity>

      <View style={styles.iconContainer}>
        <TouchableOpacity>
          <Image
            source={require('../../assets/icons/plus-dark.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
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
    marginHorizontal: 20,
    paddingLeft: 10,
    paddingRight: 10,
  },

  iconContainer: {
    flexDirection: 'row',
  },

  logo: {
    width: 100,
    height: 100,
    marginLeft: -30,
    resizeMode: 'contain',
  },

  icon: {
    width: 30,
    height: 30,
    marginLeft: 20,
    resizeMode: 'contain',
  },

  unreadBadge: {
    backgroundColor: '#FF3250',
    position: 'absolute',
    left: 35,
    bottom: 18,
    borderRadius: 25,
    width: 25,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  unreadBadgeText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default Header;
