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
      '/Users/Estime/Desktop/private/react_native/sneakers/assets/icons/searchTab.png',
  },
  {
    name: 'Post',
    active:
      '/Users/Estime/Desktop/private/react_native/sneakers/assets/icons/tabPlus-active.png',
    inactive:
      '/Users/Estime/Desktop/private/react_native/sneakers/assets/icons/tabPlus.png',
  },
  {
    name: 'Reel',
    active:
      '/Users/Estime/Desktop/private/react_native/sneakers/assets/icons/reelTab-active.png',
    inactive:
      '/Users/Estime/Desktop/private/react_native/sneakers/assets/icons/reelTab.png',
  },
  {
    name: 'Profile',
    active:
      '/Users/Estime/Desktop/private/react_native/sneakers/assets/icons/profile.png',
    inactive:
      '/Users/Estime/Desktop/private/react_native/sneakers/assets/icons/profile.png',
  },
];

const BottomTab = ({ icons }) => {
  const [activeTab, setActiveTab] = useState('Home');

  const Icon = ({ icon }) => (
    <TouchableOpacity onPress={() => setActiveTab(icon.name)}>
      <Image
        source={{ uri: activeTab === icon.name ? icon.active : icon.inactive }}
        style={[
          styles.icon,
          icon.name === 'Profile' ? styles.profilePic() : null,
          activeTab === 'Profile' && icon.name === activeTab
            ? styles.profilePic(activeTab)
            : null,
        ]}
      />
    </TouchableOpacity>
  );

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
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    width: '100%',
    bottom: '3%',
    zIndex: 999,
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
    marginTop: 10,
  },
  profilePic: activeTab => ({
    borderRadius: 50,
    borderWidth: activeTab === 'Profile' ? 2 : 0,
    borderColor: '#CB3A3A',
  }),
});
export default BottomTab;
