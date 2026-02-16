import { apiClient } from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";
export interface PanRequestProps {
  pan: string;
  consent: string;
  reason: string;
}
export const useVerifyPAN = () => {
  return useMutation({
    mutationKey: ["pan"],
    mutationFn: async (panRequest: PanRequestProps) => {
      const res = await apiClient.post("/verifications/pan", panRequest);
      return res.data;
    },
  });
};
