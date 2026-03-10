import React from "react";
import { YStack, XStack, Text } from "tamagui";
import { LinearGradient } from "expo-linear-gradient";
import { Pen } from "lucide-react-native";
import { ShootDateTimeCard } from "@/components/checkout/ShootDateTimeCard";
import { AddressDetailsCard } from "@/components/checkout/AddressDetailsCard";
import { CamocareCard } from "@/components/checkout/CamocareCard";
import { ProductDetailsSection } from "@/components/checkout/ProductDetailsSection";
import { CrewDetailsSection } from "@/components/checkout/CrewDetailsSection";
import { hp, wp, fp } from "@/utils/responsive";

// local helpers replacing removed Typography imports
const Heading2 = ({ color, children }: { color?: string; children: React.ReactNode }) => (
  <Text fontSize={fp(15)} fontWeight="600" color={color ?? "#1C1C1E"}>{children}</Text>
);
const BodyText = ({ color, children }: { color?: string; children: React.ReactNode }) => (
  <Text fontSize={fp(14)} fontWeight="400" color={color ?? "#1C1C1E"}>{children}</Text>
);
const Separator = ({ borderColor }: { borderColor?: string }) => (
  <YStack height={1} backgroundColor={borderColor ?? "#E5E7EB"} />
);

interface PaymentDetailsProps {
  shootName?: string;
  shootDates: string;
  shootStartTime: string;
  addressData: {
    address: string;
    city: string;
    state: string;
    pinCode: string;
  };
  productData: Array<{
    id: string;
    name: string;
    quantity: number;
    days: number;
    price: number;
  }>;
  crewData: Array<{
    id: string;
    name: string;
    quantity: number;
    days: number;
    price: number;
    image: string;
  }>;
  deliveryDate: string;
  camocarePrice?: number;
  hideEditShootDate?: boolean;
  isSelfPickup?: boolean;
  onEditShootSettings: () => void;
  onEditAddress: () => void;
  onAddMoreProducts: () => void;
  onAddMoreCrew: () => void;
}

export function PaymentDetails({
  shootName,
  shootDates,
  shootStartTime,
  addressData,
  productData,
  crewData,
  deliveryDate,
  camocarePrice = 64,
  hideEditShootDate = false,
  isSelfPickup = false,
  onEditShootSettings,
  onEditAddress,
  onAddMoreProducts,
  onAddMoreCrew,
}: PaymentDetailsProps) {
  return (
    <YStack gap={hp(16)}>
      {/* Shoot Name */}
      {shootName && (
        <LinearGradient
          colors={["#FFFDE8", "#FFFFFF"]}
          locations={[0, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#F9DF7B",
            shadowColor: "#F9DF7B",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 6,
            elevation: 2,
          }}
        >
          <XStack
            alignItems="center"
            gap={wp(8)}
            paddingHorizontal={wp(14)}
            paddingTop={hp(12)}
            paddingBottom={hp(12)}
          >
            <XStack
              width={28}
              height={28}
              borderRadius={7}
              backgroundColor="rgba(249,223,123,0.25)"
              alignItems="center"
              justifyContent="center"
            >
              <Pen size={14} color="#B8860B" strokeWidth={2} />
            </XStack>
            <Text fontSize={fp(14)} fontWeight="600" color="#121217" flex={1}>Shoot Name</Text>
          </XStack>
          <YStack height={1} backgroundColor="#F9DF7B" />
          <YStack paddingHorizontal={wp(14)} paddingTop={hp(10)} paddingBottom={hp(12)}>
            <Text fontSize={fp(13)} color="#121217" fontWeight="600">{shootName}</Text>
          </YStack>
        </LinearGradient>
      )}

      {/* Shoot date & time */}
      <ShootDateTimeCard
        dates={shootDates}
        startTime={shootStartTime}
        onEdit={onEditShootSettings}
        hideEdit={hideEditShootDate}
      />

      {/* Address details */}
      <AddressDetailsCard
        address={addressData.address}
        city={addressData.city}
        state={addressData.state}
        pinCode={addressData.pinCode}
        onEdit={onEditAddress}
        isSelfPickup={isSelfPickup}
      />

      {/* Camocare */}
      <CamocareCard pricePerShoot={camocarePrice} />

      {/* Product Details */}
      <ProductDetailsSection
        products={productData}
        deliveryDate={deliveryDate}
        onAddMore={onAddMoreProducts}
      />

      {/* Crew Details */}
      <CrewDetailsSection
        crew={crewData}
        deliveryDate={deliveryDate}
        onAddMore={onAddMoreCrew}
      />
    </YStack>
  );
}
