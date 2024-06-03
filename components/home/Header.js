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
import { LinearGradient } from 'expo-linear-gradient'

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
          <View>
            <LinearGradient
              colors={['#cdcdcd', '#485563', '#2b5876', '#4e4376']}
              style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>
                9+
                {/* {notifications.length} */}
              </Text>
            </LinearGradient>
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
    position: 'absolute',
    left: 30,
    bottom: 14,
    borderRadius: 20,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  unreadBadgeText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 10,
    padding: 1,
  },
})

export default Header
