import React, { useMemo } from "react";
import { YStack, XStack, Stack, Separator, Text } from "tamagui";
import { Image } from "expo-image";
import { Plus } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { wp, hp, fp } from "@/utils/responsive";
import { BodyText, BodySmall, Heading2 } from "@/components/ui/Typography";
import { formatPrice } from "@/utils/format";

interface ProductItem {
  id: string;
  name?: string;
  quantity: number;
  days: number;
  price: number;
}
interface ProductDetailsSectionProps {
  products: ProductItem[];
  deliveryDate: string;
  onAddMore: () => void;
}

export const ProductDetailsSection = ({
  products,
  deliveryDate,
  onAddMore,
}: ProductDetailsSectionProps) => {
  const productImages = useMemo(
    () =>
      products.map(
        (item) =>
          `https://img.camorent.co.in/skus/images/${item.id}/primary.webp`
      ),
    [products]
  );

  return (
    <YStack gap={hp(12)}>
      <Heading2 color="#1C1C1E">Product details</Heading2>
      <Stack
        borderColor={"#E5E7EB"}
        borderWidth={1}
        borderRadius={wp(12)}
        paddingHorizontal={wp(16)}
        paddingVertical={hp(16)}
        gap={hp(16)}
        backgroundColor="#FFFFFF"
      >
        {/* Header row */}
        <XStack justifyContent="space-between" alignItems="center">
          <YStack gap={hp(2)}>
            <BodySmall color={"#8E8E93"} fontWeight="500">Delivery scheduled on</BodySmall>
            <BodyText color={"#1C1C1E"} fontWeight="600">{deliveryDate}</BodyText>
          </YStack>
          <Text fontSize={fp(14)} fontWeight="600" color="#1C1C1E">
            Total: {products.length} {products.length === 1 ? "Item" : "Items"}
          </Text>
        </XStack>

        <Separator borderStyle="dashed" borderColor={"#E5E7EB"} />

        {/* Product rows */}
        <YStack gap={hp(14)}>
          {products.map((item, index) => (
            <XStack key={item.id} alignItems="center" gap={wp(12)}>
              {/* Product image with gradient */}
              <LinearGradient
                colors={["#F5EDFF", "#FDFBFF", "#FFFFFF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: wp(64),
                  height: hp(64),
                  borderRadius: wp(10),
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "#E5E7EB",
                }}
              >
                <Image
                  source={{ uri: productImages[index] }}
                  contentFit="contain"
                  transition={300}
                  cachePolicy="memory-disk"
                  style={{ width: wp(54), height: hp(54) }}
                />
              </LinearGradient>

              {/* Product info */}
              <YStack flex={1} gap={hp(4)}>
                {item.name && (
                  <Text
                    fontSize={fp(14)}
                    fontWeight="600"
                    color="#1C1C1E"
                    lineHeight={hp(19)}
                    numberOfLines={2}
                  >
                    {item.name}
                  </Text>
                )}
                <XStack justifyContent="space-between" alignItems="center">
                  <BodySmall color={"#8E8E93"}>
                    Qty: {item.quantity} · {item.days} {item.days === 1 ? "day" : "days"}
                  </BodySmall>
                  <Text
                    fontSize={fp(15)}
                    fontWeight="600"
                    color="#1C1C1E"
                  >
                    {formatPrice(item.price)}
                  </Text>
                </XStack>
              </YStack>
            </XStack>
          ))}
        </YStack>

        {/* Add more button */}
        <XStack
          borderWidth={1}
          borderColor="#8E0FFF"
          borderRadius={wp(10)}
          paddingVertical={hp(11)}
          paddingHorizontal={wp(16)}
          justifyContent="center"
          alignItems="center"
          gap={wp(6)}
          onPress={onAddMore}
          backgroundColor="#FAFAFF"
        >
          <Plus size={fp(16)} color="#8E0FFF" strokeWidth={2.5} />
          <Text
            fontSize={fp(14)}
            fontWeight="600"
            color="#8E0FFF"
          >
            Add more items
          </Text>
        </XStack>
      </Stack>
    </YStack>
  );
};
