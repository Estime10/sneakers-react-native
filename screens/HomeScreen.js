import { SafeAreaView, StyleSheet, ScrollView, StatusBar } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../components/home/Header';
import Stories from '../components/home/Stories';
import Post from '../components/home/Post';
import BottomTab, { BottomTabIcons } from '../components/home/BottomTab';
import { firebaseAuth, firestoreDB } from '../config/firebase.config';
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  setDoc,
} from 'firebase/firestore';

const HomeScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (firebaseAuth.currentUser) {
      const userId = firebaseAuth.currentUser.email;
      const userPostsRef = collection(firestoreDB, 'users', userId, 'posts');

      // Ajouter les posts actuels de l'utilisateur
      posts.forEach(async post => {
        await addDoc(userPostsRef, {
          ...post,
          createdAt: new Date(),
        });
      });

      // Écouter les changements dans les posts de l'utilisateur
      const unsubscribe = onSnapshot(userPostsRef, snapshot => {
        const postsData = snapshot.docs.map(doc => doc.data());
        setPosts(postsData);
      });

      return () => unsubscribe();
    }
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
