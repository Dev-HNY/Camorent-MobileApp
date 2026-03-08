import React from "react";
import { View, Text } from "react-native";
import { Input } from "@/components/ui/Input";
import { hp, wp, fp } from "@/utils/responsive";

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
    <View style={{ gap: hp(4) }}>
      <Text style={{ fontSize: fp(14), fontWeight: "400", color: "#121217" }}>
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
        <Text style={{ fontSize: fp(12), color: "#EF4444" }}>{error}</Text>
      )}
    </View>
  );
}
