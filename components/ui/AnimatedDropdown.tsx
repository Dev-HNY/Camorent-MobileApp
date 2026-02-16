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
  const [isFocused, setIsFocused] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const focusAnim = useRef(new Animated.Value(0)).current;
  const errorAnim = useRef(new Animated.Value(0)).current;
  const heightAnim = useRef(new Animated.Value(0)).current;

  // Track if we're in the process of selecting to prevent re-opening
  const isSelectingRef = useRef(false);

  // Calculate max dropdown height
  const maxDropdownHeight = Math.min(options.length * hp(48), hp(250));

  useEffect(() => {
    Animated.spring(focusAnim, {
      toValue: isFocused || value ? 1 : 0,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [isFocused, value]);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(heightAnim, {
        toValue: isOpen ? maxDropdownHeight : 0,
        friction: 8,
        tension: 40,
        useNativeDriver: false, // Height animations can't use native driver
      }),
      Animated.spring(rotateAnim, {
        toValue: isOpen ? 1 : 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isOpen, maxDropdownHeight]);

  useEffect(() => {
    if (error) {
      Animated.timing(errorAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(errorAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [error]);

  const handleToggle = useCallback(() => {
    // Don't allow toggle if we're currently selecting
    if (isSelectingRef.current) {
      isSelectingRef.current = false;
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsOpen((prev) => !prev);
    setIsFocused((prev) => !prev);
  }, []);

  const handleSelect = useCallback((optionValue: string) => {
    // Set flag synchronously to block the bubbled toggle press
    isSelectingRef.current = true;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onValueChange(optionValue);

    setIsOpen(false);
    setIsFocused(false);

    // Clear the flag after enough time for any bubbled events to fire
    setTimeout(() => {
      isSelectingRef.current = false;
    }, 300);
  }, [onValueChange]);

  const getBorderColor = () => {
    if (error) return "#F44336";
    return (isFocused || value) ? "#121217" : "#E5E7EB";
  };

  const getLabelColor = () => {
    if (error) return "#F44336";
    return (isFocused || value) ? "#121217" : "#9CA3AF";
  };

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
    <YStack gap={hp(6)}>
      <YStack>
        {/* Floating Label */}
        <Animated.View
          style={[
            styles.labelContainer,
            {
              transform: [
                { translateY: labelTranslateY },
                { scale: labelScale },
              ],
            },
          ]}
          pointerEvents="none"
        >
          <Animated.Text
            style={[
              styles.label,
              {
                color: getLabelColor(),
                backgroundColor: "#FFFFFF",
                paddingHorizontal: wp(4),
              },
            ]}
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
                borderColor: getBorderColor(),
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
              <Animated.View
                style={{
                  transform: [{ rotate: rotation }],
                }}
              >
                <ChevronDown
                  size={hp(20)}
                  color={isFocused ? "#121217" : "#9CA3AF"}
                />
              </Animated.View>
            </XStack>
          </Animated.View>
        </Pressable>

        {/* Dropdown Options - Inline expansion */}
        <Animated.View
          style={[
            styles.dropdownContainer,
            {
              height: heightAnim,
              opacity: heightAnim.interpolate({
                inputRange: [0, maxDropdownHeight * 0.3, maxDropdownHeight],
                outputRange: [0, 0.5, 1],
              }),
              borderColor: getBorderColor(),
            },
          ]}
        >
          <YStack>
            {options.map((option, index) => (
              <Pressable
                key={option.value}
                onPress={() => handleSelect(option.value)}
              >
                <XStack
                  style={[
                    styles.option,
                    {
                      backgroundColor:
                        value === option.value ? "#F3F4F6" : "#FFFFFF",
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
      </YStack>

      {/* Error Message */}
      {error && (
        <Animated.View
          style={{
            opacity: errorAnim,
            transform: [
              {
                translateY: errorAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-10, 0],
                }),
              },
            ],
          }}
        >
          <Text fontSize={fp(12)} color="#F44336" paddingLeft={wp(4)}>
            {error}
          </Text>
        </Animated.View>
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
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: hp(12),
    borderBottomRightRadius: hp(12),
    borderLeftWidth: 1.5,
    borderRightWidth: 1.5,
    borderBottomWidth: 1.5,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  option: {
    paddingHorizontal: wp(16),
    paddingVertical: hp(14),
    minHeight: hp(48),
  },
});
