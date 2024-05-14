import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Divider } from 'react-native-elements';

const postFooterIcons = [
  {
    name: 'Like',
    imageUrl:
      '/Users/Estime/Desktop/private/react_native/sneakers/assets/icons/heart-dark.png',
    likedImageUrl:
      '/Users/Estime/Desktop/private/react_native/sneakers/assets/icons/heart-fullDark.png',
  },
  {
    name: 'Comment',
    imageUrl:
      '/Users/Estime/Desktop/private/react_native/sneakers/assets/icons/comment-dark.png',
  },
  {
    name: 'Share',
    imageUrl:
      '/Users/Estime/Desktop/private/react_native/sneakers/assets/icons/share.png',
  },
  {
    name: 'Save',
    imageUrl:
      '/Users/Estime/Desktop/private/react_native/sneakers/assets/icons/bookmark.png',
  },
];
const avatar =
  '/Users/Estime/Desktop/private/react_native/sneakers/assets/icons/avatar_dark.png';

const Post = ({ post }) => {
  const [avatarUrl, setAvatarUrl] = useState(avatar);
  return (
    <View style={{ marginBottom: 30 }}>
      <Divider
        width={1}
        orientation='vertical'
      />
      <PostHeader post={post} />
      <PostImage post={post} />
      <View style={{ marginHorizontal: 15, marginTop: 10 }}>
        <PostFooter />
        <Likes post={post} />
        <Caption post={post} />
        <CommentSection post={post} />
        <Comments post={post} />
      </View>
    </View>
  );
};

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
        source={{ uri: post.avatar || avatar }}
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
);

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
);

const PostFooter = () => (
  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
    <View style={styles.leftFooterIconContainer}>
      <Icon
        imgStyle={styles.footerIcon}
        imgUrl={postFooterIcons[0].imageUrl}
      />
      <Icon
        imgStyle={styles.footerIcon}
        imgUrl={postFooterIcons[1].imageUrl}
      />
      <Icon
        imgStyle={styles.footerIcon}
        imgUrl={postFooterIcons[2].imageUrl}
      />
    </View>
    <View>
      <Icon
        imgStyle={styles.footerIcon}
        imgUrl={postFooterIcons[3].imageUrl}
      />
    </View>
  </View>
);

const Icon = ({ imgStyle, imgUrl }) => (
  <TouchableOpacity>
    <Image
      source={{ uri: imgUrl }}
      style={imgStyle}
    />
  </TouchableOpacity>
);

const Likes = ({ post }) => (
  <View style={{ flexDirection: 'row', marginTop: 5 }}>
    <Text
      style={{
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
        marginTop: 5,
      }}>
      {post.likes.toLocaleString('en')} {post.likes > 1 ? 'likes' : 'like'}
    </Text>
  </View>
);

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
