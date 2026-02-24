import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { XStack, YStack, Text } from "tamagui";
import { Switch, Pressable, ScrollView, View } from "react-native";
import { ChevronLeft, Bell, Mail, MessageSquare, Tag, Shield, FileText, HelpCircle, ChevronRight } from "lucide-react-native";
import { useState } from "react";
import { router } from "expo-router";
import { hp, wp, fp } from "@/utils/responsive";
import * as Haptics from "expo-haptics";

// ── Apple-style grouped section ──────────────────────────────────────────────
function SectionHeader({ label }: { label: string }) {
  return (
    <Text
      fontSize={fp(12)}
      fontWeight="600"
      color="#6B7280"
      letterSpacing={0.5}
      paddingHorizontal={wp(16)}
      paddingBottom={hp(6)}
      paddingTop={hp(22)}
      textTransform="uppercase"
    >
      {label}
    </Text>
  );
}

// ── Toggle row ────────────────────────────────────────────────────────────────
function ToggleRow({
  icon,
  iconBg,
  label,
  subtitle,
  value,
  onToggle,
  isFirst,
  isLast,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  subtitle?: string;
  value: boolean;
  onToggle: (v: boolean) => void;
  isFirst?: boolean;
  isLast?: boolean;
}) {
  return (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: isFirst ? wp(12) : 0,
        borderTopRightRadius: isFirst ? wp(12) : 0,
        borderBottomLeftRadius: isLast ? wp(12) : 0,
        borderBottomRightRadius: isLast ? wp(12) : 0,
        overflow: "hidden",
      }}
    >
      <XStack
        alignItems="center"
        paddingHorizontal={wp(16)}
        paddingVertical={hp(12)}
        gap={wp(12)}
      >
        {/* Coloured icon pill */}
        <View
          style={{
            width: wp(32),
            height: wp(32),
            borderRadius: wp(8),
            backgroundColor: iconBg,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </View>

        {/* Label + subtitle */}
        <YStack flex={1} gap={hp(2)}>
          <Text fontSize={fp(15)} fontWeight="500" color="#1C1C1E">{label}</Text>
          {subtitle && (
            <Text fontSize={fp(12)} color="#8E8E93">{subtitle}</Text>
          )}
        </YStack>

        {/* Toggle */}
        <Switch
          value={value}
          onValueChange={(v) => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onToggle(v);
          }}
          trackColor={{ false: "#D1D1D6", true: "#8E0FFF" }}
          thumbColor="#FFFFFF"
          ios_backgroundColor="#D1D1D6"
        />
      </XStack>
      {!isLast && (
        <View
          style={{
            height: 0.5,
            backgroundColor: "#E5E5EA",
            marginLeft: wp(16) + wp(32) + wp(12),
          }}
        />
      )}
    </View>
  );
}

