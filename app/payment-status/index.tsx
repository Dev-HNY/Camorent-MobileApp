import { useLocalSearchParams, router } from "expo-router";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { Spinner } from "tamagui";

export default function PaymentStatusRedirect() {
  const { status, payment_id, booking_id } = useLocalSearchParams<{
    status: string;
    payment_id: string;
    booking_id: string;
  }>();

  useEffect(() => {
    if (status === "success") {
      router.replace({
        pathname: "/checkout/payment/payment-success",
        params: { payment_id, booking_id },
      });
    } else {
      router.replace("/checkout/payment/payment-failure");
    }
  }, [status, payment_id, booking_id]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Spinner color={"#8E0FFF"} />
    </View>
  );
}
