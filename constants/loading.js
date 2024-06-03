import { Animated, Easing, View } from 'react-native'
import { images } from '../constants'
import { useEffect, useRef } from 'react'

export const LoadingImage = () => {
  const spinValue = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start()
  }, [spinValue])

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  })

  return (
    <Animated.Image
      style={{
        width: 100,
        height: 100,
        transform: [{ rotate: spin }],
      }}
      source={images.LOADING_IMAGE}
    />
  )
}
