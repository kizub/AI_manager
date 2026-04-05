import React, { useState, useEffect } from 'react';
import { useLeadForm } from '../hooks/useLeadForm';

interface LeadFormProps {
  projectId: string;
  sessionId: string;
  onSuccess?: () => void;
  apiBase: string;
}

export const LeadForm: React.FC<LeadFormProps> = ({ projectId, sessionId, onSuccess, apiBase }) => {
  const { name, email, setName, setEmail, submitForm, isSubmitting, resetForm, submitError } = useLeadForm(apiBase);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setIsSuccess(false);
    setErrors({});
  }, [sessionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors: { name?: string; email?: string } = {};
    if (!name.trim()) {
      validationErrors.name = 'Name is required';
    }
    if (!email.trim()) {
      validationErrors.email = 'Email is required';
    } else if (!email.includes('@')) {
      validationErrors.email = 'Email is invalid';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    if (isSubmitting) return;
    const success = await submitForm(projectId, sessionId);
    
    if (success) {
      resetForm();
      setErrors({});
      setIsSuccess(true);
    }
  };

  if (isSuccess) {
    return (
      <div className="p-4 border-t bg-gray-50">
        <p className="text-sm font-medium text-green-600">
          Thank you! We will contact you soon.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 border-t bg-gray-50">
      <p className="text-sm font-medium mb-2">Please leave your contact info</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) {
              setErrors({ ...errors, name: undefined });
            }
          }}
          disabled={isSubmitting}
          className={`p-2 border rounded text-sm ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
        {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) {
              setErrors({ ...errors, email: undefined });
            }
          }}
          disabled={isSubmitting}
          className={`p-2 border rounded text-sm ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
        {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
        <button 
          type="submit" 
          disabled={isSubmitting}
          className={`p-2 bg-blue-500 text-white rounded text-sm ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Submit
        </button>
        {submitError && <p className="text-xs text-red-500 mt-1">{submitError}</p>}
      </form>
    </div>
  );
};
