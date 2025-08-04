import { NextRequest, NextResponse } from 'next/server';

// Manually construct OpenAPI document
const openApiDocument = {
  openapi: '3.0.0',
  info: {
    title: 'InvoiceVista API',
    version: '1.0.0',
    description: 'Developer-first platform for sending digital invoices programmatically',
    contact: {
      name: 'InvoiceVista Support',
      email: 'support@invoicevista.com',
      url: 'https://invoicevista.com/support',
    },
    license: {
      name: 'Proprietary',
      url: 'https://invoicevista.com/terms',
    },
  },
  servers: [
    {
      url: 'https://api.invoicevista.com/v1',
      description: 'Production server',
    },
    {
      url: 'http://localhost:3002/api/v1',
      description: 'Development server',
    },
  ],
  security: [
    {
      ApiKeyAuth: [],
    },
  ],
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-Key',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          error: {
            type: 'object',
            properties: {
              code: { type: 'string' },
              message: { type: 'string' },
              details: { type: 'object' },
            },
            required: ['code', 'message'],
          },
        },
        required: ['error'],
      },
      Invoice: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          mode: { type: 'string', enum: ['test', 'live'] },
          status: { type: 'string', enum: ['draft', 'pending', 'paid', 'overdue', 'cancelled'] },
          number: { type: 'string' },
          customer: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              email: { type: 'string', format: 'email' },
              name: { type: 'string' },
            },
            required: ['id', 'email', 'name'],
          },
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                description: { type: 'string' },
                quantity: { type: 'integer', minimum: 1 },
                amount: { type: 'integer', minimum: 0 },
                tax_rate: { type: 'number', minimum: 0, maximum: 100 },
              },
              required: ['description', 'quantity', 'amount'],
            },
          },
          currency: { type: 'string', minLength: 3, maxLength: 3, default: 'USD' },
          subtotal: { type: 'integer' },
          tax: { type: 'integer' },
          total: { type: 'integer' },
          due_date: { type: 'string', format: 'date-time' },
          paid_at: { type: 'string', format: 'date-time' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
        required: ['id', 'mode', 'status', 'number', 'customer', 'items', 'currency', 'subtotal', 'tax', 'total', 'due_date', 'created_at', 'updated_at'],
      },
      CreateInvoice: {
        type: 'object',
        properties: {
          customer: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              email: { type: 'string', format: 'email' },
              name: { type: 'string' },
            },
            required: ['id', 'email', 'name'],
          },
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                description: { type: 'string' },
                quantity: { type: 'integer', minimum: 1 },
                amount: { type: 'integer', minimum: 0 },
                tax_rate: { type: 'number', minimum: 0, maximum: 100 },
              },
              required: ['description', 'quantity', 'amount'],
            },
          },
          currency: { type: 'string', minLength: 3, maxLength: 3, default: 'USD' },
          due_date: { type: 'string', format: 'date-time' },
          send_immediately: { type: 'boolean', default: false },
        },
        required: ['customer', 'items', 'due_date'],
      },
    },
  },
  paths: {
    '/invoices': {
      get: {
        tags: ['Invoices'],
        summary: 'List invoices',
        description: 'List all invoices',
        parameters: [
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'string' },
            description: 'Number of items to return',
          },
          {
            name: 'offset',
            in: 'query',
            schema: { type: 'string' },
            description: 'Number of items to skip',
          },
          {
            name: 'status',
            in: 'query',
            schema: { type: 'string', enum: ['draft', 'pending', 'paid', 'overdue', 'cancelled'] },
            description: 'Filter by status',
          },
          {
            name: 'customer_id',
            in: 'query',
            schema: { type: 'string' },
            description: 'Filter by customer ID',
          },
          {
            name: 'mode',
            in: 'query',
            schema: { type: 'string', enum: ['test', 'live'] },
            description: 'Filter by mode',
          },
        ],
        responses: {
          '200': {
            description: 'List of invoices',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Invoice' },
                    },
                    has_more: { type: 'boolean' },
                    total_count: { type: 'integer' },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
      post: {
        tags: ['Invoices'],
        summary: 'Create invoice',
        description: 'Create a new invoice',
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateInvoice' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Invoice created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Invoice' },
              },
            },
          },
          '400': {
            description: 'Bad request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/invoices/{id}': {
      get: {
        tags: ['Invoices'],
        summary: 'Get invoice',
        description: 'Get a specific invoice by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Invoice ID',
          },
        ],
        responses: {
          '200': {
            description: 'Invoice details',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Invoice' },
              },
            },
          },
          '404': {
            description: 'Invoice not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
  },
  tags: [
    {
      name: 'Invoices',
      description: 'Invoice management endpoints',
    },
    {
      name: 'Customers',
      description: 'Customer management endpoints',
    },
    {
      name: 'Payments',
      description: 'Payment processing endpoints',
    },
  ],
};

export async function GET(request: NextRequest) {
  return NextResponse.json(openApiDocument);
}