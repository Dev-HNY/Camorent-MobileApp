import { YStack, Text } from "tamagui";
import { Button } from "@/components/ui/Button";
import { Redirect, router } from "expo-router";
import { useAuthStore } from "@/store/auth/auth";
import { ImageBackgroundScreen } from "@/components/layouts/ImageBackgroundScreen";
import { fp, hp } from "@/utils/responsive";
import { useEffect } from "react";
import { Platform, PermissionsAndroid } from "react-native";
import Animated, { FadeInDown, FadeIn, ZoomIn } from "react-native-reanimated";
import * as Haptics from "expo-haptics";

export default function Index() {
  const { user, isCitySelected } = useAuthStore();

  // Request SMS permissions on Android for OTP auto-read
  // useEffect(() => {
  //   if (Platform.OS === "android") {
  //     const requestSmsPermission = async () => {
  //       try {
  //         const granted = await PermissionsAndroid.requestMultiple([
  //           PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
  //           PermissionsAndroid.PERMISSIONS.READ_SMS,
  //         ]);

  //         if (
  //           granted["android.permission.RECEIVE_SMS"] ===
  //             PermissionsAndroid.RESULTS.GRANTED &&
  //           granted["android.permission.READ_SMS"] ===
  //             PermissionsAndroid.RESULTS.GRANTED
  //         ) {
  //           console.log("SMS permissions granted for OTP auto-read");
  //         } else {
  //           console.log(
  //             "SMS permissions denied - OTP will need to be entered manually"
  //           );
  //         }
  //       } catch (err) {
  //         console.warn("SMS permission request error:", err);
  //       }
  //     };

  //     requestSmsPermission();
  //   }
  // }, []);

  const handleStart = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/welcome");
  };

  // Redirect based on auth state
  if (user) {
    const hasCompletedProfile = Boolean(user.first_name);

    if (!hasCompletedProfile) {
      return <Redirect href={"/(auth)/info"} />;
    }

    if (!isCitySelected) {
      return <Redirect href={"/(auth)/city-page"} />;
    }

    // Profile and city complete - go to home
    return <Redirect href={"/(tabs)/(home)"} />;
  }

  return (
    <ImageBackgroundScreen source={require("@/assets/images/onboarding.png")}>
      <YStack flex={1} justifyContent="flex-end" padding={"$4"} gap="$5">
        <Animated.View entering={FadeInDown.delay(200).duration(500).springify().damping(15)}>
          <YStack gap={hp(12)} alignItems="center">
            <Text
              fontSize={fp(21)}
              fontWeight="500"
              color="white"
              textAlign="center"
              lineHeight={hp(26)}
            >
              INDIA&apos;S FIRST CAMERA RENTAL SERVICE APP FOR FILMMAKERS
            </Text>

            <Text
              fontSize={fp(14)}
              fontWeight={"400"}
              color="white"
              textAlign="center"
              lineHeight={hp(20)}
            >
              A platform where filmmakers feels homely.
            </Text>
          </YStack>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(500).springify().damping(15)}>
          <Button size="lg" onPress={handleStart} variant="primary">
            Let&apos;s Start
          </Button>
        </Animated.View>
      </YStack>
    </ImageBackgroundScreen>
  );
}
