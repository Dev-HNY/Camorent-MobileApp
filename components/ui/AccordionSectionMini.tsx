import { Accordion, Text, YStack, XStack } from "tamagui";
import { ChevronDown, ChevronUp, Minus, Plus } from "lucide-react-native";
import { ReactNode } from "react";
import { BodySmall, BodyText } from "./Typography";
import { hp, wp } from "@/utils/responsive";

export interface AccordionItem {
  value: string;
  title: string;
  content: ReactNode;
  showBorder?: boolean;
}

interface AccordionSectionProps {
  title?: string;
  items: AccordionItem[];
  type?: "single" | "multiple";
  backgroundColor?: string;
  borderRadius?: string;
}

export function AccordionSectionMini({
  title,
  items,
  type = "multiple",
}: AccordionSectionProps) {
  return (
    <YStack gap={hp(8)}>
      <Accordion type={type} gap={hp(8)}>
        {items.map((item, index) => (
          <Accordion.Item
            key={item.value}
            value={item.value}
            backgroundColor="#FFFFFF"
            overflow="hidden"
            borderRadius={wp(12)}
            borderWidth={1}
            borderColor="#E5E7EB"
            paddingVertical={hp(16)}
            paddingHorizontal={wp(16)}
          >
            <Accordion.Header backgroundColor="transparent">
              <Accordion.Trigger
                backgroundColor="transparent"
                pressStyle={{ backgroundColor: "transparent", opacity: 0.7 }}
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                width="100%"
                borderColor="transparent"
                padding={0}
              >
                {({ open }: { open: boolean }) => (
                  <>
                    <Text color="#121217" flex={1} fontWeight="600" fontSize={hp(15)}>
                      {item.title}
                    </Text>

                    {open ? (
                      <ChevronUp size={wp(16)} color="#6B7280" />
                    ) : (
                      <ChevronDown size={wp(16)} color="#6B7280" />
                    )}
                  </>
                )}
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content
              padding={0}
              paddingTop={hp(16)}
              backgroundColor="transparent"
              borderTopWidth={0}
            >
              {item.content}
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion>
    </YStack>
  );
}
