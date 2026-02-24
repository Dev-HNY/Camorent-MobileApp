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
          colors={["#FFFBF0", "#FFF8E7", "#FFFFFF"]}
          locations={[0, 0.5, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 14,
            borderWidth: 1,
            borderColor: "#FFE08A",
            shadowColor: "#F59E0B",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <YStack padding={wp(16)} gap={hp(14)}>
            <XStack alignItems="center" gap={wp(8)}>
              <XStack
                width={32}
                height={32}
                borderRadius={8}
                backgroundColor="rgba(245, 158, 11, 0.12)"
                alignItems="center"
                justifyContent="center"
              >
                <Pen size={15} color="#D97706" strokeWidth={2} />
              </XStack>
              <Heading2 color="#1C1C1E">Shoot Name</Heading2>
            </XStack>
            <Separator borderColor="rgba(255, 218, 133, 0.5)" />
            <BodyText color="#1C1C1E">{shootName}</BodyText>
          </YStack>
        </LinearGradient>
      )}

      {/* Shoot date & time */}
      <ShootDateTimeCard
        dates={shootDates}
        startTime={shootStartTime}
        onEdit={onEditShootSettings}
      />

      {/* Address details */}
      <AddressDetailsCard
        address={addressData.address}
        city={addressData.city}
        state={addressData.state}
        pinCode={addressData.pinCode}
        onEdit={onEditAddress}
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
