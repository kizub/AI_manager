import { useState } from 'react';
import { api } from '../lib/api';

export const useLeadForm = (apiBase: string) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const submitForm = async (projectId: string, sessionToken: string) => {
    setIsSubmitting(true);
    setSubmitError('');
    try {
      await api.submitLead(apiBase, projectId, sessionToken, name, email);
      return true;
    } catch (error) {
      setSubmitError('Something went wrong. Please try again.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
  };

  return { name, email, setName, setEmail, submitForm, isSubmitting, resetForm, submitError };
};
