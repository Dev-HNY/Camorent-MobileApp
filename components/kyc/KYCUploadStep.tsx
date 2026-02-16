import React, { useState } from "react";
import { YStack, Text, ScrollView, XStack, Input, useTheme } from "tamagui";
import { BodySmall, BodyText, Heading2 } from "@/components/ui/Typography";
import { DocumentUpload } from "@/components/cart/DocumentUpload";
import { CheckCircle, Upload } from "lucide-react-native";
import { TouchableOpacity } from "react-native";
import { BackButton } from "../ui/BackButton";
import { fp, wp } from "@/utils/responsive";
import { BottomSheetButton } from "../ui/BottomSheetButton";

type DocumentStatus = "pending" | "uploaded" | "verified";

interface DocumentState {
  aadhar: DocumentStatus;
  pan: DocumentStatus;
  gst: DocumentStatus;
}

type DocumentType = "aadhar" | "pan" | "gst";

interface KYCUploadStepProps {
  documents: DocumentState;
  onDocumentUpload: (docType: keyof DocumentState) => void;
  onSubmit: () => void;
}

export function KYCUploadStep({
  documents,
  onDocumentUpload,
  onSubmit,
}: KYCUploadStepProps) {
  const theme = useTheme();
  const [selectedDocuments, setSelectedDocuments] = useState<DocumentType[]>(
    []
  );
  const [socialId, setSocialId] = useState("");

  const toggleDocumentSelection = (docType: DocumentType) => {
    setSelectedDocuments((prev) => {
      if (prev.includes(docType)) {
        return prev.filter((d) => d !== docType);
      }
      if (prev.length < 3) {
        return [...prev, docType];
      }
      return prev;
    });
  };

  const renderStatusIcon = (status: DocumentStatus) => {
    switch (status) {
      case "uploaded":
      case "verified":
        return <CheckCircle size={20} color={theme.green9.get()} />;
      default:
        return <Upload size={20} color={theme.gray8.get()} />;
    }
  };

  const RadioButton = ({ selected }: { selected: boolean }) => (
    <YStack
      width={20}
      height={20}
      borderRadius={10}
      borderWidth={2}
      borderColor={selected ? "$primary" : "$gray8"}
      alignItems="center"
      justifyContent="center"
    >
      {selected && (
        <YStack
          width={10}
          height={10}
          borderRadius={5}
          backgroundColor="$primary"
        />
      )}
    </YStack>
  );

  const DocumentOption = ({
    type,
    label,
  }: {
    type: DocumentType;
    label: string;
  }) => (
    <TouchableOpacity onPress={() => toggleDocumentSelection(type)}>
      <XStack gap={wp(8)} alignItems="center">
        <RadioButton selected={selectedDocuments.includes(type)} />
        <BodySmall fontSize={fp(12)} fontWeight={"500"} color={"#121217"}>
          {label}
        </BodySmall>
      </XStack>
    </TouchableOpacity>
  );

  return (
    <YStack flex={1} paddingHorizontal={wp(16)} gap={"$5"}>
      <XStack>
        <BackButton />
      </XStack>
      <YStack gap="$2">
        <Heading2>Proof of Identity</Heading2>
        <BodyText color={"#6C6C89"}>
          In order to complete your registration{"\n"}
          Please upload a copy of your any two identity proof.
        </BodyText>
      </YStack>

      <ScrollView
        flex={1}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <YStack gap="$4">
          <YStack gap="$3">
            <BodyText fontWeight="500" color="#121217">
              Choose any two identity type
            </BodyText>
            <XStack gap={wp(12)}>
              <DocumentOption type="aadhar" label="Aadhar card" />
              <DocumentOption type="pan" label="PAN card" />
              <DocumentOption type="gst" label="GST Certificate" />
            </XStack>
          </YStack>

          {selectedDocuments.includes("aadhar") && (
            <DocumentUpload
              title="Upload Aadhar card"
              status={documents.aadhar}
              onUpload={() => onDocumentUpload("aadhar")}
              icon={renderStatusIcon(documents.aadhar)}
            />
          )}

          {selectedDocuments.includes("gst") && (
            <DocumentUpload
              title="Upload GST Certificate"
              status={documents.gst}
              onUpload={() => onDocumentUpload("gst")}
              icon={renderStatusIcon(documents.gst)}
            />
          )}

          {selectedDocuments.includes("pan") && (
            <DocumentUpload
              title="Upload PAN card"
              status={documents.pan}
              onUpload={() => onDocumentUpload("pan")}
              icon={renderStatusIcon(documents.pan)}
            />
          )}

          <YStack gap="$2">
            <Text fontSize={14} fontWeight="600" color="$color">
              Instagram/Linkedin ID
            </Text>
            <Input
              placeholder="Placeholder"
              value={socialId}
              onChangeText={setSocialId}
              height={48}
              fontSize={14}
              borderWidth={1}
              borderColor="$gray6"
              borderRadius="$3"
              backgroundColor="$background"
            />
          </YStack>
        </YStack>
      </ScrollView>

      <YStack>
        <BottomSheetButton
          variant="primary"
          onPress={onSubmit}
          disabled={selectedDocuments.length < 2}
          opacity={selectedDocuments.length < 2 ? 0.6 : 1}
        >
          Proceed
        </BottomSheetButton>
      </YStack>
    </YStack>
  );
}
