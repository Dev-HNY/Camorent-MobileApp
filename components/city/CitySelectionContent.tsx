import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { XStack, YStack, Stack, Text, Spinner } from "tamagui";
import { Heading2, BodyText } from "@/components/ui/Typography";
import { useAuthStore } from "@/store/auth/auth";
import {
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
  ScrollView,
} from "react-native";
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

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const headerAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Staggered entrance animations
    Animated.sequence([
      Animated.spring(headerAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(fadeAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        delay: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    // Button appears when city is selected
    Animated.spring(buttonAnim, {
      toValue: selectedCity ? 1 : 0,
      friction: 8,
      tension: 40,
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
    updateCityMutation.mutate({ preferred_city: cityName });
    setSelectedCity(cityName);

    // For 'change' mode, immediately apply the selection
    if (mode === "change") {
      setCity(cityName);
      onCitySelect?.(cityName);
      onClose?.();
    }
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCity("");
    onClose?.();
  };

  const headerTranslateY = headerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 0],
  });

  const gridOpacity = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const gridTranslateY = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });

  const buttonTranslateY = buttonAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <YStack padding={wp(16)} flex={1}>
          {/* Header */}
          <Animated.View
            style={{
              opacity: headerAnim,
              transform: [{ translateY: headerTranslateY }],
            }}
          >
            <XStack
              justifyContent="space-between"
              alignItems="center"
              marginBottom={hp(24)}
            >
              <YStack gap={hp(8)} flex={1}>
                <XStack alignItems="center" gap={wp(8)}>
                  <MapPin size={hp(24)} color="#8E0FFF" strokeWidth={2} />
                  <Heading2 lineHeight={hp(28)}>{title || "Select Your City"}</Heading2>
                </XStack>
                <BodyText color="#6C6C89" fontSize={fp(14)}>
                  Choose your preferred city to see relevant equipment
                </BodyText>
              </YStack>
              {showCloseButton && (
                <Stack
                  padding={wp(8)}
                  borderRadius={wp(20)}
                  backgroundColor="#F5F5F5"
                  pressStyle={{ opacity: 0.7, scale: 0.95 }}
                  onPress={handleClose}
                  cursor="pointer"
                >
                  <X size={hp(20)} color="#666" />
                </Stack>
              )}
            </XStack>
          </Animated.View>

          {/* Cities Grid */}
          <YStack flex={1}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: hp(20),
              }}
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
                  return (
                    <CityCard
                      key={city.id}
                      name={city.name}
                      image={city.image}
                      isSelected={
                        selectedCity === city.name ||
                        (mode === "change" &&
                          !selectedCity &&
                          currentCity === city.name)
                      }
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
            <Animated.View
              style={{
                opacity: buttonAnim,
                transform: [{ translateY: buttonTranslateY }],
              }}
            >
              <XStack paddingTop={hp(16)}>
                <Button
                  size="lg"
                  width="100%"
                  onPress={handleContinue}
                  backgroundColor="#8E0FFF"
                  disabled={!selectedCity || updateCityMutation.isPending}
                  opacity={!selectedCity || updateCityMutation.isPending ? 0.5 : 1}
                >
                  <XStack alignItems="center" gap={wp(8)}>
                    {updateCityMutation.isPending ? (
                      <Spinner color="white" size="small" />
                    ) : (
                      <Text fontSize={fp(16)} fontWeight="600" color="#FFF">
                        Continue to Camorent
                      </Text>
                    )}
                  </XStack>
                </Button>
              </XStack>
            </Animated.View>
          )}
        </YStack>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
