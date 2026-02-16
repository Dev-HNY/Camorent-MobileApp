import { YStack, XStack, Text, Separator } from "tamagui";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { BodySmall, BodyText, Heading2 } from "@/components/ui/Typography";
import { Radio } from "@/components/ui/Radio";
import { useState, useEffect } from "react";
import { TouchableOpacity, ScrollView } from "react-native";
import { X, ChevronRight } from "lucide-react-native";
import { hp, wp } from "@/utils/responsive";
import { Button } from "../ui/Button";
import { useGetBrands } from "@/hooks/CDP/useGetBrands";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface FilterState {
  priceRange: string[];
  brands: string[];
  availability: string[];
}

interface FilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  tempFilters: FilterState;
  onToggleFilter: (type: keyof FilterState, value: string) => void;
  onApply: () => void;
  onClear: () => void;
  initialCategory?: keyof FilterState;
}

const FILTER_CATEGORIES = [
  { key: "priceRange", label: "Price Range", hasSubmenu: true },
  { key: "brands", label: "Brand", hasSubmenu: true },
  { key: "availability", label: "Availability", hasSubmenu: true },
];

interface FilterCategoryItemProps {
  category: { key: string; label: string; hasSubmenu: boolean };
  isSelected: boolean;
  onSelect: () => void;
}

function FilterCategoryItem({
  category,
  isSelected,
  onSelect,
}: FilterCategoryItemProps) {
  return (
    <YStack width="100%">
      <TouchableOpacity onPress={onSelect} style={{ width: "100%" }} activeOpacity={0.7}>
        <XStack
          alignItems="center"
          justifyContent="space-between"
          paddingVertical={hp(14)}
          paddingHorizontal={wp(16)}
          backgroundColor={isSelected ? "#FFFFFF" : "transparent"}
          borderLeftWidth={isSelected ? 3 : 0}
          borderLeftColor="#8E0FFF"
        >
          <BodySmall
            color={isSelected ? "#1C1C1E" : "#6B7280"}
            fontWeight={isSelected ? "600" : "500"}
            fontSize={15}
          >
            {category.label}
          </BodySmall>
          {category.hasSubmenu && isSelected && (
            <ChevronRight size={18} color="#8E0FFF" strokeWidth={2.5} />
          )}
        </XStack>
      </TouchableOpacity>
    </YStack>
  );
}

export function FilterSheet({
  isOpen,
  onClose,
  tempFilters,
  onToggleFilter,
  onApply,
  onClear,
  initialCategory,
}: FilterSheetProps) {
  const [selectedCategory, setSelectedCategory] = useState<keyof FilterState>(
    initialCategory || "priceRange"
  );

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);
  const insets = useSafeAreaInsets();
  const { data: brandsdata } = useGetBrands();
  const brands = brandsdata?.map((item: any) => item.name) ?? [];

  const FILTER_OPTIONS_DYNAMIC = {
    priceRange: [
      "₹0 - ₹500",
      "₹500 - ₹1000",
      "₹1000 - ₹2000",
      "₹2000 - ₹5000",
      "₹5000+",
    ],
    brands: brands,
    availability: ["Available", "Out of Stock", "Coming Soon"],
  };

  const handleCategorySelect = (categoryKey: keyof FilterState) => {
    setSelectedCategory(categoryKey);
  };

  const handleOptionToggle = (value: string) => {
    onToggleFilter(selectedCategory, value);
  };

  const getSelectedValues = (category: keyof FilterState): string[] => {
    const value = tempFilters[category];
    if (!value || !Array.isArray(value)) return [];
    return value;
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} snapPoints={[65]}>
      <YStack height="100%" paddingTop={hp(8)} paddingBottom={insets.bottom} backgroundColor="#FFFFFF">
        {/* Premium Header */}
        <XStack
          justifyContent="space-between"
          alignItems="center"
          paddingBottom={hp(16)}
          paddingHorizontal={wp(20)}
          paddingTop={hp(8)}
        >
          <YStack>
            <Heading2 fontSize={22} fontWeight="700" color="#1C1C1E" letterSpacing={-0.4}>
              Filters
            </Heading2>
            <BodySmall color="#6B7280" fontSize={14} marginTop={hp(2)}>
              Refine your search
            </BodySmall>
          </YStack>
          <TouchableOpacity onPress={onClose}>
            <XStack
              width={wp(36)}
              height={wp(36)}
              borderRadius={wp(18)}
              backgroundColor="#F5F5F7"
              alignItems="center"
              justifyContent="center"
            >
              <X size={20} color="#1C1C1E" strokeWidth={2.5} />
            </XStack>
          </TouchableOpacity>
        </XStack>

        <Separator alignSelf="stretch" borderColor="#E5E7EB" />

        <XStack flex={1}>
          {/* Left Sidebar - Categories */}
          <YStack flex={1} justifyContent="space-between" paddingBottom={hp(16)} backgroundColor="#FAFAFA">
            <YStack>
              {FILTER_CATEGORIES.map((category) => (
                <FilterCategoryItem
                  key={category.key}
                  category={category}
                  isSelected={selectedCategory === category.key}
                  onSelect={() =>
                    handleCategorySelect(category.key as keyof FilterState)
                  }
                />
              ))}
            </YStack>

            <TouchableOpacity onPress={onClear}>
              <XStack
                paddingVertical={hp(14)}
                paddingHorizontal={wp(16)}
                alignItems="center"
                justifyContent="center"
                borderRadius={wp(12)}
                marginHorizontal={wp(12)}
                backgroundColor="rgba(142, 15, 255, 0.08)"
              >
                <BodySmall color="#8E0FFF" fontWeight="600" fontSize={15}>
                  Clear all
                </BodySmall>
              </XStack>
            </TouchableOpacity>
          </YStack>

          <Separator vertical borderColor="#E5E7EB" />

          {/* Right Side - Options */}
          <YStack
            flex={1.5}
            justifyContent="space-between"
            paddingBottom={hp(16)}
            backgroundColor="#FFFFFF"
          >
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: hp(8) }}>
              <YStack paddingHorizontal={wp(12)}>
                {FILTER_OPTIONS_DYNAMIC[selectedCategory]?.map((option: string) => (
                  <Radio
                    key={option}
                    label={option}
                    selected={getSelectedValues(selectedCategory).includes(
                      option
                    )}
                    onSelect={() => handleOptionToggle(option)}
                  />
                ))}
              </YStack>
            </ScrollView>

            {/* Premium Apply Button */}
            <XStack paddingVertical={hp(12)} paddingHorizontal={wp(16)}>
              <Button onPress={onApply} variant="primary" width="100%" size="lg">
                Show results
              </Button>
            </XStack>
          </YStack>
        </XStack>
      </YStack>
    </BottomSheet>
  );
}
