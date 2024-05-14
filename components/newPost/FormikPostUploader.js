import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  Button,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Divider, Button as RNButton } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { firebaseAuth, firestoreDB } from '../../config/firebase.config';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';

const PLACEHOLDER_IMAGE =
  '/Users/Estime/Desktop/private/react_native/sneakers/assets/images/logo.png';

const uploadPostSchema = Yup.object().shape({
  imageUrl: Yup.string().required('an image is required'),
  caption: Yup.string().max(2200, 'Caption has reached the character limit'),
});

const FormikPostUploader = ({ navigation }) => {
  const [thumbnailUrl, setThumbnailUrl] = useState(PLACEHOLDER_IMAGE);
  const [posts, setPosts] = useState([]);
  const uploadPostToFirebase = async (imageUrl, caption) => {
    try {
      const currentUser = firebaseAuth.currentUser;
      const userId = currentUser.email;

      // Récupérer le document de l'utilisateur actuel
      const userDoc = await getDoc(doc(firestoreDB, 'users', userId));
      if (!userDoc.exists()) {
        throw new Error('User document does not exist');
      }

      const userData = userDoc.data();
      const username = userData.username;
      console.log('Username:', username);
      console.log('User data:', userData);

      await addDoc(collection(firestoreDB, 'users', userId, 'posts'), {
        imageUrl: imageUrl,
        user: userId,
        avatar: currentUser.photoURL,
        owner_uid: currentUser.uid,
        caption: caption,
        createdAt: serverTimestamp(),
        likes: 0,
        comments: [],
      });

      navigation.goBack();
    } catch (error) {
      Alert.alert(error.message);
      console.error('Error uploading post:', error);
    }
  };

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (firebaseAuth.currentUser) {
        const userId = firebaseAuth.currentUser.email;
        const userPostsRef = collection(firestoreDB, 'users', userId, 'posts');

        // Écouter les changements dans les posts de l'utilisateur
        const unsubscribe = onSnapshot(userPostsRef, snapshot => {
          const postsData = snapshot.docs.map(doc => doc.data());
          setPosts(postsData);
        });

        return () => unsubscribe();
      }
    };

    fetchUserPosts();
  }, []);

  const selectImage = async setFieldValue => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (result && !result.canceled) {
      setThumbnailUrl(result.assets[0].uri);
      setFieldValue('imageUrl', result.assets[0].uri);
    }
  };

  return (
    <Formik
      initialValues={{ caption: '', imageUrl: '' }}
      onSubmit={values => {
        uploadPostToFirebase(values.imageUrl, values.caption);
      }}
      validationSchema={uploadPostSchema}
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
          <View style={styles.container}>
            <Image
              source={{
                uri: thumbnailUrl ? thumbnailUrl : PLACEHOLDER_IMAGE,
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
          <TextInput
            style={[styles.CaptiontextInput, { maxHeight: 200 }]}
            placeholder='Caption'
            placeholderTextColor={'#979A9A'}
            onChangeText={handleChange('caption')}
            onBlur={handleBlur('caption')}
            value={values.caption}
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
            <RNButton
              title='UPLOAD IMAGE'
              onPress={() => selectImage(setFieldValue)}
              buttonStyle={{
                backgroundColor: '#D0D3D4',
              }}
              titleStyle={{
                color: 'black',
                fontWeight: 'bold',
              }}
            />
            {isValid && (
              <Button
                title='clear'
                onPress={() => {
                  setThumbnailUrl(PLACEHOLDER_IMAGE);
                  setFieldValue('imageUrl', '');
                  setFieldValue('caption', '');
                }}
                titleStyle={{
                  color: 'black',
                  fontWeight: 'bold',
                }}
              />
            )}
          </View>
          {errors.imageUrl && (
            <Text style={styles.TextError}>{errors.imageUrl}</Text>
          )}
          <View style={styles.buttonContainer}>
            <RNButton
              onPress={handleSubmit}
              title='SHARE'
              disabled={!isValid}
              buttonStyle={{
                backgroundColor: isValid ? '#D0D3D4' : 'gray',
              }}
              titleStyle={{
                color: 'black',
                fontWeight: 'bold',
              }}
            />
          </View>
        </>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: 5,
    marginRight: 5,
    justifyContent: 'space-between',
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
});

export default FormikPostUploader;
