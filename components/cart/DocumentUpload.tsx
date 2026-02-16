import React, { ReactNode, useState } from "react";
import {
  XStack,
  YStack,
  Text,
  useTheme,
  Dialog,
  Button as TamaguiButton,
} from "tamagui";
import { Button } from "@/components/ui/Button";
import { BodySmall, BodyText, Heading2 } from "@/components/ui/Typography";
import {
  Upload,
  Camera,
  Image as ImageIcon,
  FileText,
  X,
} from "lucide-react-native";
import { TouchableOpacity, Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { hp, wp } from "@/utils/responsive";

type DocumentStatus = "pending" | "uploaded" | "verified";

interface DocumentUploadProps {
  title: string;
  status: DocumentStatus;
  onUpload: () => void;
  icon: ReactNode;
}

interface UploadOptionButtonProps {
  icon: ReactNode;
  label: string;
  onPress: () => void;
}

function UploadOptionButton({ icon, label, onPress }: UploadOptionButtonProps) {
  return (
    <XStack
      onPress={onPress}
      backgroundColor="$background"
      borderRadius={wp(4)}
      borderWidth={1}
      borderColor="$gray6"
      justifyContent="flex-start"
      paddingHorizontal={wp(12)}
      paddingVertical={hp(4)}
      gap={wp(8)}
    >
      {icon}
      <BodySmall fontWeight={"500"} color={"#121217"}>
        {label}
      </BodySmall>
    </XStack>
  );
}

export function DocumentUpload({
  title,
  status,
  onUpload,
  icon,
}: DocumentUploadProps) {
  const theme = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleUpload = async () => {
    setDialogOpen(true);
  };

  const handleOptionSelect = (action: () => void) => {
    setDialogOpen(false);
    action();
  };

  const openCamera = async () => {
    try {
      console.log("Requesting camera permissions...");
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      console.log("Camera permission status:", status);

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Camera access is needed to take photos"
        );
        return;
      }

      console.log("Launching camera...");
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      console.log("Camera result:", result);
      if (!result.canceled) {
        onUpload();
      }
    } catch (error) {
      console.error("Camera error:", error);
      Alert.alert("Error", "Failed to open camera");
    }
  };

  const openGallery = async () => {
    try {
      console.log("Requesting media library permissions...");
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log("Media library permission status:", status);

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Gallery access is needed to select photos"
        );
        return;
      }

      console.log("Launching image library...");
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      console.log("Gallery result:", result);
      if (!result.canceled) {
        onUpload();
      }
    } catch (error) {
      console.error("Gallery error:", error);
      Alert.alert("Error", "Failed to open gallery");
    }
  };

  const openDocumentPicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        onUpload();
      }
    } catch {
      Alert.alert("Error", "Failed to pick document");
    }
  };

  const getBorderColor = () => {
    switch (status) {
      case "uploaded":
        return theme.green6.get();
      case "verified":
        return theme.green6.get();
      default:
        return "#D1D1DB";
    }
  };

  const getBackgroundColor = () => {
    switch (status) {
      case "uploaded":
        return theme.green2.get();
      case "verified":
        return theme.green2.get();
      default:
        return theme.background.get();
    }
  };

  return (
    <>
      <YStack gap="$3">
        <Heading2 fontWeight={"500"}>{title}</Heading2>
        <TouchableOpacity
          onPress={status === "pending" ? handleUpload : undefined}
        >
          <YStack
            paddingVertical={hp(32)}
            paddingHorizontal={wp(24)}
            borderRadius={wp(12)}
            borderWidth={1}
            borderStyle="dashed"
            borderColor={getBorderColor()}
            backgroundColor={getBackgroundColor()}
            alignItems="center"
            justifyContent="center"
            gap={hp(16)}
            opacity={status === "pending" ? 1 : 0.8}
          >
            <YStack
              width={wp(48)}
              height={hp(48)}
              borderRadius={wp(11)}
              backgroundColor="$gray3"
              alignItems="center"
              justifyContent="center"
            >
              {status === "pending" ? (
                <Upload size={24} color={theme.gray9.get()} />
              ) : (
                icon
              )}
            </YStack>

            {status === "pending" && (
              <YStack gap={hp(4)} alignItems="center">
                <BodyText textAlign="center">
                  Choose a file or drag & drop it here.
                </BodyText>
                <BodyText color="#6C6C89" textAlign="center">
                  JPG, PNG, PDF, and MP4 format, up to 50 MB.
                </BodyText>
              </YStack>
            )}
            {status === "uploaded" && (
              <BodyText color="$green9" textAlign="center">
                Document uploaded successfully
              </BodyText>
            )}
            {status === "verified" && (
              <BodyText color="$green9" textAlign="center">
                Document verified
              </BodyText>
            )}
          </YStack>
        </TouchableOpacity>
      </YStack>

      <Dialog modal open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay
            key="overlay"
            animation="quick"
            opacity={0.5}
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
            onPress={() => setDialogOpen(false)}
          />
          <Dialog.Content
            bordered
            elevate
            key="content"
            animateOnly={["transform", "opacity"]}
            animation={[
              "quick",
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}
            enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
            exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
            gap={wp(4)}
            padding={wp(12)}
            backgroundColor="$background"
            borderRadius={wp(12)}
            width="90%"
            maxWidth={400}
          >
            <Dialog.Title
              fontSize={16}
              fontWeight="600"
              color={"#121217"}
              lineHeight={hp(20)}
            >
              Select Upload Method
            </Dialog.Title>

            <Dialog.Description
              fontSize={14}
              fontWeight={"500"}
              color="#6C6C89"
              lineHeight={hp(16)}
            >
              Choose how you&apos;d like to upload your document
            </Dialog.Description>

            <YStack gap={hp(8)} marginTop={hp(12)}>
              <UploadOptionButton
                icon={<Camera size={20} color={theme.color.get()} />}
                label="Camera"
                onPress={() => handleOptionSelect(openCamera)}
              />

              <UploadOptionButton
                icon={<ImageIcon size={20} color={theme.color.get()} />}
                label="Gallery"
                onPress={() => handleOptionSelect(openGallery)}
              />

              <UploadOptionButton
                icon={<FileText size={20} color={theme.color.get()} />}
                label="Files"
                onPress={() => handleOptionSelect(openDocumentPicker)}
              />
            </YStack>

            <Dialog.Close asChild>
              <XStack
                marginTop="$2"
                backgroundColor="$gray4"
                borderWidth={0}
                borderRadius={wp(4)}
                padding={wp(6)}
                justifyContent="center"
              >
                <BodySmall
                  color={"#121217"}
                  fontWeight={"600"}
                  textAlign="center"
                >
                  Cancel
                </BodySmall>
              </XStack>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </>
  );
}
