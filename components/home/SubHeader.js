import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { icons } from '../../constants'
import { collection, doc, onSnapshot } from 'firebase/firestore'
import { firebaseAuth, firestoreDB } from '../../config/firebase.config'
import { LinearGradient } from 'expo-linear-gradient'
import UserAvatar from 'react-native-user-avatar'

const Stories = ({ navigation }) => {
  const [usersData, setUsersData] = useState([])

  useEffect(() => {
    const currentUserEmail = firebaseAuth.currentUser?.email

    const unsubscribe = onSnapshot(
      collection(firestoreDB, 'users'),
      snapshot => {
        let fetchedUsers = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))

        // Trier pour mettre le currentUser en premier
        if (currentUserEmail) {
          fetchedUsers = fetchedUsers.sort((a, b) => {
            if (a.email === currentUserEmail) return -1
            if (b.email === currentUserEmail) return 1
            return 0
          })
        }

        setUsersData(fetchedUsers)
      },
      error => {
        console.error('Erreur lors de la récupération des utilisateurs:', error)
      }
    )

    return () => unsubscribe()
  }, [])

  const currentUserEmail = firebaseAuth.currentUser?.email

  return (
    <View style={{ marginBottom: 13 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}>
        {usersData.map((user, index) => (
          <View
            key={index}
            style={styles.userContainer}>
            <View>
              {user.avatar ? (
                <TouchableOpacity
                  onPress={() => navigation.navigate('StoryScreen')}>
                  <Image
                    source={{ uri: user.avatar }}
                    style={styles.story}
                  />
                </TouchableOpacity>
              ) : (
                <UserAvatar
                  size={user.size || 50}
                  name={user.username || user.email}
                  bgColor={user.bgColor || '#000'}
                  textColor={user.textColor || '#fff'}
                  style={styles.story}
                />
              )}
              {user.email === currentUserEmail && (
                <View style={styles.plusIconContainer}>
                  <TouchableOpacity>
                    <LinearGradient
                      colors={['#cdcdcd', '#485563', '#2b5876', '#4e4376']}
                      style={styles.gradient}>
                      <TouchableOpacity
                        onPress={() => navigation.navigate('NewStoryScreen')}>
                        <Image
                          source={icons.PLUS_STORY}
                          style={styles.icon}
                        />
                      </TouchableOpacity>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}
              <Text style={styles.username}>
                {user.username
                  ? user.username.length > 8
                    ? `${user.username.slice(0, 8).toUpperCase()}...`
                    : user.username.toLowerCase()
                  : `${user.email.slice(0, 8).toUpperCase()}...`}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  story: {
    width: 65,
    height: 65,
    borderRadius: 50,
    marginLeft: 6,
    borderWidth: 3,
    borderColor: '#EFEDED',
    position: 'relative',
  },
  plusIconContainer: {
    position: 'absolute',
    right: 8,
    bottom: 16,
    width: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  gradient: {
    borderRadius: 50,
  },
  icon: {
    width: 24,
    height: 24,
  },
  username: {
    color: '#fff',
    marginTop: 5,
    fontSize: 10,
    fontWeight: 'semibold',
  },
  userContainer: {
    alignItems: 'center',
  },
})
export default Stories
