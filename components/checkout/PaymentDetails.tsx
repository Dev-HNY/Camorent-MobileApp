import React from "react";
import { YStack, XStack, Separator } from "tamagui";
import { LinearGradient } from "expo-linear-gradient";
import { Pen } from "lucide-react-native";
import { BodyText, Heading2 } from "@/components/ui/Typography";
import { ShootDateTimeCard } from "@/components/checkout/ShootDateTimeCard";
import { AddressDetailsCard } from "@/components/checkout/AddressDetailsCard";
import { CamocareCard } from "@/components/checkout/CamocareCard";
import { ProductDetailsSection } from "@/components/checkout/ProductDetailsSection";
import { CrewDetailsSection } from "@/components/checkout/CrewDetailsSection";
import { hp, wp } from "@/utils/responsive";

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
          colors={["#FFF9EB", "#FFFFFF"]}
          locations={[0, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#FFDA85",
          }}
        >
          <YStack padding={wp(16)} borderRadius={wp(12)} gap={hp(12)}>
            <XStack alignItems="center" gap={wp(8)}>
              <Pen size={wp(18)} color="#6C6C70" strokeWidth={2} />
              <Heading2 color="#1C1C1E">Shoot Name</Heading2>
            </XStack>
            <Separator borderColor={"#FFDA85"} />
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
