import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey, getMode } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';
import { CreateInvoiceSchema, InvoiceSchema } from './schemas';
import { z } from '@/lib/openapi';

// GET /api/v1/invoices
export async function GET(request: NextRequest) {
  // Validate API key
  const apiKey = await validateApiKey(request);
  if (!apiKey) {
    return NextResponse.json(
      { error: { code: 'unauthorized', message: 'Invalid or missing API key' } },
      { status: 401 }
    );
  }

  // Check rate limit
  const mode = getMode(request);
  const rateLimit = await checkRateLimit(request, mode, apiKey.key);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: { code: 'rate_limit_exceeded', message: 'Too many requests' } },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': mode === 'test' ? '100' : '1000',
          'X-RateLimit-Remaining': rateLimit.remaining?.toString() || '0',
          'X-RateLimit-Reset': rateLimit.resetAt?.toISOString() || '',
        },
      }
    );
  }

  // Parse query parameters
  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
  const offset = parseInt(searchParams.get('offset') || '0');
  const status = searchParams.get('status');
  const customerId = searchParams.get('customer_id');

  // Mock data - in production, fetch from database
  const mockInvoices = [
    {
      id: 'inv_123',
      mode,
      status: 'pending',
      number: 'INV-2025-001',
      customer: {
        id: 'cus_123',
        email: 'john@example.com',
        name: 'John Doe',
      },
      items: [
        {
          description: 'Premium Plan',
          quantity: 1,
          amount: 9900,
        },
      ],
      currency: 'USD',
      subtotal: 9900,
      tax: 990,
      total: 10890,
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  return NextResponse.json({
    data: mockInvoices,
    has_more: false,
    total_count: mockInvoices.length,
  }, {
    headers: {
      'X-Mode': mode,
      'X-RateLimit-Limit': mode === 'test' ? '100' : '1000',
      'X-RateLimit-Remaining': rateLimit.remaining?.toString() || '',
    },
  });
}

// POST /api/v1/invoices
export async function POST(request: NextRequest) {
  // Validate API key
  const apiKey = await validateApiKey(request);
  if (!apiKey) {
    return NextResponse.json(
      { error: { code: 'unauthorized', message: 'Invalid or missing API key' } },
      { status: 401 }
    );
  }

  // Check rate limit
  const mode = getMode(request);
  const rateLimit = await checkRateLimit(request, mode, apiKey.key);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: { code: 'rate_limit_exceeded', message: 'Too many requests' } },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': mode === 'test' ? '100' : '1000',
          'X-RateLimit-Remaining': rateLimit.remaining?.toString() || '0',
          'X-RateLimit-Reset': rateLimit.resetAt?.toISOString() || '',
        },
      }
    );
  }

  try {
    const body = await request.json();
    const validatedData = CreateInvoiceSchema.parse(body);

    // Calculate totals
    const subtotal = validatedData.items.reduce((acc, item) => acc + (item.amount * item.quantity), 0);
    const tax = Math.round(subtotal * 0.1); // 10% tax for demo
    const total = subtotal + tax;

    // Mock invoice creation - in production, save to database
    const newInvoice = {
      id: `inv_${Date.now()}`,
      mode,
      status: 'pending' as const,
      number: `INV-2025-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      ...validatedData,
      subtotal,
      tax,
      total,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Send immediately if requested
    if (validatedData.send_immediately) {
      // In production, trigger email/SMS sending
      console.log(`Sending invoice ${newInvoice.id} to ${newInvoice.customer.email}`);
    }

    return NextResponse.json(newInvoice, {
      status: 201,
      headers: {
        'X-Mode': mode,
        'X-RateLimit-Limit': mode === 'test' ? '100' : '1000',
        'X-RateLimit-Remaining': rateLimit.remaining?.toString() || '',
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: { code: 'validation_error', message: 'Invalid request data', details: error.errors } },
        { status: 400 }
      );
    }

    console.error('Invoice creation error:', error);
    return NextResponse.json(
      { error: { code: 'internal_error', message: 'An error occurred while creating the invoice' } },
      { status: 500 }
    );
  }
}