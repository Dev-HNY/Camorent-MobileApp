import { XStack, Text } from "tamagui";
import { X } from "lucide-react-native";
import { TouchableOpacity, Animated } from "react-native";
import { useEffect, useRef } from "react";
import { fp, hp, wp } from "@/utils/responsive";
import * as Haptics from "expo-haptics";

interface FilterChipProps {
  label: string;
  onRemove: () => void;
  variant?: "default" | "primary";
}

export function FilterChip({ label, onRemove, variant = "default" }: FilterChipProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 6,
      tension: 50,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleRemove = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scaleAnim, {
      toValue: 0,
      friction: 6,
      useNativeDriver: true,
    }).start(() => {
      onRemove();
    });
  };

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
      }}
    >
      <XStack
        backgroundColor={variant === "primary" ? "#8E0FFF" : "#F5F5F7"}
        borderRadius={wp(20)}
        paddingHorizontal={wp(12)}
        paddingVertical={hp(6)}
        alignItems="center"
        gap={wp(6)}
        borderWidth={variant === "primary" ? 0 : 1}
        borderColor="#E0E0E0"
      >
        <Text
          fontSize={fp(12)}
          fontWeight="500"
          color={variant === "primary" ? "#FFFFFF" : "#121217"}
        >
          {label}
        </Text>
        <TouchableOpacity onPress={handleRemove} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <X size={14} color={variant === "primary" ? "#FFFFFF" : "#6C6C89"} />
        </TouchableOpacity>
      </XStack>
    </Animated.View>
  );
}

interface FilterChipsContainerProps {
  activeFilters: { type: string; value: string; label: string }[];
  onRemoveFilter: (type: string, value: string) => void;
  onClearAll: () => void;
}

export function FilterChipsContainer({
  activeFilters,
  onRemoveFilter,
  onClearAll,
}: FilterChipsContainerProps) {
  if (activeFilters.length === 0) return null;

  return (
    <XStack
      gap={wp(8)}
      flexWrap="wrap"
      paddingHorizontal={wp(16)}
      paddingVertical={hp(12)}
      alignItems="center"
    >
      {activeFilters.map((filter, index) => (
        <FilterChip
          key={`${filter.type}-${filter.value}-${index}`}
          label={filter.label}
          onRemove={() => onRemoveFilter(filter.type, filter.value)}
        />
      ))}
      {activeFilters.length > 1 && (
        <TouchableOpacity onPress={onClearAll}>
          <Text fontSize={fp(12)} fontWeight="600" color="#8E0FFF">
            Clear all
          </Text>
        </TouchableOpacity>
      )}
    </XStack>
  );
}
