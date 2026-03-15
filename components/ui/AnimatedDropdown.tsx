import React, { useRef, useState, useEffect, useCallback } from "react";
import { Animated, Pressable, StyleSheet } from "react-native";
import { YStack, XStack, Text } from "tamagui";
import { ChevronDown, Check } from "lucide-react-native";
import { wp, hp, fp } from "@/utils/responsive";
import * as Haptics from "expo-haptics";

interface DropdownOption {
  label: string;
  value: string;
}

interface AnimatedDropdownProps {
  label: string;
  value: string;
  options: DropdownOption[];
  onValueChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

export function AnimatedDropdown({
  label,
  value,
  options,
  onValueChange,
  placeholder = "Select an option",
  error,
}: AnimatedDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const focusAnim = useRef(new Animated.Value(value ? 1 : 0)).current;
  const listOpacity = useRef(new Animated.Value(0)).current;

  // Animate label whenever value or open state changes
  useEffect(() => {
    Animated.timing(focusAnim, {
      toValue: isOpen || value ? 1 : 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [isOpen, value]);

  // Animate chevron + list opacity together — all native driver
  useEffect(() => {
    Animated.parallel([
      Animated.timing(rotateAnim, {
        toValue: isOpen ? 1 : 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(listOpacity, {
        toValue: isOpen ? 1 : 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isOpen]);

  const handleToggle = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsOpen((prev) => !prev);
  }, []);

  const handleSelect = useCallback((optionValue: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onValueChange(optionValue);
    setIsOpen(false);
  }, [onValueChange]);

  const isFocused = isOpen;
  const borderColor = error ? "#F44336" : (isFocused || value) ? "#121217" : "#E5E7EB";
  const labelColor = error ? "#F44336" : (isFocused || value) ? "#121217" : "#9CA3AF";

  const labelTranslateY = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, hp(-27)],
  });

  const labelScale = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.857],
  });

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <YStack gap={hp(6)} style={{ zIndex: isOpen ? 999 : 1 }}>
      <YStack style={{ position: "relative" }}>
        {/* Floating Label */}
        <Animated.View
          style={[
            styles.labelContainer,
            { transform: [{ translateY: labelTranslateY }, { scale: labelScale }] },
          ]}
          pointerEvents="none"
        >
          <Animated.Text
            style={[styles.label, { color: labelColor, backgroundColor: "#FFFFFF", paddingHorizontal: wp(4) }]}
          >
            {label}
          </Animated.Text>
        </Animated.View>

        {/* Dropdown Trigger */}
        <Pressable onPress={handleToggle}>
          <Animated.View
            style={[
              styles.container,
              {
                borderColor,
                borderWidth: 1.5,
                borderBottomLeftRadius: isOpen ? 0 : hp(12),
                borderBottomRightRadius: isOpen ? 0 : hp(12),
              },
            ]}
          >
            <XStack alignItems="center" justifyContent="space-between">
              <Text
                fontSize={fp(14)}
                fontWeight="400"
                color={value ? "#121217" : "#9CA3AF"}
                numberOfLines={1}
                flex={1}
                marginRight={wp(8)}
              >
                {selectedOption ? selectedOption.label : (isFocused || value ? placeholder : "")}
              </Text>
              <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                <ChevronDown size={hp(20)} color={isFocused ? "#121217" : "#9CA3AF"} />
              </Animated.View>
            </XStack>
          </Animated.View>
        </Pressable>

        {/* Dropdown Options — absolutely positioned so it overlays content below */}
        {isOpen && (
          <Animated.View
            style={[
              styles.dropdownContainer,
              { opacity: listOpacity, borderColor },
            ]}
          >
            <YStack>
              {options.map((option, index) => (
                <Pressable
                  key={option.value}
                  onPress={() => handleSelect(option.value)}
                  style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                >
                  <XStack
                    style={[
                      styles.option,
                      {
                        backgroundColor: value === option.value ? "#F3F4F6" : "#FFFFFF",
                        borderTopWidth: index === 0 ? 0 : 1,
                        borderTopColor: "#F0F0F0",
                      },
                    ]}
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Text
                      fontSize={fp(14)}
                      fontWeight={value === option.value ? "600" : "400"}
                      color={value === option.value ? "#121217" : "#374151"}
                      numberOfLines={1}
                      flex={1}
                      marginRight={wp(8)}
                    >
                      {option.label}
                    </Text>
                    {value === option.value && (
                      <Check size={hp(18)} color="#121217" strokeWidth={3} />
                    )}
                  </XStack>
                </Pressable>
              ))}
            </YStack>
          </Animated.View>
        )}
      </YStack>

      {/* Error Message */}
      {error && (
        <Text fontSize={fp(12)} color="#F44336" paddingLeft={wp(4)}>
          {error}
        </Text>
      )}
    </YStack>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: hp(12),
    paddingHorizontal: wp(16),
    paddingTop: hp(20),
    paddingBottom: hp(12),
    position: "relative",
  },
  labelContainer: {
    position: "absolute",
    top: hp(16),
    left: wp(16),
    paddingHorizontal: wp(4),
    zIndex: 10,
  },
  label: {
    fontWeight: "500",
    fontSize: fp(14),
  },
  dropdownContainer: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: hp(12),
    borderBottomRightRadius: hp(12),
    borderLeftWidth: 1.5,
    borderRightWidth: 1.5,
    borderBottomWidth: 1.5,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 999,
  },
  option: {
    paddingHorizontal: wp(16),
    paddingVertical: hp(14),
    minHeight: hp(48),
  },
});
