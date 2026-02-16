import React, { useRef, useEffect } from "react";
import { YStack, XStack, Text } from "tamagui";
import { Button } from "@/components/ui/Button";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { ArrowRight } from "lucide-react-native";
import { TouchableOpacity, Animated } from "react-native";
import { BodySmall, BodyText, Heading2 } from "@/components/ui/Typography";
import { wp, hp, fp } from "@/utils/responsive";
import { Input } from "../ui/Input";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

interface ShootSettingsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onDone: () => void;
  onStartDatePress: () => void;
  onEndDatePress: () => void;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  formatDateDisplay: (dateStr: string) => string;
}

export function ShootSettingsSheet({
  isOpen,
  onClose,
  onDone,
  onStartDatePress,
  onEndDatePress,
  startDate,
  endDate,
  startTime = "08:00 am",
  endTime = "08:00 am",
  formatDateDisplay,
}: ShootSettingsSheetProps) {
  // Premium animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      slideAnim.setValue(20);
    }
  }, [isOpen]);

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} snapPoints={[35]}>
      <LinearGradient
        colors={[
          "rgba(255, 255, 255, 1)",
          "rgba(142, 15, 255, 0.02)",
          "rgba(255, 255, 255, 1)",
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ flex: 1 }}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <YStack
            gap={hp(20)}
            paddingHorizontal={wp(16)}
            paddingVertical={hp(24)}
          >
            <Text fontSize={fp(20)} fontWeight="700" color="#1C1C1E" letterSpacing={-0.3}>
              Shoot Settings
            </Text>

          {/* Date Range Display */}
          <LinearGradient
            colors={[
              "rgba(255, 255, 255, 1)",
              "rgba(142, 15, 255, 0.03)",
              "rgba(255, 255, 255, 1)",
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              borderRadius: wp(12),
              borderWidth: 1,
              borderColor: "rgba(142, 15, 255, 0.12)",
              paddingHorizontal: wp(14),
              paddingVertical: hp(14),
              shadowColor: "#8E0FFF",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <XStack
              alignItems="center"
              gap={wp(8)}
            >
              {/* Start Date & Time */}
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  onStartDatePress();
                }}
                style={{ flex: 1 }}
              >
                <YStack gap={hp(4)}>
                  <Text fontSize={fp(14)} fontWeight="600" color="#1C1C1E" letterSpacing={-0.2}>
                    {startDate
                      ? formatDateDisplay(startDate)
                      : "Select Start Date"}
                  </Text>
                  <Text fontSize={fp(12)} color="#6B7280">
                    {startTime}
                  </Text>
                </YStack>
              </TouchableOpacity>
              {/* Arrow */}
              <XStack
                backgroundColor="rgba(142, 15, 255, 0.08)"
                padding={wp(6)}
                borderRadius={wp(6)}
              >
                <ArrowRight size={hp(16)} color="#8E0FFF" strokeWidth={2} />
              </XStack>
              {/* End Date & Time */}
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  onEndDatePress();
                }}
                style={{ flex: 1 }}
              >
                <YStack alignItems="flex-end" gap={hp(4)}>
                  <Text fontSize={fp(14)} fontWeight="600" color="#1C1C1E" letterSpacing={-0.2}>
                    {endDate ? formatDateDisplay(endDate) : "Select End Date"}
                  </Text>
                  <Text fontSize={fp(12)} color="#6B7280">
                    {endTime}
                  </Text>
                </YStack>
              </TouchableOpacity>
            </XStack>
          </LinearGradient>

          {/* Done Button */}
          <Button
            variant="primary"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onDone();
            }}
            backgroundColor="#8E0FFF"
            borderRadius={wp(10)}
            paddingVertical={hp(16)}
            disabled={!startDate || !endDate}
            opacity={!startDate || !endDate ? 0.5 : 1}
          >
            <Text color="white" fontWeight="600" fontSize={fp(15)} letterSpacing={-0.2}>
              Done
            </Text>
          </Button>
          </YStack>
        </Animated.View>
      </LinearGradient>
    </BottomSheet>
  );
}
