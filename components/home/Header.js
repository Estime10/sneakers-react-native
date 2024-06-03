import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native'
import React from 'react'
import { firebaseAuth } from '../../config/firebase.config'
import { signOut } from 'firebase/auth'
import { icons } from '../../constants'

const handleSignOut = () => {
  Alert.alert(
    'Confirm Logout',
    'Are you sure you want to logout ?',
    [
      {
        text: 'Cancel',
        onPress: () => console.log('Logout canceled'),
        style: 'cancel',
      },
      {
        text: 'Logout',
        onPress: () => {
          signOut(firebaseAuth)
            .then(() => {
              console.log('Logout success')
              Alert.alert(
                'Logout success',
                'You have been logged out successfully.',
                [{ text: 'OK' }],
                { cancelable: true }
              )
            })
            .catch(error => {
              console.error('Logout error:', error)
              Alert.alert(
                'Error',
                'An error occurred while trying to logout.',
                [
                  { text: 'Try again', onPress: () => handleSignOut() },
                  { text: 'Annuler', style: 'cancel' },
                ],
                { cancelable: true }
              )
            })
        },
      },
    ],
    { cancelable: false }
  )
}
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
        <TouchableOpacity>
          <Image
            source={icons.NOTIFICATION}
            style={styles.icon}
          />
        </TouchableOpacity>

        <TouchableOpacity>
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}></Text>
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
    marginTop: 15,
  },
  iconContainer: {
    flexDirection: 'row',
  },
  logo: {
    width: 250,
    height: 50,
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
    left: 35,
    bottom: 16,
    borderRadius: 25,
    width: 14,
    height: 14,
    justifyContent: 'center',
    zIndex: 100,
  },
  unreadBadgeText: {
    color: '#fff',
    fontWeight: '700',
    padding: 1,
  },
})

export default Header
