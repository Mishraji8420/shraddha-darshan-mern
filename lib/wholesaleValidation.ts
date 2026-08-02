import { EMAIL_REGEX, PHONE_REGEX } from "./contactValidation";
import { BUSINESS_TYPES, QUANTITY_RANGES } from "@/constants/wholesale";

export interface WholesaleFormValues {
  contactName: string;
  businessName: string;
  businessType: string;
  city: string;
  email: string;
  phone: string;
  quantityRange: string;
  categories: string[];
  notes: string;
}

export type WholesaleFormErrors = Partial<
  Record<keyof WholesaleFormValues, string>
>;

/**
 * This form doesn't post its own fields straight to the backend — it
 * composes them into the existing contact API's `message` field (see
 * WholesaleEnquiryForm.tsx), so it needs its own validation pass rather
 * than reusing validateContactForm() directly. Phone is required here
 * (optional on the general contact form) since a dealer enquiry without a
 * callback number is much less useful to follow up on.
 */
export function validateWholesaleForm(
  values: WholesaleFormValues,
): WholesaleFormErrors {
  const errors: WholesaleFormErrors = {};

  if (!values.contactName?.trim()) {
    errors.contactName = "Please enter your name.";
  } else if (values.contactName.trim().length < 2) {
    errors.contactName = "Name must be at least 2 characters.";
  }

  if (!values.businessName?.trim()) {
    errors.businessName = "Please enter your business/shop name.";
  }

  if (!values.businessType) {
    errors.businessType = "Please select a business type.";
  } else if (!BUSINESS_TYPES.includes(values.businessType)) {
    errors.businessType = "Please select a valid business type.";
  }

  if (!values.city?.trim()) {
    errors.city = "Please enter your city.";
  }

  if (!values.email?.trim()) {
    errors.email = "Please enter your email address.";
  } else if (!EMAIL_REGEX.test(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  if (!values.phone?.trim()) {
    errors.phone = "Please enter a phone number so we can call you back.";
  } else if (!PHONE_REGEX.test(values.phone.trim())) {
    errors.phone = "Please enter a valid 10-digit mobile number.";
  }

  if (!values.quantityRange) {
    errors.quantityRange = "Please select an expected order quantity.";
  } else if (!QUANTITY_RANGES.includes(values.quantityRange)) {
    errors.quantityRange = "Please select a valid quantity range.";
  }

  return errors;
}

/**
 * Formats the wholesale-specific fields into a single, readable message
 * body that the existing /api/contact route sends as-is (rendered with
 * white-space: pre-wrap, so the line breaks below show up correctly in
 * the email).
 */
export function buildWholesaleMessage(values: WholesaleFormValues): string {
  return [
    `Business Name: ${values.businessName.trim()}`,
    `Business Type: ${values.businessType}`,
    `City: ${values.city.trim()}`,
    `Expected Order Quantity: ${values.quantityRange}`,
    `Categories Interested In: ${
      values.categories.length > 0 ? values.categories.join(", ") : "Not specified"
    }`,
    "",
    "Additional Details:",
    values.notes.trim() || "—",
  ].join("\n");
}
