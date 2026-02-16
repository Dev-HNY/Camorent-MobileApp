import { AccordionSection } from "@/components/ui/AccordionSection";
import { BodyText } from "@/components/ui/Typography";
import { AnimatedSearchInput } from "@/components/ui/AnimatedSearchInput";
import { hp, wp, fp } from "@/utils/responsive";
import { YStack, ScrollView, XStack } from "tamagui";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { Pressable, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { useState, useRef } from "react";
import * as Haptics from "expo-haptics";

export default function Faqs() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<TextInput>(null);

  const allFaqItems = [
    {
      value: "rent-camera",
      title: "What are the steps to rent a camera?",
      content:
        "Browse our camera catalog, select your desired equipment, choose rental dates, complete KYC verification if needed, make payment, and your equipment will be delivered to your location.",
      category: "Getting Started",
    },
    {
      value: "rent-crew",
      title: "How do I rent crew?",
      content:
        "Browse our crew section, select the professionals you need, check their availability, and book them for your project dates. You can view their profiles, ratings, and previous work.",
      category: "Getting Started",
    },
    {
      value: "payment-methods",
      title: "What payment methods do you support?",
      content:
        "We support various payment methods including credit cards, debit cards, UPI, net banking, and digital wallets for your convenience.",
      category: "Payments",
    },
    {
      value: "kyc-time",
      title: "How long does KYC take?",
      content:
        "KYC verification typically takes 24-48 hours once you submit all required documents. You'll receive a notification once it's completed.",
      category: "Account",
    },
    {
      value: "shoot-issues",
      title: "What if I face issues during my shoot?",
      content:
        "Contact our 24/7 support team immediately through the app or helpline. We'll help resolve any equipment or crew issues to ensure your shoot continues smoothly.",
      category: "Support",
    },
    {
      value: "cancellation",
      title: "What is the cancellation policy?",
      content:
        "Cancellations made 48 hours before the rental period receive a full refund. Cancellations within 24-48 hours receive 50% refund. No refund for cancellations within 24 hours.",
      category: "Policies",
    },
    {
      value: "equipment-damage",
      title: "What if equipment gets damaged?",
      content:
        "All rentals are covered by insurance. Report any damage immediately. Minor wear and tear is expected, but significant damage will be assessed and charged accordingly.",
      category: "Policies",
    },
    {
      value: "free-delivery",
      title: "How do I get free delivery?",
      content:
        "When you book crew members along with equipment, you automatically qualify for free delivery to your location. This helps you save on logistics costs.",
      category: "Delivery",
    },
  ];

  // Filter FAQs based on search query
  const filteredFaqItems = searchQuery.trim()
    ? allFaqItems.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allFaqItems;

  const handleClearSearch = () => {
    setSearchQuery("");
    searchInputRef.current?.blur();
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#FAFAFA" }}
      edges={["top"]} // Only apply to top edge
    >
      <YStack flex={1} backgroundColor="#FAFAFA">
        {/* Premium Header - Fully Responsive */}
        <YStack
          backgroundColor="#FFFFFF"
          borderBottomWidth={1}
          borderBottomColor="#F0F0F0"
        >
          <XStack
            justifyContent="center"
            alignItems="center"
            paddingHorizontal={wp(60)}
            paddingTop={hp(12)}
            paddingBottom={hp(16)}
            position="relative"
            minHeight={hp(56)}
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
                backgroundColor: "#FAFAFA",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ChevronLeft size={hp(22)} color="#1C1C1E" strokeWidth={2.5} />
            </Pressable>
            <BodyText
              fontSize={fp(16)}
              fontWeight="600"
              color="#1C1C1E"
              letterSpacing={-0.3}
              textAlign="center"
              flexWrap="wrap"
              numberOfLines={2}
            >
              Help Center
            </BodyText>
          </XStack>
        </YStack>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
        <ScrollView
          flex={1}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={{
            paddingTop: hp(32),
            paddingBottom: insets.bottom + hp(40),
          }}
        >
          {/* Hero Section - Fully Responsive */}
          <YStack
            paddingHorizontal={wp(20)}
            paddingBottom={hp(24)}
            width="100%"
          >
            <YStack width="100%" flexShrink={1}>
              <BodyText
                fontSize={fp(24)}
                fontWeight="700"
                color="#1C1C1E"
                lineHeight={fp(30)}
                letterSpacing={-0.4}
              >
                Frequently asked questions
              </BodyText>
            </YStack>
            <YStack width="100%" marginTop={hp(8)} flexShrink={1}>
              <BodyText
                fontSize={fp(15)}
                color="#6B7280"
                lineHeight={fp(21)}
                letterSpacing={-0.2}
              >
                Everything you need to know about our platform
              </BodyText>
            </YStack>
          </YStack>

          {/* Premium Animated Search Bar */}
          <YStack paddingHorizontal={wp(20)} paddingBottom={hp(10)}>
            <AnimatedSearchInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              onClear={handleClearSearch}
              inputRef={searchInputRef}
              borderColor={searchQuery ? "#8E0FFF" : "#E8E8ED"}
              iconColor={searchQuery ? "#8E0FFF" : "#A0A0AB"}
            />

            {/* Search Results Count */}
            {searchQuery && (
              <YStack paddingTop={hp(12)} paddingLeft={wp(4)}>
                <BodyText fontSize={fp(14)} color="#6B7280" letterSpacing={-0.2}>
                  {filteredFaqItems.length === 0
                    ? "No results found"
                    : `${filteredFaqItems.length} result${filteredFaqItems.length !== 1 ? "s" : ""}`}
                </BodyText>
              </YStack>
            )}
          </YStack>

          {/* FAQ Accordion */}
          {filteredFaqItems.length > 0 ? (
            <AccordionSection items={filteredFaqItems} type="single" />
          ) : (
            <YStack paddingHorizontal={wp(20)} paddingTop={hp(40)} alignItems="center">
              <BodyText fontSize={fp(16)} color="#A0A0AB" textAlign="center" letterSpacing={-0.3}>
                No FAQs match your search.{"\n"}Try different keywords.
              </BodyText>
            </YStack>
          )}
        </ScrollView>
        </KeyboardAvoidingView>
      </YStack>
    </SafeAreaView>
  );
}
