export interface PaymentPayloadProps {
  payment_method: string;
  payment_type: string;
}

export interface CreateTransactionParams {
  paymentPayload: PaymentPayloadProps;
  booking_id: string | null;
}

export interface PaymentResponse {
  payment_link?: string;
}
