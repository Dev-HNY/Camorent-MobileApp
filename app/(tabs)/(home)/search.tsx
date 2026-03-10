import { useState, useRef, useCallback } from "react";
import { TextInput, Keyboard, Platform, Pressable, ActivityIndicator, NativeScrollEvent, NativeSyntheticEvent } from "react-native";
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
import { Image as ExpoImage } from "expo-image";

const TRENDING_SEARCHES = [
  "Sony FX3",
  "DJI Ronin",
  "Aputure 600d",
  "Canon C70",
  "Gimbal",
  "Drone",
];

const PAGE_SIZE = 8;

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<TextInput>(null);

  // Focus on mount
  const onInputRef = useCallback((ref: TextInput | null) => {
    (inputRef as any).current = ref;
    if (ref) setTimeout(() => ref.focus(), 100);
  }, []);

  const handleChangeText = (text: string) => {
    setSearchQuery(text);
    setVisibleCount(PAGE_SIZE);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (!text.trim()) {
      setDebouncedQuery("");
      return;
    }
    debounceTimer.current = setTimeout(() => {
      setDebouncedQuery(text.trim());
    }, 300);
  };

  // Use the first word for server search (broader match), then filter client-side by all words
  const words = debouncedQuery.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const serverQuery = words[0] ?? "";

  const { data: searchData, isLoading: isLoadingProducts } = UseGetAllProducts(
    serverQuery
      ? { is_active: true, limit: 200, q: serverQuery }
      : undefined
  );

  // Client-side: every word must appear in name, brand, or tags
  const allResults: SKU[] = (searchData?.data ?? []).filter((p: SKU) => {
    if (words.length <= 1) return true; // single word — server already filtered
    const haystack = [
      p.name,
      p.brand,
      ...(p.tags ?? []),
    ].join(" ").toLowerCase();
    return words.every((w) => haystack.includes(w));
  });
  const displayedResults = allResults.slice(0, visibleCount);
  const hasMore = visibleCount < allResults.length;

  const handleScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
    const isNearBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - hp(60);
    if (isNearBottom && hasMore) {
      setVisibleCount((prev) => prev + PAGE_SIZE);
    }
  }, [hasMore]);

  const handleProductPress = (product: SKU) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Keyboard.dismiss();
    router.back();
    router.push(`/product/${product.id}`);
  };

  const handleTrendingPress = (query: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSearchQuery(query);
    setDebouncedQuery(query);
    setVisibleCount(PAGE_SIZE);
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Keyboard.dismiss();
    router.back();
  };

  const clearSearch = () => {
    setSearchQuery("");
    setDebouncedQuery("");
    setVisibleCount(PAGE_SIZE);
    inputRef.current?.focus();
  };

  const showResults = searchQuery.trim().length > 0;
  const isSearching = showResults && (isLoadingProducts || debouncedQuery !== searchQuery.trim());

  const handleBrowseAll = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Keyboard.dismiss();
    router.back();
    router.push("/(tabs)/(home)/categories");
  };

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
            ref={onInputRef}
            value={searchQuery}
            onChangeText={handleChangeText}
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
          {isSearching && (
            <ActivityIndicator size="small" color="#8E0FFF" />
          )}
          {searchQuery.length > 0 && !isSearching && (
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
          onScroll={handleScroll}
          scrollEventThrottle={200}
        >
          {/* Search Results */}
          {showResults && !isSearching && displayedResults.length > 0 && (
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
              {displayedResults.map((product, index) => (
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

                    <YStack flex={1} gap={hp(2)}>
                      <Text fontSize={fp(14)} fontWeight="500" color="#1C1C1E" numberOfLines={1}>
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

              {hasMore && (
                <XStack
                  justifyContent="center"
                  alignItems="center"
                  paddingVertical={hp(12)}
                  borderTopWidth={1}
                  borderTopColor="#F2F2F7"
                  gap={wp(6)}
                >
                  <ActivityIndicator size="small" color="#8E0FFF" />
                  <Text fontSize={fp(12)} color="#8E8E93">
                    {allResults.length - visibleCount} more results
                  </Text>
                </XStack>
              )}
            </YStack>
          )}

          {/* No Results */}
          {showResults && !isSearching && allResults.length === 0 && (
            <YStack
              alignItems="center"
              paddingTop={hp(40)}
              paddingHorizontal={wp(32)}
              gap={hp(4)}
            >
              <ExpoImage
                source={require("@/assets/new/icons/no-product.svg")}
                contentFit="contain"
                style={{ width: wp(200), height: wp(200) }}
                cachePolicy="memory-disk"
              />
              <Text
                fontSize={fp(18)}
                fontWeight="700"
                color="#1C1C1E"
                textAlign="center"
                letterSpacing={-0.3}
              >
                <Text fontSize={fp(18)} fontWeight="700" color="#8E0FFF">Oops!</Text>
                {" "}we couldn't find product{"\n"}for your search.
              </Text>
            </YStack>
          )}

          {/* Empty state: Trending + Browse */}
          {!showResults && (
            <YStack gap={hp(24)} paddingTop={hp(8)}>
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

              <Pressable
                onPress={handleBrowseAll}
                style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
              >
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
                      Browse full catalog
                    </Text>
                    <Text fontSize={fp(12)} color="#8E0FFF">
                      500+ cameras, lenses & lighting gear
                    </Text>
                  </YStack>
                  <ChevronRight size={16} color="#8E0FFF" strokeWidth={2} />
                </XStack>
              </Pressable>
            </YStack>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
