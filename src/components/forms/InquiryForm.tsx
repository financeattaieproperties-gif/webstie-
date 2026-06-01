"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../ui/Button';
import { createLead } from '../../lib/dbService';

const inquirySchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(8, 'Phone number is required'),
  message: z.string().optional(),
});

type InquiryFormValues = z.infer<typeof inquirySchema>;

export const InquiryForm = ({ propertyId, propertyName }: { propertyId?: string, propertyName?: string }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema)
  });

  const onSubmit = async (data: InquiryFormValues) => {
    setIsSubmitting(true);
    try {
      await createLead({
        ...data,
        propertyId,
        propertyName
      });
      setIsSuccess(true);
      reset();
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error("Failed to submit inquiry", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
      <h3 className="font-heading text-xl font-bold text-brand-navy mb-4">
        {propertyName ? `Inquire about ${propertyName}` : 'Contact an Agent'}
      </h3>
      
      {isSuccess ? (
        <div className="p-4 bg-status-available/10 text-status-available rounded-lg text-center font-medium">
          Thank you! We will be in touch shortly.
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input 
              {...register('name')} 
              placeholder="Full Name" 
              className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-500' : 'border-neutral-300'} focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none`} 
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <input 
              {...register('email')} 
              type="email" 
              placeholder="Email Address" 
              className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-neutral-300'} focus:ring-2 focus:ring-brand-gold outline-none`} 
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <input 
              {...register('phone')} 
              type="tel" 
              placeholder="Phone Number" 
              className={`w-full px-4 py-3 rounded-lg border ${errors.phone ? 'border-red-500' : 'border-neutral-300'} focus:ring-2 focus:ring-brand-gold outline-none`} 
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>
          <div>
            <textarea 
              {...register('message')} 
              placeholder="I am interested in this property..." 
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-brand-gold outline-none resize-none" 
            />
          </div>
          <Button type="submit" loading={isSubmitting} className="w-full">
            Send Inquiry
          </Button>
        </form>
      )}
    </div>
  );
};
