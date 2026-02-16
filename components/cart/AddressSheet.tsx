import { hp, wp, fp } from "@/utils/responsive";
import { BottomSheet } from "../ui/BottomSheet";
import { Card, Spinner, Text, XStack, YStack } from "tamagui";
import { BodySmall, Heading2 } from "../ui/Typography";
import { ChevronRight, MapPin, Plus } from "lucide-react-native";
import { useGetMyAddresses } from "@/hooks/delivery/useGetMyAddresses";
import { ScrollView, TouchableOpacity } from "react-native";
import { useCartStore } from "@/store/cart/cart";

interface AddressSheetProps {
  isOpen: boolean;
  onClose: () => void;
  handleAddNewAddress: () => void;
}

export function AddressSheet({
  isOpen,
  onClose,
  handleAddNewAddress,
}: AddressSheetProps) {
  const { data: addresses, isLoading } = useGetMyAddresses();
  const { setSelectedAddress, clearDraftAddress } = useCartStore();

  const handleSelectAddress = (address: any) => {
    // Set the selected address in zustand
    setSelectedAddress({
      address_id: address.address_id,
      address_line1: address.address_line1,
      address_line2: address.address_line2 || "",
      city: address.city,
      state: address.state,
      pincode: address.pincode || "",
      full_name: "", // These would need to come from address or user data
      mobile_number: "",
      is_self_pickup: false,
    });

    // Clear draft address
    clearDraftAddress();

    // Close sheet
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} snapPoints={[70]}>
      <YStack
        flex={1}
        gap={hp(16)}
        paddingHorizontal={wp(16)}
        paddingVertical={hp(24)}
      >
        <Heading2>Choose Address</Heading2>

        {/* Add New Address Button */}
        <TouchableOpacity onPress={handleAddNewAddress} activeOpacity={0.7}>
          <Card
            backgroundColor="white"
            borderRadius={wp(12)}
            padding={wp(16)}
            borderWidth={1.5}
            borderColor="#E8E8ED"
          >
            <XStack gap={wp(12)} alignItems="center">
              <Plus size={wp(20)} color={"#A9A9BC"} />
              <BodySmall fontWeight="600" color="#121217">
                Add New Address
              </BodySmall>
              <XStack flex={1} />
              <ChevronRight size={wp(20)} color={"#A9A9BC"} />
            </XStack>
          </Card>
        </TouchableOpacity>

        {/* Saved Addresses Section */}
        {isLoading ? (
          <YStack alignItems="center" paddingVertical={hp(24)}>
            <Spinner color="#8E0FFF" />
          </YStack>
        ) : addresses && addresses.length > 0 ? (
          <YStack gap={hp(12)} flex={1}>
            <YStack gap={hp(4)}>
              <Heading2>Saved Addresses</Heading2>
              <BodySmall color="#6C6C89">
                Choose from your saved addresses
              </BodySmall>
            </YStack>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: hp(40) }}
            >
              <YStack gap={hp(12)}>
                {addresses.map((address: any) => (
                  <TouchableOpacity
                    key={address.address_id}
                    onPress={() => handleSelectAddress(address)}
                    activeOpacity={0.7}
                  >
                    <Card
                      backgroundColor="white"
                      borderRadius={wp(12)}
                      padding={wp(12)}
                      borderWidth={1.5}
                      borderColor="#E8E8ED"
                    >
                      <XStack gap={wp(12)} alignItems="flex-start">
                        <MapPin size={wp(18)} color="#A9A9BC" />
                        <YStack flex={1} gap={hp(4)}>
                          <Text
                            fontSize={fp(15)}
                            fontWeight="600"
                            color="#121217"
                            lineHeight={hp(20)}
                          >
                            {address.address_line1}
                          </Text>
                          {address.address_line2 && (
                            <Text
                              fontSize={fp(14)}
                              color="#6C6C89"
                              lineHeight={hp(18)}
                            >
                              {address.address_line2}
                            </Text>
                          )}
                          <Text
                            fontSize={fp(14)}
                            color="#6C6C89"
                            lineHeight={hp(18)}
                          >
                            {address.city}
                            {address.state && `, ${address.state}`}
                            {address.pincode && ` - ${address.pincode}`}
                          </Text>
                        </YStack>
                        <ChevronRight size={wp(20)} color={"#A9A9BC"} />
                      </XStack>
                    </Card>
                  </TouchableOpacity>
                ))}
              </YStack>
            </ScrollView>
          </YStack>
        ) : (
          <YStack alignItems="center" paddingVertical={hp(24)}>
            <BodySmall color="#6C6C89">No saved addresses yet</BodySmall>
          </YStack>
        )}
      </YStack>
    </BottomSheet>
  );
}
