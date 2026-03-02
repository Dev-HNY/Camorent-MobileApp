import React, { useRef, useEffect } from "react";
import {
  StyleSheet,
  Animated,
  Pressable,
  View,
  ImageSourcePropType,
} from "react-native";
import { Image } from "expo-image";
import { wp, hp } from "@/utils/responsive";
import * as Haptics from "expo-haptics";
import { Check } from "lucide-react-native";

interface CityCardProps {
  name: string;
  image: ImageSourcePropType;
  isSelected?: boolean;
  onPress: () => void;
  disabled?: boolean;
}

export function CityCard({ image, isSelected, onPress, disabled }: CityCardProps) {
  const scaleAnim  = useRef(new Animated.Value(1)).current;
  const selectAnim = useRef(new Animated.Value(isSelected ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(selectAnim, {
      toValue: isSelected ? 1 : 0,
      friction: 7,
      tension: 50,
      useNativeDriver: true,
    }).start();
  }, [isSelected]);

  const handlePressIn = () => {
    if (disabled) return;
    Animated.spring(scaleAnim, { toValue: 0.96, friction: 8, tension: 40, useNativeDriver: true }).start();
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
        <View style={[styles.card, isSelected ? styles.cardSelected : styles.cardDefault, disabled && styles.cardDisabled]}>

          {/* City illustration — image already contains city name text */}
          <Image
            source={image}
            contentFit="fill"
            cachePolicy="memory-disk"
            style={styles.cityImage}
          />

          {/* Check badge when selected */}
          {isSelected && !disabled && (
            <Animated.View
              style={[
                styles.checkBadge,
                { opacity: selectAnim, transform: [{ scale: selectAnim }] },
              ]}
            >
              <Check size={wp(12)} color="#FFFFFF" strokeWidth={3} />
            </Animated.View>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: wp(16),
    borderWidth: 2,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
    aspectRatio: 1,
  },
  cardDefault: {
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.06,
  },
  cardSelected: {
    borderColor: "#AB58F4",
    shadowColor: "#AB58F4",
    shadowOpacity: 0.35,
  },
  cardDisabled: {
    opacity: 0.45,
  },
  cityImage: {
    width: "100%",
    height: "100%",
  },
  checkBadge: {
    position: "absolute",
    top: hp(9),
    right: wp(9),
    width: wp(22),
    height: wp(22),
    borderRadius: wp(11),
    backgroundColor: "#AB58F4",
    alignItems: "center",
    justifyContent: "center",
  },
});
