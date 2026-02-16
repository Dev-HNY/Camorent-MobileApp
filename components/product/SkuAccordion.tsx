import {
  AccordionSection,
  SpecificationList,
  BulletList,
} from "@/components/ui/AccordionSection";
import { SKU } from "@/types/products/product";

interface SkuAccordionProps {
  product: SKU;
}

export function SkuAccordion({ product }: SkuAccordionProps) {
  return (
    <AccordionSection
      title="What you need to know"
      items={[
        {
          value: "specifications",
          title: "Product Details",
          content: (
            <SpecificationList
              specs={[
                { label: "Model", value: product.name },
                { label: "Brand", value: product.brand },
                {
                  label: "Price per day",
                  value: `₹${product.price_per_day}`,
                },
                {
                  label: "Status",
                  value: product.is_active ? "Available" : "Unavailable",
                  valueColor: product.is_active ? "#17663A" : "#DC2626",
                },
                // {
                //   label: "Security Deposit",
                //   value: `₹${product.security_deposit}`,
                // },
                // {
                //   label: "Replacement Value",
                //   value: `₹${product.replacement_value}`,
                // },
              ]}
            />
          ),
        },
        {
          value: "rental-terms",
          title: "Rental Terms & Conditions",
          content: (
            <BulletList
              items={[
                `Minimum rental period: ${product.minimum_rental_duration} day(s)`,
                `Maximum rental period: ${product.maximum_rental_duration} day(s)`,
                `Security deposit: ₹${product.security_deposit}`,
                "Valid ID and contact information needed",
                "Equipment must be returned in original condition",
              ]}
            />
          ),
        },
        {
          value: "care-instructions",
          title: "Care & Usage Instructions",
          content: (
            <BulletList
              items={[
                "Handle with care to avoid damage",
                "Clean after use according to manufacturer guidelines",
                "Store in provided case when not in use",
                "Report any issues immediately to avoid additional charges",
                ...(product.notes ? [product.notes] : []),
              ]}
            />
          ),
          showBorder: false,
        },
      ]}
    />
  );
}
