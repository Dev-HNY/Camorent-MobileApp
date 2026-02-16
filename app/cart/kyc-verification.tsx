import React, { useState } from "react";
import { YStack } from "tamagui";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { KYCUploadStep } from "@/components/kyc/KYCUploadStep";
import { KYCProcessingSheet } from "@/components/kyc/KYCProcessingSheet";
import {
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useAuthStore } from "@/store/auth/auth";

type DocumentStatus = "pending" | "uploaded" | "verified";

interface DocumentState {
  aadhar: DocumentStatus;
  pan: DocumentStatus;
  gst: DocumentStatus;
}

export default function KYCVerificationScreen() {
  const [showProcessingSheet, setShowProcessingSheet] = useState(false);
  const [documents, setDocuments] = useState<DocumentState>({
    aadhar: "pending",
    pan: "pending",
    gst: "pending",
  });

  const handleDocumentUpload = (docType: keyof DocumentState) => {
    setDocuments((prev) => ({
      ...prev,
      [docType]: "uploaded",
    }));
  };

  const handleSubmit = () => {
    const uploadedDocs = Object.values(documents).filter(
      (status) => status === "uploaded"
    );
    // if (uploadedDocs.length < 2) {
    //   Alert.alert(
    //     "Upload Required",
    //     "Please upload at least two documents to continue"
    //   );
    //   return;
    // }

    // Note: KYC status is now managed by the backend via kyc_status field
    setShowProcessingSheet(true);
  };

  const handleContinueToCrew = () => {
    setShowProcessingSheet(false);
    router.push("/checkout/crew");
  };

  const handleCloseProcessingSheet = () => {
    setShowProcessingSheet(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <YStack flex={1}>
            <KYCUploadStep
              documents={documents}
              onDocumentUpload={handleDocumentUpload}
              onSubmit={handleSubmit}
            />
          </YStack>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <KYCProcessingSheet
        isOpen={showProcessingSheet}
        onClose={handleCloseProcessingSheet}
        onContinueToCrew={handleContinueToCrew}
      />
    </SafeAreaView>
  );
}
