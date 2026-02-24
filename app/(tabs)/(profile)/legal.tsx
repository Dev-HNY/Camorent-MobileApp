import { SafeAreaView } from "react-native-safe-area-context";
import { XStack, YStack, Text, ScrollView } from "tamagui";
import { ChevronLeft } from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";
import { hp, wp, fp } from "@/utils/responsive";
import { Pressable, View } from "react-native";
import * as Haptics from "expo-haptics";

// ── Content ───────────────────────────────────────────────────────────────────

const PRIVACY_SECTIONS = [
  {
    title: "1. Introduction",
    body: `Camorent ("we", "our", or "us") operates the Camorent mobile application, a platform for renting professional camera equipment across India. This Privacy Policy explains how we collect, use, store, share, and protect your personal information.\n\nBy using the App, you agree to the collection and use of information as described in this policy.`,
  },
  {
    title: "2. Information We Collect",
    body: "We collect information you provide directly: identity (name), contact details (phone, email), professional details, tax & business information (PAN, GSTIN), KYC documents, delivery addresses, and payment details processed via Razorpay (we never store raw card data).\n\nWe also collect device info, usage data, preferred city, and authentication tokens stored securely on your device.",
  },
  {
    title: "3. Permissions We Request",
    body: "• Camera — Photograph documents for KYC verification\n• Storage — Select and upload documents from your device\n• SMS — Auto-read OTP for phone number verification\n\nWe only request permissions necessary for core functionality.",
  },
  {
    title: "4. How We Use Your Information",
    body: "We use your information to create and manage your account, process bookings, complete payments, verify KYC, communicate booking updates, improve our platform, maintain legal compliance, and prevent fraud.\n\nWe do not use your information for advertising to third parties.",
  },
  {
    title: "5. How We Share Your Information",
    body: "We share data only with:\n• Amazon Web Services (AWS) — Cloud hosting & authentication\n• Razorpay — Payment processing\n• Crew Partners — Equipment delivery\n\nAll providers are contractually bound to protect your data. We do not sell your personal data.",
  },
  {
    title: "6. Data Retention",
    body: "Account information is retained until account deletion plus 7 years for tax compliance. Booking and transaction records are kept for 7 years as required under Indian GST law. Authentication tokens are cleared on logout.",
  },
  {
    title: "7. Data Security",
    body: "We implement HTTPS/TLS encryption in transit, encrypted MMKV storage on-device, AWS security with access controls, and encryption at rest. Payment card data is handled entirely by Razorpay — we never store raw card numbers.",
  },
  {
    title: "8. Your Rights",
    body: "Under the IT Act 2000 and DPDP Act 2023, you have the right to access, correct, and request deletion of your personal data. To exercise your rights, contact us at support@camorent.co.in or through the Help Centre in the App.",
  },
  {
    title: "9. Children's Privacy",
    body: "Our App is intended for users aged 18 years and above. We do not knowingly collect information from minors.",
  },
  {
    title: "10. Contact & Grievance Officer",
    body: "Grievance Officer: Hemant Yadav\nEmail: hemant@camorent.co.in\nResponse time: Within 30 days\n\nGeneral support: support@camorent.co.in\nWebsite: www.camorent.com\nAddress: New Delhi, India",
  },
];

