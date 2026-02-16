import { Accordion, Text, YStack, XStack } from "tamagui";
import { Minus, Plus } from "lucide-react-native";
import { ReactNode } from "react";
import { BodySmall } from "./Typography";
import { hp, wp, fp } from "@/utils/responsive";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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

export function AccordionSection({
  title,
  items,
  type = "multiple",
}: AccordionSectionProps) {
  const insets = useSafeAreaInsets();
  return (
    <YStack gap={hp(12)} paddingHorizontal={wp(16)} paddingTop={hp(16)}>
      {title && (
        <Text
          fontWeight="700"
          color="#121217"
          fontSize={fp(20)}
          letterSpacing={-0.3}
          paddingBottom={hp(4)}
        >
          {title}
        </Text>
      )}

      <Accordion
        type={type}
        gap={hp(12)}
        paddingBottom={insets.bottom}
        animation="quick"
        backgroundColor="transparent"
      >
        {items.map((item) => (
          <Accordion.Item
            key={item.value}
            value={item.value}
            backgroundColor="#FFFFFF"
            borderRadius={wp(12)}
            borderWidth={1}
            borderColor="#E5E7EB"
            overflow="visible"
            gap={hp(0)}
            shadowColor="#000"
            shadowOffset={{ width: 0, height: 1 }}
            shadowOpacity={0.04}
            shadowRadius={4}
            elevation={2}
            paddingVertical={hp(16)}
            paddingHorizontal={wp(16)}
          >
            <Accordion.Header backgroundColor="transparent">
              <Accordion.Trigger
                padding={0}
                flexDirection="row"
                justifyContent="space-between"
                alignItems="flex-start"
                width="100%"
                borderColor="transparent"
                backgroundColor="transparent"
                pressStyle={{
                  backgroundColor: "transparent",
                  opacity: 0.7,
                }}
                animation="quick"
              >
                {({ open }: { open: boolean }) => (
                  <>
                    <YStack flex={1} paddingRight={wp(12)} flexShrink={1}>
                      <Text
                        fontWeight="600"
                        color="#121217"
                        fontSize={fp(15)}
                        lineHeight={fp(20)}
                        letterSpacing={-0.2}
                        flexWrap="wrap"
                        numberOfLines={undefined}
                      >
                        {item.title}
                      </Text>
                    </YStack>

                    <YStack
                      width={wp(28)}
                      height={wp(28)}
                      borderRadius={wp(14)}
                      backgroundColor={open ? "#8E0FFF" : "#F3F4F6"}
                      justifyContent="center"
                      alignItems="center"
                      flexShrink={0}
                      animation="quick"
                    >
                      {open ? (
                        <Minus size={16} color="#FFFFFF" strokeWidth={2.5} />
                      ) : (
                        <Plus size={16} color="#6B7280" strokeWidth={2.5} />
                      )}
                    </YStack>
                  </>
                )}
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content
              padding={0}
              paddingTop={hp(16)}
              animation="quick"
              backgroundColor="transparent"
              width="100%"
              flexShrink={1}
            >
              {typeof item.content === "string" ? (
                <YStack width="100%" flexShrink={1}>
                  <Text
                    color="#6B7280"
                    lineHeight={fp(20)}
                    fontSize={fp(14)}
                    letterSpacing={-0.1}
                    flexWrap="wrap"
                    numberOfLines={undefined}
                    paddingRight={wp(40)}
                  >
                    {item.content}
                  </Text>
                </YStack>
              ) : (
                item.content
              )}
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion>
    </YStack>
  );
}

interface SpecificationListProps {
  specs: { label: string; value: string; valueColor?: string }[];
}

export function SpecificationList({ specs }: SpecificationListProps) {
  return (
    <YStack gap={hp(12)}>
      {specs.map((spec, index) => (
        <XStack key={index} justifyContent="space-between" alignItems="center">
          <Text fontSize={fp(14)} color="#6B7280" fontWeight="500">{spec.label}:</Text>
          <Text fontSize={fp(14)} color={spec.valueColor || "#121217"} fontWeight="600">{spec.value}</Text>
        </XStack>
      ))}
    </YStack>
  );
}

interface BulletListProps {
  items: string[];
  fontSize?: any;
}

export function BulletList({ items, fontSize = fp(14) }: BulletListProps) {
  return (
    <YStack gap={hp(8)}>
      {items.map((item, index) => (
        <Text key={index} color="#6B7280" fontSize={fontSize} lineHeight={fp(20)}>
          • {item}
        </Text>
      ))}
    </YStack>
  );
}
