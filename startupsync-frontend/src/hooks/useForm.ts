import { useState, useCallback } from 'react';

export const useForm = <T extends Record<string, any>>(initialState: T) => {
  const [formData, setFormData] = useState<T>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
      setFormData((prev) => ({
        ...prev,
        [name]: val,
      }));
      // Clear error for this field
      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: '',
        }));
      }
    },
    [errors]
  );

  const setFieldValue = useCallback((name: keyof T, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const setFieldError = useCallback((name: string, error: string) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialState);
    setErrors({});
  }, [initialState]);

  return {
    formData,
    errors,
    handleChange,
    setFieldValue,
    setFieldError,
    resetForm,
  };
};
