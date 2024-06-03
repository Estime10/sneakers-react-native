import {
  View,
  Text,
  Image,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
import { Formik } from 'formik'
import { Button } from 'react-native-elements'
import { LinearGradient } from 'expo-linear-gradient'
import * as ImagePicker from 'expo-image-picker'
import {
  firebaseAuth,
  firestoreDB,
  storage,
} from '../../../config/firebase.config'
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

const PLACEHOLDER_IMAGE =
  '/Users/Estime/Desktop/private/react_native/sneakers/assets/images/logo.png'

const uploadPostSchema = Yup.object().shape({
  imageUrl: Yup.string().required('an image is required'),
})

const FormikStoryUploader = ({ navigation }) => {
  const [thumbnailUrl, setThumbnailUrl] = useState(PLACEHOLDER_IMAGE)
  const [posts, setPosts] = useState([])

  const uploadPostToFirebase = async (imageUrl, caption) => {
    try {
      const currentUser = firebaseAuth.currentUser
      const userId = currentUser.email

      // Récupérer le document de l'utilisateur actuel
      const userDoc = await getDoc(doc(firestoreDB, 'users', userId))
      if (!userDoc.exists()) {
        throw new Error('User document does not exist')
      }

      await addDoc(collection(firestoreDB, 'users', userId, 'stories'), {
        imageUrl: imageUrl,
        user: userId,
        owner_uid: currentUser.uid,
        owner_email: currentUser.email,
        createdAt: serverTimestamp(),
        likes_by_users: [],
        username: userDoc.data().username,
      })

      navigation.goBack()
    } catch (error) {
      Alert.alert(error.message)
      console.error('Error uploading post:', error)
    }
  }

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (firebaseAuth.currentUser) {
        const userId = firebaseAuth.currentUser.email
        const userPostsRef = collection(firestoreDB, 'users', userId, 'stories')

        // Écouter les changements dans les posts de l'utilisateur
        const unsubscribe = onSnapshot(userPostsRef, snapshot => {
          const postsData = snapshot.docs.map(doc => doc.data())
          setPosts(postsData)
        })

        return () => unsubscribe()
      }
    }

    fetchUserPosts()
  }, [])

  const selectImage = async setFieldValue => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (result && !result.canceled) {
      setThumbnailUrl(result.assets[0].uri)
      const downloadURL = await uploadImage(result.assets[0].uri)
      setFieldValue('imageUrl', downloadURL)
    }
  }

  const uploadImage = async imageUrl => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()

      const temporaryId = Math.random().toString(36).substring(7)
      const storageRef = ref(
        storage,
        `images/${firebaseAuth.currentUser.uid}/${temporaryId}`
      )

      await uploadBytes(storageRef, blob)

      const downloadURL = await getDownloadURL(storageRef)

      return downloadURL
    } catch (error) {
      Alert.alert('Error uploading image')
      console.error('Error uploading image:', error)
      throw error
    }
  }

  const confirmSubmit = handleSubmit => {
    Alert.alert(
      'Proceed',
      'Are you sure you want to submit these modifications ?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Submission cancelled'),
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => {
            handleSubmit()
          },
        },
      ]
    )
  }

  const confirmClear = resetFields => {
    Alert.alert(
      'Confirm reset',
      'Are you sure you want to cancel the modifications?',
      [
        {
          text: 'No',
          onPress: () => console.log('Reset cancelled'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            console.log('Reset confirmed')
            resetFields()
          },
        },
      ]
    )
  }

  return (
    <Formik
      initialValues={{ imageUrl: '' }}
      onSubmit={values => {
        uploadPostToFirebase(values.imageUrl)
      }}
      validationSchema={uploadPostSchema}
      validateOnMount={true}>
      {({ handleSubmit, setFieldValue, errors, isValid }) => (
        <>
          <View style={styles.container}>
            <Image
              source={{
                uri: thumbnailUrl || currentUser.photoURL || PLACEHOLDER_IMAGE,
              }}
              style={{
                width: 400,
                height: 100,
                aspectRatio: 1,
                overflow: 'hidden',
                resizeMode: 'contain',
              }}
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => selectImage(setFieldValue)}>
              <LinearGradient
                colors={['#cdcdcd', '#485563', '#2b5876', '#4e4376']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}>
                <Text style={styles.buttonText}>UPLOAD STORY</Text>
              </LinearGradient>
            </TouchableOpacity>
            {isValid && (
              <Button
                title='clear'
                onPress={() => {
                  confirmClear(() => {
                    setThumbnailUrl(PLACEHOLDER_IMAGE)
                    setFieldValue('imageUrl', '')
                  })
                }}
                buttonStyle={{
                  backgroundColor: 'rgba(112, 112, 112, 0.5)',
                  borderRadius: 10,
                }}
                titleStyle={{
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: 12,
                }}
                containerStyle={{
                  width: 100,
                  marginTop: 25,
                  marginLeft: 32,
                }}
              />
            )}
          </View>
          {errors.imageUrl && (
            <Text style={styles.TextError}>{errors.imageUrl}</Text>
          )}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => confirmSubmit(handleSubmit)}
              disabled={!isValid}>
              <LinearGradient
                colors={
                  isValid
                    ? ['#cdcdcd', '#485563', '#2b5876', '#4e4376']
                    : ['#4e4376', '#2b5876', '#485563', '#cdcdcd']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.gradientButton, { opacity: isValid ? 1 : 0.5 }]}>
                <Text style={styles.buttonText}>SUBMIT</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </>
      )}
    </Formik>
  )
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 5,
    marginRight: 5,
    flexDirection: 'row',
  },

  buttonContainer: {
    marginTop: 50,
    marginLeft: 125,
    marginRight: 125,
  },
  buttonResetContainer: {
    marginTop: 20,
    marginLeft: 125,
    marginRight: 125,
  },

  CaptiontextInput: {
    color: 'white',
    fontSize: 20,
    textAlign: 'justify',
    overflow: 'hidden',
    marginTop: 20,
  },

  ImagetextInput: {
    color: 'white',
    fontSize: 18,
    marginTop: 10,
  },
  TextError: {
    marginTop: 10,
    fontSize: 10,
    color: '#CB3A3A',
    textTransform: 'uppercase',
    textAlign: 'center',
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
    fontSize: 15,
    textTransform: 'uppercase',
  },
})

export default FormikStoryUploader
