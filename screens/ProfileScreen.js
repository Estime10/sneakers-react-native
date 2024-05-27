import { View, Text, StyleSheet, SafeAreaView } from 'react-native'
import React from 'react'
import Header from '../components/profile/Header'
import BottomTab, { BottomTabIcons } from '../components/home/BottomTab'

const ProfileScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Header />
      </View>
      <BottomTab icons={BottomTabIcons} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    flex: 1,
  },
})

export default ProfileScreen
