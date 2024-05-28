import { View, Text, SafeAreaView, StyleSheet } from 'react-native'
import React from 'react'
import ModifyProfile from '../components/profile/ModifyProfile'

const ModifyProfileScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ModifyProfile navigation={navigation} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    flex: 1,
  },
  text: {
    color: 'white',
    fontSize: 20,
  },
})

export default ModifyProfileScreen
