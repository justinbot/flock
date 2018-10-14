import { Animated, Easing } from 'react-native';

export const materialStandardEasing = Easing.bezier(0.4, 0.0, 0.2, 1);

export const animationDefinitions = {
  cardEnter: {
    from: {
      opacity: 0,
      scaleY: 0,
    },
    to: {
      opacity: 1,
      scaleY: 1,
    },
  },
};

export const transitionConfig = {
  duration: 300,
  // Standard easing from https://material.io/design/motion/speed.html#easing
  easing: materialStandardEasing,
  timing: Animated.timing,
  useNativeDriver: true,
};
