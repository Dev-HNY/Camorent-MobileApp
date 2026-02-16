import { Redirect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { CitySelectionContent } from "@/components/city/CitySelectionContent";
import { useAuthStore } from "@/store/auth/auth";
import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function CityPage() {
  const { user, isVerified, isCitySelected, setIsCitySelected } = useAuthStore();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  if (!user) {
    return <Redirect href={"/(auth)/signup"} />;
  }

  if (!isVerified) {
    return <Redirect href={"/(auth)/info"} />;
  }

  if (isCitySelected) {
    return <Redirect href={"/(tabs)/(home)"} />;
  }

  const handleCitySelect = () => {
    setIsCitySelected(true);
    router.replace("/(tabs)/(home)");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      {/* Subtle animated gradient background */}
      <LinearGradient
        colors={['#FFFFFF', '#F8F7FF', '#FFFFFF']}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <Animated.View
        style={{
          flex: 1,
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}
      >
        <CitySelectionContent
          onCitySelect={handleCitySelect}
          mode="onboarding"
          showContinueButton={true}
        />
      </Animated.View>
    </SafeAreaView>
  );
}
