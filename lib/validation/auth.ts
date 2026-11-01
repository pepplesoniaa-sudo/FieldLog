import { z } from 'zod';

/**
 * Shared Authentication Zod Schemas
 * Single source of truth for request validation on client and server.
 * Adheres to PRD 7.7 and Task 4 validation placement requirements.
 */

// Custom refinement for two-word name rule
const twoWordNameRegex = /^[^\s]+(\s+[^\s]+)+$/;

export const registerSchema = z.object({
  fullName: z
    .string({ required_error: 'Full name is required' })
    .trim()
    .min(2, { message: 'Full name must be at least 2 characters long' })
    .max(100, { message: 'Full name cannot exceed 100 characters' })
    .refine((val) => twoWordNameRegex.test(val), {
      message: 'Please provide both your first and last name separated by a space'
    }),

  orgName: z
    .string({ required_error: 'Organisation name is required' })
    .trim()
    .min(3, { message: 'Organisation name must be at least 3 characters' })
    .max(100, { message: 'Organisation name cannot exceed 100 characters' }),

  email: z
    .string({ required_error: 'Email address is required' })
    .trim()
    .toLowerCase()
    .email({ message: 'Please enter a valid email address' })
    .max(255, { message: 'Email address cannot exceed 255 characters' }),

  password: z
    .string({ required_error: 'Password is required' })
    .trim() // Trim leading and trailing whitespace per Step 5
    .min(10, { message: 'Password must be at least 10 characters long' })
    .max(128, { message: 'Password cannot exceed 128 characters' }),

  seats: z.coerce
    .number({ required_error: 'Supervisor seats allocation is required' })
    .int({ message: 'Supervisor seats must be an integer' })
    .min(1, { message: 'Supervisor seats must be at least 1' })
    .max(500, { message: 'Supervisor seats cannot exceed 500' }),

  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the terms and conditions to register' })
  })
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email address is required' })
    .trim()
    .toLowerCase()
    .email({ message: 'Please enter a valid email address' }),

  password: z
    .string({ required_error: 'Password is required' })
    .trim()
    .min(1, { message: 'Password cannot be empty' })
});

export const resetRequestSchema = z.object({
  email: z
    .string({ required_error: 'Email address is required' })
    .trim()
    .toLowerCase()
    .email({ message: 'Please enter a valid email address' })
});

export const verifyCodeSchema = z.object({
  email: z
    .string({ required_error: 'Email address is required' })
    .trim()
    .toLowerCase()
    .email({ message: 'Please enter a valid email address' }),

  code: z
    .string({ required_error: 'Verification code is required' })
    .trim()
    .regex(/^\d{6}$/, { message: 'Verification code must be exactly 6 numeric digits' })
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ResetRequestInput = z.infer<typeof resetRequestSchema>;
export type VerifyCodeInput = z.infer<typeof verifyCodeSchema>;
