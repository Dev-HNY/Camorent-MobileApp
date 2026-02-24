import { apiClient } from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";

interface AddAddressPayload {
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string;
  type: string;
  is_default: boolean;
}

export const useAddMyAddress = () => {
  return useMutation({
    mutationFn: async (addressData: AddAddressPayload) => {
      const res = await apiClient.post("/users/me/addresses", addressData);
      return res.data;
    },
  });
};
