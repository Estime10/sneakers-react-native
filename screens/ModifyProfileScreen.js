import { View, Text, SafeAreaView, StyleSheet } from 'react-native'
import React from 'react'
import ModifyProfile from '../components/profile/update/ModifyProfile'
import ModifySettings from '../components/profile/update/ModifySettings'

const ModifyProfileScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ModifyProfile navigation={navigation} />
      <ModifySettings navigation={navigation} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    flex: 1,
  },
})

export default ModifyProfileScreen
