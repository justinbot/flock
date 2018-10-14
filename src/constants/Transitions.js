import { Animated, Easing } from 'react-native';

export const transitionConfig = {
  duration: 300,
  // Standard easing from https://material.io/design/motion/speed.html#easing
  easing: Easing.bezier(0.4, 0.0, 0.2, 1),
  timing: Animated.timing,
  useNativeDriver: true,
};
