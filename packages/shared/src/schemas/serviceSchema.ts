import { z } from 'zod';

export const createServiceSchema = z.object({
  client_id: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/).nullable().optional(),
  type: z.string().min(1),
  description: z.string().max(500).nullable().optional(),
  value: z.number().int().min(0), // centavos
  notes: z.string().max(500).nullable().optional(),
  recurrence_id: z.string().nullable().optional(),
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;

export const updateServiceSchema = createServiceSchema.partial().extend({
  status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled']).optional(),
  completed_at: z.number().nullable().optional(),
  cancelled_at: z.number().nullable().optional(),
});

export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
