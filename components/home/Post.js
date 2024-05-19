import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react'
import { Divider } from 'react-native-elements'
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore'
import { firebaseAuth, firestoreDB } from '../../config/firebase.config'

const AVATAR =
  '/Users/Estime/Desktop/private/react_native/sneakers/assets/icons/avatar_dark.png'
const LIKE =
  '/Users/Estime/Desktop/private/react_native/sneakers/assets/icons/footer_heart.png'
const LIKED =
  '/Users/Estime/Desktop/private/react_native/sneakers/assets/icons/heart-fullDark.png'
const COMMENT =
  '/Users/Estime/Desktop/private/react_native/sneakers/assets/icons/comment-dark.png'
const SHARE =
  '/Users/Estime/Desktop/private/react_native/sneakers/assets/icons/share.png'
const SAVE =
  '/Users/Estime/Desktop/private/react_native/sneakers/assets/icons/bookmark.png'

const Post = ({ post }) => {
  const [currentPost, setCurrentPost] = useState(post)
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
        />
        <Likes post={post} />
        <Caption post={post} />
        <CommentSection post={post} />
        <Comments post={post} />
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
        source={{ uri: post.avatar || AVATAR }}
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
      <Text style={{ color: 'white', fontWeight: 900 }}>...</Text>
    </TouchableOpacity>
  </View>
)

const PostImage = ({ post }) => (
  <View style={{ width: '100%', height: 450 }}>
    <Image
      source={{ uri: post.imageUrl }}
      style={{
        resizeMode: 'cover',
        height: '100%',
        width: '100%',
      }}
    />
  </View>
)

const PostFooter = ({ handleLike, post }) => (
  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
    <View style={styles.leftFooterIconContainer}>
      <TouchableOpacity onPress={() => handleLike(post)}>
        <Image
          style={styles.footerIcon}
          source={{ uri: post.likes > 0 ? LIKED : LIKE }}
        />
      </TouchableOpacity>
      <TouchableOpacity>
        <Image
          style={styles.footerIcon}
          source={{ uri: COMMENT }}
        />
      </TouchableOpacity>
      <TouchableOpacity>
        <Image
          style={styles.footerIcon}
          source={{ uri: SHARE }}
        />
      </TouchableOpacity>
    </View>
    <View>
      <TouchableOpacity>
        <Image
          style={styles.footerIcon}
          source={{ uri: SAVE }}
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
);

const CommentSection = ({ post }) => (
  <View style={{ marginTop: 5 }}>
    {!!post.comments.length && (
      <Text style={{ color: '#626567', marginTop: 5 }}>
        View {post.comments.length > 1 ? 'all' : ''} {post.comments.length}{' '}
        {post.comments.length > 1 ? 'comments' : 'comment'}
      </Text>
    )}
  </View>
);

const Comments = ({ post }) => (
  <>
    {post.comments.map((comment, index) => (
      <View
        key={index}
        style={{ flexDirection: 'row', marginTop: 5 }}>
        <Text style={{ color: 'white' }}>
          <Text style={{ fontWeight: '800' }}>{comment.user}</Text>{' '}
          <Text>{comment.comment}</Text>
        </Text>
      </View>
    ))}
  </>
);

const styles = StyleSheet.create({
  story: {
    width: 35,
    height: 35,
    borderRadius: 50,
    marginLeft: 6,
    borderWidth: 1.5,
    borderColor: '#EFEDED',
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
});
export default Post;
