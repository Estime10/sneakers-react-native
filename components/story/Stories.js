import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Pressable,
  Button,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  useAnimatedReaction,
  runOnJS,
} from 'react-native-reanimated'
import usersStories from '../../data/stories'

const storyViewDuration = 5 * 1000

const Stories = ({ onNextUser, onPrevUser }) => {
  const [userIndex, setUserIndex] = useState(0)
  const [storyIndex, setStoryIndex] = useState(0)

  const progress = useSharedValue(0)

  const user = usersStories[userIndex]
  const story = user.stories[storyIndex]

  useEffect(() => {
    progress.value = 0
    progress.value = withTiming(1, {
      duration: storyViewDuration,
      easing: Easing.linear,
    })
  }, [storyIndex, userIndex])

  const goToPrevStory = () => {
    setStoryIndex(index => {
      if (index === 0) {
        goToPrevUser()
        return 0
      }
      return index - 1
    })
  }

  const goToNextStory = () => {
    setStoryIndex(index => {
      if (index === user.stories.length - 1) {
        goToNextUser()
        return 0
      }
      return index + 1
    })
  }

  const goToNextUser = () => {
    setUserIndex(index => {
      if (index === usersStories.length - 1) {
        onNextUser()
        return 0
      }
      onNextUser()
      return index + 1
    })
  }

  const goToPrevUser = () => {
    setUserIndex(index => {
      if (index === 0) {
        onPrevUser()
        return usersStories.length - 1
      }
      onPrevUser()
      return index - 1
    })
  }

  // useAnimatedReaction(
  //   () => progress.value,
  //   (currentValue, previousValue) => {
  //     if (currentValue !== previousValue && currentValue === 1) {
  //       runOnJS(goToNextStory)()
  //     }
  //   }
  // )

  const indicatorAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }))

  return (
    <View style={styles.storyContainer}>
      <Image
        key={`${user.userId}-${storyIndex}`}
        source={story.uri}
        style={styles.image}
      />

      <Pressable
        style={styles.navPressable}
        onPress={goToPrevStory}
      />

      <Pressable
        style={[styles.navPressable, { right: 0 }]}
        onPress={goToNextStory}
      />

      <View style={styles.header}>
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'transparent']}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.indicatorRow}>
          {user.stories.map((_, index) => (
            <View
              key={`${user.userId}-${index}`}
              style={styles.indicatorBG}>
              <Animated.View
                style={[
                  styles.indicator,
                  index === storyIndex && indicatorAnimatedStyle,
                  index > storyIndex && { width: 0 },
                  index < storyIndex && { width: '100%' },
                ]}
              />
            </View>
          ))}
        </View>
        <View style={styles.userContainer}>
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.date}>{user.date}30 min</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TextInput
          style={styles.input}
          placeholder='Send message'
          placeholderTextColor='#fff'
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  storyContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    resizeMode: 'fit',
  },
  header: {
    position: 'absolute',
    top: 0,
    width: '100%',
    padding: 10,
    paddingTop: 10,
  },
  userContainer: {
    flexDirection: 'row',
    marginTop: 0,
  },
  username: {
    color: '#fff',
    fontWeight: 'bold',
  },
  date: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 12,
    marginTop: 2,
  },
  footer: {
    width: '100%',
    backgroundColor: '#000',
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#fff',
    padding: 15,
    borderRadius: 50,
    color: '#fff',
    marginBottom: 50,
  },
  navPressable: {
    position: 'absolute',
    width: '30%',
    height: '100%',
  },

  indicatorRow: {
    gap: 5,
    flexDirection: 'row',
    marginBottom: 5,
  },

  indicatorBG: {
    flex: 1,
    height: 1.3,
    backgroundColor: 'rgba(0,0,0,0.7) ',
    borderRadius: 10,
    overflow: 'hidden',
  },
  indicator: {
    backgroundColor: '#fff',
    height: '100%',
  },
})

export default Stories
