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
import { collection, doc, onSnapshot } from 'firebase/firestore'
import { firebaseAuth, firestoreDB } from '../config/firebase.config'
import { icons } from '../constants'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import PostList from '../components/profile/list/PostList'

const ListOfPostScreen = ({ navigation, route }) => {
  const [post, setPost] = useState(null)

  useEffect(() => {
    const userId = firebaseAuth.currentUser.email
    const postId = route.params.postId
    const postRef = doc(firestoreDB, 'users', userId, 'posts', postId)

    const unsubscribe = onSnapshot(
      postRef,
      doc => {
        if (doc.exists()) {
          setPost({
            id: doc.id,
            userId: userId,
            ...doc.data(),
          })
        } else {
          console.error('Aucun document trouvé pour ce post ID:', postId)
        }
      },
      error => {
        console.error('Erreur lors de la récupération du post : ', error)
      }
    )

    return () => unsubscribe()
  }, [route])

  if (!post) {
    return <Text>Chargement du post...</Text>
  }

  return (
    <SafeAreaView style={styles.container}>
      <BottomSheetModalProvider>
        <Header navigation={navigation} />
        <PostList post={post} />
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
