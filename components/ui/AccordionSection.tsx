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
  interpolate,
} from "react-native-reanimated";
import { Minus, Plus } from "lucide-react-native";
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

const ANIMATION_DURATION = 220;
const EASING = Easing.out(Easing.cubic);

interface AccordionItemComponentProps {
  item: AccordionItem;
  isOpen: boolean;
  onToggle: () => void;
}

function AccordionItemComponent({
  item,
  isOpen,
  onToggle,
}: AccordionItemComponentProps) {
  const contentHeight = useSharedValue(0);
  const measuredHeight = useSharedValue(0);
  const [measured, setMeasured] = useState(false);

  const onContentLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const h = e.nativeEvent.layout.height;
      if (h > 0 && measuredHeight.value !== h) {
        measuredHeight.value = h;
        if (!measured) setMeasured(true);
        // If already open, update to real height
        if (isOpen) contentHeight.value = h;
      }
    },
    [measured, isOpen]
  );

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

  const animatedIconBg = useAnimatedStyle(() => {
    const bg = withTiming(isOpen ? 1 : 0, {
      duration: ANIMATION_DURATION,
      easing: EASING,
    });
    return {
      backgroundColor: bg === 1 ? "#8E0FFF" : "#F3F4F6",
    };
  }, [isOpen]);

  return (
    <View style={styles.itemContainer}>
      <Pressable
        onPress={onToggle}
        style={({ pressed }) => [styles.trigger, pressed && styles.triggerPressed]}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.itemTitle}>{item.title}</Text>
        </View>
        <Animated.View style={[styles.iconCircle, animatedIconBg]}>
          {isOpen ? (
            <Minus size={16} color="#FFFFFF" strokeWidth={2.5} />
          ) : (
            <Plus size={16} color="#6B7280" strokeWidth={2.5} />
          )}
        </Animated.View>
      </Pressable>

      <Animated.View style={animatedContainerStyle}>
        {/* Hidden measure view — renders off-screen to get natural height */}
        <View
          style={styles.contentMeasure}
          onLayout={onContentLayout}
          pointerEvents="none"
        >
          {typeof item.content === "string" ? (
            <Text style={styles.contentText}>{item.content}</Text>
          ) : (
            item.content
          )}
        </View>
        {/* Actual visible content */}
        <View style={styles.contentInner}>
          {typeof item.content === "string" ? (
            <Text style={styles.contentText}>{item.content}</Text>
          ) : (
            item.content
          )}
        </View>
      </Animated.View>
    </View>
  );
}

export function AccordionSection({
  title,
  items,
  type = "multiple",
}: AccordionSectionProps) {
  const insets = useSafeAreaInsets();
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
    <View
      style={[
        styles.root,
        { paddingBottom: insets.bottom },
      ]}
    >
      {title && <Text style={styles.sectionTitle}>{title}</Text>}

      <View style={styles.list}>
        {items.map((item) => (
          <AccordionItemComponent
            key={item.value}
            item={item}
            isOpen={openItems.has(item.value)}
            onToggle={() => toggle(item.value)}
          />
        ))}
      </View>
    </View>
  );
}

// ─── SpecificationList & BulletList (unchanged API, converted to plain RN) ────

interface SpecificationListProps {
  specs: { label: string; value: string; valueColor?: string }[];
}

export function SpecificationList({ specs }: SpecificationListProps) {
  return (
    <View style={specStyles.container}>
      {specs.map((spec, index) => (
        <View key={index} style={specStyles.row}>
          <Text style={specStyles.label}>{spec.label}:</Text>
          <Text
            style={[
              specStyles.value,
              spec.valueColor ? { color: spec.valueColor } : undefined,
            ]}
          >
            {spec.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

interface BulletListProps {
  items: string[];
  fontSize?: number;
}

export function BulletList({ items, fontSize = fp(14) }: BulletListProps) {
  return (
    <View style={bulletStyles.container}>
      {items.map((item, index) => (
        <Text
          key={index}
          style={[bulletStyles.item, { fontSize, lineHeight: fp(20) }]}
        >
          {"• "}{item}
        </Text>
      ))}
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    gap: hp(12),
    paddingHorizontal: wp(16),
    paddingTop: hp(16),
  },
  sectionTitle: {
    fontWeight: "700",
    color: "#121217",
    fontSize: fp(20),
    letterSpacing: -0.3,
    paddingBottom: hp(4),
  },
  list: {
    gap: hp(12),
  },
  itemContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: wp(12),
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    paddingVertical: hp(16),
    paddingHorizontal: wp(16),
    overflow: "hidden",
  },
  trigger: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: "100%",
  },
  triggerPressed: {
    opacity: 0.7,
  },
  titleContainer: {
    flex: 1,
    paddingRight: wp(12),
  },
  itemTitle: {
    fontWeight: "600",
    color: "#121217",
    fontSize: fp(15),
    lineHeight: fp(20),
    letterSpacing: -0.2,
    flexShrink: 1,
  },
  iconCircle: {
    width: wp(28),
    height: wp(28),
    borderRadius: wp(14),
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
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
    width: "100%",
  },
  contentText: {
    color: "#6B7280",
    lineHeight: fp(20),
    fontSize: fp(14),
    letterSpacing: -0.1,
    paddingRight: wp(40),
  },
});

const specStyles = StyleSheet.create({
  container: {
    gap: hp(12),
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: fp(14),
    color: "#6B7280",
    fontWeight: "500",
  },
  value: {
    fontSize: fp(14),
    color: "#121217",
    fontWeight: "600",
  },
});

const bulletStyles = StyleSheet.create({
  container: {
    gap: hp(8),
  },
  item: {
    color: "#6B7280",
  },
});