// ── Tappable nav row ─────────────────────────────────────────────────────────
function NavRow({
  icon,
  iconBg,
  label,
  subtitle,
  onPress,
  isFirst,
  isLast,
  destructive,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  subtitle?: string;
  onPress: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  destructive?: boolean;
}) {
  return (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: isFirst ? wp(12) : 0,
        borderTopRightRadius: isFirst ? wp(12) : 0,
        borderBottomLeftRadius: isLast ? wp(12) : 0,
        borderBottomRightRadius: isLast ? wp(12) : 0,
        overflow: "hidden",
      }}
    >
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
      >
        <XStack
          alignItems="center"
          paddingHorizontal={wp(16)}
          paddingVertical={hp(12)}
          gap={wp(12)}
        >
          <View
            style={{
              width: wp(32),
              height: wp(32),
              borderRadius: wp(8),
              backgroundColor: iconBg,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </View>
          <YStack flex={1} gap={hp(2)}>
            <Text
              fontSize={fp(15)}
              fontWeight="500"
              color={destructive ? "#FF3B30" : "#1C1C1E"}
            >
              {label}
            </Text>
            {subtitle && (
              <Text fontSize={fp(12)} color="#8E8E93">{subtitle}</Text>
            )}
          </YStack>
          <ChevronRight size={16} color="#C7C7CC" strokeWidth={2} />
        </XStack>
      </Pressable>
      {!isLast && (
        <View
          style={{
            height: 0.5,
            backgroundColor: "#E5E5EA",
            marginLeft: wp(16) + wp(32) + wp(12),
          }}
        />
      )}
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function SettingScreen() {
  const insets = useSafeAreaInsets();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F2F2F7" }} edges={["top"]}>
      {/* ── Header ── */}
      <XStack
        alignItems="center"
        paddingHorizontal={wp(16)}
        paddingTop={hp(8)}
        paddingBottom={hp(12)}
        gap={wp(12)}
      >
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
          style={{
            width: wp(36),
            height: wp(36),
            borderRadius: wp(18),
            backgroundColor: "#FFFFFF",
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.06,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <ChevronLeft size={20} color="#1C1C1E" strokeWidth={2.5} />
        </Pressable>
        <Text fontSize={fp(18)} fontWeight="700" color="#1C1C1E" letterSpacing={-0.3}>
          Settings
        </Text>
      </XStack>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: wp(16),
          paddingBottom: insets.bottom + hp(40),
        }}
      >
        {/* ── Notifications ── */}
        <SectionHeader label="Notifications" />
        <View style={{ borderRadius: wp(12), overflow: "hidden" }}>
          <ToggleRow
            icon={<Bell size={16} color="#FFFFFF" strokeWidth={2} />}
            iconBg="#8E0FFF"
            label="Push notifications"
            subtitle="Booking updates & reminders"
            value={pushNotifications}
            onToggle={setPushNotifications}
            isFirst
          />
          <ToggleRow
            icon={<Mail size={16} color="#FFFFFF" strokeWidth={2} />}
            iconBg="#007AFF"
            label="Email notifications"
            subtitle="Receive updates about your rentals"
            value={emailNotifications}
            onToggle={setEmailNotifications}
          />
          <ToggleRow
            icon={<MessageSquare size={16} color="#FFFFFF" strokeWidth={2} />}
            iconBg="#34C759"
            label="SMS notifications"
            subtitle="Get text updates for urgent matters"
            value={smsNotifications}
            onToggle={setSmsNotifications}
          />
          <ToggleRow
            icon={<Tag size={16} color="#FFFFFF" strokeWidth={2} />}
            iconBg="#FF9500"
            label="Marketing & offers"
            subtitle="Deals, new gear, and promotions"
            value={marketingEmails}
            onToggle={setMarketingEmails}
            isLast
          />
        </View>

        {/* ── Privacy & Security ── */}
        <SectionHeader label="Privacy & Security" />
        <View style={{ borderRadius: wp(12), overflow: "hidden" }}>
          <NavRow
            icon={<Shield size={16} color="#FFFFFF" strokeWidth={2} />}
            iconBg="#5856D6"
            label="Privacy policy"
            onPress={() => router.push({ pathname: "/(tabs)/(profile)/legal", params: { type: "privacy" } })}
            isFirst
          />
          <NavRow
            icon={<FileText size={16} color="#FFFFFF" strokeWidth={2} />}
            iconBg="#32ADE6"
            label="Terms of service"
            onPress={() => router.push({ pathname: "/(tabs)/(profile)/legal", params: { type: "terms" } })}
            isLast
          />
        </View>

        {/* ── Support ── */}
        <SectionHeader label="Support" />
        <View style={{ borderRadius: wp(12), overflow: "hidden" }}>
          <NavRow
            icon={<HelpCircle size={16} color="#FFFFFF" strokeWidth={2} />}
            iconBg="#FF9F0A"
            label="Help center"
            subtitle="FAQs and contact options"
            onPress={() => router.push("/help-center")}
            isFirst
            isLast
          />
        </View>

        {/* App version */}
        <Text
          fontSize={fp(12)}
          color="#AEAEB2"
          textAlign="center"
          marginTop={hp(32)}
        >
          Camorent v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
