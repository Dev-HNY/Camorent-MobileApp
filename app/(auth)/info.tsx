import { BackButton } from "@/components/ui/BackButton";
import { Button } from "@/components/ui/Button";
import { BodySmall, Heading1 } from "@/components/ui/Typography";
import { zodResolver } from "@hookform/resolvers/zod";
import { Redirect, router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, XStack, YStack, Spinner } from "tamagui";
import { z } from "zod";
import {
  ActivityIndicator,
  Animated,
} from "react-native";
import { useAuthStore } from "@/store/auth/auth";
import { AnimatedFormField } from "@/components/ui/AnimatedFormField";
import { AnimatedDropdown } from "@/components/ui/AnimatedDropdown";
import { ProgressIndicator } from "@/components/ui/ProgressIndicator";
import { fp, hp, wp } from "@/utils/responsive";
import { useRef, useEffect } from "react";
import { useVerifyGST } from "@/hooks/verifications/useVerifyGST";
import { useUpdateUserProfile } from "@/hooks/auth";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { KeyboardAwareScrollView } from "@/components/ui/KeyboardAwareScrollView";

type LoginFormData = {
  name: string;
  profession: string;
  userType: string;
  org_name?: string;
  GSTIN_no?: string;
};

const schema = z
  .object({
    name: z.string().min(1, "Please enter your name"),
    userType: z.string().min(1, "Please select your user type"),
    profession: z.string().min(1, "Please select your profession"),
    org_name: z.string().optional(),
    GSTIN_no: z
      .string()
      .optional()
      .refine(
        (val) => !val || val.length === 15,
        "GSTIN must be exactly 15 characters"
      )
      .refine(
        (val) =>
          !val || /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{3}$/.test(val),
        "Invalid GSTIN format"
      ),
  })
  .superRefine((data, ctx) => {
    if (data.userType === "organisation") {
      // org_name is auto-filled from GST, no validation needed here
      if (!data.GSTIN_no) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "GSTIN number is required",
          path: ["GSTIN_no"],
        });
      }
    }
  });

const userTypeOptions = [
  { label: "Individual", value: "individual" },
  { label: "Organisation", value: "organisation" },
];

const professionOptions = [
  { label: "Director of Photography (DOP)", value: "dop" },
  { label: "Assistant DOP (AC)", value: "assistant_dop" },
  { label: "Video Producer in Production Company", value: "video_producer" },
  { label: "Content Team in Corporate Company", value: "content_team" },
  { label: "Individual end to end shooting", value: "individual_shooting" },
];

