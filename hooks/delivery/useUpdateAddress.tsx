import { apiClient } from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";

interface UpdateAddressParams {
  address_id: string;
  addressData: {
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    pincode: string;
    type: "delivery" | "billing";
    is_default: boolean;
  };
}

export const useUpdateAddress = () => {
  return useMutation({
    mutationFn: async ({ address_id, addressData }: UpdateAddressParams) => {
      const res = await apiClient.put(
        `/users/me/addresses/${address_id}`,
        addressData
      );
      console.log("Update address response:");
      return res.data;
    },
  });
};
