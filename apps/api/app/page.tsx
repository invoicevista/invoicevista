'use client';

import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { 
  ssr: false,
  loading: () => <div className="flex items-center justify-center min-h-screen">Loading API documentation...</div>
});

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">InvoiceVista API Documentation</h1>
          <p className="text-muted-foreground">
            Explore our REST API endpoints and test them directly from this page.
          </p>
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="text-sm font-semibold mb-2">Authentication</p>
            <p className="text-sm text-muted-foreground">
              All API requests require an API key. Include your API key in the <code className="px-1 py-0.5 bg-background rounded">X-API-Key</code> header.
            </p>
            <div className="mt-2">
              <p className="text-sm font-semibold">Test API Key:</p>
              <code className="text-sm px-2 py-1 bg-background rounded">test_key_1234567890</code>
            </div>
          </div>
        </div>
        <div className="border rounded-lg overflow-hidden">
          <SwaggerUI 
            url="/api/openapi.json"
            docExpansion="list"
            defaultModelsExpandDepth={0}
            persistAuthorization={true}
          />
        </div>
      </div>
    </div>
  );
}