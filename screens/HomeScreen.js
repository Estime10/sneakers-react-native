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
  const unsubscribes = {};

  const unsubscribeUsers = onSnapshot(
    collection(firestoreDB, 'users'),
    snapshot => {
      snapshot.docChanges().forEach(change => {
        const userId = change.doc.id;
        const userPostsRef = collection(firestoreDB, 'users', userId, 'posts');
        const postsQuery = query(userPostsRef, orderBy('createdAt', 'desc'));

        if (change.type === 'added' || change.type === 'modified') {
          const unsubscribePosts = onSnapshot(postsQuery, postsSnapshot => {
            const newPosts = postsSnapshot.docs.map(postDoc => ({
              id: postDoc.id,
              ...postDoc.data(),
            }));
            setPosts(prevPosts => [
              ...newPosts.filter(
                post => !prevPosts.some(prevPost => prevPost.id === post.id)
              ),
              ...prevPosts,
            ]);
          });

          unsubscribes[userId] = unsubscribePosts;
        } else if (change.type === 'removed') {
          if (unsubscribes[userId]) {
            unsubscribes[userId]();
            delete unsubscribes[userId];
          }
          setPosts(prevPosts =>
            prevPosts.filter(post => post.userId !== userId)
          );
        }
      });
    }
  );

  return () => {
    unsubscribeUsers();
    Object.values(unsubscribes).forEach(unsubscribe => unsubscribe());
  };
}, []);

return (
  <SafeAreaView style={styles.container}>
    <StatusBar barStyle='light-content' />
    <Header navigation={navigation} />
    <Stories />
    <ScrollView showsVerticalScrollIndicator={false}>
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
