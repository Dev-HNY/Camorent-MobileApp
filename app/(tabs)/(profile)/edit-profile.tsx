import { SafeAreaView } from "react-native-safe-area-context";
import { XStack, YStack, Spinner, Text } from "tamagui";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChevronLeft, User, Mail, Briefcase, Phone, Building2, CreditCard, FileText } from "lucide-react-native";
import { router } from "expo-router";
import { fp, hp, wp } from "@/utils/responsive";
import { useGetCurrentUser, useUpdateUserProfile } from "@/hooks/auth";
import { useEffect, useState } from "react";
import { Pressable, View, TextInput, StyleSheet, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AnimatedInput } from "@/components/ui/AnimatedInput";
import { AnimatedDropdown } from "@/components/ui/AnimatedDropdown";
import * as Haptics from "expo-haptics";
import { KeyboardAwareScrollView } from "@/components/ui/KeyboardAwareScrollView";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useVerifyGST } from "@/hooks/verifications/useVerifyGST";
import { useAuthStore } from "@/store/auth/auth";
import Svg, { Path } from "react-native-svg";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getInitials = (firstName: string, lastName: string) => {
  const f = (firstName || "").trim();
  const l = (lastName || "").trim();
  if (f && l) return (f.charAt(0) + l.charAt(0)).toUpperCase();
  if (f) return f.charAt(0).toUpperCase();
  return "?";
};

// ─── GSTIN regex ──────────────────────────────────────────────────────────────
const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{3}$/;

interface GSTINEditorProps {
  initialGSTIN: string;
  initialOrgName?: string;
}

