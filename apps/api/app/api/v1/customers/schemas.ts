import { z } from '@/lib/openapi';

// Customer schemas
export const CustomerSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  phone: z.string().optional(),
  address: z.object({
    line1: z.string(),
    line2: z.string().optional(),
    city: z.string(),
    state: z.string().optional(),
    postal_code: z.string(),
    country: z.string().length(2),
  }).optional(),
  metadata: z.record(z.any()).optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});


export const CreateCustomerSchema = CustomerSchema.pick({
  email: true,
  name: true,
  phone: true,
  address: true,
  metadata: true,
});


