import {
  XStack,
  YStack,
  Card,
  Text,
  ScrollView as TMScrollView,
  Spinner,
} from "tamagui";
import { Image } from "expo-image";
import { fp, hp, wp } from "@/utils/responsive";
import { Heading2 } from "../ui/Typography";
import { useGetCategories } from "@/hooks/CDP/useGetCategories";
import { useGetSubCategories } from "@/hooks/CDP/useGetSubCategories";
import { Category } from "@/types/category/category";
import { useEffect, useRef } from "react";

interface CategorySelectorProps {
  selectedCategory?: string;
  selectedSubcategory?: string;
  onCategorySelect: (category: string) => void;
  onSubcategorySelect: (subcategory: string) => void;
}

// Map category icons - match home page style
const categoryIcons: { [key: string]: any } = {
  "cameras": require("@/assets/new/icons/home/camera.svg"),
  "camera": require("@/assets/new/icons/home/camera.svg"),
  "lens": require("@/assets/new/icons/home/lens.svg"),
  "lenses": require("@/assets/new/icons/home/lens.svg"),
  "light": require("@/assets/new/icons/home/lights.svg"),
  "lights": require("@/assets/new/icons/home/lights.svg"),
  "lighting": require("@/assets/new/icons/home/lights.svg"),
  "audio": require("@/assets/new/icons/home/audio.svg"),
  "accessories": require("@/assets/new/icons/home/accesories.svg"),
  "support & rigs": require("@/assets/new/icons/home/support-rigs.svg"),
  "support": require("@/assets/new/icons/home/support-rigs.svg"),
  "rigs": require("@/assets/new/icons/home/support-rigs.svg"),
};

export function CategorySelector({
  selectedCategory,
  selectedSubcategory,
  onCategorySelect,
  onSubcategorySelect,
}: CategorySelectorProps) {
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGetCategories();
  const { data: subcategories, isLoading: subcategoriesLoading } =
    useGetSubCategories(selectedCategory || "");
  const scrollRef = useRef<TMScrollView>(null);

  const getCategoryIcon = (categoryName: string, imageUrl: string | null) => {
    const normalizedName = categoryName.toLowerCase();
    return categoryIcons[normalizedName] || (imageUrl ? { uri: imageUrl } : null);
  };
  useEffect(() => {
    if (categories?.data && selectedCategory && scrollRef.current) {
      const categoryIndex = categories.data.findIndex(
        (cat) => cat.id === selectedCategory
      );
      if (categoryIndex > 0) {
        const cardWidth = hp(40);
        const gap = wp(12);
        const scrollX = categoryIndex * (cardWidth + gap);
        setTimeout(() => {
          scrollRef.current?.scrollTo({
            x: scrollX,
            y: 0,
            animated: true,
          });
        }, 100);
      }
    }
  }, [categories?.data, selectedCategory]);
  if (categoriesLoading) {
    return <Spinner size="small" color={"#8E0FFF"} />;
  }

  if (categoriesError || !categories) {
    return (
      <YStack justifyContent="center" alignItems="center">
        <Heading2>there might be some error....</Heading2>
      </YStack>
    );
  }

  return (
    <YStack gap={hp(16)}>
      <TMScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={hp(80) + wp(12)}
        snapToAlignment="start"
      >
        <XStack gap={wp(12)} paddingHorizontal={wp(16)}>
          {categories.data.map((category: Category) => {
            const iconSource = getCategoryIcon(category.name, category.image_url);
            const isSelected = selectedCategory === category.id;
            return (
              <Card
                key={category.id}
                width={wp(80)}
                height={hp(90)}
                borderRadius={wp(12)}
                overflow="hidden"
                onPress={() => onCategorySelect(category.id)}
                backgroundColor="#f5f5f5"
                borderWidth={isSelected ? 1.5 : 1}
                borderColor={isSelected ? "#8E0FFF" : "#EBEBEF"}
                padding={0}
                margin={0}
                pressStyle={{ opacity: 0.9, scale: 0.98 }}
                animation="quick"
              >
                <YStack flex={1} position="relative">
                  {iconSource && (
                    <Image
                      source={iconSource}
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
                    backgroundColor={isSelected ? "rgba(142,15,255,0.12)" : "transparent"}
                  >
                    <Text
                      fontSize={fp(10)}
                      fontWeight="500"
                      color={isSelected ? "#8E0FFF" : "#606060"}
                      numberOfLines={2}
                      textAlign="center"
                      lineHeight={fp(12)}
                    >
                      {category.name}
                    </Text>
                  </YStack>
                </YStack>
              </Card>
            );
          })}
        </XStack>
      </TMScrollView>

      {/* Subcategory Row */}
      {selectedCategory && subcategories && subcategories.data?.length > 0 && (
        <TMScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
        >
          <XStack gap={wp(8)} paddingHorizontal={wp(16)}>
            {subcategoriesLoading ? (
              <Spinner size="small" color={"#8E0FFF"} />
            ) : (
              subcategories.data.map((subcategory) => (
                <Card
                  key={subcategory.id}
                  onPress={() => onSubcategorySelect(subcategory.id)}
                  backgroundColor={
                    selectedSubcategory === subcategory.id
                      ? "#F3E8FF"
                      : "#FFFFFF"
                  }
                  borderColor={
                    selectedSubcategory === subcategory.id
                      ? "#8E0FFF"
                      : "#EBEBEF"
                  }
                  borderWidth={selectedSubcategory === subcategory.id ? 1.5 : 0.7}
                  borderRadius={wp(20)}
                  paddingHorizontal={wp(16)}
                  paddingVertical={hp(8)}
                  minWidth="auto"
                  boxShadow={"0 2px 4px 0 rgba(0, 0, 0, 0.06)"}
                  pressStyle={{ scale: 0.96, opacity: 0.9 }}
                  animation="quick"
                >
                  <Text
                    fontSize={fp(12)}
                    color={
                      selectedSubcategory === subcategory.id
                        ? "#8E0FFF"
                        : "#121217"
                    }
                    fontWeight="600"
                    lineHeight={hp(16)}
                    whiteSpace="nowrap"
                  >
                    {subcategory.name}
                  </Text>
                </Card>
              ))
            )}
          </XStack>
        </TMScrollView>
      )}
    </YStack>
  );
}
