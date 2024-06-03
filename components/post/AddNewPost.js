import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import FormikPostUploader from './form/FormikPostUploader'
import { icons } from '../../constants'

const AddNewPost = ({ navigation }) => (
  <View style={styles.container}>
    <Header navigation={navigation} />
    <FormikPostUploader navigation={navigation} />
  </View>
)

const Header = ({ navigation }) => (
  <View style={styles.headerContainer}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Image
        source={icons.LEFT_ARROW}
        style={styles.icon}
      />
    </TouchableOpacity>
    <Text style={styles.headerText}>new post</Text>
    <Text></Text>
  </View>
)

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
  },

  icon: {
    width: 25,
    height: 25,
  },

  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },

  headerText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 20,
    textTransform: 'uppercase',
    marginRight: 25,
  },
});

export default AddNewPost;