function GSTINEditor({ initialGSTIN }: GSTINEditorProps) {
  const [gstin, setGstin] = useState(initialGSTIN || "");
  const [verifiedOrgName, setVerifiedOrgName] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(!!initialGSTIN);
  const [inputError, setInputError] = useState("");

  const { updateUser } = useAuthStore();
  const verifyMutation = useVerifyGST();
  const updateProfile = useUpdateUserProfile();

  useEffect(() => {
    if (initialGSTIN) {
      setGstin(initialGSTIN);
      setIsSaved(true);
    }
  }, [initialGSTIN]);

  const handleChange = (text: string) => {
    const upper = text.toUpperCase();
    setGstin(upper);
    setIsSaved(false);
    setInputError("");
    verifyMutation.reset();
    setVerifiedOrgName(null);
    if (upper.length === 15 && GST_REGEX.test(upper)) {
      verifyMutation.mutate(
        { gstin: upper },
        {
          onSuccess: (data: any) => {
            if (data?.legal_name) {
              setVerifiedOrgName(data.legal_name);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
          },
        }
      );
    }
  };

  const handleSave = () => {
    const trimmed = gstin.trim();
    if (!trimmed || trimmed.length !== 15 || !GST_REGEX.test(trimmed)) {
      setInputError("Invalid GSTIN format (e.g. 29ABCDE1234F1Z5)");
      return;
    }
    if (!verifyMutation.isSuccess) {
      setInputError("Please wait for GSTIN verification");
      return;
    }
    updateProfile.mutate(
      {
        first_name: "",
        GSTIN_no: trimmed,
        ...(verifiedOrgName ? { org_name: verifiedOrgName } : {}),
      },
      {
        onSuccess: (data) => {
          updateUser(data as any);
          setIsSaved(true);
          setInputError("");
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        },
        onError: () => {
          setInputError("Failed to save GSTIN. Please try again.");
        },
      }
    );
  };

  const isVerifying = verifyMutation.isPending;
  const isVerified = verifyMutation.isSuccess;
  const isSaving = updateProfile.isPending;
  const canSave = isVerified && !isSaved && !isSaving;

  return (
    <YStack gap={hp(8)}>
      <XStack alignItems="center" gap={wp(8)}>
        <FileText size={hp(16)} color="#8E8E93" />
        <Text fontSize={fp(12)} fontWeight="500" color="#8E8E93">
          GSTIN Number
        </Text>
        {isSaved && (
          <YStack
            backgroundColor="#F0FDF4"
            paddingHorizontal={wp(8)}
            paddingVertical={hp(2)}
            borderRadius={wp(6)}
          >
            <Text fontSize={fp(10)} fontWeight="600" color="#22C55E">Verified ✓</Text>
          </YStack>
        )}
      </XStack>

      <View style={gstEditStyles.inputRow}>
        <TextInput
          style={[
            gstEditStyles.input,
            inputError ? gstEditStyles.inputError : null,
            isVerified ? gstEditStyles.inputVerified : null,
            isSaved ? gstEditStyles.inputVerified : null,
          ]}
          value={gstin}
          onChangeText={handleChange}
          placeholder="Enter 15-digit GSTIN"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="characters"
          maxLength={15}
          returnKeyType="done"
          editable={!isSaved}
        />

        {isVerifying || isSaving ? (
          <View style={[gstEditStyles.statusWrap, { borderColor: "#8E0FFF", backgroundColor: "#F5EDFF" }]}>
            <ActivityIndicator size="small" color="#8E0FFF" />
          </View>
        ) : isSaved ? (
          <View style={[gstEditStyles.statusWrap, gstEditStyles.statusSaved]}>
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
              <Path d="M20 6L9 17l-5-5" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </View>
        ) : (
          <Pressable
            onPress={handleSave}
            disabled={!canSave}
            style={({ pressed }) => [
              gstEditStyles.saveBtn,
              !canSave && gstEditStyles.saveBtnDisabled,
              pressed && { opacity: 0.82 },
            ]}
          >
            <LinearGradient
              colors={["#8E0FFF", "#6D00DA"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={gstEditStyles.saveBtnGrad}
            >
              <Text style={gstEditStyles.saveBtnText}>Save</Text>
            </LinearGradient>
          </Pressable>
        )}
      </View>

      {!!inputError && (
        <Text fontSize={fp(11.5)} color="#EF4444">{inputError}</Text>
      )}
      {isVerifying && (
        <Text fontSize={fp(11.5)} color="#9CA3AF">Verifying GSTIN…</Text>
      )}
      {isVerified && !isSaved && (
        <Text fontSize={fp(11.5)} color="#22C55E">✓ GSTIN verified — tap Save</Text>
      )}
      {verifyMutation.isError && (
        <Text fontSize={fp(11.5)} color="#EF4444">
          {(verifyMutation.error as any)?.response?.data?.message || "Verification failed. Check the number."}
        </Text>
      )}

      {/* Verified org name */}
      {isVerified && verifiedOrgName && (
        <YStack
          backgroundColor="#F0FDF4"
          borderWidth={1}
          borderColor="#22C55E"
          borderRadius={wp(10)}
          padding={wp(12)}
          gap={hp(3)}
        >
          <Text fontSize={fp(11)} color="#6C6C89" fontWeight="500">Organisation Name</Text>
          <Text fontSize={fp(13.5)} fontWeight="700" color="#121217">{verifiedOrgName}</Text>
        </YStack>
      )}

      {/* Change link */}
      {isSaved && (
        <Pressable
          onPress={() => { setIsSaved(false); verifyMutation.reset(); setVerifiedOrgName(null); }}
          hitSlop={8}
        >
          <Text fontSize={fp(12)} color="#8E0FFF" fontWeight="600">Change GSTIN</Text>
        </Pressable>
      )}
    </YStack>
  );
}

const gstEditStyles = StyleSheet.create({
  inputRow: { flexDirection: "row", gap: wp(10), alignItems: "center" },
  input: {
    flex: 1,
    height: hp(46),
    borderWidth: 1.5,
    borderColor: "#E5E5EA",
    borderRadius: wp(10),
    paddingHorizontal: wp(12),
    fontSize: fp(13.5),
    color: "#121217",
    backgroundColor: "#F9F9F9",
    letterSpacing: 1,
    fontWeight: "600",
  },
  inputError: { borderColor: "#EF4444" },
  inputVerified: { borderColor: "#22C55E", backgroundColor: "#F0FDF4" },
  statusWrap: {
    width: wp(46),
    height: hp(46),
    borderRadius: wp(10),
    borderWidth: 1.5,
    borderColor: "#E5E5EA",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9F9F9",
  },
  statusSaved: { borderColor: "#22C55E", backgroundColor: "#F0FDF4" },
  saveBtn: { borderRadius: wp(10), overflow: "hidden", height: hp(46), minWidth: wp(64) },
  saveBtnDisabled: { opacity: 0.45 },
  saveBtnGrad: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: wp(14) },
  saveBtnText: { fontSize: fp(13), fontWeight: "700", color: "#FFFFFF" },
});

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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F2F2F7" }} edges={["top"]}>
      {/* Purple Gradient Background - Full Height with Fade */}
      <LinearGradient
        colors={[
          "#4A0D8F",
          "#5C1AAB",
          "rgba(94,26,171,0.55)",
          "rgba(94,26,171,0.20)",
          "rgba(242,242,247,0)",
        ]}
        locations={[0, 0.18, 0.38, 0.58, 1]}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: "50%",
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
            backgroundColor: "rgba(255,255,255,0.18)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ChevronLeft size={hp(20)} color="#FFFFFF" strokeWidth={2} />
        </Pressable>

        <Text fontSize={fp(17)} fontWeight="600" color="#FFFFFF" letterSpacing={-0.3}>
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
          <Text fontSize={fp(16)} fontWeight="600" color="#FFFFFF">
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
          {/* Profile Avatar — Initials */}
          <YStack alignItems="center" paddingTop={hp(8)}>
            <YStack
              width={wp(120)}
              height={hp(120)}
              borderRadius={wp(60)}
              backgroundColor="#7B2CBF"
              alignItems="center"
              justifyContent="center"
              shadowColor="#320163"
              shadowOffset={{ width: 0, height: 4 }}
              shadowOpacity={0.25}
              shadowRadius={12}
              elevation={6}
            >
              <Text fontSize={fp(40)} fontWeight="700" color="#FFFFFF" lineHeight={hp(48)}>
                {getInitials(currentUser?.first_name || "", currentUser?.last_name || "")}
              </Text>
            </YStack>
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
                  {/* Organization Name — read-only, auto-filled from GSTIN */}
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
                        {currentUser?.org_name || "Auto-filled from GSTIN"}
                      </Text>
                    </YStack>
                  </YStack>

                  {/* GSTIN — editable with verify */}
                  <GSTINEditor
                    initialGSTIN={currentUser?.GSTIN_no || ""}
                    initialOrgName={currentUser?.org_name || ""}
                  />

                  {/* PAN — read-only */}
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

            {/* GST Invoice — available for all users */}
            <YStack gap={hp(12)}>
              <Text
                fontSize={fp(13)}
                fontWeight="600"
                color="#8E8E93"
                textTransform="uppercase"
                letterSpacing={0.5}
                paddingHorizontal={wp(4)}
              >
                GST Invoice
              </Text>

              <YStack
                backgroundColor="#FFFFFF"
                borderRadius={wp(16)}
                padding={wp(20)}
                gap={hp(8)}
                shadowColor="#000000"
                shadowOffset={{ width: 0, height: 2 }}
                shadowOpacity={0.06}
                shadowRadius={8}
                elevation={3}
              >
                <Text fontSize={fp(12)} color="#9CA3AF" lineHeight={hp(18)}>
                  Add your GSTIN to receive a GST invoice for your bookings. It will be auto-applied at checkout.
                </Text>
                <GSTINEditor
                  initialGSTIN={currentUser?.GSTIN_no || ""}
                  initialOrgName={currentUser?.org_name || ""}
                />
              </YStack>
            </YStack>
          </YStack>
        </YStack>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
