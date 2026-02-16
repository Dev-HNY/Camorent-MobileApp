import { apiClient } from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";

export interface GstRequestProps {
  gstin: string;
}

export const useVerifyGST = () => {
  return useMutation({
    mutationKey: ["gst"],
    mutationFn: async (gstRequest: GstRequestProps) => {
      const res = await apiClient.post("/verifications/gstin", gstRequest);
      return res.data;
    },
  });
};
