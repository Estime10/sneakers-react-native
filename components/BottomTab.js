import { View, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Divider } from 'react-native-elements'
import { useNavigation, useNavigationState } from '@react-navigation/native'
import { icons } from '../constants'
import { firebaseAuth, firestoreDB } from '../config/firebase.config'
import { doc, onSnapshot } from 'firebase/firestore'

export const BottomTabIcons = [
  {
    name: 'HomeScreen',
    screen: 'HomeScreen',
    icon: icons.HOMESCREEN,
  },
  {
    name: 'SearchScreen',
    screen: 'SearchScreen',
    icon: icons.SEARCHSCREEN,
  },
  {
    name: 'NewPostScreen',
    screen: 'NewPostScreen',
    icon: icons.NEWPOSTSCREEN,
  },
  {
    name: 'ChartScreen',
    screen: 'ChartScreen',
    icon: icons.CHARTSCREEN,
  },
  {
    name: 'ProfileScreen',
    screen: 'ProfileScreen',
    icon: icons.PROFILESCREEN,
  },
]

const BottomTab = () => {
  const navigation = useNavigation()
  const currentRoutes = useNavigationState(state => state.routes) // Obtenez les routes actuelles
  const [activeTab, setActiveTab] = useState('Home')
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      if (firebaseAuth.currentUser) {
        const userEmail = firebaseAuth.currentUser.email
        const userRef = doc(firestoreDB, 'users', userEmail)
        onSnapshot(userRef, docSnap => {
          if (docSnap.exists()) {
            setUserData(docSnap.data())
          } else {
            console.log('No document found!')
          }
        })
      }
    }

    fetchUserData()
  }, [])

  useEffect(() => {
    if (currentRoutes.length > 0) {
      const currentScreen = currentRoutes[currentRoutes.length - 1].name
      setActiveTab(currentScreen)
    }
  }, [currentRoutes]) // Mettez à jour activeTab chaque fois que les routes changent

  const Icon = ({ icon }) => {
    const sourceImage =
      icon.name === 'ProfileScreen' && userData?.avatar
        ? { uri: userData.avatar }
        : icon.icon

    const iconStyle = [
      styles.icon,
      icon.name === 'ProfileScreen' ? styles.roundIcon : null,
      activeTab === icon.name ? styles.activeIcon : null,
    ]

    return (
      <TouchableOpacity
        onPress={() => {
          setActiveTab(icon.name)
          navigation.navigate(icon.screen)
        }}>
        <View style={styles.iconContainer}>
          <Image
            source={sourceImage}
            style={iconStyle}
          />
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.wrapper}>
      <Divider
        width={1}
        orientation='vertical'
      />
      <View style={styles.container}>
        {BottomTabIcons.map((icon, index) => (
          <Icon
            icon={icon}
            key={index}
          />
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    backgroundColor: '#000000',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    height: 80,
    padding: 10,
  },
  icon: {
    width: 30,
    height: 30,
    marginTop: 10,
    marginBottom: 10,
  },
  roundIcon: {
    borderRadius: 15,
  },
  activeIcon: {
    backgroundColor: '#808080',
    padding: 5,
    borderRadius: 5,
  },
})
export default BottomTab
