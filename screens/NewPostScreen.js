import { SafeAreaView, StyleSheet } from 'react-native';
import React from 'react';
import AddNewPost from '../components/newPost/AddNewPost';

const NewPostScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <AddNewPost />
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
