// hooks/useLogin.ts

"use client";

import { useState, useCallback, type FormEvent } from "react";
import { loginUser, saveSession } from "@/lib/auth";
import { ApiError } from "@/lib/api";

type FormFields = {
  email: string;
  password: string;
};

type FieldErrors = Partial<Record<keyof FormFields, string>>;

type UseLoginReturn = {
  fields: FormFields;
  errors: FieldErrors;
  serverError: string;
  isLoading: boolean;
  setField: (field: keyof FormFields, value: string) => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(fields: FormFields): FieldErrors {
  const errors: FieldErrors = {};

  if (!fields.email.trim()) {
    errors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(fields.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!fields.password) {
    errors.password = "Password is required";
  }

  return errors;
}

export function useLogin(): UseLoginReturn {
  const [fields, setFields] = useState<FormFields>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const setField = useCallback((field: keyof FormFields, value: string) => {
    setFields((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setServerError("");
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      const validationErrors = validate(fields);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      setIsLoading(true);
      setServerError("");

      try {
        const response = await loginUser({
          email: fields.email.trim(),
          password: fields.password,
        });

        saveSession(response);

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
