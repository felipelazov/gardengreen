import { z } from 'zod';

export const quoteItemSchema = z.object({
  description: z.string().min(1, 'Descricao obrigatoria'),
  value: z.number().int().min(0, 'Valor deve ser positivo'), // centavos
  quantity: z.number().int().min(1, 'Quantidade minima e 1'),
});

export type QuoteItem = z.infer<typeof quoteItemSchema>;

export const createQuoteSchema = z.object({
  client_id: z.string().min(1, 'Cliente obrigatorio'),
  items: z.array(quoteItemSchema).min(1, 'Adicione pelo menos um item'),
  valid_until: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data invalida'),
  notes: z.string().max(500).nullable().optional(),
});

export type CreateQuoteInput = z.infer<typeof createQuoteSchema>;

export const updateQuoteStatusSchema = z.object({
  status: z.enum(['draft', 'sent', 'approved', 'rejected', 'expired']),
  sent_at: z.number().nullable().optional(),
  approved_at: z.number().nullable().optional(),
});

export type UpdateQuoteStatusInput = z.infer<typeof updateQuoteStatusSchema>;
