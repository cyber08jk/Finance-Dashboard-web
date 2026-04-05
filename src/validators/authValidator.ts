import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase(),
  username: z.string().min(3, 'Username must be at least 3 characters').max(255),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['viewer', 'analyst', 'admin']).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase(),
  password: z.string(),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const createUserSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase(),
  username: z.string().min(3, 'Username must be at least 3 characters').max(255),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['viewer', 'analyst', 'admin']),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  role: z.enum(['viewer', 'analyst', 'admin']).optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
