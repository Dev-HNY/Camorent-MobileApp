import { fp, wp } from "@/utils/responsive";
import {
  AccordionSectionMini,
  AccordionItem,
} from "../ui/AccordionSectionMini";
import { View, Text } from "react-native";
import React from "react";
import { capitalizeFirst } from "@/utils/format";

interface AccordionSpecificationProps {
  description: string;
  specifications: Record<string, string[]>;
}

export default function AccordionSpecification({
  description,
  specifications,
}: AccordionSpecificationProps) {
  const descriptionContent = (
    <View style={{ gap: wp(8) }}>
      {description.split(",").map((item, index) => (
        <View key={index} style={{ flexDirection: "row", gap: wp(4), alignItems: "flex-start" }}>
          <Text style={{ color: "#6B7280", fontSize: fp(14) }}>{"•"}</Text>
          <Text style={{ color: "#6B7280", fontSize: fp(14), lineHeight: fp(20), flex: 1 }}>
            {capitalizeFirst(item.trim())}
          </Text>
        </View>
      ))}
    </View>
  );

  const specificationContent = (
    <View style={{ gap: wp(12) }}>
      {Object.entries(specifications).map(([key, value]) => {
        const values = value.map((v) => v.trim()).filter(Boolean);
        return (
          <View key={key} style={{ gap: wp(6) }}>
            <Text style={{ fontWeight: "600", fontSize: fp(14), color: "#121217" }}>
              {key}:
            </Text>
            {values.map((item, index) => (
              <View key={index} style={{ flexDirection: "row", gap: wp(4), alignItems: "flex-start" }}>
                <Text style={{ color: "#6B7280", fontSize: fp(14) }}>{"•"}</Text>
                <Text style={{ color: "#6B7280", fontSize: fp(14), lineHeight: fp(20), flex: 1 }}>
                  {capitalizeFirst(item.trim())}
                </Text>
              </View>
            ))}
          </View>
        );
      })}
    </View>
  );

  const specificationItems: AccordionItem[] = [
    {
      value: "Product Description",
      title: "Product Description",
      content: descriptionContent,
    },
    {
      value: "Product Specification",
      title: "Product Specification",
      content: specificationContent,
    },
  ];

  return <AccordionSectionMini items={specificationItems} type="multiple" />;
}
