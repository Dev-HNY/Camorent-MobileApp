import { useState, useEffect, useRef } from "react";
import { TextInput, Animated, View, Pressable } from "react-native";
import { XStack } from "tamagui";
import { Search, X } from "lucide-react-native";
import { hp, wp, fp } from "@/utils/responsive";

interface AnimatedSearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  inputRef?: React.RefObject<TextInput | null>;
  borderColor?: string;
  iconColor?: string;
}

const ROTATION_WORDS = ["cameras", "lenses", "gimbals", "lights", "accessories"];
const ANIMATION_DURATION = 2000; // Duration each word stays visible (faster)
const FADE_DURATION = 400; // Fade in/out duration (faster)

export function AnimatedSearchInput({
  value,
  onChangeText,
  onClear,
  inputRef,
  borderColor = "#E8E8ED",
  iconColor = "#A0A0AB",
}: AnimatedSearchInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;

  // Rotate words only when input is empty and not focused
  useEffect(() => {
    if (value || isFocused) {
      return; // Don't animate when typing or focused
    }

    const rotateWords = () => {
      // Fade out and slide up
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: FADE_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: -8,
          duration: FADE_DURATION,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Change word at the midpoint (invisible)
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % ROTATION_WORDS.length);

        // Reset position and fade in
        translateYAnim.setValue(8); // Start from below
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: FADE_DURATION,
            useNativeDriver: true,
          }),
          Animated.timing(translateYAnim, {
            toValue: 0,
            duration: FADE_DURATION,
            useNativeDriver: true,
          }),
        ]).start();
      });
    };

    // Initial animation and interval
    const interval = setInterval(rotateWords, ANIMATION_DURATION);

    return () => clearInterval(interval);
  }, [value, isFocused, fadeAnim, translateYAnim]);

  // Reset animation when focus changes
  useEffect(() => {
    if (isFocused || value) {
      fadeAnim.setValue(1);
      translateYAnim.setValue(0);
    }
  }, [isFocused, value, fadeAnim, translateYAnim]);

  return (
    <XStack
      backgroundColor="#FFFFFF"
      borderRadius={wp(14)}
      paddingLeft={wp(16)}
      paddingRight={value ? wp(8) : wp(16)}
      paddingVertical={hp(14)}
      alignItems="center"
      gap={wp(12)}
      borderWidth={1.5}
      borderColor={borderColor}
      shadowColor="#000000"
      shadowOffset={{ width: 0, height: 1 }}
      shadowOpacity={0.04}
      shadowRadius={2}
      position="relative"
    >
      <Search size={hp(20)} color={iconColor} strokeWidth={2} />

      {/* Container for TextInput and Animated Placeholder */}
      <View
        style={{
          flex: 1,
          position: "relative",
          backgroundColor: "#FFFFFF", // Explicit white background
        }}
      >
        {/* Custom Animated Placeholder - Only visible when empty and not focused */}
        {!value && !isFocused && (
          <View
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              justifyContent: "center",
              flexDirection: "row",
              alignItems: "center",
              pointerEvents: "none",
              backgroundColor: "transparent", // Transparent to show parent white bg
            }}
          >
            <Animated.Text
              style={{
                fontSize: fp(16),
                color: "#A0A0AB", // Light gray for placeholder
                fontWeight: "400",
                letterSpacing: -0.3,
                backgroundColor: "transparent",
              }}
            >
              Search for help with{" "}
            </Animated.Text>
            <Animated.Text
              style={{
                fontSize: fp(16),
                color: "#8E0FFF", // Purple for animated word
                fontWeight: "500",
                letterSpacing: -0.3,
                opacity: fadeAnim,
                transform: [{ translateY: translateYAnim }],
                backgroundColor: "transparent",
              }}
            >
              {ROTATION_WORDS[currentWordIndex]}
            </Animated.Text>
          </View>
        )}

        {/* Actual TextInput */}
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={isFocused || value ? "Search questions..." : ""}
          placeholderTextColor="#A0A0AB"
          // Ensure keyboard appearance is light (not dark mode)
          keyboardAppearance="light"
          style={{
            flex: 1,
            fontSize: fp(16),
            color: "#1C1C1E", // Dark text on white background
            padding: 0,
            fontWeight: "400",
            letterSpacing: -0.3,
            backgroundColor: "transparent", // Transparent to show parent white bg
          }}
        />
      </View>

      {/* Clear Button */}
      {value ? (
        <Pressable
          onPress={onClear}
          style={{
            width: wp(28),
            height: wp(28),
            borderRadius: wp(14),
            backgroundColor: "#F0F0F5",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <X size={hp(16)} color="#6B7280" strokeWidth={2.5} />
        </Pressable>
      ) : null}
    </XStack>
  );
}
