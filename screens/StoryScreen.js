import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  SafeAreaView,
  View,
  Button,
  Image,
  StatusBar,
} from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  withTiming,
} from 'react-native-reanimated'
import Stories from '../components/story/Stories'

const allStories = usersStories.flatMap(user => user.stories)
const width = 320
const StoryScreen = () => {
  const pageIndex = useSharedValue(0)

  const runAnimation = () => {
    // pageIndex.value = 0;
    pageIndex.value = withTiming(Math.floor(pageIndex.value + 1), {
      duration: 500,
    })
  }

  const goBack = () => {
    pageIndex.value = withTiming(Math.floor(pageIndex.value - 1), {
      duration: 300,
    })
  }

  const AnimatedPage = ({ pageColor, index, pageIndex, children }) => {
    const anim = useAnimatedStyle(() => ({
      transform: [
        {
          perspective: 320 * 2,
        },
        {
          rotateY: `${interpolate(
            pageIndex.value,
            [index - 1, index, index + 1],
            [90, 0, -90]
          )}deg`,
        },
      ],
    }))

    return (
      <Animated.View
        style={[
          {
            zIndex: 100 - index,
            width: width,
            height: 600,
            top: 160,
            position: 'absolute',
            aspectRatio: 9 / 16,
            backgroundColor: pageColor,
            backfaceVisibility: 'hidden',
            borderRadius: 10,
            transformOrigin: ['50%', '50%', -160],
            overflow: 'hidden',
          },
          anim,
        ]}>
        {children}
      </Animated.View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {allStories.map((story, index) => (
        <AnimatedPage
          key={index}
          pageIndex={pageIndex}
          index={index}>
          <Stories
            onNextUser={runAnimation}
            onPrevUser={goBack}
          />
        </AnimatedPage>
      ))}
      <StatusBar barStyle='light-content' />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
export default StoryScreen
