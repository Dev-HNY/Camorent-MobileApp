/**
 * Animation Constants - Industry Standard Timing Values
 * Inspired by Apple's Human Interface Guidelines and Material Design
 */

import { Easing } from 'react-native-reanimated';

// Durations (in milliseconds)
export const DURATION = {
  instant: 100,
  fast: 200,
  normal: 300,
  slow: 450,
  slower: 600,
  entrance: 500,
  exit: 300,
  stagger: 50,
} as const;

// Spring configurations for natural motion
export const SPRING_CONFIG = {
  // Snappy - quick, responsive interactions (buttons, toggles)
  snappy: {
    damping: 15,
    stiffness: 400,
    mass: 0.8,
  },
  // Bouncy - playful, energetic animations (cards popping in)
  bouncy: {
    damping: 10,
    stiffness: 180,
    mass: 0.5,
  },
  // Smooth - elegant, fluid transitions (page transitions)
  smooth: {
    damping: 20,
    stiffness: 200,
    mass: 1,
  },
  // Gentle - slow, subtle movements (parallax, fades)
  gentle: {
    damping: 25,
    stiffness: 120,
    mass: 1.2,
  },
  // Default - balanced for general use
  default: {
    damping: 18,
    stiffness: 250,
    mass: 1,
  },
} as const;

// Easing curves for timing animations
export const EASING = {
  // Apple-style ease out (deceleration)
  easeOut: Easing.bezier(0.25, 0.1, 0.25, 1),
  // Apple-style ease in-out
  easeInOut: Easing.bezier(0.42, 0, 0.58, 1),
  // Emphasized ease out (more dramatic deceleration)
  emphasized: Easing.bezier(0.2, 0, 0, 1),
  // Smooth deceleration
  decelerate: Easing.bezier(0, 0, 0.2, 1),
  // Smooth acceleration
  accelerate: Easing.bezier(0.4, 0, 1, 1),
  // Overshoot for bouncy effects
  overshoot: Easing.bezier(0.34, 1.56, 0.64, 1),
} as const;

// Animation distances (in pixels)
export const DISTANCE = {
  micro: 4,
  small: 8,
  medium: 16,
  large: 24,
  xlarge: 40,
  xxlarge: 60,
} as const;

// Scale values for press effects
export const SCALE = {
  pressed: 0.96,
  hover: 1.02,
  bounce: 1.05,
  normal: 1,
} as const;

// Opacity values
export const OPACITY = {
  hidden: 0,
  dim: 0.5,
  visible: 1,
  pressed: 0.8,
} as const;

// Z-index for layering animated elements
export const Z_INDEX = {
  background: 0,
  content: 1,
  overlay: 10,
  modal: 100,
  toast: 1000,
} as const;
