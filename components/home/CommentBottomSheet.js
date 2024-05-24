import React, {
  forwardRef,
  useCallback,
  useEffect,
  useState,
  useMemo,
  useRef,
} from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetTextInput,
  BottomSheetFooter,
} from '@gorhom/bottom-sheet'
import { Divider, Button as RNButton } from 'react-native-elements'
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore'
import { firebaseAuth, firestoreDB } from '../../config/firebase.config'
import moment from 'moment'
import { Formik } from 'formik'
import * as Yup from 'yup'

const LIKE =
  '/Users/Estime/Desktop/private/react_native/sneakers/assets/icons/footer_heart.png'
const LIKED =
  '/Users/Estime/Desktop/private/react_native/sneakers/assets/icons/heart-fullDark.png'
const AVATAR =
  '/Users/Estime/Desktop/private/react_native/sneakers/assets/icons/avatar_dark.png'

const BottomModal = forwardRef((props, ref) => {
  const { post } = props
  const [comments, setComments] = useState('')
  const [commentsList, setCommentsList] = useState([])
  const inputRef = useRef('')
  useEffect(() => {
    inputRef.current = inputRef.current || {}
  }, [])

  useEffect(() => {
    const fetchPostComments = async () => {
      const postRef = doc(firestoreDB, 'users', post.userId, 'posts', post.id)
      const commentsCollectionRef = collection(postRef, 'comments')

      const unsubscribe = onSnapshot(commentsCollectionRef, snapshot => {
        const commentsData = snapshot.docs.map(doc => doc.data())
        setCommentsList(commentsData)
      })

      return () => unsubscribe()
    }

    fetchPostComments()
  }, [post.id, post.userId])

  const AddAComment = async comment => {
    try {
      const currentUser = firebaseAuth.currentUser
      const userId = currentUser.email
      if (!inputRef.current) {
        throw new Error('Input reference is not defined')
      }

      const userDoc = await getDoc(doc(firestoreDB, 'users', userId))
      if (!userDoc.exists()) {
        throw new Error('User document does not exist')
      }

      await addDoc(
        collection(firestoreDB, 'users', userId, 'posts', post.id, 'comments'),
        {
          user: userId,
          avatar: currentUser.photoURL,
          owner_uid: currentUser.uid,
          owner_email: currentUser.email,
          text: comment,
          createdAt: serverTimestamp(),
        }
      )
      setComments('')
    } catch (error) {
      Alert.alert(error.message)
      console.error('Error uploading post:', error)
    }
  }

  const uploadPostSchema = Yup.object().shape({
    imageUrl: Yup.string().required('an image is required'),
    caption: Yup.string().max(2200, 'Caption has reached the character limit'),
  })

  const snapPoints = useMemo(() => ['100%'], [])

  const renderBackdrop = useCallback(
    () => (
      <View
        style={styles.backdrop}
        onStartShouldSetResponder={() => {
          ref.current.dismiss()
          return true
        }}
      />
    ),
    [ref]
  )

  const renderFooter = useCallback(
    props => (
      <Formik
        initialValues={{ comment: '' }}
        onSubmit={(values, { resetForm }) => {
          AddAComment(values.comment)
            .then(() => {
              resetForm()
            })
            .catch(error => {
              console.error('Error uploading comment:', error)
              Alert.alert('Error', error.message)
            })
        }}
        validationSchema={uploadPostSchema}
        validateOnMount={true}>
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <BottomSheetFooter
            {...props}
            style={styles.footerContaint}
            enabledGestureInteraction={true}>
            <Divider
              width={1}
              orientation='vertical'
              style={{ marginBottom: 1, color: '#ffff' }}
            />
            <View>
              <BottomSheetTextInput
                style={styles.footerContainer}
                placeholder='Add a comment'
                placeholderTextColor='#979A9A'
                onChangeText={handleChange('comment')}
                onBlur={handleBlur('comment')}
                value={values.comment}
                multiline={true}
                numberOfLines={4}
                scrollEnabled={true}
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSubmit}>
                <Text style={styles.sendButtonText}>Envoyer</Text>
              </TouchableOpacity>
            </View>
          </BottomSheetFooter>
        )}
      </Formik>
    ),
    [comments, commentsList, post, snapPoints, ref]
  )

  return (
    <View>
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        handlePanDownToClose={true}
        handleIndicatorStyle={styles.indicator}
        backgroundStyle={{
          backgroundColor: '#000000',
        }}
        backdropComponent={renderBackdrop}
        footerComponent={renderFooter}>
        <View>
          <Text style={styles.title}>Comments</Text>
          <Divider
            width={1}
            orientation='vertical'
            style={styles.divider}
          />
        </View>
        <View style={styles.scrollViewContainer}>
          <ScrollView
            vertical
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.commentContainer}>
            {Array.isArray(commentsList) &&
              commentsList.map((comment, index) => (
                <View key={index}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'flex-end',
                      }}>
                      <Image
                        source={{
                          uri: comment.avatar ? comment.avatar : AVATAR,
                        }}
                        style={styles.avatar}
                      />
                      <Text
                        style={{
                          color: '#ffff',
                          paddingRight: 50,
                          fontSize: 10,
                          fontWeight: 'bold',
                        }}>
                        {comment.username ? comment.username : comment.user}
                      </Text>
                      <Text
                        style={{
                          color: '#ffff',
                          fontSize: 10,
                        }}>
                        {comment.createdAt
                          ? moment(comment.createdAt.toDate()).fromNow()
                          : 'N/A'}
                      </Text>
                    </View>
                  </View>
                  <View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          color: '#ffff',
                          fontSize: 12,

                          width: '90%',
                          marginTop: 8,
                        }}>
                        {comment.text}
                      </Text>
                      <View style={{ alignItems: 'center', marginTop: 10 }}>
                        <TouchableOpacity>
                          <Image
                            source={{ uri: LIKE }}
                            style={{ width: 15, height: 15 }}
                          />
                        </TouchableOpacity>
                        <Text
                          style={{
                            color: '#ffff',
                            fontSize: 10,
                            marginTop: 2,
                          }}>
                          {comment.liked ? comment.liked : 0}
                        </Text>
                      </View>
                    </View>
                    <View>
                      <TouchableOpacity>
                        <Text
                          style={{
                            color: '#ffff',
                            fontSize: 12,
                            marginTop: 0,
                          }}>
                          reply
                        </Text>
                      </TouchableOpacity>
                      <View
                        style={{
                          marginLeft: 25,
                          marginTop: 5,
                          width: '50%',
                        }}>
                        <TextInput
                          style={[styles.replyTextInput, { maxHeight: 50 }]}
                          placeholder='Reply'
                          placeholderTextColor={'#979A9A'}
                          multiline={true}
                          numberOfLines={2}
                          scrollEnabled={true}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              ))}
          </ScrollView>
        </View>
      </BottomSheetModal>
    </View>
  )
})

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    marginLeft: 5,
    marginRight: 5,
    flexDirection: 'row',
  },
  indicator: { backgroundColor: '#808080', marginTop: 35 },
  divider: { marginTop: 10, color: '#ffff' },
  title: {
    color: '#ffffff',
    marginTop: 1,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  scrollViewContainer: {
    flexDirection: 'row',
    margin: 10,
    height: 320,
  },
  commentContainer: {
    padding: 1,
  },
  comment: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 1,
    color: '#ffff',
  },
  avatar: {
    width: 15,
    height: 15,
    borderRadius: 15,
    marginRight: 3,
  },
  username: {
    color: '#ffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  footerContaint: {
    backgroundColor: '#000000',
    marginTop: 50,
    height: 200,
  },
  footerContainer: {
    color: '#ffff',
    fontSize: 14,
    textAlign: 'justify',
    padding: 1,
    height: 50,
    zIndex: 1,
  },
  input: {
    color: '#ffff',
    fontSize: 14,
    textAlign: 'justify',
    padding: 10,
    width: '100%',
    height: 100,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sendButton: {
    position: 'absolute',
    right: 25,
    bottom: -50,
    padding: 10,
  },
  sendButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  footerText: {
    textAlign: 'center',
    color: '#ffffff',
    fontWeight: '800',
    marginTop: 50,
  },
  replyTextInput: {
    color: '#ffffff',
    fontSize: 12,
    textAlign: 'justify',
    marginTop: 0,
    marginBottom: 10,
  },
})

export default BottomModal
