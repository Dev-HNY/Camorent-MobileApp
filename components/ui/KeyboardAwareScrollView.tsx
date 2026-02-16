import React, { useRef, useEffect } from "react";
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ScrollViewProps,
  KeyboardEvent,
  findNodeHandle,
  TextInput,
} from "react-native";
import { YStack } from "tamagui";

interface KeyboardAwareScrollViewProps extends ScrollViewProps {
  children: React.ReactNode;
  extraScrollHeight?: number;
  enableAutomaticScroll?: boolean;
  enableResetScrollToCoords?: boolean;
  keyboardVerticalOffset?: number;
}

/**
 * Industry-grade KeyboardAwareScrollView that automatically scrolls to focused input
 * Mimics behavior from apps like Airbnb and Apple apps
 */
export function KeyboardAwareScrollView({
  children,
  extraScrollHeight = 20,
  enableAutomaticScroll = true,
  enableResetScrollToCoords = true,
  keyboardVerticalOffset = 0,
  ...scrollViewProps
}: KeyboardAwareScrollViewProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const keyboardHeightRef = useRef(0);
  const currentlyFocusedInputRef = useRef<TextInput | null>(null);

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      handleKeyboardShow
    );

    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      handleKeyboardHide
    );

    // Track currently focused input
    const textInputs = TextInput as any;
    const originalFocus = textInputs.State.focusTextInput;
    const originalBlur = textInputs.State.blurTextInput;

    textInputs.State.focusTextInput = function (textField: TextInput) {
      currentlyFocusedInputRef.current = textField;
      originalFocus.call(this, textField);
    };

    textInputs.State.blurTextInput = function (textField: TextInput) {
      currentlyFocusedInputRef.current = null;
      originalBlur.call(this, textField);
    };

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();

      // Restore original methods
      textInputs.State.focusTextInput = originalFocus;
      textInputs.State.blurTextInput = originalBlur;
    };
  }, []);

  const handleKeyboardShow = (event: KeyboardEvent) => {
    keyboardHeightRef.current = event.endCoordinates.height;

    if (enableAutomaticScroll && currentlyFocusedInputRef.current) {
      setTimeout(() => {
        scrollToInput(currentlyFocusedInputRef.current);
      }, 100);
    }
  };

  const handleKeyboardHide = () => {
    keyboardHeightRef.current = 0;

    if (enableResetScrollToCoords) {
      scrollViewRef.current?.scrollTo({
        x: 0,
        y: 0,
        animated: true,
      });
    }
  };

  const scrollToInput = (input: TextInput | null) => {
    if (!input || !scrollViewRef.current) return;

    const scrollView = scrollViewRef.current;
    const nodeHandle = findNodeHandle(input);

    if (!nodeHandle) return;

    // Measure the input position relative to the window
    (input as any).measureLayout(
      findNodeHandle(scrollView),
      (x: number, y: number, width: number, height: number) => {
        const keyboardHeight = keyboardHeightRef.current;
        const scrollViewHeight = 600; // Approximate, will be overridden by actual measurement

        // Calculate the position to scroll to
        // We want the input to be visible above the keyboard with some extra space
        const inputBottom = y + height + extraScrollHeight;
        const visibleHeight = scrollViewHeight - keyboardHeight;

        if (inputBottom > visibleHeight) {
          const scrollTo = inputBottom - visibleHeight;

          scrollView.scrollTo({
            x: 0,
            y: scrollTo,
            animated: true,
          });
        }
      },
      () => {
        // Error callback - fallback to simple scroll
        scrollView.scrollTo({
          x: 0,
          y: 100,
          animated: true,
        });
      }
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <ScrollView
        ref={scrollViewRef}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        scrollEventThrottle={16}
        bounces={true}
        {...scrollViewProps}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
