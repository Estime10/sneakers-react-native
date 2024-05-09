import { SafeAreaView, StyleSheet, ScrollView, StatusBar } from 'react-native';
import React from 'react';
import Header from '../components/home/Header';
import Stories from '../components/home/Stories';
import Post from '../components/home/Post';
import { POSTS } from '../data/posts';
import BottomTab, { BottomTabIcons } from '../components/home/BottomTab';

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='light-content' />
      <Header />
      <Stories />
      <ScrollView>
        {POSTS.map((post, index) => (
          <Post
            post={post}
            key={index}
          />
        ))}
      </ScrollView>
      <BottomTab icons={BottomTabIcons} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    flex: 1,
  },
});
export default HomeScreen;
