import { XStack, YStack, Text, Card, Spinner } from "tamagui";
import { Image } from "expo-image";
import { hp, wp, fp } from "@/utils/responsive";
import { useGetCategories } from "@/hooks/CDP/useGetCategories";
import { memo, useMemo, useCallback } from "react";

interface CategoriesSectionProps {
  onCategoryPress: (category: string) => void;
}

// Map category icons - SVGs already have colors, no background needed
const categoryIcons: { [key: string]: any } = {
  "cameras": require("@/assets/new/icons/home/camera.svg"),
  "camera": require("@/assets/new/icons/home/camera.svg"),
  "lens": require("@/assets/new/icons/home/lens.svg"),
  "lenses": require("@/assets/new/icons/home/lens.svg"),
  "light": require("@/assets/new/icons/home/lights.svg"),
  "lights": require("@/assets/new/icons/home/lights.svg"),
  "lighting": require("@/assets/new/icons/home/lights.svg"),
  "audio": require("@/assets/new/icons/home/audio.svg"),
  "gimbal": require("@/assets/new/icons/home/gimbal.svg"),
  "drones": require("@/assets/new/icons/home/drone.svg"),
  "accessories": require("@/assets/new/icons/home/accesories.svg"),
  "support & rigs": require("@/assets/new/icons/home/support.svg"),
  "support": require("@/assets/new/icons/home/support.svg"),
  "rigs": require("@/assets/new/icons/home/support.svg"),
};

// Memoized category card component for better performance
const CategoryCard = memo(({ category, iconSource, onPress }: {
  category: any;
  iconSource: any;
  onPress: () => void;
}) => (
  <Card
    width="23%"
    height={hp(90)}
    borderRadius={wp(12)}
    overflow="hidden"
    onPress={onPress}
    backgroundColor="#f5f5f5"
    padding={0}
    margin={0}
    pressStyle={{ opacity: 0.9, scale: 0.98 }}
  >
    <YStack flex={1} position="relative">
      {iconSource && (
        <Image
          source={iconSource}
          alt={`${category.name}`}
          contentFit="fill"
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
          }}
          cachePolicy="memory-disk"
          priority="high"
        />
      )}
      <YStack
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        paddingVertical={hp(5)}
        paddingHorizontal={wp(4)}
        alignItems="center"
      >
        <Text
          fontSize={fp(9)}
          fontWeight="500"
          color="#606060"
          numberOfLines={2}
          textAlign="center"
          lineHeight={fp(11)}
        >
          {category.name}
        </Text>
      </YStack>
    </YStack>
  </Card>
));

CategoryCard.displayName = 'CategoryCard';

export function CategoriesSection({ onCategoryPress }: CategoriesSectionProps) {
  const { data: categories, isLoading, isError } = useGetCategories();

  // All hooks must be called before any conditional returns
  const displayCategories = useMemo(() => categories?.data || [], [categories?.data]);

  const categoriesToShow = useMemo(() => {
    const LAST_TWO = ["support", "accessories"];
    const sorted = [...displayCategories].sort((a, b) => {
      const aLast = LAST_TWO.some((k) => a.name.toLowerCase().includes(k));
      const bLast = LAST_TWO.some((k) => b.name.toLowerCase().includes(k));
      if (aLast && !bLast) return 1;
      if (!aLast && bLast) return -1;
      return 0;
    });
    return sorted.slice(0, 8);
  }, [displayCategories]);

  const getCategoryIcon = useCallback((categoryName: string, imageUrl: string | null) => {
    const normalizedName = categoryName.toLowerCase();
    return categoryIcons[normalizedName] || (imageUrl ? { uri: imageUrl } : null);
  }, []);

  // Conditional returns AFTER all hooks
  if (isLoading) {
    return (
      <YStack gap="$3" paddingHorizontal={wp(16)}>
        <XStack alignItems="flex-start" gap={wp(8)}>
          <Text fontSize={fp(18)} fontWeight="800" color="#121217">Crafted</Text>
          <XStack
            backgroundColor="#F4EAFE"
            borderRadius={wp(5)}
            paddingHorizontal={wp(8)}
            paddingVertical={hp(3)}
          >
            <Text fontSize={fp(11)} fontWeight="700" color="#500696">for Creators</Text>
          </XStack>
        </XStack>
        <XStack justifyContent="center" paddingVertical={hp(40)}>
          <Spinner color="#8E0FFF" />
        </XStack>
      </YStack>
    );
  }

  if (isError) {
    return (
      <YStack gap="$3" paddingHorizontal={wp(16)}>
        <XStack alignItems="center" gap={wp(8)}>
          <Text fontSize={fp(18)} fontWeight="800" color="#121217">Crafted</Text>
          <XStack
            backgroundColor="#F4EAFE"
            borderRadius={wp(5)}
            paddingHorizontal={wp(8)}
            paddingVertical={hp(3)}
          >
            <Text fontSize={fp(11)} fontWeight="700" color="#500696">for Creators</Text>
          </XStack>
        </XStack>
        <XStack justifyContent="center" paddingVertical={hp(40)}>
          <Text color="$red10">Failed to load categories</Text>
        </XStack>
      </YStack>
    );
  }

  return (
    <YStack gap={wp(12)} paddingHorizontal={wp(16)}>
      <XStack justifyContent="flex-start">
        <XStack alignItems="center" gap={wp(8)}>
          <Text fontSize={fp(18)} fontWeight="800" color="#121217">Crafted</Text>
          <XStack
            backgroundColor="#F4EAFE"
            borderRadius={wp(5)}
            paddingHorizontal={wp(8)}
            paddingVertical={hp(3)}
          >
            <Text fontSize={fp(11)} fontWeight="700" color="#500696">for Creators</Text>
          </XStack>
        </XStack>
      </XStack>
      <XStack flexWrap="wrap" gap={wp(8)} justifyContent="space-between">
        {categoriesToShow.map((category) => {
          const iconSource = getCategoryIcon(category.name, category.image_url);
          return (
            <CategoryCard
              key={category.id}
              category={category}
              iconSource={iconSource}
              onPress={() => onCategoryPress(category.id)}
            />
          );
        })}
      </XStack>

      {/* See all categories button */}
      {/* <XStack justifyContent="center" paddingTop={hp(8)}>
        <LinearGradient
          colors={[
            "rgba(255, 255, 255, 0.9)",
            "rgba(142, 15, 255, 0.08)",
            "rgba(255, 255, 255, 0.6)"
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 21,
            paddingLeft: wp(16),
            paddingRight: wp(12),
            paddingVertical: hp(10),
            borderWidth: 1,
            borderColor: "rgba(142, 15, 255, 0.15)",
          }}
        >
          <YStack
            pressStyle={{ opacity: 0.8 }}
            onPress={() => {
              // Navigate to all categories
            }}
          >
            <XStack alignItems="center" gap={4}>
              <Text fontSize={15} fontWeight="600" color="#8E0FFF">
                See all categories
              </Text>
              <Text fontSize={18} color="#8E0FFF">→</Text>
            </XStack>
          </YStack>
        </LinearGradient>
      </XStack> */}
    </YStack>
  );
}
