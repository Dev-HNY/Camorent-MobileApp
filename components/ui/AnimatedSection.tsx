import { useEffect, useRef } from "react";
import { Animated, ViewStyle } from "react-native";
import { YStack } from "tamagui";

interface AnimatedSectionProps {
  children: React.ReactNode;
  delay?: number;
  style?: ViewStyle;
}

export function AnimatedSection({ children, delay = 0, style }: AnimatedSectionProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
        ...style,
      }}
    >
      {children}
    </Animated.View>
  );
}
