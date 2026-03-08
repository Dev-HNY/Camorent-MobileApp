import React, { useRef, useEffect } from "react";
import {
  StyleSheet,
  Animated,
  Pressable,
  View,
  Text,
  ImageSourcePropType,
} from "react-native";
import { Image } from "expo-image";
import { wp, hp, fp } from "@/utils/responsive";
import * as Haptics from "expo-haptics";
import { Check } from "lucide-react-native";

interface CityCardProps {
  name: string;
  image: ImageSourcePropType;
  isSelected?: boolean;
  onPress: () => void;
  disabled?: boolean;
}

export function CityCard({ name, image, isSelected, onPress, disabled }: CityCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const selectAnim = useRef(new Animated.Value(isSelected ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(selectAnim, {
      toValue: isSelected ? 1 : 0,
      friction: 7,
      tension: 60,
      useNativeDriver: true,
    }).start();
  }, [isSelected]);

  const handlePressIn = () => {
    if (disabled) return;
    Animated.spring(scaleAnim, { toValue: 0.95, friction: 8, tension: 40, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    if (disabled) return;
    Animated.spring(scaleAnim, { toValue: 1, friction: 8, tension: 40, useNativeDriver: true }).start();
  };
  const handlePress = () => {
    if (disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }], width: "48%" }}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled}
      >
        <View style={[
          styles.card,
          isSelected ? styles.cardSelected : styles.cardDefault,
          disabled && styles.cardDisabled,
        ]}>
          {/* City name */}
          <Text style={[styles.cityName, isSelected && styles.cityNameSelected]}>
            {name}
          </Text>

          {/* Landmark illustration */}
          <View style={styles.imageWrap}>
            <Image
              source={image}
              contentFit="contain"
              cachePolicy="memory-disk"
              style={[styles.cityImage, (!isSelected ? { filter: "grayscale(1)" } : {}) as any]}
            />
          </View>

          {/* Selected check badge */}
          {isSelected && !disabled && (
            <Animated.View style={[
              styles.checkBadge,
              { opacity: selectAnim, transform: [{ scale: selectAnim }] },
            ]}>
              <Check size={wp(11)} color="#FFFFFF" strokeWidth={3} />
            </Animated.View>
          )}

          {/* Subtle "Soon" pill for disabled cities */}
          {disabled && (
            <View style={styles.soonPill}>
              <Text style={styles.soonText}>Soon</Text>
            </View>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: wp(18),
    borderWidth: 1.5,
    paddingTop: hp(14),
    paddingBottom: hp(12),
    paddingHorizontal: wp(12),
    alignItems: "center",
    overflow: "hidden",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  cardDefault: {
    backgroundColor: "#F8F8FB",
    borderColor: "#E8E8F0",
    shadowColor: "#000",
    shadowOpacity: 0.05,
  },
  cardSelected: {
    backgroundColor: "#F3EEFF",
    borderColor: "#AB58F4",
    shadowColor: "#AB58F4",
    shadowOpacity: 0.25,
  },
  cardDisabled: {
    opacity: 0.5,
  },
  cityName: {
    fontSize: fp(14),
    fontWeight: "700",
    color: "#6B7280",
    letterSpacing: -0.2,
    marginBottom: hp(10),
  },
  cityNameSelected: {
    color: "#7C3AED",
  },
  imageWrap: {
    width: "100%",
    height: hp(90),
    alignItems: "center",
    justifyContent: "center",
  },
  cityImage: {
    width: "85%",
    height: "100%",
  },
  checkBadge: {
    position: "absolute",
    top: hp(10),
    right: wp(10),
    width: wp(20),
    height: wp(20),
    borderRadius: wp(10),
    backgroundColor: "#AB58F4",
    alignItems: "center",
    justifyContent: "center",
  },
  soonPill: {
    position: "absolute",
    bottom: hp(8),
    right: wp(8),
    backgroundColor: "rgba(0,0,0,0.07)",
    paddingHorizontal: wp(7),
    paddingVertical: hp(3),
    borderRadius: wp(20),
  },
  soonText: {
    fontSize: fp(10),
    fontWeight: "600",
    color: "#9CA3AF",
  },
});
