import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  Button,
  Alert,
  TouchableOpacity,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
import { Formik } from 'formik'
import { Divider } from 'react-native-elements'
import { LinearGradient } from 'expo-linear-gradient'
import * as ImagePicker from 'expo-image-picker'
import {
  firebaseAuth,
  firestoreDB,
  storage,
} from '../../config/firebase.config'
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

const BANNER_IMAGE =
  '/Users/Estime/Desktop/private/react_native/sneakers/assets/images/name.png'
const AVATAR_IMAGE =
  '/Users/Estime/Desktop/private/react_native/sneakers/assets/images/logo.png'

const ModifyProfileFormSchema = Yup.object().shape({
  username: Yup.string()
    .min(1, 'Too Short')
    .max(20, 'Too Long')
    .test('is-unique', 'Username already taken', async value => {
      if (!value) return true
      const checkUsernameExists = async username => {
        const userRef = collection(firestoreDB, 'users')
        const querySnapshot = await getDocs(
          query(userRef, where('username', '==', username))
        )
        return querySnapshot.docs.length > 0
      }

      const exists = await checkUsernameExists(value)
      return !exists
    }),
  avatar: Yup.string().url('Invalid URL'),
  bannerImage: Yup.string().url('Invalid URL'),
})

const FormikModifyProfile = ({ navigation }) => {
  const [bannerImage, setBannerImage] = useState(BANNER_IMAGE)
  const [avatar, setAvatar] = useState(AVATAR_IMAGE)
  const [userProfile, setUserProfile] = useState([])

  const modifyProfile = async (username, avatar, bannerImage) => {
    try {
      const currentUser = firebaseAuth.currentUser
      const userId = currentUser.email
      const userRef = doc(firestoreDB, 'users', userId)

      const updatedUsername = username || userProfile.username
      const updatedAvatar = avatar || userProfile.avatar
      const updatedBannerImage = bannerImage || userProfile.bannerImage

      await setDoc(
        userRef,
        {
          username: updatedUsername,
          avatar: updatedAvatar,
          bannerImage: updatedBannerImage,
        },
        { merge: true }
      )

      navigation.goBack()
    } catch (error) {
      console.error('Error updating profile:', error)
      Alert.alert('Error updating profile', error.message)
    }
  }

  useEffect(() => {
    const fetchUserProfile = async () => {
      const currentUser = firebaseAuth.currentUser
      const userId = currentUser.email
      const userDoc = await getDoc(doc(firestoreDB, 'users', userId))
      setUserProfile(userDoc.data())
    }
    fetchUserProfile()
  }, [])

  const selectAvatar = async setFieldValue => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (result && !result.canceled) {
      const downloadURL = await uploadAvatar(result.assets[0].uri)
      setAvatar(downloadURL)
      setFieldValue('avatar', downloadURL)
    }
  }
  const uploadAvatar = async avatar => {
    try {
      const response = await fetch(avatar)
      const blob = await response.blob()

      const temporaryId = Math.random().toString(36).substring(7)
      const storageRef = ref(
        storage,
        `avatars/${firebaseAuth.currentUser.uid}/${temporaryId}`
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

  const selectBanner = async setFieldValue => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (result && !result.canceled) {
      const downloadURL = await uploadBannerImage(result.assets[0].uri)
      setBannerImage(downloadURL)
      setFieldValue('bannerImage', downloadURL)
    }
  }

  const uploadBannerImage = async bannerImage => {
    try {
      const response = await fetch(bannerImage)
      const blob = await response.blob()

      const temporaryId = Math.random().toString(36).substring(7)
      const storageRef = ref(
        storage,
        `banners/${firebaseAuth.currentUser.uid}/${temporaryId}`
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
  const confirmClear = setFieldValue => {
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
            setFieldValue('username', '')
            setFieldValue('avatar', AVATAR_IMAGE)
            setFieldValue('bannerImage', BANNER_IMAGE)
            setAvatar(AVATAR_IMAGE)
            setBannerImage(BANNER_IMAGE)
          },
        },
      ]
    )
  }

  return (
    <Formik
      initialValues={{ username: '', avatar: '', bannerImage: '' }}
      onSubmit={(values, { setSubmitting }) => {
        modifyProfile(values.username, values.avatar, values.bannerImage)
        setSubmitting(false)
      }}
      validationSchema={ModifyProfileFormSchema}
      validateOnMount={true}>
      {({
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        values,
        errors,
        isValid,
      }) => (
        <>
          <View style={styles.BannerContainer}>
            <View style={styles.banner}>
              <Image
                source={{ uri: bannerImage }}
                style={styles.image}
              />
            </View>
            <View style={styles.profileContainer}>
              <Image
                source={{ uri: avatar }}
                style={styles.profileimage}
              />
            </View>
          </View>

          <TextInput
            style={[styles.CaptiontextInput, { maxHeight: 200 }]}
            placeholder='Username'
            placeholderTextColor={'#979A9A'}
            onChangeText={handleChange('username')}
            onBlur={handleBlur('username')}
            value={values.username}
            multiline={true}
            numberOfLines={4}
            scrollEnabled={true}
          />
          <Divider
            width={0.2}
            orientation='vertical'
            style={{ marginTop: 10 }}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => selectAvatar(setFieldValue)}>
              <LinearGradient
                colors={['#cdcdcd', '#485563', '#2b5876', '#4e4376']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}>
                <Text style={styles.buttonText}>UPLOAD AVATAR</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => selectBanner(setFieldValue)}>
              <LinearGradient
                colors={['#cdcdcd', '#485563', '#2b5876', '#4e4376']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}>
                <Text style={styles.buttonText}>UPLOAD BANNER</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: 50 }}>
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
                style={styles.gradientButton}>
                <Text style={styles.buttonText}>submit modifications</Text>
              </LinearGradient>
            </TouchableOpacity>
            <Button
              title='reset'
              onPress={() => confirmClear(setFieldValue)}
            />
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
    flexDirection: 'row',
    marginTop: 50,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  BannerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 0,
    marginBottom: 200,
    width: '100%',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  banner: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
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
    borderColor: '#ffffff',
  },
})

export default FormikModifyProfile
