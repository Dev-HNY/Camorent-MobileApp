import React from "react";
import { YStack, Text } from "tamagui";
import { Input } from "@/components/ui/Input";
import { hp, wp } from "@/utils/responsive";

interface ShootNameFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  error?: string;
  placeholder?: string;
}

export function ShootNameField({
  value,
  onChangeText,
  onBlur,
  error,
  placeholder = "Enter Shoot name",
}: ShootNameFieldProps) {
  return (
    <YStack gap={hp(4)}>
      <Text fontSize={wp(14)} fontWeight="400" color="#121217">
        Shoot Name *
      </Text>
      <Input
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        placeholderTextColor="#8A8AA3"
        error={!!error}
      />
      {error && (
        <Text fontSize={12} color="#EF4444">
          {error}
        </Text>
      )}
    </YStack>
  );
}
