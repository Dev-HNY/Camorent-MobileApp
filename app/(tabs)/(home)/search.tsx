import { useState, useEffect, useRef } from "react";
import { TextInput, Keyboard, Platform, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { YStack, XStack, Text, ScrollView } from "tamagui";
import { Search, X, ChevronRight, TrendingUp } from "lucide-react-native";
import { UseGetAllProducts } from "@/hooks/product/useGetAllProducts";
import { SKU } from "@/types/products/product";
import { Image } from "expo-image";
import { wp, hp, fp } from "@/utils/responsive";
import * as Haptics from "expo-haptics";
import { KeyboardAvoidingView } from "react-native";

const TRENDING_SEARCHES = [
  "Sony FX3",
  "DJI Ronin",
  "Aputure 600d",
  "Canon C70",
  "Gimbal",
  "Drone",
];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SKU[]>([]);

  const { data: products } = UseGetAllProducts({ is_active: true, limit: 100 });
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        const filtered =
          products?.data.filter(
            (p: SKU) =>
              p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.brand.toLowerCase().includes(searchQuery.toLowerCase())
          ) ?? [];
        setSearchResults(filtered.slice(0, 12));
      } else {
        setSearchResults([]);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery, products]);

  const handleProductPress = (product: SKU) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Keyboard.dismiss();
    router.back();
    router.push(`/product/${product.id}`);
  };

  const handleTrendingPress = (query: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSearchQuery(query);
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Keyboard.dismiss();
    router.back();
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    inputRef.current?.focus();
  };

  const showResults = searchQuery.trim().length > 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F2F2F7" }}>
      {/* Search Bar */}
      <XStack
        alignItems="center"
        gap={wp(10)}
        paddingHorizontal={wp(16)}
        paddingTop={hp(8)}
        paddingBottom={hp(12)}
        backgroundColor="#F2F2F7"
      >
        <XStack
          flex={1}
          alignItems="center"
          backgroundColor="#FFFFFF"
          borderRadius={12}
          paddingHorizontal={wp(12)}
          height={hp(44)}
          gap={wp(8)}
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.06,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <Search size={18} color="#8E0FFF" strokeWidth={2.2} />
          <TextInput
            ref={inputRef}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search cameras, lenses, lights..."
            placeholderTextColor="#9CA3AF"
            returnKeyType="search"
            autoFocus
            style={{
              flex: 1,
              fontSize: fp(15),
              color: "#1C1C1E",
              padding: 0,
              margin: 0,
              height: hp(44),
            }}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={clearSearch} hitSlop={8}>
              <XStack
                width={20}
                height={20}
                borderRadius={10}
                backgroundColor="#C7C7CC"
                alignItems="center"
                justifyContent="center"
              >
                <X size={12} color="#FFFFFF" strokeWidth={2.5} />
              </XStack>
            </Pressable>
          )}
        </XStack>

        <Pressable onPress={handleClose} hitSlop={8}>
          <Text fontSize={fp(16)} fontWeight="500" color="#8E0FFF">
            Cancel
          </Text>
        </Pressable>
      </XStack>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          flex={1}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={{ paddingBottom: hp(40) }}
        >
          {/* Search Results */}
          {showResults && searchResults.length > 0 && (
            <YStack
              backgroundColor="#FFFFFF"
              marginHorizontal={wp(16)}
              marginTop={hp(4)}
              borderRadius={14}
              overflow="hidden"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              {searchResults.map((product, index) => (
                <Pressable
                  key={product.sku_id}
                  onPress={() => handleProductPress(product)}
                  style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                >
                  <XStack
                    alignItems="center"
                    gap={wp(12)}
                    paddingHorizontal={wp(14)}
                    paddingVertical={hp(10)}
                    borderTopWidth={index === 0 ? 0 : 1}
                    borderTopColor="#F2F2F7"
                  >
                    {/* Product thumbnail */}
                    <XStack
                      width={hp(48)}
                      height={hp(48)}
                      borderRadius={10}
                      backgroundColor="#F8F8FA"
                      alignItems="center"
                      justifyContent="center"
                      overflow="hidden"
                    >
                      <Image
                        source={{ uri: product.primary_image_url }}
                        contentFit="contain"
                        style={{ width: hp(44), height: hp(44) }}
                      />
                    </XStack>

                    {/* Text */}
                    <YStack flex={1} gap={hp(2)}>
                      <Text
                        fontSize={fp(14)}
                        fontWeight="500"
                        color="#1C1C1E"
                        numberOfLines={1}
                      >
                        {product.name}
                      </Text>
                      <Text fontSize={fp(12)} color="#8E8E93" numberOfLines={1}>
                        {product.brand}
                      </Text>
                    </YStack>

                    <ChevronRight size={16} color="#C7C7CC" strokeWidth={2} />
                  </XStack>
                </Pressable>
              ))}
            </YStack>
          )}

          {/* No Results */}
          {showResults && searchResults.length === 0 && (
            <YStack
              alignItems="center"
              paddingTop={hp(60)}
              paddingHorizontal={wp(32)}
              gap={hp(10)}
            >
              <XStack
                width={hp(64)}
                height={hp(64)}
                borderRadius={hp(32)}
                backgroundColor="#F2F2F7"
                alignItems="center"
                justifyContent="center"
              >
                <Search size={hp(28)} color="#C7C7CC" strokeWidth={1.8} />
              </XStack>
              <Text fontSize={fp(17)} fontWeight="600" color="#1C1C1E">
                No results found
              </Text>
              <Text
                fontSize={fp(14)}
                color="#8E8E93"
                textAlign="center"
                lineHeight={fp(20)}
              >
                Try a different search — brand names, lens types, or lighting gear
              </Text>
            </YStack>
          )}

          {/* Empty state: Trending + Quick suggestions */}
          {!showResults && (
            <YStack gap={hp(24)} paddingTop={hp(8)}>
              {/* Trending Searches */}
              <YStack gap={hp(2)}>
                <XStack
                  alignItems="center"
                  gap={wp(6)}
                  paddingHorizontal={wp(20)}
                  paddingBottom={hp(10)}
                >
                  <TrendingUp size={15} color="#8E0FFF" strokeWidth={2} />
                  <Text fontSize={fp(13)} fontWeight="600" color="#8E8E93" letterSpacing={0.5}>
                    TRENDING
                  </Text>
                </XStack>

                <YStack
                  backgroundColor="#FFFFFF"
                  marginHorizontal={wp(16)}
                  borderRadius={14}
                  overflow="hidden"
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.06,
                    shadowRadius: 6,
                    elevation: 2,
                  }}
                >
                  {TRENDING_SEARCHES.map((term, index) => (
                    <Pressable
                      key={term}
                      onPress={() => handleTrendingPress(term)}
                      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                    >
                      <XStack
                        alignItems="center"
                        gap={wp(12)}
                        paddingHorizontal={wp(14)}
                        paddingVertical={hp(13)}
                        borderTopWidth={index === 0 ? 0 : 1}
                        borderTopColor="#F2F2F7"
                      >
                        <XStack
                          width={32}
                          height={32}
                          borderRadius={8}
                          backgroundColor="#F5EEFF"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <TrendingUp size={15} color="#8E0FFF" strokeWidth={2} />
                        </XStack>
                        <Text flex={1} fontSize={fp(14)} fontWeight="400" color="#1C1C1E">
                          {term}
                        </Text>
                        <ChevronRight size={15} color="#C7C7CC" strokeWidth={2} />
                      </XStack>
                    </Pressable>
                  ))}
                </YStack>
              </YStack>

              {/* Camorent hint */}
              <XStack
                marginHorizontal={wp(16)}
                backgroundColor="#F5EEFF"
                borderRadius={12}
                paddingHorizontal={wp(14)}
                paddingVertical={hp(12)}
                alignItems="center"
                gap={wp(10)}
              >
                <XStack
                  width={36}
                  height={36}
                  borderRadius={18}
                  backgroundColor="#8E0FFF"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Search size={16} color="#FFFFFF" strokeWidth={2.2} />
                </XStack>
                <YStack flex={1} gap={hp(2)}>
                  <Text fontSize={fp(13)} fontWeight="600" color="#5F00BA">
                    Search the full catalog
                  </Text>
                  <Text fontSize={fp(12)} color="#8E0FFF">
                    500+ cameras, lenses & lighting gear
                  </Text>
                </YStack>
              </XStack>
            </YStack>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
