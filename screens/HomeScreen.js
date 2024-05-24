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
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'

const HomeScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([])
  const [users, setUsers] = useState([])

  useEffect(() => {
    const unsubscribeUsers = onSnapshot(
      collection(firestoreDB, 'users'),
      snapshot => {
        const usersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        setUsers(usersData)
      },
      error => {
        console.error(
          'Erreur lors de la récupération des utilisateurs : ',
          error
        )
      }
    )

    return () => {
      unsubscribeUsers()
    }
  }, [])

  useEffect(() => {
    const allPosts = []

    const fetchPosts = async () => {
      const usersSnapshot = await getDocs(collection(firestoreDB, 'users'))
      for (let userDoc of usersSnapshot.docs) {
        const userId = userDoc.id

        onSnapshot(collection(userDoc.ref, 'posts'), userPostsSnapshot => {
          userPostsSnapshot.docChanges().forEach(change => {
            const postDoc = change.doc
            const post = {
              id: postDoc.id,
              userId: userId,
              ...postDoc.data(),
            }

            if (change.type === 'added') {
              allPosts.push(post)
            } else if (change.type === 'modified') {
              const index = allPosts.findIndex(p => p.id === post.id)
              if (index !== -1) {
                allPosts[index] = post
              }
            } else if (change.type === 'removed') {
              const index = allPosts.findIndex(p => p.id === post.id)
              if (index !== -1) {
                allPosts.splice(index, 1)
              }
            }
          })

          allPosts.sort((a, b) => b.createdAt - a.createdAt)
          setPosts([...allPosts])
        })
      }
    }

    fetchPosts()
  }, [users])

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='light-content' />
      <Header navigation={navigation} />
      <Stories />
      <BottomSheetModalProvider>
        <ScrollView showsVerticalScrollIndicator={false}>
          {posts.map((post, index) => (
            <Post
              post={post}
              key={index}
            />
          ))}
        </ScrollView>
        <BottomTab icons={BottomTabIcons} />
      </BottomSheetModalProvider>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    flex: 1,
  },
});
export default HomeScreen;
