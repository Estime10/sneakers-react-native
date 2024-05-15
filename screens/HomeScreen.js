import { SafeAreaView, StyleSheet, ScrollView, StatusBar } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../components/home/Header';
import Stories from '../components/home/Stories';
import Post from '../components/home/Post';
import BottomTab, { BottomTabIcons } from '../components/home/BottomTab';
import { firebaseAuth, firestoreDB } from '../config/firebase.config';
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';

const HomeScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = () => {
      const usersRef = collection(firestoreDB, 'users');

      onSnapshot(usersRef, usersSnapshot => {
        let allPosts = [];

        usersSnapshot.docs.forEach(userDoc => {
          const userId = userDoc.id;
          const userPostsRef = collection(
            firestoreDB,
            'users',
            userId,
            'posts'
          );
          const postsQuery = query(userPostsRef, orderBy('createdAt', 'desc'));

          onSnapshot(postsQuery, postsSnapshot => {
            allPosts = [];
            const userPosts = postsSnapshot.docs.map(postDoc => postDoc.data());

            allPosts = [...allPosts, ...userPosts];
            allPosts.sort((a, b) => b.createdAt - a.createdAt);

            setPosts([...allPosts]);
          });
        });
      });
    };

    fetchPosts();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='light-content' />
      <Header navigation={navigation} />
      <Stories />
      <ScrollView>
        {posts.map((post, index) => (
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
