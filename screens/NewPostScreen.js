import { SafeAreaView, StyleSheet } from 'react-native';
import React from 'react';
import AddNewPost from '../components/post/AddNewPost'

const NewPostScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <AddNewPost navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    flex: 1,
  },
});
export default NewPostScreen;
