import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { Divider } from 'react-native-elements'
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore'
import { firebaseAuth, firestoreDB } from '../../../config/firebase.config'
import { icons } from '../../../constants'
import CommentBottomSheet from '../../modal/CommentBottomSheet'
import moment from 'moment/moment'

const Post = ({ post }) => {
  const [currentPost, setCurrentPost] = useState(post)
  const [commentCount, setCommentCount] = useState(0)
  const commentSheetRef = useRef(null)

  useEffect(() => {
    const postRef = doc(firestoreDB, 'users', post.userId, 'posts', post.id)

    const unsubscribe = onSnapshot(postRef, doc => {
      if (doc.exists()) {
        setCurrentPost(doc.data())
      } else {
        console.error('No such document!')
      }
    })

    return () => unsubscribe()
  }, [post.userId, post.id])

  useEffect(() => {
    const postRef = doc(firestoreDB, 'users', post.userId, 'posts', post.id)
    const commentsCollectionRef = collection(postRef, 'comments')

    const unsubscribeComments = onSnapshot(
      commentsCollectionRef,
      snapshot => {
        setCommentCount(snapshot.size)
      },
      error => {
        console.error('Failed to fetch comments:', error)
      }
    )

    return () => {
      unsubscribeComments()
    }
  }, [post.id, post.userId])

  const handleLike = async () => {
    const currentUserEmail = firebaseAuth.currentUser.email
    const postRef = doc(firestoreDB, 'users', post.userId, 'posts', post.id)
    const docSnap = await getDoc(postRef)

    if (!docSnap.exists()) {
      Alert.alert('Error: Post does not exist')
      return
    }

    const postLikes = docSnap.data().likes_by_users || []
    const currentLikeStatus = !postLikes.includes(currentUserEmail)

    try {
      await updateDoc(postRef, {
        likes_by_users: currentLikeStatus
          ? arrayUnion(currentUserEmail)
          : arrayRemove(currentUserEmail),
      })

      // Mise à jour de l'état local du post avec les nouveaux likes
      const updatedPost = {
        ...post,
        likes_by_users: currentLikeStatus
          ? [...postLikes, currentUserEmail]
          : postLikes.filter(email => email !== currentUserEmail),
      }
      setCurrentPost(updatedPost)
    } catch (error) {
      Alert.alert('Error updating like status')
      console.error('Error updating like status: ', error)
    }
  }

  const handleComment = () => {
    commentSheetRef.current?.present()
  }

  return (
    <View style={{ marginBottom: 50 }}>
      <Divider
        width={1}
        orientation='vertical'
      />
      <PostHeader post={post} />
      <PostImage post={post} />
      <View style={{ marginHorizontal: 15, marginTop: 10 }}>
        <PostFooter
          post={post}
          handleLike={handleLike}
          handleComment={handleComment}
        />
        <Likes post={post} />
        <Caption post={post} />
        <CommentSection
          post={post}
          commentCount={commentCount}
          handleComment={handleComment}
        />
        <CommentBottomSheet
          ref={commentSheetRef}
          post={post}
        />
      </View>
    </View>
  )
}

const PostHeader = ({ post }) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      margin: 5,
    }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
      <Image
        source={post.avatar ? post.avatar : icons.TAB_AVATAR}
        style={styles.story}
      />
      <Text
        style={{
          color: 'white',
          marginLeft: 8,
          fontSize: 14,
          fontWeight: 'bold',
        }}>
        {post.user}
      </Text>
    </View>
    <TouchableOpacity>
      <Text
        style={{
          color: 'white',
          fontWeight: 900,
          transform: [{ rotate: '90deg' }],
        }}>
        ...
      </Text>
    </TouchableOpacity>
  </View>
)

const PostImage = ({ post }) => (
  <View
    style={{
      width: '100%',
      height: 350,
      paddingTop: 5,
    }}>
    <Image
      source={{ uri: post.imageUrl }}
      style={{
        resizeMode: 'fit',
        height: 350,
        width: '100%',
      }}
    />
  </View>
)

const PostFooter = ({ handleLike, handleComment, post }) => (
  <View
    style={{
      flexDirection: 'row',
      justifyContent: 'space-between',

      paddingTop: 10,
    }}>
    <View style={styles.leftFooterIconContainer}>
      <TouchableOpacity onPress={() => handleLike(post)}>
        <Image
          style={styles.footerIcon}
          source={
            post.likes_by_users.includes(firebaseAuth.currentUser?.email)
              ? icons.LIKED
              : icons.LIKE
          }
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleComment}>
        <Image
          style={styles.footerIcon}
          source={icons.COMMENT}
        />
      </TouchableOpacity>

      <TouchableOpacity>
        <Image
          style={styles.footerIcon}
          source={icons.SHARE}
        />
      </TouchableOpacity>
    </View>
    <View>
      <TouchableOpacity>
        <Image
          style={styles.footerIcon}
          source={icons.BOOKMARK}
        />
      </TouchableOpacity>
    </View>
  </View>
)

const Likes = ({ post }) => (
  <View style={{ flexDirection: 'row', marginTop: 5 }}>
    <Text
      style={{
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
        marginTop: 5,
      }}>
      {(post.likes_by_users?.length || 0).toLocaleString('en')}{' '}
      {post.likes_by_users?.length > 1 ? 'likes' : 'like'}
    </Text>
  </View>
)

const Caption = ({ post }) => (
  <View style={{ marginTop: 10 }}>
    <Text style={{ color: 'white' }}>
      <Text style={{ fontWeight: '800' }}>{post.user}</Text>
      <Text> {post.caption}</Text>
    </Text>
  </View>
)

const CommentSection = ({ commentCount, handleComment, post }) => (
  <View style={{ marginTop: 5 }}>
    {commentCount > 0 ? (
      <TouchableOpacity onPress={handleComment}>
        <Text style={{ color: '#626567', marginTop: 5 }}>
          Voir {commentCount}{' '}
          {commentCount > 1 ? 'commentaires' : 'commentaire'}
        </Text>
      </TouchableOpacity>
    ) : null}
    <Text style={{ color: '#626567', marginTop: 5 }}>
      {post.createdAt
        ? moment(post.createdAt.toDate()).fromNow()
        : 'Date inconnue'}
    </Text>
  </View>
)

const styles = StyleSheet.create({
  story: {
    width: 35,
    height: 35,
    marginLeft: 6,
  },

  footerIcon: {
    width: 25,
    height: 25,
  },

  leftFooterIconContainer: {
    flexDirection: 'row',
    width: '25%',
    justifyContent: 'space-between',
  },
})
export default Post
