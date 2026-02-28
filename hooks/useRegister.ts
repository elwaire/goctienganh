// hooks/useRegister.ts

"use client";

import { useState, useCallback, type FormEvent } from "react";
import { registerUser, saveSession } from "@/lib/auth";
import { ApiError } from "@/lib/api";

type FormFields = {
  fullname: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type FieldErrors = Partial<Record<keyof FormFields, string>>;

type UseRegisterReturn = {
  fields: FormFields;
  errors: FieldErrors;
  serverError: string;
  isLoading: boolean;
  setField: (field: keyof FormFields, value: string) => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

function validate(fields: FormFields): FieldErrors {
  const errors: FieldErrors = {};

  if (!fields.fullname.trim()) {
    errors.fullname = "Full name is required";
  }

  if (!fields.email.trim()) {
    errors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(fields.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!fields.password) {
    errors.password = "Password is required";
  } else if (fields.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }

  if (!fields.confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (fields.password !== fields.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
}

export function useRegister(): UseRegisterReturn {
  const [fields, setFields] = useState<FormFields>({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const setField = useCallback((field: keyof FormFields, value: string) => {
    setFields((prev) => ({ ...prev, [field]: value }));
    // Clear field error on change
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setServerError("");
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      // Client-side validation
      const validationErrors = validate(fields);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      setIsLoading(true);
      setServerError("");

      try {
        const response = await registerUser({
          email: fields.email.trim(),
          fullname: fields.fullname.trim(),
          password: fields.password,
        });

        saveSession(response);

        // Redirect after successful registration
        window.location.href = "/";
      } catch (error) {
        if (error instanceof ApiError) {
          setServerError(error.message);
        } else {
          setServerError("An unexpected error occurred. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [fields],
  );

  return { fields, errors, serverError, isLoading, setField, handleSubmit };
}