const TERMS_SECTIONS = [
  {
    title: "1. About These Terms",
    body: "These Terms and Conditions govern your use of the Camorent mobile application. By creating an account or using the App, you agree to be legally bound by these Terms.\n\nEffective Date: 17 February 2026",
  },
  {
    title: "2. Eligibility",
    body: "To use the App, you must be at least 18 years of age, a resident of or operating in India, hold a valid Indian phone number, and have the legal capacity to enter into a binding agreement.",
  },
  {
    title: "3. Account Registration",
    body: "You may register using your mobile phone number via OTP verification. You are responsible for maintaining account confidentiality and all activities under your account.\n\nKYC verification (PAN/GSTIN) may be required before placing orders. Providing false information is a breach of these Terms.",
  },
  {
    title: "4. Equipment Rental",
    body: "Each booking constitutes a rental agreement. You agree to rent equipment for the specified dates only, pay applicable charges and security deposit, and return equipment in the same condition.\n\nReport any pre-existing damage within 2 hours of delivery.",
  },
  {
    title: "5. Pricing and Payments",
    body: "All prices are in Indian Rupees (INR). A refundable security deposit is collected at booking and refunded within 7 business days after satisfactory return.\n\nPayments are processed via Razorpay. A GST-compliant invoice is generated for each booking.",
  },
  {
    title: "6. Cancellation & Refund Policy",
    body: "• More than 48 hours before start: Full refund\n• 24–48 hours before start: 50% rental fee refunded; security deposit refunded\n• Less than 24 hours before start: No refund on rental fee; security deposit refunded\n\nIf Camorent cancels, you receive a full refund within 5–7 business days.",
  },
  {
    title: "7. Equipment Damage & Liability",
    body: "You are fully responsible for equipment during the rental period. You are liable for accidental damage (repair/replacement cost), loss or theft (full replacement cost), and intentional damage.\n\nCamoCare protection is available in-app and may cover accidental damage up to a specified limit.",
  },
  {
    title: "8. Equipment Use",
    body: "You agree to use equipment only for lawful, professional purposes. You must not sublet, loan, or transfer equipment to any third party, or use it for illegal filming, surveillance, or any unlawful activity.",
  },
  {
    title: "9. Delivery and Return",
    body: "Equipment is delivered by our crew or available for self-pickup. Late returns are charged at the daily rental rate for each additional day. Ensure someone is available at the delivery address to inspect the equipment.",
  },
  {
    title: "10. Prohibited Uses",
    body: "You must not post false or fraudulent information, attempt to reverse engineer or hack the App, impersonate another person, manipulate reviews, or circumvent our booking or payment systems.",
  },
  {
    title: "11. Intellectual Property",
    body: "All content in the App — text, graphics, logos, icons, images, and software — is the property of Camorent and protected by Indian copyright and trademark laws. You may not reproduce or modify it without prior written consent.",
  },
  {
    title: "12. Dispute Resolution",
    body: "Please contact support@camorent.co.in first. If unresolved within 30 days, disputes shall be referred to arbitration under the Arbitration and Conciliation Act, 1996 of India, conducted in English.\n\nThese Terms are governed by the laws of India.",
  },
  {
    title: "13. Contact Us",
    body: "Email: support@camorent.co.in\nGrievance Officer: hemant@camorent.co.in\nWebsite: www.camorent.com\nAddress: New Delhi, India",
  },
];

// ── Sub-components ─────────────────────────────────────────────────────────────

function Section({ title, body }: { title: string; body: string }) {
  return (
    <YStack gap={hp(6)} marginBottom={hp(20)}>
      <Text fontSize={fp(14)} fontWeight="700" color="#1C1C1E" letterSpacing={-0.1}>
        {title}
      </Text>
      <Text fontSize={fp(13)} color="#4B5563" lineHeight={fp(20)}>
        {body}
      </Text>
    </YStack>
  );
}

// ── Main Screen ────────────────────────────────────────────────────────────────

export default function LegalScreen() {
  const { type } = useLocalSearchParams<{ type: "privacy" | "terms" }>();

  const isPrivacy = type === "privacy";
  const title = isPrivacy ? "Privacy Policy" : "Terms & Conditions";
  const effectiveDate = "Effective: 17 February 2026";
  const sections = isPrivacy ? PRIVACY_SECTIONS : TERMS_SECTIONS;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F2F2F7" }} edges={["top"]}>
      {/* Header */}
      <XStack
        alignItems="center"
        paddingHorizontal={wp(16)}
        paddingTop={hp(8)}
        paddingBottom={hp(12)}
        gap={wp(12)}
      >
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
          style={{
            width: wp(36),
            height: wp(36),
            borderRadius: wp(18),
            backgroundColor: "#FFFFFF",
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.06,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <ChevronLeft size={20} color="#1C1C1E" strokeWidth={2.5} />
        </Pressable>
        <YStack gap={hp(2)}>
          <Text fontSize={fp(18)} fontWeight="700" color="#1C1C1E" letterSpacing={-0.3}>
            {title}
          </Text>
          <Text fontSize={fp(11)} color="#9CA3AF">
            {effectiveDate}
          </Text>
        </YStack>
      </XStack>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: wp(16),
          paddingTop: hp(8),
          paddingBottom: hp(48),
        }}
      >
        {/* Hero card */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: wp(14),
            padding: wp(16),
            marginBottom: hp(20),
            borderWidth: 1,
            borderColor: "#E5E7EB",
          }}
        >
          <Text fontSize={fp(13)} color="#6B7280" lineHeight={fp(20)}>
            {isPrivacy
              ? "This policy explains how Camorent collects, uses, and protects your personal information when you use our camera equipment rental platform."
              : "These terms govern your use of the Camorent app. By using our platform, you agree to be bound by these terms."}
          </Text>
        </View>

        {/* Sections */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: wp(14),
            padding: wp(16),
            borderWidth: 1,
            borderColor: "#E5E7EB",
          }}
        >
          {sections.map((section, index) => (
            <Section key={index} title={section.title} body={section.body} />
          ))}
        </View>

        {/* Footer */}
        <Text
          fontSize={fp(11)}
          color="#9CA3AF"
          textAlign="center"
          marginTop={hp(20)}
          lineHeight={fp(16)}
        >
          {isPrivacy
            ? "This Privacy Policy is governed by the laws of India."
            : "By using the Camorent App, you acknowledge that you have read and agree to these Terms."}
          {"\n"}© 2026 Camorent. All rights reserved.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
