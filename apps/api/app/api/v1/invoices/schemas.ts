import { z } from '@/lib/openapi';

// Invoice schemas
export const InvoiceItemSchema = z.object({
  description: z.string().min(1).max(500),
  quantity: z.number().int().positive(),
  amount: z.number().int().positive(), // Amount in cents
  tax_rate: z.number().min(0).max(100).optional(),
});


export const InvoiceSchema = z.object({
  id: z.string(),
  mode: z.enum(['test', 'live']),
  status: z.enum(['draft', 'pending', 'paid', 'overdue', 'cancelled']),
  number: z.string(),
  customer: z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string(),
    address: z.object({
      line1: z.string(),
      line2: z.string().optional(),
      city: z.string(),
      state: z.string().optional(),
      postal_code: z.string(),
      country: z.string().length(2),
    }).optional(),
  }),
  items: z.array(InvoiceItemSchema),
  currency: z.string().length(3).default('USD'),
  subtotal: z.number().int(),
  tax: z.number().int(),
  total: z.number().int(),
  due_date: z.string().datetime(),
  paid_at: z.string().datetime().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});


export const CreateInvoiceSchema = InvoiceSchema.pick({
  customer: true,
  items: true,
  currency: true,
  due_date: true,
}).extend({
  send_immediately: z.boolean().default(false),
});


export const UpdateInvoiceSchema = CreateInvoiceSchema.partial();


export const InvoiceListSchema = z.object({
  data: z.array(InvoiceSchema),
  has_more: z.boolean(),
  total_count: z.number().int(),
});


