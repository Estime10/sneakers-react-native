import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Profile from '../components/profile/Profile'
import BottomTab, { BottomTabIcons } from '../components/home/BottomTab'
import Post from '../components/home/Post'
import { firestoreDB } from '../config/firebase.config'
import { collection, getDocs, onSnapshot } from 'firebase/firestore'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'

const ProfileScreen = () => {
  const [posts, setPosts] = useState([])
  const [users, setUsers] = useState([])

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
      <BottomSheetModalProvider>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Profile
            users={users}
            posts={posts}
          />
        </ScrollView>
        <BottomTab icons={BottomTabIcons} />
      </BottomSheetModalProvider>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    flex: 1,
  },
})

export default ProfileScreen
