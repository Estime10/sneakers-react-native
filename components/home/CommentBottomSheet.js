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
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native'
import {
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetFooter,
} from '@gorhom/bottom-sheet'
import { Divider, Button as RNButton } from 'react-native-elements'
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { firebaseAuth, firestoreDB } from '../../config/firebase.config'
import { icons } from '../../constants'
import moment from 'moment'
import { Formik } from 'formik'
import * as Yup from 'yup'

const BottomModal = forwardRef((props, ref) => {
  const { post } = props
  const [comments, setComments] = useState('')
  const [commentsList, setCommentsList] = useState([])
  const [replyInputVisibility, setReplyInputVisibility] = useState({})
  const inputRef = useRef('')

  const toggleReplyInput = commentId => {
    setReplyInputVisibility(prevState => ({
      ...prevState,
      [commentId]: !prevState[commentId],
    }))
  }

  useEffect(() => {
    inputRef.current = inputRef.current || {}
  }, [])

  useEffect(() => {
    const fetchPostComments = async () => {
      const postRef = doc(firestoreDB, 'users', post.userId, 'posts', post.id)
      const commentsCollectionRef = collection(postRef, 'comments')

      const unsubscribe = onSnapshot(
        query(commentsCollectionRef, orderBy('createdAt', 'desc')),
        snapshot => {
          const commentsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }))
          setCommentsList(commentsData)
        }
      )
      return () => unsubscribe()
    }

    fetchPostComments()
  }, [post.id, post.userId])

  const handleAddComment = async comment => {
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
          comment_likeed_by_user: [],
        }
      )
      setComments('')
    } catch (error) {
      Alert.alert(error.message)
      console.error('Error uploading post:', error)
    }
  }

  const handleLikeComment = async commentId => {
    const currentUserEmail = firebaseAuth.currentUser.email
    const commentRef = doc(
      firestoreDB,
      'users',
      post.userId,
      'posts',
      post.id,
      'comments',
      commentId
    )

    try {
      const docSnap = await getDoc(commentRef)

      if (!docSnap.exists()) {
        Alert.alert("Erreur : Le commentaire n'existe pas")
        return
      }

      const commentLikes = docSnap.data().liked_by_user || []
      const currentLikeStatus = !commentLikes.includes(currentUserEmail)

      await updateDoc(commentRef, {
        liked_by_user: currentLikeStatus
          ? arrayUnion(currentUserEmail)
          : arrayRemove(currentUserEmail),
      })

      // Mise à jour de l'état local du commentaire avec les nouveaux likes
      const updatedCommentsList = commentsList.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            liked_by_user: currentLikeStatus
              ? [...commentLikes, currentUserEmail]
              : commentLikes.filter(email => email !== currentUserEmail),
          }
        }
        return comment
      })
      setCommentsList(updatedCommentsList)
    } catch (error) {
      Alert.alert('Erreur lors de la mise à jour du statut de like')
      console.error('Erreur lors de la mise à jour du statut de like : ', error)
    }
  }

  const uploadPostSchema = Yup.object().shape({
    caption: Yup.string().max(2200, 'Caption has reached the character limit'),
  })

  const snapPoints = useMemo(() => ['90%'], [])

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
          handleAddComment(values.comment)
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
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
      accessible={false}>
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
              showsHorizontalScrollIndicator={true}
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  paddingBottom: 60,
                  paddingTop: 10,
                }}>
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
                            source={
                              comment.avatar ? comment.avatar : icons.TAB_AVATAR
                            }
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
                              marginTop: 14,
                            }}>
                            {comment.text}
                          </Text>
                          <View style={{ alignItems: 'center', marginTop: 10 }}>
                            <View style={{ flexDirection: 'row' }}>
                              <TouchableOpacity
                                onPress={() => {
                                  handleLikeComment(comment.id)
                                }}>
                                <Image
                                  style={{
                                    width: 15,
                                    height: 15,
                                    marginRight: 10,
                                  }}
                                  source={
                                    comment.liked_by_user &&
                                    comment.liked_by_user.includes(
                                      firebaseAuth.currentUser.email
                                    )
                                      ? icons.LIKED
                                      : icons.LIKE
                                  }
                                />
                              </TouchableOpacity>
                              <Text
                                style={{
                                  color: '#ffff',
                                  fontSize: 10,
                                  marginTop: 2,
                                }}>
                                {(
                                  comment.liked_by_user?.length || 0
                                ).toLocaleString('en')}{' '}
                              </Text>
                            </View>
                          </View>
                        </View>
                        <View style={{ marginBottom: 10 }}>
                          <TouchableOpacity
                            onPress={() => toggleReplyInput(comment.id)}>
                            <Text
                              style={{
                                color: '#ffff',
                                fontSize: 12,
                                marginTop: 0,
                              }}>
                              reply
                            </Text>
                          </TouchableOpacity>
                          {replyInputVisibility[comment.id] && (
                            <View
                              style={{
                                marginLeft: 25,
                                marginTop: 5,
                                width: '50%',
                              }}>
                              <TextInput
                                style={[
                                  styles.replyTextInput,
                                  { maxHeight: 50 },
                                ]}
                                placeholder='Reply'
                                placeholderTextColor={'#979A9A'}
                                multiline={true}
                                numberOfLines={2}
                                scrollEnabled={true}
                              />
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                  ))}
              </View>
            </ScrollView>
          </View>
        </BottomSheetModal>
      </View>
    </TouchableWithoutFeedback>
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
    marginTop: 10,
    flexDirection: 'row',
    height: 600,

    width: '100%',
  },
  commentContainer: {
    padding: 10,
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
