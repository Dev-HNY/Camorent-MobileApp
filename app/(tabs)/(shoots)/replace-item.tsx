import React, { useState } from "react";
import { YStack, XStack, Text, ScrollView } from "tamagui";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { Button } from "@/components/ui/Button";
import { router } from "expo-router";
import DropDownPicker from "react-native-dropdown-picker";
import { fp, hp, wp } from "@/utils/responsive";
import { BodySmall, Heading2 } from "@/components/ui/Typography";
import { Image } from "expo-image";
import { ProductCard } from "@/components/ui/ProductCard";
import { SKU } from "@/types/products/product";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

// Mock data - replace with actual data from API/params
const MOCK_ALTERNATIVE_PRODUCTS: SKU[] = [
  {
    sku_id: "sku-1",
    id: "1",
    name: "Canon EOS 5D Mark IV",
    brand: "Canon",
    category_id: "camera",
    subcategory_id: "",
    price_per_day: "₹5,000",
    primary_image_url: undefined,
    tags: null,
    is_active: true,
    avg_rating: "4.5",
    review_count: 120,
  },
  {
    sku_id: "sku-2",
    id: "2",
    name: "Nikon D850",
    brand: "Nikon",
    category_id: "camera",
    subcategory_id: "",
    price_per_day: "₹4,500",
    primary_image_url: undefined,
    tags: null,
    is_active: true,
    avg_rating: "4.5",
    review_count: 98,
  },
];

const REPLACEMENT_REASONS = [
  { label: "Damaged", value: "damaged" },
  { label: "Not working", value: "not_working" },
  { label: "Missing parts", value: "missing_parts" },
  { label: "Poor quality", value: "poor_quality" },
  { label: "Wrong item", value: "wrong_item" },
  { label: "Other", value: "other" },
];

export default function ReplaceItemScreen() {
  const [selectedReason, setSelectedReason] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [open, setOpen] = useState(false);
  const tabBarHeight = useBottomTabBarHeight();

  const handleSubmit = () => {
    if (!selectedReason) return;

    // TODO: Submit replacement request to backend
    router.back();
  };

  const handleProductPress = (productId: string) => {
    // TODO: Navigate to product details or add to replacement request
  };

  const handleAddToCart = (productId: string) => {
    // TODO: Add product to cart or replacement request
  };

  const isFormValid = selectedReason.length > 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <YStack flex={1}>
        <XStack
          alignItems="center"
          paddingHorizontal={wp(16)}
          paddingTop={hp(12)}
          gap={wp(88)}
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
          <Heading2>Replace Item</Heading2>
        </XStack>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
        <ScrollView flex={1} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentContainerStyle={{ paddingBottom: tabBarHeight + hp(60) }}>
          <YStack
            gap={hp(24)}
            paddingTop={hp(24)}
            paddingBottom={hp(24)}
            paddingHorizontal={wp(16)}
          >
            {/* Product Card */}
            <YStack
              backgroundColor="white"
              borderRadius={wp(12)}
              padding={wp(12)}
              borderWidth={1}
              borderColor="#EBEBEF"
            >
              <XStack alignItems="center" gap={wp(16)}>
                <Image
                  source={require("@/assets/images/pdp3.png")}
                  style={{
                    width: wp(70),
                    height: wp(70),
                  }}
                  contentFit="cover"
                />
                <YStack flex={1} gap={hp(4)}>
                  <BodySmall fontWeight={"600"} color={"#121217"}>
                    Blackmagic Pocket Cinema Camera 6k Pro
                  </BodySmall>
                  <Text fontSize={fp(10)} fontWeight={"400"} color="#6C6C89">
                    Robust build quality, Dual pixel CMOS AF, 4k video @30ps
                  </Text>
                </YStack>
                <XStack width={wp(20)} />
              </XStack>
            </YStack>

            {/* Reason of replacement */}
            <YStack gap={hp(8)} zIndex={1000}>
              <XStack gap={wp(4)}>
                <Heading2>Reason of replacement</Heading2>
                <Text fontSize={fp(16)} fontWeight="600" color="#FF0000">
                  *
                </Text>
              </XStack>
              <DropDownPicker
                open={open}
                value={selectedReason}
                items={REPLACEMENT_REASONS}
                setOpen={setOpen}
                setValue={(callback) => {
                  const newValue =
                    typeof callback === "function"
                      ? callback(selectedReason)
                      : callback;
                  setSelectedReason(newValue || "");
                }}
                onSelectItem={(item) => {
                  setOpen(false);
                }}
                placeholder="Damaged"
                listMode="SCROLLVIEW"
                closeAfterSelecting={true}
                style={{
                  borderColor: "#EBEBEF",
                  borderWidth: 1,
                  borderRadius: wp(8),
                  minHeight: hp(48),
                  backgroundColor: "white",
                  boxShadow: "0 1px 2px 0 rgba(18, 18, 23, 0.05)",
                }}
                textStyle={{
                  fontSize: fp(14),
                  fontWeight: "400",
                  color: "#6C6C89",
                  lineHeight: wp(20),
                }}
                placeholderStyle={{
                  fontSize: fp(14),
                  fontWeight: "400",
                  color: "#6C6C89",
                  lineHeight: wp(20),
                }}
                dropDownContainerStyle={{
                  borderColor: "#EBEBEF",
                  borderRadius: wp(8),
                  boxShadow: "0 1px 2px 0 rgba(18, 18, 23, 0.05)",
                }}
              />
            </YStack>

            {/* Additional Information */}
            <YStack gap={hp(8)}>
              <Heading2>Additional Information</Heading2>
              <TextInput
                placeholder="What problem are you facing?"
                value={additionalInfo}
                onChangeText={setAdditionalInfo}
                multiline
                placeholderTextColor="#6C6C89"
                style={{
                  borderWidth: 1,
                  borderColor: "#EBEBEF",
                  borderRadius: wp(8),
                  paddingHorizontal: wp(16),
                  paddingVertical: wp(8),
                  minHeight: hp(120),
                  fontSize: fp(14),
                  boxShadow: "0 1px 2px 0 rgba(18, 18, 23, 0.05)",
                  textAlignVertical: "top",
                }}
              />
            </YStack>

            {/* Alternate gear suggestion */}
            <YStack gap={hp(12)}>
              <XStack justifyContent="space-between" alignItems="center">
                <Heading2>Alternate gear suggestion</Heading2>
                <XStack>
                  <Text>View All</Text>
                </XStack>
              </XStack>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingBottom: tabBarHeight + hp(60),
                }}
              >
                <XStack gap={wp(12)}>
                  {MOCK_ALTERNATIVE_PRODUCTS.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onProductPress={() => handleProductPress(product.id)}
                      onAddToCart={() => handleAddToCart(product.id)}
                      maxWidth={wp(165)}
                    />
                  ))}
                </XStack>
              </ScrollView>
            </YStack>
          </YStack>
        </ScrollView>
        </KeyboardAvoidingView>
      </YStack>
    </SafeAreaView>
  );
}
