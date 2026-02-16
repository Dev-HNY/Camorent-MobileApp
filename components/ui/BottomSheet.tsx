import { Sheet } from "tamagui";
import { ReactNode } from "react";
import { wp } from "@/utils/responsive";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  snapPointsMode?: "percent" | "constant";
  snapPoints?: number[];
}

export function BottomSheet({
  isOpen,
  onClose,
  children,
  snapPointsMode = "percent",
  snapPoints = [25, 50, 75, 100],
}: BottomSheetProps) {
  return (
    <Sheet
      modal
      open={isOpen}
      onOpenChange={onClose}
      snapPoints={snapPoints}
      dismissOnSnapToBottom
      snapPointsMode={snapPointsMode}
      moveOnKeyboardChange
      animation="quick"
      zIndex={100000}
      animationConfig={{
        type: "spring",
        damping: 25,
        stiffness: 300,
      }}
    >
      <Sheet.Overlay
        backgroundColor="rgba(0,0,0,0.5)"
        animation="quick"
        opacity={1}
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
        zIndex={100000}
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
      />
      <Sheet.Handle backgroundColor="#D1D1D6" width={wp(36)} height={5} />
      <Sheet.Frame
        backgroundColor="#FFFFFF"
        borderTopRightRadius={wp(24)}
        borderTopLeftRadius={wp(24)}
        shadowColor="#000"
        shadowOffset={{ width: 0, height: -2 }}
        shadowOpacity={0.06}
        shadowRadius={8}
        elevation={4}
        zIndex={100001}
      >
        {children}
      </Sheet.Frame>
    </Sheet>
  );
}
