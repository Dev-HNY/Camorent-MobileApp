import { Heading2 } from "@/components/ui/Typography";
import { SafeAreaView } from "react-native-safe-area-context";
import { XStack, YStack, Text } from "tamagui";
import { AccordionSection } from "@/components/ui/AccordionSection";
import { ArrowLeft } from "lucide-react-native";
import { useState } from "react";
import { router } from "expo-router";
import { hp, wp } from "@/utils/responsive";
import { Checkbox } from "@/components/ui/Checkbox";
import { BottomSheetButton } from "@/components/ui/BottomSheetButton";

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  value?: boolean;
  onToggle: (checked: boolean) => void;
  showToggle?: boolean;
  rightContent?: React.ReactNode;
}

export default function SettingScreen() {
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(false);

  const notificationItems: SettingItem[] = [
    {
      id: "email",
      title: "Email notifications",
      subtitle: "Receive updates about your rentals",
      value: emailNotifications,
      onToggle: setEmailNotifications,
      showToggle: true,
    },
    {
      id: "sms",
      title: "SMS notifications",
      subtitle: "Get text update for urgent matters",
      value: smsNotifications,
      onToggle: setSmsNotifications,
      showToggle: true,
    },
    {
      id: "marketing",
      title: "Marketing emails",
      subtitle: "Receive deals and new equipment updates",
      value: marketingEmails,
      onToggle: setMarketingEmails,
      showToggle: true,
    },
  ];

  const kycItems: SettingItem[] = [
    {
      id: "aadhar",
      title: "Aadhar verified",
      subtitle: "Aadhar card uploaded",
      value: true,
      onToggle: () => {},
      showToggle: true,
    },
    {
      id: "gst",
      title: "GST verified",
      subtitle: "GST bill uploaded",
      value: true,
      onToggle: () => {},
      showToggle: true,
    },
    {
      id: "pan",
      title: "PAN verified",
      subtitle: "upload PAN card",
      value: false,
      onToggle: () => {},
      showToggle: true,
    },
  ];

  function SettingItemComponent({ item }: { item: SettingItem }) {
    return (
      <XStack
        padding={wp(4)}
        justifyContent="space-between"
        alignItems="center"
        gap={wp(12)}
      >
        {item.showToggle ? (
          <Checkbox checked={!item.value} onCheckedChange={item.onToggle} />
        ) : (
          item.rightContent
        )}
        <YStack flex={1}>
          <Text fontSize="$4" fontWeight="500">
            {item.title}
          </Text>
          {item.subtitle && (
            <Text fontSize="$3" color="$gray10" marginTop="$1">
              {item.subtitle}
            </Text>
          )}
        </YStack>
      </XStack>
    );
  }

  const accordionItems = [
    {
      value: "notifications",
      title: "Notification and preferences",
      content: (
        <YStack>
          {notificationItems.map((item) => (
            <SettingItemComponent key={item.id} item={item} />
          ))}
        </YStack>
      ),
    },
    // {
    //   value: "kyc",
    //   title: "KYC verified",
    //   content: (
    //     <YStack>
    //       {kycItems.map((item) => (
    //         <SettingItemComponent key={item.id} item={item} />
    //       ))}
    //     </YStack>
    //   ),
    // },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <YStack flex={1} paddingBottom={hp(60)}>
        <XStack
          //  justifyContent="space-between"
          alignItems="center"
          paddingHorizontal={wp(16)}
          paddingTop={hp(12)}
          gap={wp(104)}
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
          <Heading2>Settings</Heading2>
        </XStack>

        <YStack paddingVertical={hp(16)} gap={hp(12)} flex={1}>
          <YStack>
            <AccordionSection items={accordionItems} type="multiple" />
          </YStack>
        </YStack>
        <XStack paddingHorizontal={wp(16)}>
          <BottomSheetButton width="100%" variant="primary" size="lg">
            Update
          </BottomSheetButton>
        </XStack>
      </YStack>
    </SafeAreaView>
  );
}
