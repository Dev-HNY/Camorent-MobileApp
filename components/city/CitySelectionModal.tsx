import { Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CitySelectionContent } from "./CitySelectionContent";

interface CitySelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCitySelect?: (city: string) => void;
  mode?: "onboarding" | "change"; // Different modes for different use cases
  title?: string;
}

export function CitySelectionModal({
  isOpen,
  onClose,
  onCitySelect,
  mode = "change",
  title,
}: CitySelectionModalProps) {
  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
        <CitySelectionContent
          onCitySelect={onCitySelect}
          onClose={onClose}
          mode={mode}
          title={title}
          showCloseButton={true}
          showContinueButton={mode === "onboarding"}
        />
      </SafeAreaView>
    </Modal>
  );
}
