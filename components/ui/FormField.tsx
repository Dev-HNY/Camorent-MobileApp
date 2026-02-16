import React from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { YStack, Label, Text } from 'tamagui';
import { Input } from './Input';

interface FormFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
  style?: any;
  inputStyle?: any;
}

export function FormField<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  secureTextEntry,
  keyboardType = 'default',
  style,
  inputStyle,
}: FormFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <YStack gap="$2" {...style}>
          {label && <Label htmlFor={name}>{label}</Label>}
          <Input
            style={inputStyle}
            error={!!error}
            placeholder={placeholder}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
          />
          {error && (
            <Text color="$red10" fontSize="$3">
              {error.message}
            </Text>
          )}
        </YStack>
      )}
    />
  );
}