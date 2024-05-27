import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react'
import { Divider } from 'react-native-elements'
import { useNavigation, useNavigationState } from '@react-navigation/native'

export const BottomTabIcons = [
  {
    name: 'HomeScreen',
    active:
      '/Users/Estime/Desktop/private/react_native/sneakers/assets/icons/tabHome-active.png',
    inactive:
      '/Users/Estime/Desktop/private/react_native/sneakers/assets/icons/tabHome.png',
    screen: 'HomeScreen',
  },
  {
    name: 'SearchScreen',
    active:
      '/Users/Estime/Desktop/private/react_native/sneakers/assets/icons/tabSearch-active.png',
    inactive:
      '/Users/Estime/Desktop/private/react_native/sneakers/assets/icons/tabSearch.png',
    screen: 'SearchScreen',
  },
  {
    name: 'NewPostScreen',
    active:
      '/Users/Estime/Desktop/private/react_native/sneakers/assets/icons/tabPlus-active.png',
    inactive:
      '/Users/Estime/Desktop/private/react_native/sneakers/assets/icons/tabPlus.png',
    screen: 'NewPostScreen',
  },
  {
    name: 'ChartScreen',
    active:
      '/Users/Estime/Desktop/private/react_native/sneakers/assets/icons/tabChart-active.png',
    inactive:
      '/Users/Estime/Desktop/private/react_native/sneakers/assets/icons/tabChart.png',
    screen: 'ChartScreen',
  },
  {
    name: 'ProfileScreen',
    active:
      '/Users/Estime/Desktop/private/react_native/sneakers/assets/icons/tabAvatar-active.png',
    inactive:
      '/Users/Estime/Desktop/private/react_native/sneakers/assets/icons/tabAvatar.png',
    screen: 'ProfileScreen',
  },
]

const BottomTab = ({ icons }) => {
  const navigation = useNavigation()
  const [activeTab, setActiveTab] = useState('Home')
  const currentRoutes = useNavigationState(state => state.routes)

  useEffect(() => {
    if (currentRoutes.length > 0) {
      const currentScreen = currentRoutes[currentRoutes.length - 1].name
      setActiveTab(currentScreen)
    }
  }, [currentRoutes])

  const Icon = ({ icon }) => (
    <TouchableOpacity
      onPress={() => {
        setActiveTab(icon.name)
        navigation.navigate(icon.screen)
      }}>
      <Image
        source={{ uri: activeTab === icon.name ? icon.active : icon.inactive }}
        style={styles.icon}
      />
    </TouchableOpacity>
  )

  return (
    <View style={styles.wrapper}>
      <Divider
        width={1}
        orientation='vertical'
      />
      <View style={styles.container}>
        {icons.map((icon, index) => (
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
    bottom: '3%',
    backgroundColor: '#000000',
  },

  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 50,
    padding: 10,
  },
  icon: {
    width: 30,
    height: 30,
    marginTop: 5,
    marginBottom: 10,
  },
})
export default BottomTab;
