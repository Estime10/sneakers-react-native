import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { Divider } from 'react-native-elements';

export const BottomTabIcons = [
  {
    name: 'Home',
    active:
      '/Users/Estime/Desktop/private/react_native/sneakers/assets/icons/tabHome-active.png',
    inactive:
      '/Users/Estime/Desktop/private/react_native/sneakers/assets/icons/tabHome.png',
  },
  {
    name: 'Search',
    active:
      '/Users/Estime/Desktop/private/react_native/sneakers/assets/icons/tabSearch-active.png',
    inactive:
      '/Users/Estime/Desktop/private/react_native/sneakers/assets/icons/tabSearch.png',
  },
  {
    name: 'AddNewPost',
    active:
      '/Users/Estime/Desktop/private/react_native/sneakers/assets/icons/tabPlus-active.png',
    inactive:
      '/Users/Estime/Desktop/private/react_native/sneakers/assets/icons/tabPlus.png',
  },
  {
    name: 'Reel',
    active:
      '/Users/Estime/Desktop/private/react_native/sneakers/assets/icons/tabChart-active.png',
    inactive:
      '/Users/Estime/Desktop/private/react_native/sneakers/assets/icons/tabChart.png',
  },
  {
    name: 'Profile',
    active:
      '/Users/Estime/Desktop/private/react_native/sneakers/assets/icons/tabAvatar-active.png',
    inactive:
      '/Users/Estime/Desktop/private/react_native/sneakers/assets/icons/tabAvatar.png',
  },
]

const BottomTab = ({ icons }) => {
  const [activeTab, setActiveTab] = useState('Home')

  const Icon = ({ icon }) => (
    <TouchableOpacity onPress={() => setActiveTab(icon.name)}>
      <Image
        source={{ uri: activeTab === icon.name ? icon.active : icon.inactive }}
        style={[
          styles.icon,
          activeTab === 'Profile' && icon.name === activeTab,
        ]}
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
