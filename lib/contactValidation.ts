export interface ContactFormValues {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}
 
export type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>;
 
export const CONTACT_SUBJECT_OPTIONS = [
  "General Inquiry",
  "Order & Shipping",
  "Wholesale / Dealer Enquiry",
  "Product Question",
  "Other",
];
 
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_REGEX = /^[6-9]\d{9}$/; // Indian 10-digit mobile numbers
 
/**
 * Single source of truth for contact form validation.
 * Used on the client for instant feedback, and re-run on the server
 * because client-side validation can always be bypassed.
 */
export function validateContactForm(
  values: ContactFormValues,
): ContactFormErrors {
  const errors: ContactFormErrors = {};
 
  if (!values.name?.trim()) {
    errors.name = "Please enter your name.";
  } else if (values.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }
 
  if (!values.email?.trim()) {
    errors.email = "Please enter your email address.";
  } else if (!EMAIL_REGEX.test(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }
 
  if (values.phone?.trim() && !PHONE_REGEX.test(values.phone.trim())) {
    errors.phone = "Please enter a valid 10-digit mobile number.";
  }
 
  if (!values.subject) {
    errors.subject = "Please select a subject.";
  } else if (!CONTACT_SUBJECT_OPTIONS.includes(values.subject)) {
    errors.subject = "Please select a valid subject.";
  }
 
  if (!values.message?.trim()) {
    errors.message = "Please enter a message.";
  } else if (values.message.trim().length < 10) {
    errors.message = "Message must be at least 10 characters.";
  } else if (values.message.trim().length > 2000) {
    errors.message = "Message must be under 2000 characters.";
  }
 
  return errors;
}