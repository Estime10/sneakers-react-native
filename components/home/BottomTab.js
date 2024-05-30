import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react'
import { Divider } from 'react-native-elements'
import { useNavigation, useNavigationState } from '@react-navigation/native'
import { icons } from '../../constants'

export const BottomTabIcons = [
  {
    name: 'HomeScreen',
    screen: 'HomeScreen',
    icon: icons.HOMESCREEN,
    iconActive: icons.HOMESCREEN_ACTIVE,
  },
  {
    name: 'SearchScreen',
    screen: 'SearchScreen',
    icon: icons.SEARCHSCREEN,
    iconActive: icons.SEARCHSCREEN_ACTIVE,
  },
  {
    name: 'NewPostScreen',
    screen: 'NewPostScreen',
    icon: icons.NEWPOSTSCREEN,
    iconActive: icons.NEWPOSTSCREEN_ACTIVE,
  },
  {
    name: 'ChartScreen',
    screen: 'ChartScreen',
    icon: icons.CHARTSCREEN,
    iconActive: icons.CHARTSCREEN_ACTIVE,
  },
  {
    name: 'ProfileScreen',
    screen: 'ProfileScreen',
    icon: icons.PROFILESCREEN,
    iconActive: icons.PROFILESCREEN_ACTIVE,
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
        source={activeTab === icon.name ? icon.iconActive : icon.icon}
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
    bottom: 0,
    backgroundColor: '#000000',
  },

  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 80,
    padding: 10,
  },
  icon: {
    width: 30,
    height: 30,
    marginTop: 10,
    marginBottom: 10,
  },
})
export default BottomTab;
