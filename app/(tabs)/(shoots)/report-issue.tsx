import React, { useState } from "react";
import { YStack, XStack, ScrollView } from "tamagui";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { ArrowLeft, ChevronRight, Search } from "lucide-react-native";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { BodySmall, BodyText, Heading2 } from "@/components/ui/Typography";
import { router } from "expo-router";
import { wp, hp, fp } from "@/utils/responsive";
import { BottomSheetButton } from "@/components/ui/BottomSheetButton";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

const ISSUE_CATEGORIES = [
  { id: "equipment", label: "Equipment issues" },
  // { id: "crew", label: "Crew issues" },
  // { id: "delivery", label: "Delivery & Pickup issues" },
  // { id: "payment", label: "Payment & Booking issues" },
  // { id: "app", label: "App & Other issues" },
];

const EQUIPMENT_ISSUES = [
  "Equipment malfunction",
  "Damaged item",
  "Missing accessories",
  "Quality issue",
  "Battery/Power issue",
  "Compatibility issue",
  "Other",
];

type Step = "categories" | "equipment-details" | "final";

export default function ReportIssueScreen() {
  const [step, setStep] = useState<Step>("categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [description, setDescription] = useState("");

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (categoryId === "equipment") {
      setStep("equipment-details");
    }
    // Add other categories later
  };

  const handleBack = () => {
    if (step === "equipment-details") {
      setStep("categories");
      setSelectedIssues([]);
    } else {
      router.back();
    }
  };

  const toggleIssue = (issue: string) => {
    setSelectedIssues((prev) =>
      prev.includes(issue) ? prev.filter((i) => i !== issue) : [...prev, issue]
    );
  };

  const handleSubmit = () => {
    // TODO: Submit issue report to backend
    console.log({
      category: selectedCategory,
      issues: selectedIssues,
      description,
    });
    router.back();
  };

  const filteredCategories = ISSUE_CATEGORIES.filter((cat) =>
    cat.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredEquipmentIssues = EQUIPMENT_ISSUES.filter((issue) =>
    issue.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const tabBarHeight = useBottomTabBarHeight();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <YStack flex={1}>
        {/* Header */}
        <XStack
          alignItems="center"
          paddingHorizontal={wp(16)}
          paddingTop={hp(12)}
          gap={wp(83)}
        >
          <XStack
            borderRadius={28}
            borderWidth={1}
            padding={"$2"}
            borderColor={"$gray7"}
            onPress={() => router.back()}
          >
            <ArrowLeft size={18} />
          </XStack>
          <Heading2 flex={1}> Report Issue</Heading2>
        </XStack>

        {/* Search Input */}
        <YStack paddingHorizontal={wp(16)} paddingVertical={hp(16)}>
          <XStack
            alignItems="center"
            backgroundColor="white"
            borderRadius={wp(12)}
            borderWidth={1}
            borderColor="#E5E7EB"
            padding={wp(8)}
            gap={wp(12)}
          >
            <Search size={20} color="#9CA3AF" />
            <TextInput
              placeholder="Search issue"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{
                flex: 1,
                fontSize: fp(14),
                color: "#121217",
                padding: 0,
              }}
              placeholderTextColor="#9CA3AF"
            />
          </XStack>
        </YStack>

        {/* Content */}
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
        <ScrollView flex={1} paddingHorizontal={wp(16)} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentContainerStyle={{ paddingBottom: tabBarHeight + hp(24) }}>
          {step === "categories" && (
            <YStack gap={hp(0)}>
              {filteredCategories.map((category, index) => (
                <XStack
                  key={category.id}
                  onPress={() => handleCategoryPress(category.id)}
                  alignItems="center"
                  justifyContent="space-between"
                  paddingVertical={hp(8)}
                  paddingHorizontal={wp(12)}
                  borderBottomWidth={
                    index < filteredCategories.length - 1 ? 1 : 0
                  }
                  borderBottomColor="#EBEBEF"
                >
                  <BodySmall fontWeight={"500"} color="#121217">
                    {category.label}
                  </BodySmall>
                  <ChevronRight size={wp(12)} color="#8A8AA3" />
                </XStack>
              ))}
            </YStack>
          )}

          {step === "equipment-details" && (
            <YStack gap={hp(16)} paddingBottom={hp(100)}>
              <Heading2>Equiments</Heading2>
              <YStack gap={hp(12)}>
                {filteredEquipmentIssues.map((issue) => (
                  <XStack
                    key={issue}
                    onPress={() => toggleIssue(issue)}
                    alignItems="center"
                    gap={wp(12)}
                  >
                    <Checkbox
                      checked={selectedIssues.includes(issue)}
                      onCheckedChange={() => toggleIssue(issue)}
                    />
                    <BodySmall fontWeight="500" color="#121217">
                      {issue}
                    </BodySmall>
                  </XStack>
                ))}

                {selectedIssues.length > 0 && (
                  <YStack gap={hp(12)} marginTop={hp(20)}>
                    <BodyText
                      fontSize={fp(14)}
                      fontWeight="600"
                      color="#121217"
                    >
                      Describe the issue (optional)
                    </BodyText>
                    <TextInput
                      placeholder="Please provide details about the issue..."
                      value={description}
                      onChangeText={setDescription}
                      multiline
                      style={{
                        borderWidth: 1,
                        borderColor: "#E5E7EB",
                        borderRadius: wp(8),
                        padding: wp(12),
                        minHeight: hp(100),
                        fontSize: fp(14),
                        textAlignVertical: "top",
                        backgroundColor: "white",
                      }}
                    />
                  </YStack>
                )}
              </YStack>
            </YStack>
          )}
        </ScrollView>
        </KeyboardAvoidingView>

        {/* Fixed Bottom Button */}
        {step === "equipment-details" && selectedIssues.length > 0 && (
          <YStack paddingHorizontal={wp(16)} paddingBottom={tabBarHeight}>
            <BottomSheetButton size="lg" onPress={handleSubmit}>
              Submit Issue Report
            </BottomSheetButton>
          </YStack>
        )}
      </YStack>
    </SafeAreaView>
  );
}
