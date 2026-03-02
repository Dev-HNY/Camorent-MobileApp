import React, { useState, useCallback, ReactNode } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  LayoutChangeEvent,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import { hp, wp, fp } from "@/utils/responsive";

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

const ANIMATION_DURATION = 220;
const EASING = Easing.out(Easing.cubic);

interface MiniAccordionItemProps {
  item: AccordionItem;
  isOpen: boolean;
  onToggle: () => void;
}

function MiniAccordionItem({ item, isOpen, onToggle }: MiniAccordionItemProps) {
  const measuredHeight = useSharedValue(0);

  const onContentLayout = useCallback((e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    if (h > 0) measuredHeight.value = h;
  }, []);

  const animatedContainerStyle = useAnimatedStyle(() => {
    const targetHeight = isOpen ? measuredHeight.value : 0;
    return {
      height: withTiming(targetHeight, {
        duration: ANIMATION_DURATION,
        easing: EASING,
      }),
      overflow: "hidden",
    };
  }, [isOpen]);

  return (
    <View style={styles.itemContainer}>
      <Pressable
        onPress={onToggle}
        style={({ pressed }) => [styles.trigger, pressed && styles.triggerPressed]}
      >
        <Text style={styles.itemTitle}>{item.title}</Text>
        {isOpen ? (
          <ChevronUp size={wp(16)} color="#6B7280" />
        ) : (
          <ChevronDown size={wp(16)} color="#6B7280" />
        )}
      </Pressable>

      <Animated.View style={animatedContainerStyle}>
        {/* Hidden measure view */}
        <View
          style={styles.contentMeasure}
          onLayout={onContentLayout}
          pointerEvents="none"
        >
          {item.content}
        </View>
        {/* Visible content */}
        <View style={styles.contentInner}>{item.content}</View>
      </Animated.View>
    </View>
  );
}

export function AccordionSectionMini({
  items,
  type = "multiple",
}: AccordionSectionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggle = useCallback(
    (value: string) => {
      setOpenItems((prev) => {
        const next = new Set(prev);
        if (next.has(value)) {
          next.delete(value);
        } else {
          if (type === "single") next.clear();
          next.add(value);
        }
        return next;
      });
    },
    [type]
  );

  return (
    <View style={styles.root}>
      {items.map((item) => (
        <MiniAccordionItem
          key={item.value}
          item={item}
          isOpen={openItems.has(item.value)}
          onToggle={() => toggle(item.value)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: hp(8),
  },
  itemContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: wp(12),
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: hp(16),
    paddingHorizontal: wp(16),
    overflow: "hidden",
  },
  trigger: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  triggerPressed: {
    opacity: 0.7,
  },
  itemTitle: {
    color: "#121217",
    flex: 1,
    fontWeight: "600",
    fontSize: fp(15),
  },
  contentMeasure: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    opacity: 0,
  },
  contentInner: {
    paddingTop: hp(16),
  },
});
