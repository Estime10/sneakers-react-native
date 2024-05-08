import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React from 'react';
import { USERS } from '../../data/users';

const Stories = () => {
  return (
    <View style={{ marginBottom: 13 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}>
        {USERS.map((story, index) => (
          <View
            key={index}
            style={{ alignItems: 'center' }}>
            <Image
              source={{ uri: story.avatar }}
              style={styles.story}
            />
            <Text style={styles.username}>
              {story.username.length > 8
                ? story.username.slice(0, 8).toUpperCase() + '...'
                : story.username.toLowerCase()}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  story: {
    width: 70,
    height: 70,
    borderRadius: 50,
    marginLeft: 6,
    borderWidth: 3,
    borderColor: '#EFEDED',
  },

  username: {
    color: 'white',
    marginTop: 15,
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default Stories;
