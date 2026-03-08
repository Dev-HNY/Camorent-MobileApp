import React, { useState, useEffect, useCallback } from "react";
import {
  YStack,
  XStack,
  Text,
  Sheet,
  Spinner,
} from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ShootStatus } from "@/types/shoots/shoots";
import { ShootCard } from "@/components/shoots/ShootCard";
import { BodyText } from "@/components/ui/Typography";
import { ChevronLeft } from "lucide-react-native";
import { Image as ExpoImage } from "expo-image";
import { hp, wp, fp } from "@/utils/responsive";
import { ShootsToast } from "@/components/ui/ShootsToast";
import { useToastState } from "@tamagui/toast";
import { Button } from "@/components/ui/Button";
import { useGetUserBookings } from "@/hooks/shoots/useGetUserBookings";
import { categoriseBookings } from "@/utils/categorise-bookings";
import { Pressable, FlatList } from "react-native";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const TABS = [
  { key: "ongoing" as ShootStatus, label: "Ongoing" },
  { key: "upcoming" as ShootStatus, label: "Upcoming" },
  { key: "past" as ShootStatus, label: "Past" },
];

export default function Shoots() {
  const [activeTab, setActiveTab] = useState<ShootStatus>("ongoing");
  const [showCancelSheet, setShowCancelSheet] = useState(false);
  const insets = useSafeAreaInsets();
  const { data: bookings, isLoading: isLoadingBookings } = useGetUserBookings();
  const { past, ongoing, upcoming } = categoriseBookings(bookings);

  const headerOpacity = useSharedValue(1);
  const headerScale = useSharedValue(1);
  const tabsOpacity = useSharedValue(0);
  const tabsTranslateY = useSharedValue(20);

  useEffect(() => {
    tabsOpacity.value = withTiming(1, { duration: 400 });
    tabsTranslateY.value = withSpring(0, { damping: 18, stiffness: 250 });
  }, []);

  // Auto-select the tab that has data: ongoing > upcoming > past
  useEffect(() => {
    if (isLoadingBookings) return;
    if (ongoing.length > 0) setActiveTab("ongoing");
    else if (upcoming.length > 0) setActiveTab("upcoming");
    else if (past.length > 0) setActiveTab("past");
  }, [isLoadingBookings]);

  const headerMarginBottom = hp(-30);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ scale: headerScale.value }],
    marginBottom: headerMarginBottom,
  }));

  const tabsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: tabsOpacity.value,
    transform: [{ translateY: tabsTranslateY.value }],
  }));

  const handleOrderDetailsClick = useCallback((booking_id: string) => {
    router.push({
      pathname: "/(tabs)/(shoots)/order-details",
      params: { booking_id, status: activeTab },
    });
  }, [activeTab]);

  const handleTabChange = useCallback((tabKey: ShootStatus) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveTab(tabKey);
  }, []);

  const handleCancelOrder = useCallback((_booking_id: string) => {
    setShowCancelSheet(true);
  }, []);

  const handleConfirmCancel = useCallback(() => {
    setShowCancelSheet(false);
  }, []);

  const handleBrowseProducts = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/(tabs)/(home)/categories");
  }, []);

  const currentShoots =
    activeTab === "past" ? past : activeTab === "upcoming" ? upcoming : ongoing;
  const currentCount = currentShoots.length;

  const renderShootItem = useCallback(
    ({ item, index }: { item: (typeof currentShoots)[0]; index: number }) => (
      <ShootCard
        shoot={item}
        tab={activeTab}
        index={index}
        onOrderDetailsClick={() => handleOrderDetailsClick(item.booking_id)}
        onCancelOrder={() => handleCancelOrder(item.booking_id)}
      />
    ),
    [activeTab, handleOrderDetailsClick, handleCancelOrder]
  );

  const ItemSeparator = useCallback(
    () => <YStack height={hp(12)} />,
    []
  );


  const state = useToastState();

  return (
    <YStack flex={1} backgroundColor="#F2F2F7">
      {/* Premium Gradient Header */}
      <Animated.View style={headerAnimatedStyle}>
        <LinearGradient
          colors={["#8E0FFF", "#A855F7", "#C084FC"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingTop: insets.top + hp(16),
            paddingBottom: hp(70),
            borderBottomLeftRadius: wp(24),
            borderBottomRightRadius: wp(24),
            shadowColor: "#8E0FFF",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          {/* Header Content */}
          <XStack
            justifyContent="center"
            alignItems="center"
            paddingHorizontal={wp(20)}
            position="relative"
            marginBottom={hp(12)}
          >
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.back();
              }}
              style={{
                position: "absolute",
                left: wp(16),
                width: wp(40),
                height: wp(40),
                borderRadius: wp(20),
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ChevronLeft size={hp(22)} color="#FFFFFF" strokeWidth={2.5} />
            </Pressable>
            <YStack alignItems="center" gap={hp(4)}>
              <Text fontSize={fp(18)} fontWeight="700" color="#FFFFFF" letterSpacing={-0.3}>
                My Shoots
              </Text>
              <Text fontSize={fp(12)} fontWeight="400" color="rgba(255, 255, 255, 0.85)">
                Track your rental journey
              </Text>
            </YStack>
          </XStack>
        </LinearGradient>
      </Animated.View>

      {/* Premium Tab Pills with Glassmorphism */}
      <Animated.View
        style={[
          tabsAnimatedStyle,
          {
            paddingHorizontal: wp(16),
            paddingTop: hp(16),
            paddingBottom: hp(12),
            width: "100%",
            zIndex: 10,
          },
        ]}
      >
        <LinearGradient
          colors={["rgba(255, 255, 255, 0.98)", "rgba(255, 255, 255, 1)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: wp(28),
            padding: wp(5),
            shadowColor: "#8E0FFF",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
            elevation: 4,
            borderWidth: 1,
            borderColor: "rgba(142, 15, 255, 0.08)",
          }}
        >
          <XStack width="100%" justifyContent="space-between" alignItems="center">
            {TABS.map((tab) => {
              const count =
                tab.key === "past"
                  ? past.length
                  : tab.key === "upcoming"
                    ? upcoming.length
                    : ongoing.length;
              const isActive = activeTab === tab.key;

              return (
                <React.Fragment key={tab.key}>
                  <Pressable
                    onPress={() => handleTabChange(tab.key)}
                    style={{
                      flex: 1,
                      paddingHorizontal: wp(10),
                      paddingVertical: hp(10),
                      borderRadius: wp(22),
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: wp(6),
                      backgroundColor: isActive ? "#8E0FFF" : "transparent",
                    }}
                  >
                    {/* Number Badge */}
                    <YStack
                      width={wp(20)}
                      height={wp(20)}
                      borderRadius={wp(10)}
                      backgroundColor={
                        isActive
                          ? "rgba(255, 255, 255, 0.95)"
                          : "rgba(142, 15, 255, 0.08)"
                      }
                      justifyContent="center"
                      alignItems="center"
                    >
                      {isLoadingBookings ? (
                        <Spinner size="small" color="#8E0FFF" />
                      ) : (
                        <Text
                          fontSize={fp(10)}
                          fontWeight="700"
                          color="#8E0FFF"
                        >
                          {count}
                        </Text>
                      )}
                    </YStack>
                    {/* Label */}
                    <Text
                      fontSize={fp(12)}
                      fontWeight="600"
                      color={isActive ? "#FFFFFF" : "#6B7280"}
                      numberOfLines={1}
                      letterSpacing={-0.1}
                    >
                      {tab.label}
                    </Text>
                  </Pressable>

                  {/* Subtle Divider */}
                  {/* {index < TABS.length - 1 && (
                    <YStack
                      width={1}
                      height={hp(24)}
                      backgroundColor="rgba(142, 15, 255, 0.1)"
                    />
                  )} */}
                </React.Fragment>
              );
            })}
          </XStack>
        </LinearGradient>
      </Animated.View>

      {/* Shoots List */}
      <YStack flex={1} paddingHorizontal={wp(16)}>
        {isLoadingBookings ? (
          <YStack flex={1} justifyContent="center" alignItems="center">
            <Spinner size="large" color="#8E0FFF" />
            <Text fontSize={fp(14)} color="#6B7280" marginTop={hp(12)}>
              Loading your shoots...
            </Text>
          </YStack>
        ) : currentCount === 0 ? (
          <YStack flex={1} justifyContent="center" alignItems="center" paddingBottom={hp(60)}>
            <ExpoImage
              source={require("@/assets/new/icons/myshoots.svg")}
              style={{ width: wp(220), height: wp(220) }}
              contentFit="contain"
            />
            <Text
              fontSize={fp(20)}
              fontWeight="800"
              color="#1C1C1E"
              textAlign="center"
              marginTop={hp(16)}
              marginBottom={hp(8)}
              paddingHorizontal={wp(24)}
              letterSpacing={-0.3}
            >
              {activeTab === "past"
                ? "Uh oh! You don't\nhave any past shoots."
                : activeTab === "ongoing"
                  ? "No ongoing shoots\nright now."
                  : "Uh oh! You don't have\nany upcoming shoots."}
            </Text>
            <Text
              fontSize={fp(14)}
              color="#6B7280"
              textAlign="center"
              lineHeight={fp(21)}
              paddingHorizontal={wp(32)}
              marginBottom={hp(32)}
            >
              {activeTab === "past"
                ? "Let's celebrate your shoot success together."
                : activeTab === "ongoing"
                  ? "Active rentals will show up here."
                  : "Make your shoot journey simplified\nwith camorent."}
            </Text>
            <Pressable
              onPress={handleBrowseProducts}
              style={{
                paddingHorizontal: wp(48),
                paddingVertical: hp(15),
                backgroundColor: "#8E0FFF",
                borderRadius: wp(50),
              }}
            >
              <Text fontSize={fp(15)} fontWeight="600" color="#FFFFFF">
                Rent Now
              </Text>
            </Pressable>
          </YStack>
        ) : (
          <FlatList
            data={currentShoots}
            keyExtractor={(item) => item.booking_id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingTop: hp(16),
              paddingBottom: insets.bottom + hp(100),
            }}
            renderItem={renderShootItem}
            ItemSeparatorComponent={ItemSeparator}
          />
        )}
      </YStack>

      {state && <ShootsToast />}

      {/* Cancel Order Bottom Sheet */}
      <Sheet
        open={showCancelSheet}
        onOpenChange={setShowCancelSheet}
        snapPointsMode="fit"
        dismissOnSnapToBottom
        modal
        animation="quick"
      >
        <Sheet.Overlay
          backgroundColor="rgba(0, 0, 0, 0.5)"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Frame
          backgroundColor="white"
          borderTopLeftRadius={wp(24)}
          borderTopRightRadius={wp(24)}
          paddingHorizontal={wp(16)}
          paddingTop={hp(24)}
          paddingBottom={Math.max(insets.bottom, hp(24))}
        >
          <YStack gap={hp(24)} alignItems="center">
            <YStack gap={hp(12)} alignItems="center">
              <Text
                fontSize={fp(18)}
                fontWeight="600"
                lineHeight={hp(24)}
                color="black"
                textAlign="center"
              >
                Are you sure you want to cancel this order?
              </Text>
              <BodyText color="#6C6C89" textAlign="center">
                The order is fully refundable.
              </BodyText>
            </YStack>

            <YStack width="100%" gap={hp(12)}>
              <Button
                variant="primary"
                size="lg"
                onPress={handleConfirmCancel}
                backgroundColor="#6D00DA"
              >
                <Text fontSize={fp(14)} fontWeight="600" color="white">
                  Cancel with full refund
                </Text>
              </Button>

              <Button
                variant="outline"
                size="lg"
                onPress={() => setShowCancelSheet(false)}
                borderColor="#6D00DA"
              >
                <Text fontSize={fp(14)} fontWeight="600" color="#6D00DA">
                  No Wait!
                </Text>
              </Button>
            </YStack>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </YStack>
  );
}
