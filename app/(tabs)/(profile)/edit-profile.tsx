import { SafeAreaView } from "react-native-safe-area-context";
import { XStack, YStack, Spinner, Text } from "tamagui";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChevronLeft, Camera, User, Mail, Briefcase, Phone, Building2, CreditCard, FileText } from "lucide-react-native";
import { router } from "expo-router";
import { fp, hp, wp } from "@/utils/responsive";
import { useGetCurrentUser, useUpdateUserProfile } from "@/hooks/auth";
import { useEffect } from "react";
import { Pressable, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { AnimatedInput } from "@/components/ui/AnimatedInput";
import { AnimatedDropdown } from "@/components/ui/AnimatedDropdown";
import * as Haptics from "expo-haptics";
import { KeyboardAwareScrollView } from "@/components/ui/KeyboardAwareScrollView";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

const editProfileSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  profession: z.string().min(1, "Please select your role"),
});

type EditProfileForm = z.infer<typeof editProfileSchema>;

const roleOptions = [
  { label: "Director of Photography (DOP)", value: "dop" },
  { label: "Assistant DOP (AC)", value: "assistant_dop" },
  { label: "Video Producer in Production Company", value: "video_producer" },
  { label: "Content Team in Corporate Company", value: "content_team" },
  { label: "Individual end to end shooting", value: "individual_shooting" },
];

