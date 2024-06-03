import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { Divider } from 'react-native-elements'
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore'
import { firebaseAuth, firestoreDB } from '../../config/firebase.config'
import { icons } from '../../constants'

const BANNER_IMAGE = require('/Users/Estime/Desktop/private/react_native/sneakers/assets/images/name.png')
const AVATAR_IMAGE = require('/Users/Estime/Desktop/private/react_native/sneakers/assets/images/logo.png')

const Profiles = ({ navigation }) => {
  const [userData, setUserData] = useState({})
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchUserData = async () => {
      if (firebaseAuth.currentUser) {
        const userEmail = firebaseAuth.currentUser.email
        const userRef = doc(firestoreDB, 'users', userEmail)
        onSnapshot(userRef, docSnap => {
          if (docSnap.exists()) {
            setUserData(docSnap.data())
          } else {
            console.log('Aucun document trouvé!')
          }
        })
      }
    }

    fetchUserData()
  }, [])

  useEffect(() => {
    const currentUser = firebaseAuth.currentUser
    if (currentUser) {
      const userId = currentUser.email
      const postsRef = collection(firestoreDB, 'users', userId, 'posts')
      const q = query(
        postsRef,
        where('user', '==', userId),
        orderBy('createdAt', 'desc')
      )

      const unsubscribe = onSnapshot(q, snapshot => {
        const postsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        setPosts(postsData)
      })

      return () => unsubscribe()
    }
  }, [])

  return (
    <View
      style={{
        height: '100%',
        marginBottom: 100,
      }}>
      <Options />
      <Banner userData={userData} />
      <Profile
        userData={userData}
        posts={posts}
        navigation={navigation}
      />
      <Divider
        style={{ marginTop: 20 }}
        width={1}
        orientation='vertical'
      />
      <DataGrid
        posts={posts}
        navigation={navigation}
      />
    </View>
  )
}
const Options = () => (
  <View>
    <View style={styles.iconContainer}>
      <TouchableOpacity>
        <Image
          source={icons.PLUS_HEADER}
          style={styles.icon}
        />
      </TouchableOpacity>

      <TouchableOpacity>
        <Image
          source={icons.NOTIFICATION}
          style={styles.icon}
        />
      </TouchableOpacity>

      <TouchableOpacity>
        <View style={styles.unreadBadge}>
          <Text></Text>
        </View>
        <Image
          source={icons.CHAT}
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  </View>
)
const Banner = ({ userData }) => (
  <View style={styles.BannerContainer}>
    <View style={styles.banner}>
      <Image
        source={
          userData.bannerImage ? { uri: userData.bannerImage } : BANNER_IMAGE
        }
        style={styles.image}
      />
      <View style={styles.profileContainer}>
        <Image
          source={userData.avatar ? { uri: userData.avatar } : AVATAR_IMAGE}
          style={styles.profileimage}
        />
      </View>
    </View>
  </View>
)
const Profile = ({ userData, posts, navigation }) => (
  <>
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 50,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View style={styles.profile}>
          <Text style={styles.username}>
            {userData.username ? userData.username : userData.owner_uid}
          </Text>
          <Text style={styles.useruid}>@{userData.owner_uid}</Text>
        </View>
      </View>
      <View style={styles.postContent}>
        <View style={styles.post}>
          <Text style={styles.postItems}>Post</Text>
          <Text style={styles.postNumber}>{posts.length}</Text>
        </View>
        <View style={styles.post}>
          <Text style={styles.postItems}>Followers</Text>
          <Text style={styles.postNumber}>10</Text>
        </View>
        <View style={styles.post}>
          <Text style={styles.postItems}>Following</Text>
          <Text style={styles.postNumber}>10</Text>
        </View>
      </View>
    </View>
    <>
      <View
        style={{
          marginTop: 20,
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
        }}>
        <View>
          <TouchableOpacity
            onPress={() => {
              navigation.push('ModifyProfileScreen')
            }}>
            <LinearGradient
              colors={['#cdcdcd', '#485563', '#2b5876', '#4e4376']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}>
              <Text style={styles.buttonText}>modify profile</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => {
              navigation.push('ModifySettingsScreen')
            }}>
            <LinearGradient
              colors={['#cdcdcd', '#485563', '#2b5876', '#4e4376']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}>
              <Text style={styles.buttonText}>modify settings</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </>
  </>
)
const DataGrid = ({ posts, navigation }) => (
  <View>
    <View style={styles.iconGridContainer}>
      <Image
        source={icons.HASH_TAG}
        style={styles.iconGrid}
      />
      <Image
        source={icons.TRADE}
        style={styles.iconGrid}
      />
      <Image
        source={icons.ARROBASE}
        style={styles.iconGrid}
      />
    </View>
    <View style={styles.grid}>
      {posts.map((post, index) => (
        <View
          key={index}
          style={styles.box}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ListOfPostScreen', { postId: post.id })
            }}>
            <Image
              source={{ uri: post.imageUrl }}
              style={styles.postImage}
            />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  </View>
)

const styles = StyleSheet.create({
  BannerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 1,
    paddingBottom: 10,
    marginTop: 15,
    width: '100%',
  },
  banner: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  profileContainer: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: 0,
    left: '50%',
    transform: [{ translateX: -50 }],
  },
  profileimage: {
    width: 150,
    height: 150,
    borderRadius: 100,
    position: 'absolute',
    bottom: -100,
    left: '20%',
    marginLeft: -150,
    borderWidth: 5,
  },
  profile: {
    marginLeft: 160,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffff',
  },
  useruid: {
    fontSize: 10,
    color: '#808080',
  },
  postContent: {
    marginTop: 20,
    marginLeft: 95,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  post: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginHorizontal: 18,
  },

  postItems: {
    fontSize: 14,
    color: '#808080',
    textAlign: 'right',
  },
  postNumber: {
    fontSize: 14,
    color: '#808080',
    textAlign: 'right',
  },
  gradientButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    textTransform: 'uppercase',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 30,
    paddingHorizontal: 20,
  },
  iconGridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 12,
  },
  icon: {
    width: 25,
    height: 25,
    marginLeft: 20,
    marginTop: -10,
  },
  iconGrid: {
    width: 25,
    height: 25,
  },
  unreadBadge: {
    backgroundColor: '#808080',
    position: 'absolute',
    left: 35,
    bottom: 16,
    borderRadius: 25,
    width: 14,
    height: 14,
    justifyContent: 'center',
    zIndex: 100,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  box: {
    width: '31%',
    margin: '0%',
  },
  postImage: {
    width: '100%',
    height: 120,
    resizeMode: 'fit',
    borderRadius: 10,
    marginBottom: 10,
  },
})
export default Profiles
