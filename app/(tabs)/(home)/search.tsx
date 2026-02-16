import { useState, useEffect, useRef } from "react";
import { TextInput, Keyboard, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { YStack, XStack, Text, ScrollView, Button, Stack } from "tamagui";
import {
  Search,
  ArrowLeft,
  X,
  ArrowRight,
  ChevronRight,
} from "lucide-react-native";
import { UseGetAllProducts } from "@/hooks/product/useGetAllProducts";
import { SearchSKUResult, SKU } from "@/types/products/product";
import { Image } from "expo-image";
import { wp } from "@/utils/responsive";
import { BodySmall, BodyText } from "@/components/ui/Typography";
import Animated, { FadeInDown, FadeIn, FadeOut } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { DURATION } from "@/components/animations/constants";
import { LinearGradient } from "expo-linear-gradient";

export default function SearchModal() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SKU[]>([]);

  const { data: products } = UseGetAllProducts({ is_active: true, limit: 100 });
  const inputRef = useRef<TextInput>(null);

  // Auto-focus when modal opens
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Search products with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        searchProducts(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const searchProducts = (query: string) => {
    const filtered =
      products?.data.filter(
        (product: SKU) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.brand.toLowerCase().includes(query.toLowerCase())
      ) ?? [];
    setSearchResults(filtered?.slice(0, 10));
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.back();
      // You can implement search result navigation here
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    inputRef.current?.focus();
  };

  const handleClose = () => {
    Keyboard.dismiss();
    router.back();
  };

  const handleQuickSearch = (query: string) => {
    setSearchQuery(query);
    handleSearch(query);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <LinearGradient
        colors={['rgba(142, 15, 255, 0.02)', 'rgba(255, 255, 255, 1)']}
        style={{ flex: 1 }}
      >
        <YStack flex={1}>
        {/* Header */}
        <XStack
          paddingHorizontal="$4"
          paddingVertical="$3"
          alignItems="center"
          gap="$3"
          borderBottomWidth={1}
          borderBottomColor="$gray5"
        >
          <XStack
            borderRadius={28}
            borderWidth={1}
            padding={"$2"}
            borderColor={"$gray7"}
            onPress={() => router.back()}
          >
            <ArrowLeft size={18} />
          </XStack>

          <XStack flex={1} position="relative" alignItems="center">
            <TextInput
              ref={inputRef}
              style={styles.searchInput}
              placeholder="Search products, categories..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => handleSearch(searchQuery)}
              returnKeyType="search"
              placeholderTextColor="#999"
              autoFocus={true}
            />
            <Search
              size={20}
              color="#666"
              style={{
                position: "absolute",
                left: 16,
                zIndex: 1,
              }}
            />
            {searchQuery.length > 0 && (
              <Stack
                position="absolute"
                right="$2"
                padding="$2"
                pressStyle={{ opacity: 0.6 }}
                cursor="pointer"
                onPress={clearSearch}
              >
                <X size={20} color="#666" />
              </Stack>
            )}
          </XStack>
        </XStack>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
        <ScrollView
          flex={1}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={{ paddingBottom: 70 }}
        >
          {/* Search Results */}
          {searchQuery.trim() && searchResults.length > 0 && (
            <YStack padding="$4" gap="$2">
              {/* <Text fontSize="$5" fontWeight="600" marginBottom="$2">
                Products
              </Text> */}
              {searchResults.map((product, index) => (
                <XStack
                  key={product.sku_id}
                  padding="$3"
                  alignItems="center"
                  gap="$3"
                  backgroundColor={"$blue4"}
                  borderRadius={wp(12)}
                  onPress={() => {
                    handleSearch(product.name);
                    router.push(`/product/${product.id}`);
                  }}
                >
                  <XStack gap={wp(12)} alignItems="center">
                    <XStack justifyContent="center" alignItems="center">
                      <Image
                        source={{ uri: product.primary_image_url }}
                        contentFit="cover"
                        transition={300}
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 8,
                        }}
                      />
                    </XStack>
                    <YStack flex={1}>
                      <BodySmall color={"#121217"} numberOfLines={1}>
                        {product.name}
                      </BodySmall>
                      <Text fontSize="$3" color="$gray9" numberOfLines={1}>
                        in{" "}
                        <BodySmall color={"#121217"}>{product.brand}</BodySmall>
                      </Text>
                    </YStack>
                    <XStack justifyContent="flex-end">
                      <ChevronRight />
                    </XStack>
                  </XStack>
                </XStack>
              ))}
            </YStack>
          )}

          {/* No Results */}
          {searchQuery.trim() && searchResults.length === 0 && (
            <YStack padding="$4" alignItems="center" gap="$2">
              <Search size={48} color="#ccc" />
              <Text fontSize="$5" fontWeight="600" color="$gray9">
                No products found
              </Text>
              <Text fontSize="$3" color="$gray7" textAlign="center">
                Try searching with different keywords
              </Text>
            </YStack>
          )}
        </ScrollView>
        </KeyboardAvoidingView>
        </YStack>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 8,
    paddingLeft: 48, // Space for search icon
    fontSize: 16,
    backgroundColor: "#fff",
    minHeight: 24,
    color: "#000",
  },
});
