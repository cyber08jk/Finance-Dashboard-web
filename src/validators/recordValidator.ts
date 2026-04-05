import { z } from 'zod';

export const createRecordSchema = z.object({
  amount: z.number().positive('Amount must be greater than 0'),
  type: z.enum(['income', 'expense']),
  category: z.string().min(1, 'Category is required').max(100),
  date: z.coerce.date().refine(
    (date) => date <= new Date(),
    'Date cannot be in the future'
  ),
  description: z.string().max(500, 'Description must not exceed 500 characters').optional(),
});

export type CreateRecordInput = z.infer<typeof createRecordSchema>;

export const updateRecordSchema = z.object({
  amount: z.number().positive('Amount must be greater than 0').optional(),
  type: z.enum(['income', 'expense']).optional(),
  category: z.string().min(1, 'Category is required').max(100).optional(),
  date: z.coerce.date().refine(
    (date) => date <= new Date(),
    'Date cannot be in the future'
  ).optional(),
  description: z.string().max(500, 'Description must not exceed 500 characters').optional(),
});

export type UpdateRecordInput = z.infer<typeof updateRecordSchema>;

export const queryRecordsSchema = z.object({
  limit: z.coerce.number().int().positive().default(20),
  offset: z.coerce.number().int().nonnegative().default(0),
  category: z.string().max(100).optional(),
  type: z.enum(['income', 'expense']).optional(),
  date_from: z.coerce.date().optional(),
  date_to: z.coerce.date().optional(),
  search: z.string().trim().min(1).max(100).optional(),
}).refine((data) => {
  if (!data.date_from || !data.date_to) {
    return true;
  }
  return data.date_from <= data.date_to;
}, {
  message: 'date_from must be less than or equal to date_to',
  path: ['date_from'],
});

export type QueryRecordsInput = z.infer<typeof queryRecordsSchema>;

export const dashboardQuerySchema = z.object({
  date_from: z.coerce.date().optional(),
  date_to: z.coerce.date().optional(),
  type: z.enum(['income', 'expense', 'both']).default('both').optional(),
}).refine((data) => {
  if (!data.date_from || !data.date_to) {
    return true;
  }
  return data.date_from <= data.date_to;
}, {
  message: 'date_from must be less than or equal to date_to',
  path: ['date_from'],
});

export type DashboardQueryInput = z.infer<typeof dashboardQuerySchema>;
