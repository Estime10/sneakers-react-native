import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React from 'react';
import { firebaseAuth } from '../../config/firebase.config';
import { signOut } from 'firebase/auth';
import { icons } from '../../constants'

const handleSignOut = () =>
  signOut(firebaseAuth).then(() => console.log('sign out'))

const Header = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleSignOut}>
        <Image
          source={icons.LOGO_NAME}
          style={styles.logo}
        />
      </TouchableOpacity>

      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => navigation.push('NewPostScreen')}>
          <Image
            source={icons.PLUS_HEADER}
            style={styles.icon}
          />
        </TouchableOpacity>

        <TouchableOpacity>
          <Image
            source={icons.NOTIFICATION}
            style={styles.icon}
          />
        </TouchableOpacity>

        <TouchableOpacity>
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>30</Text>
          </View>
          <Image
            source={icons.CHAT}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

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
    backgroundColor: '#808080',
    position: 'absolute',
    left: 30,
    bottom: 16,
    borderRadius: 25,
    width: 20,
    height: 18,
    justifyContent: 'center',
    zIndex: 100,
  },
  unreadBadgeText: {
    color: '#fff',
    fontWeight: '700',
    padding: 1,
  },
})

export default Header;
