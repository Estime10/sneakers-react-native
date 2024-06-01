import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import BottomTab, { BottomTabIcons } from '../components/BottomTab'
import { collection, onSnapshot } from 'firebase/firestore'
import { firebaseAuth, firestoreDB } from '../config/firebase.config'
import { icons } from '../constants'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import PostList from '../components/profile/list/PostList'

const ListOfPostScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    // Assurez-vous que l'utilisateur est connecté et obtenez son ID
    const userId = firebaseAuth.currentUser.email
    const userPostsRef = collection(firestoreDB, 'users', userId, 'posts')

    const unsubscribe = onSnapshot(
      userPostsRef,
      snapshot => {
        const allPosts = snapshot.docs
          .map(doc => ({
            id: doc.id,
            userId: userId,
            ...doc.data(),
          }))
          .sort((a, b) => b.createdAt - a.createdAt)

        setPosts(allPosts)
      },
      error => {
        console.error('Erreur lors de la récupération des posts : ', error)
      }
    )

    return () => unsubscribe()
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <BottomSheetModalProvider>
        <Header navigation={navigation} />
        <ScrollView showsVerticalScrollIndicator={false}>
          {posts.map((post, index) => (
            <PostList
              post={post}
              key={index}
            />
          ))}
        </ScrollView>
        <BottomTab icons={BottomTabIcons} />
      </BottomSheetModalProvider>
    </SafeAreaView>
  )
}
const Header = ({ navigation }) => (
  <View style={styles.headerContainer}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Image
        source={icons.LEFT_ARROW}
        style={styles.icon}
      />
    </TouchableOpacity>
    <Text style={styles.headerText}>Posts</Text>
    <Text></Text>
  </View>
)
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    flex: 1,
  },
  icon: {
    width: 25,
    height: 25,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 20,
    textTransform: 'uppercase',
    marginRight: 25,
  },
})
export default ListOfPostScreen
