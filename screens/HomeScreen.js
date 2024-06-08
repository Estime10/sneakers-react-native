import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  StatusBar,
  View,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../components/home/Header'
import Stories from '../components/home/SubHeader'
import Post from '../components/home/Post'
import BottomTab, { BottomTabIcons } from '../components/navbar/BottomTab'
import { firebaseAuth, firestoreDB } from '../config/firebase.config'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
} from 'firebase/firestore'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { LoadingImage } from '../constants/loading'

const HomeScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([])
  const [users, setUsers] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

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
    const fetchCurrentUser = async () => {
      const userId = firebaseAuth.currentUser.email
      const userRef = doc(firestoreDB, 'users', userId)
      const userSnap = await getDoc(userRef)
      if (userSnap.exists()) {
        setCurrentUser(userSnap.data())
      } else {
        console.log("Aucune donnée disponible pour l'utilisateur actuel.")
      }
    }

    fetchCurrentUser()
  }, [])

  useEffect(() => {
    const fetchPosts = async () => {
      const usersSnapshot = await getDocs(collection(firestoreDB, 'users'))
      const allPosts = []
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
          setIsLoading(false)
        })
      }
    }

    fetchPosts()
  }, [users])

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='light-content' />
      <Header navigation={navigation} />
      <Stories navigation={navigation} />
      <BottomSheetModalProvider>
        <ScrollView showsVerticalScrollIndicator={false}>
          {isLoading ? (
            <View style={styles.loaderContainer}>
              <LoadingImage />
            </View>
          ) : (
            posts.map((post, index) => {
              const user = users.find(u => u.id === post.userId)
              return (
                <Post
                  post={post}
                  userData={user}
                  key={index}
                />
              )
            })
          )}
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    marginTop: 100,
  },
})
export default HomeScreen
