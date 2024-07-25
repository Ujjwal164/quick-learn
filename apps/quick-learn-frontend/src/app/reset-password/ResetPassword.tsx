'use client';
import React from 'react';
import { z } from 'zod';
import FormFieldsMapper from '@src/shared/formElements/FormFieldsMapper';
import { FieldConfig } from '@src/shared/types/formTypes';
import { resetPasswordFormSchema } from './resetPasswordSchema';

const ResetPassword = () => {
  const resetPasswordFields: FieldConfig[] = [
    {
      label: 'New Password',
      name: 'newPassword',
      type: 'password',
      placeholder: '••••••••',
    },
    {
      label: 'Confirm Password',
      name: 'confirmPassword',
      type: 'password',
      placeholder: '••••••••',
    },
  ];
  type ResetPasswordFormData = z.infer<typeof resetPasswordFormSchema>;

  const handleResetPassword = async (data: ResetPasswordFormData) => {
    console.log('ResetPassword data:', data);
  };
  return (
    <FormFieldsMapper
      fields={resetPasswordFields}
      schema={resetPasswordFormSchema}
      onSubmit={handleResetPassword}
      buttonText="Set password"
    />
  );
};

export default ResetPassword;
