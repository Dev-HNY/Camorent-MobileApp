import { YStack, XStack, Text, Stack } from "tamagui";
import { Image } from "expo-image";
import { useState, useMemo, useRef } from "react";
import AccordionSpecification from "./AccordionSpecification";
import { fp, hp, wp } from "@/utils/responsive";
import { HeartIcon } from "../ui/HeartIcon";
import { VerifiedIcon } from "../ui/VerifiedIcon";
import { BodySmall, BodyText } from "../ui/Typography";
import { SKUDetail } from "@/types/products/product";
import { Link, router } from "expo-router";
import { useWishlistStatus } from "@/hooks/wishlist";
import { capitalizeFirst, formatPrice } from "@/utils/format";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { Dimensions, Pressable, Share } from "react-native";
import { ImageZoomModal } from "./ImageZoomModal";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { ChevronLeft, Search, ShoppingCart, Share2 } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGetCart } from "@/hooks/cart/useGetCart";
import { LinearGradient } from "expo-linear-gradient";
import { CustomerSupport } from "../PDP/CustomerSupport";

interface ProductInfoProps {
  product: SKUDetail | undefined;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const getProductPrice = () => {
    if (!product) return 0;
    return parseFloat(product.price_per_day);
  };
  const currentPrice = getProductPrice();
  const originalPrice = currentPrice + currentPrice * 0.15;
  const discountPercent = "15";
  const features = product?.top_specs_list.slice(0, 3) || [];

  const productImages = useMemo(() => {
    if (!product?.id) return [];
    return [
      `https://img.camorent.co.in/skus/images/${product?.id}/primary.webp`,
      `https://img.camorent.co.in/skus/images/${product?.id}/profile.webp`,
      `https://img.camorent.co.in/skus/images/${product?.id}/top.webp`,
      `https://img.camorent.co.in/skus/images/${product?.id}/side.webp`,
    ];
  }, [product?.id]);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const carouselRef = useRef<ICarouselInstance>(null);
  const width = Dimensions.get("window").width;

  const { isInWishlist, toggleWishlist } = useWishlistStatus(
    product?.id ?? "",
    product?.name ?? ""
  );

  const insets = useSafeAreaInsets();
  const { data: cart } = useGetCart();
  const cartItemsCount = cart?.sku_items.length || 0;

  const handleFavoritePress = (e: any) => {
    e.stopPropagation();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleWishlist();
  };

