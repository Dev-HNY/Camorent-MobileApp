import React, { memo } from "react";
import { XStack, YStack, Text, Card, Separator } from "tamagui";
import { BodySmall, Heading2 } from "../ui/Typography";
import { Image } from "expo-image";
import { wp,fp } from "@/utils/responsive";
import { BRANDS } from "@/constants/brands";
import { useGetBrands } from "@/hooks/CDP/useGetBrands";

interface BrandsSectionProps {
  onBrandPress?: (brand: string) => void;
  onViewAllPress?: () => void;
}

export function BrandsSection({
  onBrandPress,
  onViewAllPress,
}: BrandsSectionProps) {
  // Display brands twice to show 6 items in a 3x2 grid
  const { data: brandsdata, isLoading: isLoadingBrands } = useGetBrands();
  const brands = brandsdata?.filter((brand) => brand.id !== "blackmagic");

  return (
    <YStack gap="$4" paddingHorizontal={wp(16)}>
      <XStack justifyContent="space-between" alignItems="center">
        {/* <Heading2></Heading2> */}
        <Text fontSize={fp(18)} fontWeight="800" color="#121217">Search by Brands</Text>
        <Text
          color="$purple9"
          fontWeight="600"
          fontSize="$3"
          onPress={onViewAllPress}
          pressStyle={{ opacity: 0.7 }}
          cursor="pointer"
        >
          View All
        </Text>
      </XStack>

      <YStack backgroundColor="#FFFFFF">
        <XStack justifyContent="space-between">
          {brands?.slice(0, 3).map((brand, index) => (
            <React.Fragment key={`${brand.id}-${index}`}>
              <Card
                flex={1}
                height={100}
                backgroundColor="#FFFFFF"
                pressStyle={{ opacity: 0.8, scale: 0.98 }}
                onPress={() => onBrandPress?.(brand.name)}
                justifyContent="center"
                alignItems="center"
                padding={wp(10)}
              >
                <Image
                  source={{
                    uri: `https://img.camorent.co.in/brands/images/${brand.id}/primary.webp`,
                  }}
                  contentFit="contain"
                  cachePolicy="memory-disk"
                  priority="normal"
                  style={{
                    width: "100%",
                    height: "100%",
                    maxWidth: 90,
                    maxHeight: 50,
                  }}
                />
              </Card>
              {index < 2 && <Separator vertical />}
            </React.Fragment>
          ))}
        </XStack>
        <Separator />
        <XStack justifyContent="space-between">
          {brands?.slice(3, 6).map((brand, index) => (
            <React.Fragment key={`${brand.id}-${index + 3}`}>
              <Card
                flex={1}
                height={100}
                backgroundColor="#FFFFFF"
                pressStyle={{ opacity: 0.8, scale: 0.98 }}
                onPress={() => onBrandPress?.(brand.name)}
                justifyContent="center"
                alignItems="center"
                padding={wp(10)}
              >
                <Image
                  source={{
                    uri: `https://img.camorent.co.in/brands/images/${brand.id}/primary.webp`,
                  }}
                  contentFit="contain"
                  cachePolicy="memory-disk"
                  priority="normal"
                  style={{
                    width: "100%",
                    height: "100%",
                    maxWidth: 90,
                    maxHeight: 50,
                  }}
                />
              </Card>
              {index < 2 && <Separator vertical />}
            </React.Fragment>
          ))}
        </XStack>
      </YStack>

      {/* Success stats section */}
      <YStack alignItems="center" paddingTop="$4">
        <BodySmall fontWeight="600" textAlign="center" color={"#121217"}>
          Over <Text color="#7C3AED">500</Text> projects delivered
        </BodySmall>
        <BodySmall fontWeight="600" textAlign="center" color={"#121217"}>
          Successfully
        </BodySmall>
      </YStack>

      {/* Project Images Gallery */}
      <XStack gap="$2" paddingTop="$4" height={200}>
        {/* First column */}

        <YStack flex={1} gap="$2">
          <Card
            flex={1}
            borderRadius="$3"
            overflow="hidden"
            backgroundColor="$purple10"
            transform={[{ perspective: 100 }, { rotateY: "+5deg" }]}
          >
            <Image
              source={require("@/assets/images/project-1.png")}
              contentFit="cover"
              cachePolicy="memory-disk"
              style={{ width: "100%", height: "100%" }}
            />
          </Card>
        </YStack>

        {/* Second column */}
        <YStack flex={1} gap="$2">
          <Card
            flex={1}
            borderRadius="$3"
            overflow="hidden"
            transform={[
              { perspective: 100 },
              { rotateY: "0deg" },
              { scale: 0.95 },
            ]}
          >
            <Image
              source={require("@/assets/images/project-2.png")}
              contentFit="cover"
              cachePolicy="memory-disk"
              style={{ width: "100%", height: "100%" }}
            />
          </Card>
        </YStack>

        {/* Third column */}
        <YStack flex={1} gap="$2">
          <Card
            flex={1}
            borderRadius="$3"
            overflow="hidden"
            transform={[{ perspective: 100 }, { rotateY: "-5deg" }]}
          >
            <Image
              source={require("@/assets/images/project-3.png")}
              contentFit="cover"
              cachePolicy="memory-disk"
              style={{ width: "100%", height: "100%" }}
            />
          </Card>
        </YStack>
      </XStack>
    </YStack>
  );
}