export default function EditProfileScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const { data: currentUser, isLoading: isLoadingUser } = useGetCurrentUser();
  const updateProfile = useUpdateUserProfile();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<EditProfileForm>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      profession: "",
    },
  });

  // Populate form when user data is loaded
  useEffect(() => {
    if (currentUser) {
      reset({
        first_name: currentUser.first_name || "",
        last_name: currentUser.last_name || "",
        email: currentUser.email || "",
        profession: currentUser.profession || "",
      });
    }
  }, [currentUser, reset]);

  const onSubmit = (data: EditProfileForm) => {
    updateProfile.mutate(data, {
      onSuccess: () => {
        router.back();
      },
    });
  };

  if (isLoadingUser) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F8F8" }}>
        <YStack flex={1} justifyContent="center" alignItems="center">
          <Spinner size="large" color="#8E0FFF" />
        </YStack>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F8F8" }} edges={["top"]}>
      {/* Purple Gradient Background - Full Height with Fade */}
      <LinearGradient
        colors={["#C8A2E0", "#D4B5F0", "#E8D5F5", "rgba(232, 213, 245, 0.6)", "rgba(232, 213, 245, 0.3)", "rgba(232, 213, 245, 0.1)", "rgba(232, 213, 245, 0)"]}
        locations={[0, 0.15, 0.3, 0.5, 0.7, 0.85, 1]}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      {/* Header */}
      <XStack
        justifyContent="space-between"
        alignItems="center"
        paddingHorizontal={wp(20)}
        paddingTop={hp(12)}
        paddingBottom={hp(16)}
        position="relative"
      >
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
          style={{
            width: wp(36),
            height: hp(36),
            borderRadius: wp(18),
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ChevronLeft size={hp(20)} color="#000000" strokeWidth={2} />
        </Pressable>

        <Text fontSize={fp(17)} fontWeight="600" color="#000000">
          Edit Profile
        </Text>

        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            handleSubmit(onSubmit)();
          }}
          disabled={!isDirty || updateProfile.isPending}
          style={{
            opacity: !isDirty || updateProfile.isPending ? 0.5 : 1,
          }}
        >
          <Text fontSize={fp(16)} fontWeight="600" color="#8E0FFF">
            {updateProfile.isPending ? "Saving..." : "Save"}
          </Text>
        </Pressable>
      </XStack>

      <KeyboardAwareScrollView
        contentContainerStyle={{ paddingBottom: tabBarHeight + hp(40) }}
        extraScrollHeight={80}
        enableResetScrollToCoords={false}
      >
        <YStack gap={hp(24)}>
          {/* Profile Photo Section */}
          <YStack alignItems="center" paddingTop={hp(8)}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                position: "relative",
              }}
            >
              {/* Avatar */}
              <YStack
                width={wp(120)}
                height={hp(120)}
                borderRadius={wp(60)}
                backgroundColor="#FFFFFF"
                overflow="hidden"
                shadowColor="#000000"
                shadowOffset={{ width: 0, height: 4 }}
                shadowOpacity={0.15}
                shadowRadius={12}
                elevation={6}
              >
                <Image
                  source={require("@/assets/images/adaptive-icon.png")}
                  style={{ width: "100%", height: "100%" }}
                  contentFit="cover"
                />
              </YStack>

              {/* Camera Button Overlay */}
              <YStack
                position="absolute"
                bottom={0}
                right={0}
                width={wp(40)}
                height={hp(40)}
                borderRadius={wp(20)}
                backgroundColor="#8E0FFF"
                justifyContent="center"
                alignItems="center"
                borderWidth={3}
                borderColor="#FFFFFF"
                shadowColor="#8E0FFF"
                shadowOffset={{ width: 0, height: 2 }}
                shadowOpacity={0.3}
                shadowRadius={6}
                elevation={4}
              >
                <Camera size={hp(20)} color="#FFFFFF" strokeWidth={2.5} />
              </YStack>
            </TouchableOpacity>

            <Text
              fontSize={fp(13)}
              fontWeight="500"
              color="#666666"
              marginTop={hp(12)}
            >
              Tap to change profile photo
            </Text>
          </YStack>

          {/* Form Section */}
          <YStack paddingHorizontal={wp(20)} gap={hp(20)}>
            {/* Personal Information Card */}
            <YStack gap={hp(12)}>
              <Text
                fontSize={fp(13)}
                fontWeight="600"
                color="#8E8E93"
                textTransform="uppercase"
                letterSpacing={0.5}
                paddingHorizontal={wp(4)}
              >
                Personal Information
              </Text>

              <YStack
                backgroundColor="#FFFFFF"
                borderRadius={wp(16)}
                padding={wp(20)}
                gap={hp(20)}
                shadowColor="#000000"
                shadowOffset={{ width: 0, height: 2 }}
                shadowOpacity={0.06}
                shadowRadius={8}
                elevation={3}
              >
                {/* First Name */}
                <YStack zIndex={4}>
                  <Controller
                    control={control}
                    name="first_name"
                    render={({ field: { onChange, value } }) => (
                      <AnimatedInput
                        label="First Name"
                        value={value}
                        onChangeText={onChange}
                        placeholder="Enter your first name"
                        error={errors.first_name?.message}
                        icon={<User size={hp(18)} color="#8E8E93" />}
                      />
                    )}
                  />
                </YStack>

                {/* Last Name */}
                <YStack zIndex={3}>
                  <Controller
                    control={control}
                    name="last_name"
                    render={({ field: { onChange, value } }) => (
                      <AnimatedInput
                        label="Last Name"
                        value={value}
                        onChangeText={onChange}
                        placeholder="Enter your last name"
                        error={errors.last_name?.message}
                        icon={<User size={hp(18)} color="#8E8E93" />}
                      />
                    )}
                  />
                </YStack>

                {/* Email */}
                <YStack zIndex={2}>
                  <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, value } }) => (
                      <AnimatedInput
                        label="Email Address"
                        value={value}
                        onChangeText={onChange}
                        placeholder="Enter your email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        error={errors.email?.message}
                        icon={<Mail size={hp(18)} color="#8E8E93" />}
                      />
                    )}
                  />
                </YStack>

                {/* Profession */}
                <YStack zIndex={1000}>
                  <Controller
                    control={control}
                    name="profession"
                    render={({ field: { onChange, value } }) => (
                      <AnimatedDropdown
                        label="Profession"
                        value={value}
                        options={roleOptions}
                        onValueChange={onChange}
                        placeholder="Select your role"
                        error={errors.profession?.message}
                      />
                    )}
                  />
                </YStack>
              </YStack>
            </YStack>

            {/* Read-Only Information Card */}
            <YStack gap={hp(12)}>
              <Text
                fontSize={fp(13)}
                fontWeight="600"
                color="#8E8E93"
                textTransform="uppercase"
                letterSpacing={0.5}
                paddingHorizontal={wp(4)}
              >
                Account Details
              </Text>

              <YStack
                backgroundColor="#FFFFFF"
                borderRadius={wp(16)}
                padding={wp(20)}
                gap={hp(16)}
                shadowColor="#000000"
                shadowOffset={{ width: 0, height: 2 }}
                shadowOpacity={0.06}
                shadowRadius={8}
                elevation={3}
              >
                {/* Phone Number - Read Only */}
                <YStack gap={hp(8)}>
                  <XStack alignItems="center" gap={wp(8)}>
                    <Phone size={hp(16)} color="#8E8E93" />
                    <Text fontSize={fp(12)} fontWeight="500" color="#8E8E93">
                      Phone Number
                    </Text>
                  </XStack>
                  <YStack
                    backgroundColor="#F9F9F9"
                    padding={wp(14)}
                    borderRadius={wp(10)}
                    borderWidth={1}
                    borderColor="#E5E5EA"
                  >
                    <Text fontSize={fp(15)} fontWeight="400" color="#666666">
                      {currentUser?.phone_number || "Not provided"}
                    </Text>
                  </YStack>
                </YStack>

                {/* User Type - Read Only */}
                <YStack gap={hp(8)}>
                  <XStack alignItems="center" gap={wp(8)}>
                    <Briefcase size={hp(16)} color="#8E8E93" />
                    <Text fontSize={fp(12)} fontWeight="500" color="#8E8E93">
                      User Type
                    </Text>
                  </XStack>
                  <YStack
                    backgroundColor="#F9F9F9"
                    padding={wp(14)}
                    borderRadius={wp(10)}
                    borderWidth={1}
                    borderColor="#E5E5EA"
                  >
                    <Text fontSize={fp(15)} fontWeight="400" color="#666666">
                      {currentUser?.user_type === "organisation"
                        ? "Organization"
                        : "Individual"}
                    </Text>
                  </YStack>
                </YStack>
              </YStack>
            </YStack>

            {/* Organization Details - Only if user type is organization */}
            {currentUser?.user_type === "organisation" && (
              <YStack gap={hp(12)}>
                <Text
                  fontSize={fp(13)}
                  fontWeight="600"
                  color="#8E8E93"
                  textTransform="uppercase"
                  letterSpacing={0.5}
                  paddingHorizontal={wp(4)}
                >
                  Organization Details
                </Text>

                <YStack
                  backgroundColor="#FFFFFF"
                  borderRadius={wp(16)}
                  padding={wp(20)}
                  gap={hp(16)}
                  shadowColor="#000000"
                  shadowOffset={{ width: 0, height: 2 }}
                  shadowOpacity={0.06}
                  shadowRadius={8}
                  elevation={3}
                >
                  {/* Organization Name */}
                  <YStack gap={hp(8)}>
                    <XStack alignItems="center" gap={wp(8)}>
                      <Building2 size={hp(16)} color="#8E8E93" />
                      <Text fontSize={fp(12)} fontWeight="500" color="#8E8E93">
                        Organization Name
                      </Text>
                    </XStack>
                    <YStack
                      backgroundColor="#F9F9F9"
                      padding={wp(14)}
                      borderRadius={wp(10)}
                      borderWidth={1}
                      borderColor="#E5E5EA"
                    >
                      <Text fontSize={fp(15)} fontWeight="400" color="#666666">
                        {currentUser?.org_name || "Not provided"}
                      </Text>
                    </YStack>
                  </YStack>

                  {/* GSTIN */}
                  <YStack gap={hp(8)}>
                    <XStack alignItems="center" gap={wp(8)}>
                      <FileText size={hp(16)} color="#8E8E93" />
                      <Text fontSize={fp(12)} fontWeight="500" color="#8E8E93">
                        GSTIN Number
                      </Text>
                    </XStack>
                    <YStack
                      backgroundColor="#F9F9F9"
                      padding={wp(14)}
                      borderRadius={wp(10)}
                      borderWidth={1}
                      borderColor="#E5E5EA"
                    >
                      <Text fontSize={fp(15)} fontWeight="400" color="#666666">
                        {currentUser?.GSTIN_no || "Not provided"}
                      </Text>
                    </YStack>
                  </YStack>

                  {/* PAN */}
                  <YStack gap={hp(8)}>
                    <XStack alignItems="center" gap={wp(8)}>
                      <CreditCard size={hp(16)} color="#8E8E93" />
                      <Text fontSize={fp(12)} fontWeight="500" color="#8E8E93">
                        PAN Number
                      </Text>
                    </XStack>
                    <YStack
                      backgroundColor="#F9F9F9"
                      padding={wp(14)}
                      borderRadius={wp(10)}
                      borderWidth={1}
                      borderColor="#E5E5EA"
                    >
                      <Text fontSize={fp(15)} fontWeight="400" color="#666666">
                        {currentUser?.PAN_no || "Not provided"}
                      </Text>
                    </YStack>
                  </YStack>
                </YStack>
              </YStack>
            )}
          </YStack>
        </YStack>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