  const handleBackPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleSharePress = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await Share.share({
        message: `Check out ${product?.name} on Camorent!`,
      });
    } catch (error) {
    }
  };

  return (
    <YStack backgroundColor="#FFFFFF">
      {/* Main Image Carousel - Full Width with Overlaid Header */}
      <Animated.View entering={FadeInDown.duration(400).springify()}>
        <YStack>
          {/* Image Carousel */}
          <Stack
            height={hp(320)}
            backgroundColor="#FFFFFF"
            justifyContent="flex-end"
            alignItems="center"
            paddingBottom={hp(20)}
          >
            <Carousel
              ref={carouselRef}
              loop
              width={width}
              height={hp(180)}
              data={productImages}
              onSnapToItem={(index) => setSelectedImageIndex(index)}
              renderItem={({ item }) => (
                <Pressable onPress={() => setIsModalVisible(true)}>
                  <Image
                    source={{ uri: item }}
                    contentFit="contain"
                    style={{
                      width: width,
                      height: hp(180),
                    }}
                  />
                </Pressable>
              )}
            />

            {/* Overlaid Header Icons */}
            <XStack
              position="absolute"
              top={insets.top || hp(10)}
              left={0}
              right={0}
              paddingHorizontal={wp(16)}
              justifyContent="space-between"
              alignItems="center"
              zIndex={10}
            >
              {/* Back Button */}
              <Pressable
                onPress={handleBackPress}
                style={{
                  width: wp(40),
                  height: wp(40),
                  borderRadius: wp(20),
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  justifyContent: "center",
                  alignItems: "center",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <ChevronLeft size={24} color="#121217" />
              </Pressable>

              {/* Right Side Icons */}
              <XStack gap={wp(8)}>
                {/* Search Icon */}
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push('/(tabs)/(home)/search');
                  }}
                  style={{
                    width: wp(40),
                    height: wp(40),
                    borderRadius: wp(20),
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    justifyContent: "center",
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <Search size={20} color="#121217" />
                </Pressable>

                {/* Wishlist Icon */}
                <Pressable
                  onPress={handleFavoritePress}
                  style={{
                    width: wp(40),
                    height: wp(40),
                    borderRadius: wp(20),
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    justifyContent: "center",
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <HeartIcon filled={isInWishlist} width={20} height={20} />
                </Pressable>

                {/* Cart Icon with Badge */}
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push('/cart');
                  }}
                  style={{
                    width: wp(40),
                    height: wp(40),
                    borderRadius: wp(20),
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    justifyContent: "center",
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <ShoppingCart size={20} color="#121217" />
                  {cartItemsCount > 0 && (
                    <Stack
                      position="absolute"
                      top={-2}
                      right={-2}
                      backgroundColor="#EF4444"
                      borderRadius={wp(10)}
                      minWidth={wp(18)}
                      height={wp(18)}
                      justifyContent="center"
                      alignItems="center"
                      paddingHorizontal={wp(4)}
                    >
                      <Text fontSize={fp(10)} fontWeight="700" color="#FFFFFF">
                        {cartItemsCount}
                      </Text>
                    </Stack>
                  )}
                </Pressable>
              </XStack>
            </XStack>

            {/* Brand New Badge - Overlaid on Image */}
            <Stack
              position="absolute"
              top={insets.top + hp(60)}
              left={wp(16)}
              backgroundColor="#EEFBF4"
              paddingHorizontal={wp(12)}
              paddingVertical={hp(6)}
              borderRadius={wp(6)}
              zIndex={10}
            >
              <Text fontSize={fp(12)} fontWeight="600" color="#17663A">
                Brand new
              </Text>
            </Stack>

            {/* Share Button - Bottom Right on Image */}
            {/* <Pressable
              onPress={handleSharePress}
              style={{
                position: "absolute",
                bottom: hp(16),
                right: wp(16),
                width: wp(44),
                height: wp(44),
                borderRadius: wp(22),
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                justifyContent: "center",
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 6,
                elevation: 4,
                zIndex: 10,
              }}
            >
              <Share2 size={20} color="#121217" />
            </Pressable> */}
          </Stack>
        </YStack>
      </Animated.View>

      {/* Product Details Card */}
      <Animated.View entering={FadeInDown.delay(100).duration(400).springify()}>
        <YStack
          paddingHorizontal={wp(16)}
          gap={hp(16)}
        >
          {/* Thumbnail Strip */}
          <XStack gap={wp(10)} paddingVertical={hp(4)}>
            {productImages.slice(0, 4).map((image, index) => {
              const isActive = index === selectedImageIndex;
              return (
                <Pressable
                  key={index}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setSelectedImageIndex(index);
                    carouselRef.current?.scrollTo({ index, animated: true });
                  }}
                >
                  <Stack
                    width={wp(72)}
                    height={hp(72)}
                    borderRadius={wp(10)}
                    borderWidth={isActive ? 2 : 0}
                    borderColor={isActive ? "#1C1C1E" : "transparent"}
                    justifyContent="center"
                    alignItems="center"
                    backgroundColor="#F8F8FA"
                    style={{
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: isActive ? 0 : 0.04,
                      shadowRadius: 3,
                      elevation: isActive ? 0 : 1,
                    }}
                  >
                    <Image
                      source={{ uri: image }}
                      contentFit="contain"
                      cachePolicy="memory-disk"
                      style={{ width: wp(62), height: hp(62) }}
                    />
                  </Stack>
                </Pressable>
              );
            })}
          </XStack>

          {/* Product Name + Verified */}
          <YStack gap={hp(12)}>
            <XStack alignItems="center" gap={wp(8)}>
              <Text fontSize={fp(17)} fontWeight="600" color="#121217" letterSpacing={-0.3} flex={1}>
                {product?.name}
              </Text>
              <VerifiedIcon />
            </XStack>

            {/* Pricing Section */}
            <YStack gap={hp(8)}>
              <XStack alignItems="center" gap={wp(8)} flexWrap="wrap">
                <Text fontSize={fp(20)} fontWeight="700" color="#121217" letterSpacing={-0.3}>
                  {formatPrice(currentPrice)}
                </Text>
                <Text fontSize={fp(13)} fontWeight="400" color="#6B7280">
                  per day
                </Text>
                <XStack
                  backgroundColor="#00ACFF"
                  paddingHorizontal={wp(10)}
                  paddingVertical={hp(4)}
                  borderRadius={wp(20)}
                >
                  <Text fontSize={fp(12)} fontWeight="600" color="#FFFFFF">
                    {discountPercent}% Off
                  </Text>
                </XStack>
              </XStack>

              <XStack alignItems="center" gap={wp(6)} flexWrap="wrap">
                <Text fontSize={fp(12)} color="#6C6C89" fontWeight="400">
                  MRP
                </Text>
                <Text
                  fontSize={fp(14)}
                  color="#3F3F50"
                  textDecorationLine="line-through"
                  fontWeight="400"
                >
                  {formatPrice(originalPrice)}
                </Text>
                <Text fontSize={fp(12)} color="#6C6C89" fontWeight="400">
                  per day ( incl. of all taxes )
                </Text>
              </XStack>
            </YStack>
          </YStack>

          {/* Why this is Creator's first choice? - Bordered Container with Badge */}
          {features.length > 0 && (
            <YStack position="relative" marginTop={hp(12)}>
              {/* Rented Times Badge - Positioned on Border */}
              <XStack
                position="absolute"
                top={hp(-12)}
                left={wp(16)}
                backgroundColor="#F0FAFF"
                borderWidth={1}
                borderColor="#ADE4FF"
                paddingHorizontal={wp(12)}
                paddingVertical={hp(6)}
                borderRadius={wp(10)}
                zIndex={10}
              >
                <Text fontSize={fp(12)} fontWeight="500" color="#0284C7">
                  Rented 100+ times this Year
                </Text>
              </XStack>

              {/* Bordered Container */}
              <YStack
                borderWidth={1}
                borderColor="#EBEBEF"
                borderRadius={wp(12)}
                padding={wp(16)}
                paddingTop={hp(24)}
                gap={hp(12)}
              >
                <Text fontSize={fp(14)} fontWeight="600" color="#121217">
                  Why this is Creator's first choice?
                </Text>
                <XStack gap={wp(12)} flexWrap="wrap" justifyContent="space-between">
                  {features.map((feature, index) => (
                    <LinearGradient
                      key={index}
                      colors={['#FFF3D6', '#FFFFFF']}
                      locations={[0, 0.8413]}
                      style={{
                        flex: 1,
                        minWidth: wp(50),
                        borderTopLeftRadius: wp(12),
                        borderTopRightRadius: wp(12),
                      }}
                    >
                      <Stack
                        padding={wp(10)}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <YStack justifyContent="center" alignItems="center" gap={hp(6)}>
                          <Text
                            fontSize={fp(14)}
                            fontWeight="600"
                            color="#6D00DA"
                            textAlign="center"
                          >
                            {feature.split(' ')[0]}
                          </Text>
                          <Text
                            fontSize={fp(11)}
                            fontWeight="400"
                            color="#6C6C89"
                            textAlign="center"
                          >
                            {feature.split(' ').slice(1).join(' ')}
                          </Text>
                        </YStack>
                      </Stack>
                    </LinearGradient>
                  ))}
                </XStack>
              </YStack>
            </YStack>
          )}

          {/* Need Help pill */}
          <Link href="mailto:support@camorent.co.in">
            <XStack
              backgroundColor="#F5EEFF"
              paddingHorizontal={wp(14)}
              paddingVertical={hp(10)}
              borderRadius={wp(12)}
              alignItems="center"
              gap={wp(6)}
            >
              <Text fontSize={fp(13)} fontWeight="600" color="#8E0FFF">
                Need help?
              </Text>
              <Text fontSize={fp(13)} fontWeight="400" color="#8E0FFF" opacity={0.7}>
                Talk to our equipment specialist →
              </Text>
            </XStack>
          </Link>

          {/* Divider - Gradient Line */}
          <LinearGradient
            colors={['#FFFFFF', '#8E0FFF', '#FFFFFF']}
            locations={[0, 0.519231, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              height: 1,
              width: '100%',
              marginTop: hp(12),
            }}
          />

          {/* Product Specification and Description Accordions */}
          <AccordionSpecification
            description={product?.description || ""}
            specifications={(product?.specifications ?? {}) as Record<string, string[]>}
          />

          {/* Service Highlights - Same Day, 24*7, 100% Refundable */}
          <CustomerSupport />

        </YStack>
      </Animated.View>

      <ImageZoomModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        images={productImages}
        initialIndex={selectedImageIndex}
        onIndexChange={(index) => {
          setSelectedImageIndex(index);
          carouselRef.current?.scrollTo({ index, animated: false });
        }}
      />
    </YStack>
  );
}
