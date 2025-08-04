import { z } from '@/lib/openapi';

// Payment schemas
export const PaymentSchema = z.object({
  id: z.string(),
  invoice_id: z.string(),
  amount: z.number().int().positive(),
  currency: z.string().length(3),
  status: z.enum(['pending', 'processing', 'succeeded', 'failed', 'cancelled']),
  payment_method: z.object({
    type: z.enum(['card', 'bank_transfer', 'paypal']),
    last4: z.string().optional(),
    brand: z.string().optional(),
  }),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});


