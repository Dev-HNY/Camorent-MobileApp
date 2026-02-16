import React from "react";
import { YStack, ScrollView, XStack, Text, Card, Image } from "tamagui";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  ArrowLeft,
  Search,
  Heart,
  ShoppingCart,
} from "lucide-react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Button } from "@/components/ui/Button";

export default function InventoryUnavailableScreen() {
  const insets = useSafeAreaInsets();
  const tabHeight = useBottomTabBarHeight();

  const handleGoBack = () => {
    router.back();
  };

  const handleAddToCart = (itemId: string) => {
    console.log("Add to cart:", itemId);
    // Handle add to cart functionality
  };

  // Sample alternative gear suggestions
  const alternativeGear = [
    {
      id: "1",
      name: "Go pro Hero 13 black",
      originalPrice: 1500,
      discountedPrice: 1350,
      discount: 10,
      image: "https://via.placeholder.com/120x120",
    },
    {
      id: "2",
      name: "Go pro Hero 13 black",
      originalPrice: 1500,
      discountedPrice: 1350,
      discount: 10,
      image: "https://via.placeholder.com/120x120",
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <YStack flex={1} paddingBottom={tabHeight}>
        {/* Custom Header */}
        <XStack
          alignItems="center"
          justifyContent="space-between"
          padding="$4"
          paddingBottom="$2"
        >
          <XStack alignItems="center" gap="$2">
            <Button
              size="sm"
              variant="ghost"
              circular
              onPress={handleGoBack}
              icon={<ArrowLeft size={20} color="$color" />}
            >
              {<></>}
            </Button>
            <Text fontSize="$4" color="$color">
              Gurugram
            </Text>
            <Text fontSize="$3" color="$color" opacity={0.6}>
              NCR, India
            </Text>
          </XStack>
          <XStack alignItems="center" gap="$4">
            <Button size="sm" variant="ghost">
              <Search size={20} color="$color" />
            </Button>
            <Button size="sm" variant="ghost">
              <Heart size={20} color="$color" />
            </Button>
            <Button size="sm" variant="ghost">
              <ShoppingCart size={20} color="$color" />
            </Button>
          </XStack>
        </XStack>

        <ScrollView
          flex={1}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 18 }}
        >
          <YStack
            flex={1}
            alignItems="center"
            justifyContent="center"
            padding="$4"
            gap="$6"
            minHeight={400}
          >
            {/* Empty State Message */}
            <YStack alignItems="center" gap="$4">
              <Text
                fontSize="$6"
                fontWeight="600"
                color="$color"
                textAlign="center"
              >
                Items not available
              </Text>
              <Text
                fontSize="$4"
                color="$color"
                opacity={0.6}
                textAlign="center"
                maxWidth={300}
              >
                We are sorry!!
              </Text>
              <Text
                fontSize="$3"
                color="$color"
                opacity={0.6}
                textAlign="center"
                maxWidth={280}
              >
                Few items are not available in the stock, please choose
                alternate options.
              </Text>
            </YStack>

            {/* Unavailable Item Card */}
            <Card
              padding="$4"
              backgroundColor="$gray1"
              borderRadius="$3"
              width="100%"
              maxWidth={350}
            >
              <XStack gap="$3" alignItems="center">
                <Image
                  source={{ uri: "https://via.placeholder.com/80x80" }}
                  width={80}
                  height={80}
                  borderRadius="$3"
                  backgroundColor="$gray3"
                />
                <YStack flex={1} gap="$1">
                  <Text fontSize="$4" fontWeight="600" color="$color">
                    Canon EOS R 5
                  </Text>
                  <Text fontSize="$3" color="$color" opacity={0.7}>
                    Robust build quality, Dual pixel CMOS AF 4K video @30fps
                  </Text>
                </YStack>
              </XStack>
            </Card>
          </YStack>

          {/* Alternative Gear Suggestions */}
          <YStack padding="$4" gap="$4">
            <Text fontSize="$5" fontWeight="600" color="$color">
              Alternate gear suggestions
            </Text>

            <XStack gap="$3" flexWrap="wrap" justifyContent="space-between">
              {alternativeGear.map((item) => (
                <Card
                  key={item.id}
                  width="48%"
                  padding="$3"
                  backgroundColor="$gray1"
                  borderRadius="$3"
                >
                  <YStack gap="$3">
                    <Card
                      width="100%"
                      height={120}
                      backgroundColor="$gray2"
                      borderRadius="$3"
                      alignItems="center"
                      justifyContent="center"
                    >
                      {/* Placeholder for product image */}
                      <Card
                        width={60}
                        height={40}
                        backgroundColor="$gray4"
                        borderRadius="$2"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Text fontSize="$2" color="$gray8">
                          📷
                        </Text>
                      </Card>
                    </Card>

                    <YStack gap="$2">
                      <Text
                        fontSize="$3"
                        fontWeight="500"
                        color="$color"
                        numberOfLines={2}
                      >
                        {item.name}
                      </Text>

                      <XStack alignItems="center" gap="$2">
                        <Text fontSize="$3" fontWeight="600" color="$color">
                          Rs. {item.discountedPrice}/day
                        </Text>
                        <Text
                          fontSize="$2"
                          color="$color"
                          opacity={0.6}
                          textDecorationLine="line-through"
                        >
                          -{item.discount} %
                        </Text>
                      </XStack>

                      <Text fontSize="$2" color="$color" opacity={0.5}>
                        Rs. {item.originalPrice}/day
                      </Text>

                      <Button
                        size="sm"
                        backgroundColor="$primary"
                        color="white"
                        onPress={() => handleAddToCart(item.id)}
                        marginTop="$2"
                        pressStyle={{
                          backgroundColor: "$blue8",
                          scale: 0.98,
                        }}
                      >
                        <Text fontSize="$3" color="white" fontWeight="500">
                          Add
                        </Text>
                      </Button>
                    </YStack>
                  </YStack>
                </Card>
              ))}
            </XStack>
          </YStack>
        </ScrollView>
      </YStack>
    </SafeAreaView>
  );
}
