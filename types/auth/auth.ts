export interface User {
  user_id: string;
  phone_number: string;
  email: string;
  first_name: string;
  last_name: string;
  profession: string;
  user_type: string;
  org_name: string;
  GSTIN_no: string;
  PAN_no: string;
  role: string;
  account_status: string;
  kyc_status: string;
  user_trust: string;
  user_category: string;
  created_at: string;
  updated_at: string;
}
export interface OtpRequest {
  phoneNumber: string;
}

export interface OtpResponse {
  success: boolean;
  message: string;
  expires_in: string;
}

export interface VerifyOtpRequest {
  phoneNumber: string;
  otpCode: string;
}

export interface VerifiedElementUserResponse {
  id: string;
  first_name?: string;
  last_name?: string;
  phone: string;
  email?: string;
  role: string;
  kyc_status: string;
  account_status: string;
}

export interface VerifyOtpResponse {
  token: string;
  user: VerifiedElementUserResponse;
}

export interface TokenResponse {
  id_token: string;
  refresh_token: string;
  token_type: string;
}

/**
 * User profile data returned by GET /auth/me and PUT /users/me
 */
export interface UserProfile {
  user_id: string;
  phone_number: string;
  email: string;
  first_name: string;
  last_name: string;
  profession: string;
  user_type: string;
  org_name: string;
  GSTIN_no: string;
  PAN_no: string;
  role: string;
  account_status: string;
  kyc_status: string;
  user_trust: string;
  user_category: string;
  created_at: string;
  updated_at: string;
}

/**
 * Request payload for PUT /users/me
 */
export interface UpdateUserProfileRequest {
  first_name: string;
  last_name?: string;
  email?: string;
  profession?: string;
  user_type?: string;
  org_name?: string;
  GSTIN_no?: string;
  PAN_no?: string;
}
