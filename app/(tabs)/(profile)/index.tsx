import {
  YStack,
  XStack,
  Text,
  Dialog,
  Spinner,
  ScrollView,
} from "tamagui";
import { useAuthStore } from "@/store/auth/auth";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable, Animated } from "react-native";
import { useState, useEffect, useRef } from "react";
import * as Haptics from "expo-haptics";
import { Button } from "@/components/ui/Button";
import { fp, hp, wp } from "@/utils/responsive";
import { useGetCurrentUser } from "@/hooks/auth";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronLeft, ChevronRight, LogOut, Edit2 } from "lucide-react-native";
import { Image } from "expo-image";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

interface MenuItem {
  icon: any;
  label: string;
  onPress: () => void;
  showChevron?: boolean;
}

const roleOptions = [
  { label: "Director of Photography (DOP)", value: "dop" },
  { label: "Assistant DOP (AC)", value: "assistant_dop" },
  { label: "Video Producer in Production Company", value: "video_producer" },
  { label: "Content Team in Corporate Company", value: "content_team" },
  { label: "Individual end to end shooting", value: "individual_shooting" },
];

const getRoleLabel = (value: string) => {
  return roleOptions.find((role) => role.value === value)?.label || value;
};

const capitalizeName = (name: string) => {
  if (!name) return "";
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

export default function Index() {
  const tabBarHeight = useBottomTabBarHeight();
  const { clearAuth } = useAuthStore();
  const { data: currentUser, isLoading: isLoadingUser } = useGetCurrentUser();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  // Premium animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (!isLoadingUser) {
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
    }
  }, [isLoadingUser]);

  const handleLogout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowLogoutDialog(true);
  };

  const confirmLogout = () => {
    clearAuth();
    router.replace("/(onboarding)");
    setShowLogoutDialog(false);
  };

  const handleEditProfile = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/edit-profile");
  };

  const menuItems: MenuItem[] = [
    {
      icon: require("@/assets/profile/email.png"),
      label: currentUser?.email || "girtika@gmail.com",
      onPress: () => {},
      showChevron: true,
    },
    {
      icon: require("@/assets/profile/phone.png"),
      label: currentUser?.phone_number || "+91 9758577153",
      onPress: () => {},
      showChevron: true,
    },
    {
      icon: require("@/assets/profile/payment.png"),
      label: "Payments",
      onPress: () => console.log("Payments"),
      showChevron: true,
    },
    {
      icon: require("@/assets/profile/help.png"),
      label: "Help center",
      onPress: () => router.push("/help-center"),
      showChevron: true,
    },
    {
      icon: require("@/assets/profile/setting.png"),
      label: "Setting",
      onPress: () => router.push("/settings"),
      showChevron: true,
    },
    {
      icon: require("@/assets/profile/wishlist.png"),
      label: "Wishlist",
      onPress: () => router.push("/wishlist"),
      showChevron: true,
    },
  ];

  const displayName = currentUser
    ? `${capitalizeName(currentUser?.first_name || "")} ${capitalizeName(
        currentUser?.last_name || ""
      )}`.trim() || "User"
    : "Ritika Gupta";

  const displayRole = currentUser?.profession
    ? getRoleLabel(currentUser.profession)
    : "Director of photography\nCreative studio LLC";

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

      <ScrollView
        flex={1}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: tabBarHeight + hp(24),
        }}
      >
        <YStack flex={1}>
          {/* Header with Back Button and Title */}
          <XStack
            justifyContent="center"
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
                position: "absolute",
                left: wp(20),
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
              Profile
            </Text>
          </XStack>

          {/* Profile Header Card */}
          <YStack paddingHorizontal={wp(20)} paddingTop={hp(16)}>
            {isLoadingUser ? (
              <YStack alignItems="center" gap={hp(12)} paddingVertical={hp(40)}>
                <Spinner size="large" color="#8E0FFF" />
                <Text fontSize={14} color="#6B7280">
                  Loading profile...
                </Text>
              </YStack>
            ) : (
              <Animated.View
                style={{
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                }}
              >
                <YStack
                  backgroundColor="#FFFFFF"
                  borderRadius={wp(16)}
                  padding={wp(16)}
                  shadowColor="#000000"
                  shadowOffset={{ width: 0, height: 2 }}
                  shadowOpacity={0.08}
                  shadowRadius={8}
                  elevation={3}
                  marginBottom={hp(24)}
                >
                <XStack
                  alignItems="center"
                  justifyContent="space-between"
                  width="100%"
                >
                  {/* Left: Avatar + Info */}
                  <XStack alignItems="center" gap={wp(12)} flex={1}>
                    {/* Profile Picture - Circular */}
                    <YStack
                      width={wp(64)}
                      height={hp(64)}
                      borderRadius={wp(32)}
                      backgroundColor="#F0F0F0"
                      overflow="hidden"
                      shadowColor="#000000"
                      shadowOffset={{ width: 0, height: 2 }}
                      shadowOpacity={0.1}
                      shadowRadius={4}
                      elevation={2}
                    >
                      <Image
                        source={require("@/assets/images/adaptive-icon.png")}
                        style={{ width: "100%", height: "100%" }}
                        contentFit="cover"
                      />
                    </YStack>

                    {/* User Info */}
                    <YStack flex={1} gap={hp(4)}>
                      {/* Name - Bold */}
                      <Text
                        fontSize={fp(18)}
                        fontWeight="600"
                        color="#000000"
                        numberOfLines={1}
                      >
                        {displayName}
                      </Text>

                      {/* Role/Email - Secondary */}
                      <Text
                        fontSize={fp(14)}
                        fontWeight="400"
                        color="#666666"
                        numberOfLines={2}
                        lineHeight={hp(18)}
                      >
                        {displayRole}
                      </Text>
                    </YStack>
                  </XStack>

                  {/* Right: Edit Button */}
                  <Pressable
                    onPress={handleEditProfile}
                    style={{
                      width: wp(36),
                      height: hp(36),
                      borderRadius: wp(18),
                      backgroundColor: "#F7F7F7",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Edit2 size={hp(18)} color="#444444" strokeWidth={2} />
                  </Pressable>
                </XStack>
              </YStack>
              </Animated.View>
            )}
          </YStack>

          {/* Personal Information Section */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <YStack paddingHorizontal={wp(20)} gap={hp(20)}>
            {/* Section Title */}
            <Text
              fontSize={fp(13)}
              fontWeight="600"
              color="#8E8E93"
              textTransform="uppercase"
              letterSpacing={0.5}
              paddingHorizontal={wp(4)}
            >
              Account Settings
            </Text>

            {/* Menu Items Card */}
            <YStack
              backgroundColor="#FFFFFF"
              borderRadius={wp(12)}
              overflow="hidden"
              shadowColor="#000000"
              shadowOffset={{ width: 0, height: 1 }}
              shadowOpacity={0.05}
              shadowRadius={4}
              elevation={2}
            >
              {menuItems.map((item, index) => (
                <YStack key={index}>
                  <Pressable
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      item.onPress();
                    }}
                  >
                    <XStack
                      alignItems="center"
                      justifyContent="space-between"
                      paddingVertical={hp(16)}
                      paddingHorizontal={wp(16)}
                      backgroundColor="#FFFFFF"
                      hoverStyle={{ backgroundColor: "#F9F9F9" }}
                    >
                      <XStack alignItems="center" gap={wp(12)} flex={1}>
                        {/* Icon */}
                        <YStack
                          width={wp(28)}
                          height={hp(28)}
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Image
                            source={item.icon}
                            style={{
                              width: wp(24),
                              height: hp(24),
                            }}
                            contentFit="contain"
                          />
                        </YStack>
                        {/* Label */}
                        <Text
                          fontSize={fp(16)}
                          fontWeight="400"
                          color="#000000"
                          flex={1}
                          numberOfLines={1}
                        >
                          {item.label}
                        </Text>
                      </XStack>
                      {/* Chevron Arrow */}
                      {item.showChevron && (
                        <ChevronRight size={hp(20)} color="#C7C7CC" strokeWidth={2} />
                      )}
                    </XStack>
                  </Pressable>
                  {/* Divider Line - Inset */}
                  {index < menuItems.length - 1 && (
                    <YStack
                      height={0.5}
                      backgroundColor="#E5E5EA"
                      marginLeft={wp(56)}
                    />
                  )}
                </YStack>
              ))}
            </YStack>
          </YStack>
          </Animated.View>

          {/* Logout Button */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <YStack paddingHorizontal={wp(20)} marginTop={hp(8)}>
            <Pressable onPress={handleLogout}>
              <YStack
                backgroundColor="#FFFFFF"
                borderRadius={wp(12)}
                paddingVertical={hp(16)}
                shadowColor="#000000"
                shadowOffset={{ width: 0, height: 1 }}
                shadowOpacity={0.05}
                shadowRadius={4}
                elevation={2}
              >
                <XStack alignItems="center" justifyContent="center" gap={wp(8)}>
                  <LogOut size={hp(20)} color="#FF3B30" strokeWidth={2} />
                  <Text fontSize={fp(16)} fontWeight="600" color="#FF3B30">
                    Log Out
                  </Text>
                </XStack>
              </YStack>
            </Pressable>
          </YStack>
          </Animated.View>
        </YStack>
      </ScrollView>

      {/* Logout Confirmation Dialog */}
      <Dialog modal open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <Dialog.Portal>
          <Dialog.Overlay
            key="overlay"
            animation="quick"
            opacity={0.5}
            backgroundColor={"#000000"}
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
            onPress={() => {
              setShowLogoutDialog(false);
            }}
          />
          <Dialog.Content
            bordered
            elevate
            key="content"
            animateOnly={["transform", "opacity"]}
            animation={[
              "quick",
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}
            enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
            exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
            gap={hp(16)}
            paddingHorizontal={wp(24)}
            paddingVertical={hp(24)}
            borderRadius={wp(16)}
            width={wp(300)}
            marginHorizontal={wp(28)}
            backgroundColor="#FFFFFF"
          >
            <Dialog.Title textAlign="center" fontSize={fp(18)} fontWeight="700" color="#000000">
              Logout
            </Dialog.Title>
            <Dialog.Description textAlign="center" fontSize={fp(14)} color="#6C6C89" lineHeight={hp(20)}>
              Are you sure you want to logout?
            </Dialog.Description>

            <XStack gap={wp(12)} justifyContent="space-between" marginTop={hp(4)}>
              <Dialog.Close displayWhenAdapted asChild flex={1}>
                <Button
                  variant="outline"
                  borderColor="#E0E0E0"
                  color="#000000"
                  flex={1}
                  backgroundColor="#F5F5F5"
                >
                  Cancel
                </Button>
              </Dialog.Close>
              <Button
                onPress={confirmLogout}
                backgroundColor="#EF4444"
                color="white"
                hoverStyle={{ backgroundColor: "#dc2626" }}
                pressStyle={{ backgroundColor: "#b91c1c" }}
                flex={1}
              >
                Logout
              </Button>
            </XStack>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </SafeAreaView>
  );
}
