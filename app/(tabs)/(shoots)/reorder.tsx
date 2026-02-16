import React from "react";
import {
  YStack,
  XStack,
  Text,
  ScrollView,
  Stack,
  Separator,
  Card,
} from "tamagui";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Pressable } from "react-native";
import { ArrowLeft, Star, Trash2, ChevronRight } from "lucide-react-native";
import { Link, router, useLocalSearchParams } from "expo-router";
import { fp, hp, wp } from "@/utils/responsive";
import { BodySmall, BodyText, Heading2 } from "@/components/ui/Typography";
import { BottomSheetButton } from "@/components/ui/BottomSheetButton";
import { useCartStore } from "@/store/cart/cart";
import { Image } from "expo-image";

export default function ReorderPage() {
  const { items, crewItems, calculateRentalDays } = useCartStore();
  const addressData = {
    address: "302, Lotus Residency, Lane No. 5, Kothrud",
    city: "Pune",
    state: "Maharashtra",
    pinCode: "411038",
  };
  const rentalDays = calculateRentalDays() || 3;
  const productItems = items;
  const productData = productItems.map((item) => ({
    id: item.productId,
    name: item.product.name,
    quantity: item.quantity,
    days: rentalDays,
    price: parseFloat(item.product.price_per_day.replace(/[^0-9.]/g, "")),
    image:
      item.product.primary_image.image_url || "https://via.placeholder.com/60",
  }));

  const crewData = crewItems.map((item) => ({
    id: item.id,
    name: item.crew_type_name,
    quantity: item.quantity,
    days: rentalDays,
    price: item.price_per_day,
    image: item.image || "https://via.placeholder.com/60",
  }));

  // const [showPriceBreakdown, setShowPriceBreakdown] = useState(false);

  const orderData = null;

  const handleRateClick = () => {
    router.push("/(tabs)/(shoots)/rating");
  };

  const handleTrackOrder = () => {
    router.push("/(tabs)/(shoots)/track-order");
  };

  const handleReplaceItem = (itemName: string) => {
    router.push({
      pathname: "/(tabs)/(shoots)/replace-item",
      params: { itemName },
    });
  };

  const handleAddToCart = () => {
    // TODO: Implement add to cart logic for reordering
    console.log("Adding items to cart for reorder");
    router.push("/(tabs)/(home)");
  };

  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <YStack flex={1}>
        <XStack
          //  justifyContent="space-between"
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
          <Heading2>Order details</Heading2>
        </XStack>

        <ScrollView
          flex={1}
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        >
          <YStack gap="$4" padding={wp(16)} paddingBottom="$6">
            {/* Status Card */}
            <YStack
              backgroundColor="white"
              borderRadius={wp(12)}
              paddingHorizontal={wp(12)}
              paddingVertical={hp(16)}
              gap={hp(12)}
              borderWidth={1}
              borderColor="#EBEBEF"
            >
              <YStack>
                <Heading2>Gears were delivered on 13th june</Heading2>
                <BodyText color="#6C6C89">
                  Shoot successfully completed
                </BodyText>
              </YStack>
              <Separator />
              <Pressable onPress={handleTrackOrder}>
                <XStack alignItems="center" gap={wp(8)}>
                  <Text
                    fontSize={fp(12)}
                    lineHeight={hp(16)}
                    fontWeight="500"
                    color="#6D00DA"
                  >
                    Track Order
                  </Text>
                  <ChevronRight size={16} color="#7c3aed" />
                </XStack>
              </Pressable>
            </YStack>

            {/* Rating Card */}
            <Pressable onPress={handleRateClick}>
              <YStack
                backgroundColor="white"
                paddingHorizontal={wp(12)}
                paddingVertical={hp(16)}
                borderRadius={wp(12)}
                gap={hp(12)}
                borderWidth={1}
                borderColor="#EBEBEF"
              >
                <YStack
                  gap={hp(12)}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Heading2>How was the shoot?</Heading2>
                  <XStack gap={wp(8)}>
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        size={28}
                        color="#9ca3af"
                        fill="transparent"
                        strokeWidth={1.5}
                      />
                    ))}
                  </XStack>
                </YStack>
                <XStack alignItems="center" justifyContent="flex-end">
                  <Text
                    fontSize={fp(12)}
                    lineHeight={hp(16)}
                    fontWeight="500"
                    color="#6D00DA"
                  >
                    Help us Improve
                  </Text>
                  <ChevronRight size={16} color="#7c3aed" />
                </XStack>
              </YStack>
            </Pressable>

            {/* All Items Card */}
            <YStack gap={hp(12)}>
              <XStack alignItems="center" justifyContent="space-between">
                <Heading2>All Items</Heading2>
                <Pressable>
                  <Text
                    fontSize={fp(12)}
                    lineHeight={hp(16)}
                    fontWeight="500"
                    color="#6D00DA"
                  >
                    Download Invoice
                  </Text>
                </Pressable>
              </XStack>
              <Stack
                borderColor={"#EBEBEF"}
                borderWidth={1}
                borderRadius={wp(12)}
                paddingHorizontal={wp(12)}
                paddingVertical={hp(16)}
                gap={wp(16)}
              >
                <YStack>
                  <XStack justifyContent="space-between" alignItems="center">
                    <BodyText color={"#6C6C89"}>Delivery scheduled on</BodyText>
                    <Heading2>
                      Total: {productData.length + crewData.length} Items
                    </Heading2>
                  </XStack>
                  <BodyText color={"#6C6C89"}>21-5-2025</BodyText>
                </YStack>
                <Separator borderColor={"#D1D1DB"} />

                {/* Product Items */}
                {productData.length > 0 && (
                  <YStack gap={wp(16)}>
                    {productData.map((item) => (
                      <Card key={item.id}>
                        <XStack alignItems="center" gap={wp(12)}>
                          <Image
                            source={require("@/assets/images/pdp3.png")}
                            style={{ width: wp(60), height: wp(60) }}
                          />
                          <YStack flex={1} gap={hp(4)}>
                            <Heading2>{item.name}</Heading2>
                            <XStack
                              justifyContent="space-between"
                              alignItems="center"
                            >
                              <BodySmall color={"#6C6C89"}>
                                Qty: {item.quantity} • {item.days} days
                              </BodySmall>
                              <Heading2>₹{item.price}</Heading2>
                            </XStack>
                          </YStack>
                        </XStack>
                      </Card>
                    ))}
                  </YStack>
                )}

                {/* Crew Items */}
                {crewData.length > 0 && (
                  <>
                    {productData.length > 0 && (
                      <Separator borderStyle="dashed" borderColor={"#D1D1DB"} />
                    )}
                    <YStack gap={wp(16)}>
                      {crewData.map((item) => (
                        <Card key={item.id}>
                          <XStack alignItems="center" gap={wp(12)}>
                            <Image
                              source={require("@/assets/images/pdp3.png")}
                              style={{ width: wp(60), height: wp(60) }}
                            />
                            <YStack flex={1} gap={hp(4)}>
                              <Heading2>{item.name}</Heading2>
                              <XStack
                                justifyContent="space-between"
                                alignItems="center"
                              >
                                <BodySmall color={"#6C6C89"}>
                                  Qty: {item.quantity} • {item.days} days
                                </BodySmall>
                                <Heading2>₹{item.price}</Heading2>
                              </XStack>
                            </YStack>
                          </XStack>
                        </Card>
                      ))}
                    </YStack>
                  </>
                )}

                <Separator borderStyle="solid" borderColor={"#D1D1DB"} />

                <XStack alignItems="center" justifyContent="space-between">
                  <Heading2>Total Price</Heading2>
                  <YStack alignItems="flex-end" gap={hp(4)}>
                    <Text
                      fontSize={fp(20)}
                      fontWeight="700"
                      lineHeight={hp(24)}
                      color="black"
                    >
                      Rs {orderData.totalPrice.toLocaleString()}
                    </Text>
                    <Pressable>
                      <BodySmall>Price breakup</BodySmall>
                    </Pressable>
                  </YStack>
                </XStack>
              </Stack>
            </YStack>

            {/* Delete Order Card */}
            {/* <YStack
              backgroundColor="white"
              borderRadius={wp(12)}
              padding={wp(12)}
              gap={hp(8)}
              borderWidth={1}
              borderColor="#EBEBEF"
            >
              <XStack alignItems="center" gap="$2">
                <Trash2 size={20} color="black" />
                <Heading2>Delete order</Heading2>
              </XStack>
              <Separator />
              <Text fontSize={14} color="#666">
                Deleted orders will not be restored.
              </Text>

              <XStack justifyContent="flex-end">
                <Pressable>
                  <Text
                    fontSize={fp(12)}
                    lineHeight={hp(16)}
                    fontWeight="500"
                    color="#6D00DA"
                  >
                    Delete order
                  </Text>
                </Pressable>
              </XStack>
            </YStack> */}

            {/* Add to Cart Button */}
            <BottomSheetButton
              variant="primary"
              size="lg"
              onPress={handleAddToCart}
            >
              Add to Cart
            </BottomSheetButton>

            {/* Need Help Card */}
            <YStack gap={hp(12)}>
              <Heading2>Need help?</Heading2>
              <Link href={"mailto:support@camorent.co.in"}>
                <BottomSheetButton variant="outline" size="lg" width="100%">
                  Chat with us
                </BottomSheetButton>
              </Link>
            </YStack>
          </YStack>
        </ScrollView>
      </YStack>
    </SafeAreaView>
  );
}
