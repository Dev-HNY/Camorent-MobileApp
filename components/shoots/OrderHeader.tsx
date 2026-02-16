import { XStack } from "tamagui";
import { ArrowLeft } from "lucide-react-native";
import { router } from "expo-router";
import { Heading2 } from "@/components/ui/Typography";
import { wp, hp } from "@/utils/responsive";

interface OrderHeaderProps {
  title: string;
  onBack?: () => void;
}

export function OrderHeader({ title, onBack }: OrderHeaderProps) {
  const handleBack = onBack || (() => router.back());

  return (
    <XStack
      alignItems="center"
      paddingHorizontal={wp(16)}
      paddingTop={hp(12)}
      gap={wp(88)}
    >
      <XStack
        borderRadius={28}
        borderWidth={1}
        padding={"$2"}
        borderColor={"$gray7"}
        onPress={handleBack}
      >
        <ArrowLeft size={18} />
      </XStack>
      <Heading2>{title}</Heading2>
    </XStack>
  );
}
