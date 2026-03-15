import React, { useState, useEffect } from "react";
import { Sheet, Text, YStack, XStack } from "tamagui";
import {
  View,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Keyboard,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path, Line } from "react-native-svg";
import { useAuthStore } from "@/store/auth/auth";
import { useVerifyGST } from "@/hooks/verifications/useVerifyGST";
import { useUpdateUserProfile } from "@/hooks/auth/useUpdateUserProfile";
import { fp, hp, wp } from "@/utils/responsive";

const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{3}$/;

interface GSTSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Receipt SVG icon
function ReceiptIcon({ color = "#8E0FFF", size = 20 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1V2l-2 1-2-1-2 1-2-1-2 1-2-1z"
        stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      />
      <Line x1="8" y1="9" x2="16" y2="9" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Line x1="8" y1="13" x2="16" y2="13" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Line x1="8" y1="17" x2="12" y2="17" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

export function GSTSheet({ open, onOpenChange }: GSTSheetProps) {
  const { user, updateUser } = useAuthStore();
  const insets = useSafeAreaInsets();

  // "saved" = viewing existing GSTIN, "editing" = input mode
  const [mode, setMode] = useState<"saved" | "editing">("editing");
  const [gstin, setGstin] = useState("");
  const [verifiedOrgName, setVerifiedOrgName] = useState<string | null>(null);
  const [inputError, setInputError] = useState("");

  const verifyMutation = useVerifyGST();
  const updateProfileMutation = useUpdateUserProfile();

  // Reset on open
  useEffect(() => {
    if (open) {
      const savedGSTIN = user?.GSTIN_no || "";
      if (savedGSTIN) {
        setMode("saved");
        setGstin(savedGSTIN);
        setVerifiedOrgName(user?.org_name || null);
      } else {
        setMode("editing");
        setGstin("");
        setVerifiedOrgName(null);
      }
      setInputError("");
      verifyMutation.reset();
    }
  }, [open]);

  const handleChange = (text: string) => {
    const upper = text.toUpperCase();
    setGstin(upper);
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
    Keyboard.dismiss();
    const trimmed = gstin.trim();
    if (!trimmed || trimmed.length !== 15 || !GST_REGEX.test(trimmed)) {
      setInputError("Invalid GSTIN format (e.g. 29ABCDE1234F1Z5)");
      return;
    }
    if (!verifyMutation.isSuccess) {
      setInputError("Please wait for GSTIN verification");
      return;
    }
    updateProfileMutation.mutate(
      {
        first_name: "",
        GSTIN_no: trimmed,
        ...(verifiedOrgName ? { org_name: verifiedOrgName } : {}),
      },
      {
        onSuccess: (data) => {
          updateUser(data as any);
          setMode("saved");
          setInputError("");
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setTimeout(() => onOpenChange(false), 500);
        },
        onError: () => {
          setInputError("Failed to save GSTIN. Please try again.");
        },
      }
    );
  };

  const handleRemove = () => {
    updateProfileMutation.mutate(
      { first_name: "", GSTIN_no: "" },
      {
        onSuccess: (data) => {
          updateUser(data as any);
          setGstin("");
          setMode("editing");
          setInputError("");
          verifyMutation.reset();
          setVerifiedOrgName(null);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        },
      }
    );
  };

  const isVerifying = verifyMutation.isPending;
  const isVerified = verifyMutation.isSuccess;
  const verifyFailed = verifyMutation.isError;
  const isSaving = updateProfileMutation.isPending;
  const isRemoving = updateProfileMutation.isPending && mode === "saved";
  const canSave = isVerified && !isSaving;

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      snapPointsMode="fit"
      dismissOnSnapToBottom
      modal
      animation="quick"
    >
      <Sheet.Overlay
        backgroundColor="rgba(0,0,0,0.45)"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Frame
        backgroundColor="#FFFFFF"
        borderTopLeftRadius={wp(24)}
        borderTopRightRadius={wp(24)}
        paddingHorizontal={wp(20)}
        paddingTop={hp(20)}
        paddingBottom={Math.max(insets.bottom, hp(24))}
      >
        {/* Handle */}
        <YStack alignItems="center" marginBottom={hp(16)}>
          <View style={s.handle} />
        </YStack>

        {/* Header */}
        <XStack alignItems="center" gap={wp(10)} marginBottom={hp(20)}>
          <View style={s.iconWrap}>
            <ReceiptIcon color="#8E0FFF" size={20} />
          </View>
          <YStack flex={1}>
            <Text fontSize={fp(16)} fontWeight="700" color="#121217" letterSpacing={-0.2}>
              GST Invoice
            </Text>
            <Text fontSize={fp(12)} color="#8E0FFF" fontWeight="500" marginTop={hp(1)}>
              {mode === "saved" && gstin ? `GSTIN: ${gstin}` : "Add GSTIN for a GST invoice on this booking"}
            </Text>
          </YStack>
        </XStack>

        {mode === "saved" ? (
          /* ── Saved view ── */
          <YStack gap={hp(16)}>
            {/* GSTIN display card */}
            <View style={s.savedCard}>
              <XStack alignItems="center" justifyContent="space-between">
                <YStack gap={hp(3)} flex={1}>
                  <Text fontSize={fp(11)} color="#6C6C89" fontWeight="500">GSTIN</Text>
                  <Text fontSize={fp(15)} fontWeight="700" color="#16A34A" letterSpacing={1}>
                    {gstin}
                  </Text>
                  {verifiedOrgName ? (
                    <Text fontSize={fp(12)} color="#374151" fontWeight="500" marginTop={hp(2)}>
                      {verifiedOrgName}
                    </Text>
                  ) : null}
                </YStack>
                {/* Green check */}
                <View style={s.checkWrap}>
                  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                    <Path d="M20 6L9 17l-5-5" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                </View>
              </XStack>
            </View>

            {/* Actions */}
            <XStack gap={wp(10)}>
              <Pressable
                onPress={() => { setMode("editing"); verifyMutation.reset(); setVerifiedOrgName(null); }}
                style={({ pressed }) => [s.outlineBtn, { opacity: pressed ? 0.7 : 1 }]}
              >
                <Text fontSize={fp(14)} fontWeight="600" color="#8E0FFF">Change GSTIN</Text>
              </Pressable>
              <Pressable
                onPress={handleRemove}
                disabled={isRemoving}
                style={({ pressed }) => [s.outlineBtn, s.removeBtn, { opacity: pressed ? 0.7 : 1 }]}
              >
                {isRemoving
                  ? <ActivityIndicator size="small" color="#EF4444" />
                  : <Text fontSize={fp(14)} fontWeight="600" color="#EF4444">Remove</Text>
                }
              </Pressable>
            </XStack>

            <Pressable
              onPress={() => onOpenChange(false)}
              style={({ pressed }) => [s.doneBtn, { opacity: pressed ? 0.85 : 1 }]}
            >
              <Text fontSize={fp(15)} fontWeight="700" color="#FFFFFF">Done</Text>
            </Pressable>
          </YStack>
        ) : (
          /* ── Input / editing view ── */
          <YStack gap={hp(4)}>
            {/* Input row */}
            <View style={s.inputRow}>
              <TextInput
                style={[
                  s.input,
                  inputError ? s.inputError : null,
                  isVerified ? s.inputVerified : null,
                ]}
                value={gstin}
                onChangeText={handleChange}
                placeholder="Enter 15-digit GSTIN"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="characters"
                maxLength={15}
                returnKeyType="done"
                onSubmitEditing={handleSave}
                editable={!isSaving}
                autoFocus
              />

              {isVerifying || isSaving ? (
                <View style={[s.statusWrap, isSaving && { borderColor: "#8E0FFF", backgroundColor: "#F5EDFF" }]}>
                  <ActivityIndicator size="small" color="#8E0FFF" />
                </View>
              ) : (
                <Pressable
                  onPress={handleSave}
                  disabled={!canSave}
                  style={({ pressed }) => [s.saveBtn, !canSave && s.saveBtnDisabled, pressed && { opacity: 0.82 }]}
                >
                  <LinearGradient
                    colors={["#8E0FFF", "#6D00DA"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={s.saveBtnGrad}
                  >
                    <Text style={s.saveBtnText}>Save</Text>
                  </LinearGradient>
                </Pressable>
              )}
            </View>

            {/* Feedback */}
            {!!inputError && (
              <Text fontSize={fp(12)} color="#EF4444" marginTop={hp(4)}>{inputError}</Text>
            )}
            {isVerifying && (
              <Text fontSize={fp(12)} color="#9CA3AF" marginTop={hp(4)}>Verifying GSTIN…</Text>
            )}
            {isVerified && (
              <Text fontSize={fp(12)} color="#22C55E" marginTop={hp(4)}>
                ✓ GSTIN verified — tap Save to apply
              </Text>
            )}
            {verifyFailed && (
              <Text fontSize={fp(12)} color="#EF4444" marginTop={hp(4)}>
                {(verifyMutation.error as any)?.response?.data?.message || "GSTIN verification failed. Check the number."}
              </Text>
            )}

            {/* Verified org name card */}
            {isVerified && verifiedOrgName && (
              <View style={s.orgCard}>
                <Text fontSize={fp(11)} color="#6C6C89" fontWeight="500">Organisation Name</Text>
                <Text fontSize={fp(14)} fontWeight="700" color="#121217">{verifiedOrgName}</Text>
              </View>
            )}

            {/* Cancel */}
            <Pressable
              onPress={() => {
                if (user?.GSTIN_no) {
                  // Go back to saved view if there's an existing GSTIN
                  setMode("saved");
                  setGstin(user.GSTIN_no);
                  setVerifiedOrgName(user.org_name || null);
                  verifyMutation.reset();
                  setInputError("");
                } else {
                  onOpenChange(false);
                }
              }}
              style={({ pressed }) => [s.outlineBtn, { marginTop: hp(12), opacity: pressed ? 0.7 : 1 }]}
            >
              <Text fontSize={fp(14)} fontWeight="600" color="#6B7280">Cancel</Text>
            </Pressable>
          </YStack>
        )}
      </Sheet.Frame>
    </Sheet>
  );
}

const s = StyleSheet.create({
  handle: {
    width: wp(36), height: 4, borderRadius: 2, backgroundColor: "#E5E7EB",
  },
  iconWrap: {
    width: wp(40), height: wp(40), borderRadius: wp(12),
    backgroundColor: "#F5EDFF", alignItems: "center", justifyContent: "center",
  },
  savedCard: {
    backgroundColor: "#F0FDF4", borderWidth: 1, borderColor: "#86EFAC",
    borderRadius: wp(14), padding: wp(14),
  },
  checkWrap: {
    width: wp(36), height: wp(36), borderRadius: wp(18),
    backgroundColor: "#DCFCE7", alignItems: "center", justifyContent: "center",
  },
  inputRow: {
    flexDirection: "row", gap: wp(10), alignItems: "center",
  },
  input: {
    flex: 1, height: hp(48),
    borderWidth: 1.5, borderColor: "#E5D5FF", borderRadius: wp(12),
    paddingHorizontal: wp(14), fontSize: fp(14),
    color: "#121217", backgroundColor: "#FAFAFA",
    letterSpacing: 1.2, fontWeight: "600",
  },
  inputError: { borderColor: "#EF4444" },
  inputVerified: { borderColor: "#22C55E", backgroundColor: "#F0FDF4" },
  statusWrap: {
    width: wp(48), height: hp(48), borderRadius: wp(12),
    borderWidth: 1.5, borderColor: "#E5D5FF",
    alignItems: "center", justifyContent: "center", backgroundColor: "#FAFAFA",
  },
  saveBtn: {
    borderRadius: wp(12), overflow: "hidden", height: hp(48), minWidth: wp(70),
  },
  saveBtnDisabled: { opacity: 0.45 },
  saveBtnGrad: {
    flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: wp(16),
  },
  saveBtnText: { fontSize: fp(14), fontWeight: "700", color: "#FFFFFF" },
  orgCard: {
    marginTop: hp(8), backgroundColor: "#F0FDF4",
    borderWidth: 1, borderColor: "#22C55E", borderRadius: wp(12), padding: wp(12), gap: hp(3),
  },
  outlineBtn: {
    flex: 1, paddingVertical: hp(13), borderRadius: wp(12),
    borderWidth: 1.5, borderColor: "#E5D5FF",
    alignItems: "center", justifyContent: "center",
  },
  removeBtn: { borderColor: "#FEE2E2", backgroundColor: "#FFF5F5" },
  doneBtn: {
    backgroundColor: "#8E0FFF", borderRadius: wp(12),
    paddingVertical: hp(14), alignItems: "center", justifyContent: "center",
  },
});
