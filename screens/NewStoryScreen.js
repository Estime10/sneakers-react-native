import { View, Text, StyleSheet, SafeAreaView } from 'react-native'
import React from 'react'
import AddNewStory from '../components/story/AddNewStory'

const NewStoryScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <AddNewStory navigation={navigation} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    flex: 1,
  },
})

export default NewStoryScreen
