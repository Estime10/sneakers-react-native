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
import { Divider } from 'react-native-elements'
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
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
  const replyInputRefs = useRef({})

  const toggleReplyInput = (commentId, userOrEmail) => {
    setReplyInputVisibility(prevState => {
      const isVisible = !prevState[commentId]?.visible
      return {
        ...prevState,
        [commentId]: { visible: isVisible, userOrEmail: userOrEmail },
      }
    })
  }

  useEffect(() => {
    inputRef.current = inputRef.current || {}
  }, [])

  useEffect(() => {
    const fetchPostComments = async () => {
      const postRef = doc(firestoreDB, 'users', post.userId, 'posts', post.id)
      const commentsCollectionRef = collection(postRef, 'comments')
      const querySnapshot = await getDocs(
        query(commentsCollectionRef, orderBy('createdAt', 'desc'))
      )

      const commentsWithReplies = await Promise.all(
        querySnapshot.docs.map(async doc => {
          const commentData = { id: doc.id, ...doc.data() }
          const replies = await fetchReplies(doc.id)
          return { ...commentData, replies }
        })
      )

      setCommentsList(commentsWithReplies)
    }

    fetchPostComments()
  }, [post.id, post.userId])

  const fetchReplies = async commentId => {
    const repliesRef = collection(
      firestoreDB,
      'users',
      post.userId,
      'posts',
      post.id,
      'comments',
      commentId,
      'replies'
    )
    const snapshot = await getDocs(query(repliesRef, orderBy('createdAt')))
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }

  const handleAddComment = async comment => {
    try {
      const currentUser = firebaseAuth.currentUser
      if (!currentUser) {
        throw new Error('Aucun utilisateur connecté')
      }
      if (!inputRef.current) {
        throw new Error('Input reference is not defined')
      }

      await addDoc(
        collection(
          firestoreDB,
          'users',
          post.userId,
          'posts',
          post.id,
          'comments'
        ),
        {
          avatar: currentUser.photoURL || icons.TAB_AVATAR,
          owner_uid: currentUser.uid,
          owner_email: currentUser.email,
          text: comment,
          createdAt: serverTimestamp(),
          comment_liked_by_user: [],
        }
      )
      setComments('')
    } catch (error) {
      Alert.alert('Erreur', error.message)
      console.error("Erreur lors de l'ajout du commentaire : ", error)
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

  const handleReplyComment = async (commentId, replyText) => {
    const currentUser = firebaseAuth.currentUser
    if (!currentUser) {
      throw new Error('Aucun utilisateur connecté')
    }

    const commentRef = doc(
      firestoreDB,
      'users',
      post.userId,
      'posts',
      post.id,
      'comments',
      commentId
    )

    const repliesRef = collection(commentRef, 'replies')

    try {
      await addDoc(repliesRef, {
        avatar: currentUser.photoURL || icons.TAB_AVATAR,
        text: replyText,
        createdAt: serverTimestamp(),
        owner_uid: currentUser.uid,
        owner_email: currentUser.email,
      })
    } catch (error) {
      console.error("Erreur lors de l'ajout de la réponse : ", error)
      Alert.alert('Erreur', error.message)
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
                <Image
                  style={styles.sendButtonText}
                  source={icons.SEND}
                />
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
                          }}>
                          <Image
                            source={
                              comment.avatar ? comment.avatar : icons.TAB_AVATAR
                            }
                            style={styles.avatar}
                          />
                          <View>
                            <Text
                              style={{
                                color: '#ffff',
                                fontSize: 10,
                                fontWeight: 'bold',
                              }}>
                              {comment.username || comment.owner_email}
                            </Text>
                            <Text
                              style={{
                                color: '#ffff',
                                fontSize: 10,
                                paddingTop: 4,
                                textAlign: 'right',
                              }}>
                              {comment.createdAt
                                ? moment(comment.createdAt.toDate()).fromNow()
                                : 'N/A'}
                            </Text>
                          </View>
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
                            onPress={() =>
                              toggleReplyInput(
                                comment.id,
                                comment.username || comment.owner_email
                              )
                            }>
                            <Text
                              style={{
                                color: '#424242',
                                fontSize: 12,
                                marginTop: 8,
                                marginBottom: 5,
                              }}>
                              responde
                            </Text>
                          </TouchableOpacity>
                          {replyInputVisibility[comment.id]?.visible && (
                            <View
                              style={{
                                marginLeft: 25,
                                marginTop: 5,
                                width: '90%',
                                borderBottomWidth: 0.3,
                                borderBottomColor: '#979A9A',
                              }}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                }}>
                                <TextInput
                                  style={styles.replyTextInput}
                                  ref={el =>
                                    (replyInputRefs.current[comment.id] = el)
                                  }
                                  onChangeText={text => {
                                    if (replyInputRefs.current[comment.id]) {
                                      replyInputRefs.current[comment.id].value =
                                        text
                                    }
                                  }}
                                  placeholder={`Répondre à ${
                                    replyInputVisibility[comment.id].userOrEmail
                                  }`}
                                  placeholderTextColor={'#979A9A'}
                                  multiline={true}
                                  numberOfLines={2}
                                  scrollEnabled={true}
                                />
                                <TouchableOpacity
                                  onPress={() => {
                                    if (
                                      replyInputRefs.current[comment.id] &&
                                      replyInputRefs.current[comment.id].value
                                    ) {
                                      const replyText =
                                        replyInputRefs.current[comment.id].value
                                      handleReplyComment(comment.id, replyText)
                                    } else {
                                      console.error(
                                        'Erreur : Aucune valeur de réponse trouvée.'
                                      )
                                    }
                                  }}>
                                  <Image
                                    style={{
                                      width: 15,
                                      height: 15,
                                    }}
                                    source={icons.SEND}
                                  />
                                </TouchableOpacity>
                              </View>
                            </View>
                          )}
                          <View>
                            {comment.replies &&
                              comment.replies.map((reply, replyIndex) => (
                                <View
                                  key={replyIndex}
                                  style={{
                                    marginTop: 10,
                                    marginLeft: 20,
                                  }}>
                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      marginBottom: 5,
                                    }}>
                                    <Image
                                      source={reply.avatar || icons.TAB_AVATAR}
                                      style={styles.avatar}
                                    />
                                    <Text
                                      style={{
                                        color: '#fff',
                                        fontSize: 10,
                                        fontWeight: 'bold',
                                      }}>
                                      {reply.username || reply.owner_email}
                                    </Text>
                                  </View>
                                  <Text
                                    key={replyIndex}
                                    style={{
                                      color: '#fff',
                                      fontSize: 10,
                                      marginLeft: 20,
                                    }}>
                                    {reply.text}
                                  </Text>
                                </View>
                              ))}
                          </View>
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
    right: 5,
    bottom: -75,
    padding: 10,
  },
  sendButtonText: {
    width: 25,
    height: 25,
  },
  sendButtonReplyText: {
    color: '#ffffff',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: 10,
  },
  footerText: {
    textAlign: 'center',
    color: '#ffffff',
    fontWeight: '800',
    marginTop: 50,
  },
  replyTextInput: {
    fontSize: 10,
    height: 35,
    width: '100%',
    color: '#ffffff',
  },
})

export default BottomModal