export default function Info() {
  const { user, isVerified, isCitySelected, updateUser, setIsVerified } =
    useAuthStore();

  const verifygstmutation = useVerifyGST();
  const updateProfileMutation = useUpdateUserProfile();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onSubmit = (data: LoginFormData) => {
    if (data.userType === "organisation") {
      let hasError = false;

      if (verifygstmutation.isPending) {
        setError("GSTIN_no", {
          type: "manual",
          message: "GST verification is in progress. Please wait.",
        });
        hasError = true;
      } else if (!verifygstmutation.isSuccess) {
        setError("GSTIN_no", {
          type: "manual",
          message: "GST must be verified before proceeding.",
        });
        hasError = true;
      }

      if (hasError) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const userData = {
      first_name: data.name,
      last_name: "",
      user_type: data.userType,
      ...data,
    };

    updateProfileMutation.mutate(userData, {
      onSuccess: (updatedUser) => {
        updateUser(updatedUser);
        setIsVerified(true);
        router.replace({
          pathname: "/(auth)/city-page",
        });
      },
    });
  };

  if (!user) {
    return <Redirect href={"/(auth)/signup"} />;
  }

  if (isVerified && isCitySelected) {
    return <Redirect href={"/(tabs)/(home)"} />;
  }

  if (isVerified && !isCitySelected) {
    return <Redirect href={"/(auth)/city-page"} />;
  }

  const userType = watch("userType");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }} edges={["top"]}>
      <LinearGradient
        colors={["#FFFFFF", "#F8F7FF", "#FFFFFF"]}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <YStack flex={1}>
        <XStack
          justifyContent="space-between"
          paddingHorizontal={wp(16)}
          paddingVertical={hp(16)}
        >
          <BackButton onPress={() => router.back()} />
        </XStack>

        <KeyboardAwareScrollView
          contentContainerStyle={{
            paddingHorizontal: wp(16),
            paddingBottom: hp(40),
          }}
          extraScrollHeight={100}
          enableResetScrollToCoords={false}
        >
          {/* Header */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <YStack gap={hp(8)} marginBottom={hp(24)}>
              <Heading1>Tell us about yourself</Heading1>
              <Text fontSize={fp(14)} color="#6C6C89" lineHeight={hp(20)}>
                Help us personalize your experience
              </Text>
            </YStack>
          </Animated.View>

          {/* Progress */}
          <Animated.View style={{ opacity: fadeAnim, marginBottom: hp(24) }}>
            <ProgressIndicator
              steps={[
                { label: "Account", status: "completed" },
                { label: "Verify", status: "completed" },
                { label: "Profile", status: "active" },
                { label: "City", status: "pending" },
                { label: "Done", status: "pending" },
              ]}
              currentStep={2}
            />
          </Animated.View>

          {/* Form Fields */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <YStack gap={hp(16)}>
              {/* Name Field */}
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, value } }) => (
                  <AnimatedFormField
                    label="What is your name? *"
                    value={value || ""}
                    onChangeText={onChange}
                    placeholder="Enter your full name"
                    error={errors.name?.message}
                    autoCapitalize="words"
                  />
                )}
              />

              {/* Profession Field */}
              <Controller
                control={control}
                name="profession"
                render={({ field: { onChange, value } }) => (
                  <AnimatedDropdown
                    label="Select Your Profession *"
                    value={value || ""}
                    options={professionOptions}
                    onValueChange={onChange}
                    placeholder="Choose your role"
                    error={errors.profession?.message}
                  />
                )}
              />

              {/* User Type Field */}
              <Controller
                control={control}
                name="userType"
                render={({ field: { onChange, value } }) => (
                  <AnimatedDropdown
                    label="Select User Type *"
                    value={value || ""}
                    options={userTypeOptions}
                    onValueChange={onChange}
                    placeholder="Individual or Organisation"
                    error={errors.userType?.message}
                  />
                )}
              />

              {/* GSTIN Field - Only for Organisation */}
              {userType === "organisation" && (
                <Controller
                  control={control}
                  name="GSTIN_no"
                  render={({ field: { onChange, value } }) => {
                    const orgName = watch("org_name");
                    return (
                      <YStack gap={hp(8)}>
                        <AnimatedFormField
                          label="GSTIN Number *"
                          value={value || ""}
                          onChangeText={(text) => {
                            onChange(text);
                            if (text.length === 15) {
                              setTimeout(() => {
                                if (!errors.GSTIN_no) {
                                  verifygstmutation.mutate(
                                    { gstin: text },
                                    {
                                      onSuccess: (data: any) => {
                                        // Auto-fill organization name from GST legal_name
                                        if (data?.legal_name) {
                                          setValue("org_name", data.legal_name, {
                                            shouldValidate: true,
                                          });
                                          Haptics.notificationAsync(
                                            Haptics.NotificationFeedbackType.Success
                                          );
                                        }
                                      },
                                    }
                                  );
                                }
                              }, 500);
                            } else {
                              verifygstmutation.reset();
                              // Clear org_name when GSTIN is cleared
                              if (!text) {
                                setValue("org_name", "");
                              }
                            }
                          }}
                          placeholder="Enter 15-digit GSTIN"
                          error={errors.GSTIN_no?.message}
                          autoCapitalize="characters"
                        />
                        {verifygstmutation.isPending && (
                          <XStack gap={wp(8)} alignItems="center" paddingLeft={wp(4)}>
                            <ActivityIndicator size="small" color="#8E0FFF" />
                            <BodySmall color="#6C6C89">Verifying GST...</BodySmall>
                          </XStack>
                        )}
                        {verifygstmutation.isSuccess && (
                          <YStack gap={hp(4)}>
                            <BodySmall color="#22c55e" paddingLeft={wp(4)}>
                              ✓ GST verified successfully
                            </BodySmall>
                            {orgName && (
                              <YStack
                                backgroundColor="#F0FDF4"
                                borderWidth={1}
                                borderColor="#22c55e"
                                borderRadius={wp(8)}
                                padding={wp(12)}
                                gap={hp(4)}
                              >
                                <BodySmall color="#6C6C89" fontSize={fp(12)}>
                                  Organisation Name
                                </BodySmall>
                                <Text
                                  fontSize={fp(14)}
                                  fontWeight="600"
                                  color="#121217"
                                  lineHeight={hp(20)}
                                >
                                  {orgName}
                                </Text>
                              </YStack>
                            )}
                          </YStack>
                        )}
                        {verifygstmutation.isError && (
                          <BodySmall color="#F44336" paddingLeft={wp(4)}>
                            {(verifygstmutation.error as any)?.response?.data?.message ||
                              "GST verification failed. Please check the number."}
                          </BodySmall>
                        )}
                      </YStack>
                    );
                  }}
                />
              )}
            </YStack>
          </Animated.View>

          {/* Submit Button */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              marginTop: hp(24),
            }}
          >
            <Button
              size="lg"
              width="100%"
              onPress={handleSubmit(onSubmit)}
              disabled={updateProfileMutation.isPending}
              opacity={updateProfileMutation.isPending ? 0.7 : 1}
            >
              <XStack alignItems="center" gap={wp(8)} justifyContent="center">
                {updateProfileMutation.isPending ? (
                  <Spinner color={"white"} />
                ) : (
                  <Text fontSize={fp(16)} fontWeight="600" color="#FFF">
                    Continue
                  </Text>
                )}
              </XStack>
            </Button>
          </Animated.View>
        </KeyboardAwareScrollView>
      </YStack>
    </SafeAreaView>
  );
}
