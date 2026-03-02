import { BodyText } from "@/components/ui/Typography";
import { SafeAreaView } from "react-native-safe-area-context";
import { XStack, YStack, ScrollView } from "tamagui";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { router } from "expo-router";
import { hp, wp, fp } from "@/utils/responsive";
import { Image } from "expo-image";
import * as Linking from "expo-linking";
import { Pressable } from "react-native";
import * as Haptics from "expo-haptics";

interface PremiumHelpCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onPress: () => void;
}

function PremiumHelpCard({
  icon,
  title,
  description,
  onPress,
}: PremiumHelpCardProps) {
  return (
    <Pressable onPress={() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }}>
      <XStack
        backgroundColor="#FFFFFF"
        borderRadius={wp(16)}
        padding={wp(16)}
        alignItems="center"
        gap={wp(16)}
        shadowColor="#000000"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.05}
        shadowRadius={8}
        elevation={2}
        borderWidth={1}
        borderColor="#F3F4F6"
      >
        {/* Icon */}
        {icon}

        {/* Content */}
        <YStack flex={1} gap={hp(4)}>
          <BodyText
            fontSize={fp(16)}
            fontWeight="600"
            color="#000000"
            lineHeight={hp(22)}
          >
            {title}
          </BodyText>
          <BodyText fontSize={fp(13)} color="#6B7280" lineHeight={hp(18)}>
            {description}
          </BodyText>
        </YStack>

        {/* Chevron */}
        <ChevronRight size={hp(20)} color="#C7C7CC" strokeWidth={2} />
      </XStack>
    </Pressable>
  );
}

export default function HelpCenterScreen() {
  const tabHeight = useBottomTabBarHeight();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F8F8" }}>
      <YStack flex={1}>
        {/* Header */}
        <XStack
          justifyContent="center"
          alignItems="center"
          paddingHorizontal={wp(20)}
          paddingTop={hp(12)}
          paddingBottom={hp(16)}
          backgroundColor="#FFFFFF"
          position="relative"
          borderBottomWidth={1}
          borderBottomColor="#F3F4F6"
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
              backgroundColor: "#F8F8F8",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ChevronLeft size={hp(24)} color="#000000" strokeWidth={2.5} />
          </Pressable>
          <BodyText fontSize={fp(17)} fontWeight="600" color="#000000">
            Help Center
          </BodyText>
        </XStack>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: tabHeight + hp(60) }}
        >
          {/* Help banner illustration — full width, no radius, no padding */}
          <Image
            source={require("@/assets/new/icons/help.svg")}
            style={{ width: "100%", height: hp(180) }}
            contentFit="cover"
          />

          {/* Section Title */}
          <YStack paddingHorizontal={wp(16)} paddingTop={hp(24)} paddingBottom={hp(12)}>
            <BodyText fontSize={fp(20)} fontWeight="700" color="#000000">
              How can we help you?
            </BodyText>
            <BodyText fontSize={fp(14)} color="#6B7280" marginTop={hp(6)}>
              Choose an option below to get started
            </BodyText>
          </YStack>

          {/* Contact options */}
          <YStack paddingHorizontal={wp(16)} gap={hp(12)}>
            <PremiumHelpCard
              icon={
                <Image
                  source={require("@/assets/images/profile/help-center-4.png")}
                  style={{ width: wp(40), height: hp(40) }}
                  contentFit="contain"
                />
              }
              title="Chat with us"
              description="Click here to mail us"
              onPress={() => {
                Linking.openURL("mailto:support@camorent.co.in");
              }}
            />

            <PremiumHelpCard
              icon={
                <Image
                  source={require("@/assets/images/profile/help-center-3.png")}
                  style={{ width: wp(40), height: hp(40) }}
                  contentFit="contain"
                />
              }
              title="Check FAQs"
              description="Clear your doubts with FAQs"
              onPress={() => router.push("/(tabs)/(profile)/faqs")}
            />
          </YStack>
        </ScrollView>
      </YStack>
    </SafeAreaView>
  );
}
