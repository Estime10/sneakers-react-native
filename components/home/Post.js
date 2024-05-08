import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { Divider } from 'react-native-elements';

const Post = ({ post }) => {
  return (
    <View style={{ marginBottom: 30 }}>
      <Divider
        width={1}
        orientation='vertical'
      />
      <Text style={{ color: 'white', fontSize: 20 }}>Post</Text>
    </View>
  );
};

const styles = StyleSheet.create({});
export default Post;
