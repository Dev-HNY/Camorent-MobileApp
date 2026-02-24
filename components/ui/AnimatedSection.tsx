import { useEffect, useRef } from "react";
import { Animated, ViewStyle } from "react-native";

interface AnimatedSectionProps {
  children: React.ReactNode;
  delay?: number;
  style?: ViewStyle;
}

export function AnimatedSection({ children, delay = 0, style }: AnimatedSectionProps) {
  const fadeAnim = useRef(new Animated.Value(delay === 0 ? 1 : 0)).current;

  useEffect(() => {
    if (delay === 0) return;
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }, delay);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={[{ opacity: fadeAnim }, style]}>
      {children}
    </Animated.View>
  );
}
