import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { XStack, YStack, Text, Spinner } from "tamagui";
import { useAuthStore } from "@/store/auth/auth";
import { Animated, Pressable, ScrollView, StyleSheet } from "react-native";
import { wp, hp, fp } from "@/utils/responsive";
import { CITIES } from "@/constants/cities";
import { CityCard } from "@/components/ui/CityCard";
import { X, MapPin } from "lucide-react-native";
import { useUpdateCityMutation } from "@/hooks/auth/useUpdateCityMutation";
import * as Haptics from "expo-haptics";

interface CitySelectionContentProps {
  onCitySelect?: (city: string) => void;
  onClose?: () => void;
  mode?: "onboarding" | "change";
  title?: string;
  showCloseButton?: boolean;
  showContinueButton?: boolean;
}

export function CitySelectionContent({
  onCitySelect,
  onClose,
  mode = "change",
  title,
  showCloseButton = false,
  showContinueButton = false,
}: CitySelectionContentProps) {
  const [selectedCity, setSelectedCity] = useState("");
  const { setCity, city: currentCity } = useAuthStore();

  const updateCityMutation = useUpdateCityMutation();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const headerAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 260,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    Animated.timing(buttonAnim, {
      toValue: selectedCity ? 1 : 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [selectedCity]);

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (selectedCity) {
      updateCityMutation.mutate({ preferred_city: selectedCity });
      setCity(selectedCity);
      onCitySelect?.(selectedCity);
    }
    onClose?.();
  };

  const handleCitySelect = (cityName: string, isDisabled?: boolean) => {
    if (isDisabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedCity(cityName);

    if (mode === "change") {
      updateCityMutation.mutate({ preferred_city: cityName });
      setCity(cityName);
      onCitySelect?.(cityName);
      requestAnimationFrame(() => onClose?.());
    }
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCity("");
    onClose?.();
  };

  const headerTranslateY = headerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-16, 0],
  });

  const gridOpacity = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const gridTranslateY = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 0],
  });

  return (
    <YStack flex={1} backgroundColor="#F2F2F7">
      {/* Header */}
      <Animated.View
        style={{
          opacity: headerAnim,
          transform: [{ translateY: headerTranslateY }],
        }}
      >
        <YStack
          backgroundColor="#FFFFFF"
          paddingHorizontal={wp(20)}
          paddingTop={hp(20)}
          paddingBottom={hp(16)}
          style={styles.headerCard}
        >
          <XStack justifyContent="space-between" alignItems="flex-start">
            <XStack alignItems="center" gap={wp(10)} flex={1}>
              <YStack style={styles.mapPinCircle}>
                <MapPin size={hp(18)} color="#8E0FFF" strokeWidth={2.2} />
              </YStack>
              <YStack gap={hp(3)} flex={1}>
                <Text fontSize={fp(18)} fontWeight="700" color="#1C1C1E" letterSpacing={-0.3}>
                  {title || "Select Your City"}
                </Text>
                <Text fontSize={fp(13)} color="#8E8E93" fontWeight="400">
                  Choose your city to see available gear
                </Text>
              </YStack>
            </XStack>

            {showCloseButton && (
              <Pressable onPress={handleClose} hitSlop={8} style={styles.closeBtn}>
                <X size={hp(16)} color="#3C3C43" strokeWidth={2.5} />
              </Pressable>
            )}
          </XStack>
        </YStack>
      </Animated.View>

      {/* Section label */}
      <Animated.View
        style={{
          opacity: gridOpacity,
          transform: [{ translateY: gridTranslateY }],
        }}
      >
        <Text style={styles.sectionLabel}>AVAILABLE CITIES</Text>
      </Animated.View>

      {/* Cities Grid */}
      <YStack flex={1}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: wp(16), paddingBottom: hp(24) }}
        >
          <Animated.View
            style={{
              opacity: gridOpacity,
              transform: [{ translateY: gridTranslateY }],
            }}
          >
            <XStack flexWrap="wrap" gap={wp(12)} justifyContent="space-between">
              {CITIES.map((city) => {
                const isDisabled = city.id !== "delhi";
                const isSelected =
                  selectedCity === city.name ||
                  (mode === "change" && !selectedCity && currentCity === city.name);
                return (
                  <CityCard
                    key={city.id}
                    name={city.name}
                    image={city.image}
                    isSelected={isSelected}
                    onPress={() => handleCitySelect(city.name, isDisabled)}
                    disabled={isDisabled}
                  />
                );
              })}
            </XStack>
          </Animated.View>
        </ScrollView>
      </YStack>

      {/* Continue Button */}
      {showContinueButton && (
        <Animated.View style={[styles.continueBar, { opacity: buttonAnim }]}>
          <Button
            size="lg"
            width="100%"
            onPress={handleContinue}
            disabled={!selectedCity || updateCityMutation.isPending}
            opacity={!selectedCity || updateCityMutation.isPending ? 0.5 : 1}
          >
            <XStack alignItems="center" justifyContent="center" height={hp(24)}>
              {updateCityMutation.isPending ? (
                <Spinner color="white" size="small" />
              ) : (
                <Text fontSize={fp(16)} fontWeight="600" color="#FFF">
                  Continue to Camorent
                </Text>
              )}
            </XStack>
          </Button>
        </Animated.View>
      )}
    </YStack>
  );
}

const styles = StyleSheet.create({
  headerCard: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  mapPinCircle: {
    width: wp(38),
    height: wp(38),
    borderRadius: wp(19),
    backgroundColor: "#F5EEFF",
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtn: {
    width: wp(32),
    height: wp(32),
    borderRadius: wp(16),
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionLabel: {
    fontSize: fp(13),
    fontWeight: "600",
    color: "#8E8E93",
    letterSpacing: 0.4,
    paddingHorizontal: wp(20),
    paddingTop: hp(20),
    paddingBottom: hp(10),
  },
  continueBar: {
    paddingHorizontal: wp(16),
    paddingTop: hp(12),
    paddingBottom: hp(16),
    borderTopWidth: 1,
    borderTopColor: "#F2F2F7",
    backgroundColor: "#FFFFFF",
  },
});
