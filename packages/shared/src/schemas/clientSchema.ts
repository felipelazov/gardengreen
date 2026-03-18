import { z } from 'zod';

export const createClientSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
  phone: z.string().min(10, 'Telefone invalido').max(15),
  email: z.string().email('Email invalido').nullable().optional(),
  address: z.string().max(200).nullable().optional(),
  neighborhood: z.string().max(100).nullable().optional(),
  city: z.string().max(100).nullable().optional(),
  notes: z.string().max(500).nullable().optional(),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;
