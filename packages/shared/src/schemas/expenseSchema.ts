import { z } from 'zod';

export const EXPENSE_CATEGORIES = [
  { id: 'fuel', label: 'Combustivel' },
  { id: 'tools', label: 'Ferramentas' },
  { id: 'supplies', label: 'Insumos' },
  { id: 'maintenance', label: 'Manutencao' },
  { id: 'other', label: 'Outros' },
] as const;

export type ExpenseCategoryId = (typeof EXPENSE_CATEGORIES)[number]['id'];

export const createExpenseSchema = z.object({
  description: z
    .string()
    .min(1, 'Descricao e obrigatoria')
    .max(200, 'Descricao deve ter no maximo 200 caracteres'),
  amount: z
    .number()
    .int('Valor deve ser um numero inteiro em centavos')
    .positive('Valor deve ser maior que zero'),
  category: z.enum(['fuel', 'tools', 'supplies', 'maintenance', 'other'], {
    errorMap: () => ({ message: 'Selecione uma categoria valida' }),
  }),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
