import {
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Dimensions,
} from "react-native";
import { XStack, Stack } from "tamagui";
import { Image } from "expo-image";
import { ResumableZoom } from "react-native-zoom-toolkit";
import { X } from "lucide-react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { useRef, useEffect, useState } from "react";
import { wp, hp } from "@/utils/responsive";

interface ImageZoomModalProps {
  visible: boolean;
  onClose: () => void;
  images: string[];
  initialIndex: number;
  onIndexChange: (index: number) => void;
}

export function ImageZoomModal({
  visible,
  onClose,
  images,
  initialIndex,
  onIndexChange,
}: ImageZoomModalProps) {
  const modalCarouselRef = useRef<ICarouselInstance>(null);
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <Pressable style={styles.closeButton} onPress={onClose}>
          <X color="#121217" size={30} />
        </Pressable>

        <Carousel
          ref={modalCarouselRef}
          loop
          width={screenWidth}
          height={screenHeight}
          data={images}
          defaultIndex={initialIndex}
          onSnapToItem={(index) => {
            setCurrentIndex(index);
            onIndexChange(index);
          }}
          renderItem={({ item }) => (
            <ResumableZoom minScale={1} maxScale={6}>
              <Image
                source={{ uri: item }}
                contentFit="contain"
                style={{
                  width: wp(150),
                  height: hp(150),
                }}
              />
            </ResumableZoom>
          )}
        />

        <XStack
          position="absolute"
          bottom={50}
          left={0}
          right={0}
          justifyContent="center"
          alignItems="center"
          gap={wp(6)}
        >
          {images.map((_, index) => (
            <Stack
              key={index}
              width={wp(currentIndex === index ? 24 : 6)}
              height={hp(6)}
              borderRadius={wp(3)}
              backgroundColor={currentIndex === index ? "#121217" : "#d1d1db"}
              animation="quick"
            />
          ))}
        </XStack>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
});
