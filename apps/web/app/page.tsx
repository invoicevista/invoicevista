import Link from "next/link"
import { ArrowRight, Code2, Mail, CreditCard, Zap, Shield, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <CreditCard className="h-6 w-6" />
            <span className="font-bold text-xl">InvoiceVista</span>
          </Link>
          <nav className="flex items-center space-x-6">
            <Link href="#features" className="text-sm font-medium transition-colors hover:text-primary">
              Features
            </Link>
            <Link href="#developers" className="text-sm font-medium transition-colors hover:text-primary">
              For Developers
            </Link>
            <Link href="#pricing" className="text-sm font-medium transition-colors hover:text-primary">
              Pricing
            </Link>
            <Link href="/docs" className="text-sm font-medium transition-colors hover:text-primary">
              Documentation
            </Link>
            <ThemeToggle />
            <Button>Get Started</Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 lg:py-32">
          <div className="container relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Send Digital Invoices{" "}
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  with Code
                </span>
              </h1>
              <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
                The developer-first platform for sending digital invoices programmatically. 
                Integrate with your applications in minutes, not days.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button size="lg" className="group">
                  Start Building
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button size="lg" variant="outline">
                  View Documentation
                </Button>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        </section>

        {/* Code Example */}
        <section className="border-t bg-muted/50 py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <div className="rounded-lg border bg-card p-4">
                <div className="flex items-center gap-2 border-b pb-3">
                  <div className="flex gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-sm text-muted-foreground">api.js</span>
                </div>
                <pre className="mt-4 overflow-x-auto">
                  <code className="text-sm">
{`import { InvoiceVista } from '@invoicevista/sdk';

const client = new InvoiceVista('your-api-key');

const invoice = await client.invoices.create({
  customer: {
    email: 'john@example.com',
    name: 'John Doe'
  },
  items: [{
    description: 'Premium Plan',
    amount: 9900,
    quantity: 1
  }],
  currency: 'USD'
});

await client.invoices.send(invoice.id);`}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
                Built for Developers, by Developers
              </h2>
              <p className="mb-12 text-lg text-muted-foreground">
                Everything you need to integrate invoicing into your application
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="group relative rounded-lg border p-6 transition-colors hover:border-primary">
                <Code2 className="mb-4 h-10 w-10 text-primary" />
                <h3 className="mb-2 font-semibold">Simple API</h3>
                <p className="text-sm text-muted-foreground">
                  Clean, intuitive REST and GraphQL APIs with comprehensive SDKs in multiple languages.
                </p>
              </div>
              <div className="group relative rounded-lg border p-6 transition-colors hover:border-primary">
                <Zap className="mb-4 h-10 w-10 text-primary" />
                <h3 className="mb-2 font-semibold">Lightning Fast</h3>
                <p className="text-sm text-muted-foreground">
                  Sub-second invoice generation and delivery with 99.9% uptime guarantee.
                </p>
              </div>
              <div className="group relative rounded-lg border p-6 transition-colors hover:border-primary">
                <Shield className="mb-4 h-10 w-10 text-primary" />
                <h3 className="mb-2 font-semibold">Enterprise Security</h3>
                <p className="text-sm text-muted-foreground">
                  SOC 2 Type II certified with end-to-end encryption and compliance built-in.
                </p>
              </div>
              <div className="group relative rounded-lg border p-6 transition-colors hover:border-primary">
                <Mail className="mb-4 h-10 w-10 text-primary" />
                <h3 className="mb-2 font-semibold">Multi-channel Delivery</h3>
                <p className="text-sm text-muted-foreground">
                  Send via email, SMS, or generate shareable links. Your choice.
                </p>
              </div>
              <div className="group relative rounded-lg border p-6 transition-colors hover:border-primary">
                <Globe className="mb-4 h-10 w-10 text-primary" />
                <h3 className="mb-2 font-semibold">Global Support</h3>
                <p className="text-sm text-muted-foreground">
                  Support for 135+ currencies and automatic tax calculations worldwide.
                </p>
              </div>
              <div className="group relative rounded-lg border p-6 transition-colors hover:border-primary">
                <CreditCard className="mb-4 h-10 w-10 text-primary" />
                <h3 className="mb-2 font-semibold">Payment Integration</h3>
                <p className="text-sm text-muted-foreground">
                  Built-in support for Stripe, PayPal, and other major payment processors.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Developer Section */}
        <section id="developers" className="border-t bg-muted/50 py-24">
          <div className="container">
            <div className="mx-auto max-w-5xl">
              <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
                <div>
                  <h2 className="mb-4 text-3xl font-bold">
                    Developer Experience First
                  </h2>
                  <p className="mb-6 text-muted-foreground">
                    We've obsessed over every detail of the developer experience so you can focus on building your product.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 h-2 w-2 rounded-full bg-primary" />
                      <div>
                        <strong className="font-medium">Comprehensive Documentation</strong>
                        <p className="text-sm text-muted-foreground">
                          Interactive API docs with live examples and tutorials
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 h-2 w-2 rounded-full bg-primary" />
                      <div>
                        <strong className="font-medium">Multiple SDKs</strong>
                        <p className="text-sm text-muted-foreground">
                          Official libraries for JavaScript, Python, Ruby, PHP, Go, and more
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 h-2 w-2 rounded-full bg-primary" />
                      <div>
                        <strong className="font-medium">Webhooks & Events</strong>
                        <p className="text-sm text-muted-foreground">
                          Real-time notifications for invoice status changes
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 h-2 w-2 rounded-full bg-primary" />
                      <div>
                        <strong className="font-medium">Test Environment</strong>
                        <p className="text-sm text-muted-foreground">
                          Full-featured sandbox with test API keys
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute -inset-4 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 opacity-25 blur-lg" />
                    <div className="relative rounded-lg border bg-card p-6">
                      <pre className="overflow-x-auto">
                        <code className="text-sm">
{`// Install via npm
npm install @invoicevista/sdk

// Or using yarn
yarn add @invoicevista/sdk

// Or using pnpm
pnpm add @invoicevista/sdk`}
                        </code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
                Simple, Transparent Pricing
              </h2>
              <p className="mb-12 text-lg text-muted-foreground">
                Start free, scale as you grow
              </p>
            </div>
            <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-3">
              <div className="relative rounded-lg border p-6">
                <h3 className="mb-2 text-lg font-semibold">Starter</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Perfect for side projects
                </p>
                <div className="mb-6">
                  <span className="text-3xl font-bold">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="mb-6 space-y-2 text-sm">
                  <li>✓ 100 invoices/month</li>
                  <li>✓ Basic API access</li>
                  <li>✓ Email delivery</li>
                  <li>✓ Community support</li>
                </ul>
                <Button className="w-full" variant="outline">
                  Get Started
                </Button>
              </div>
              <div className="relative rounded-lg border-2 border-primary p-6">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  Most Popular
                </div>
                <h3 className="mb-2 text-lg font-semibold">Pro</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  For growing businesses
                </p>
                <div className="mb-6">
                  <span className="text-3xl font-bold">$49</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="mb-6 space-y-2 text-sm">
                  <li>✓ 10,000 invoices/month</li>
                  <li>✓ Full API access</li>
                  <li>✓ Multi-channel delivery</li>
                  <li>✓ Webhooks & events</li>
                  <li>✓ Priority support</li>
                </ul>
                <Button className="w-full">Get Started</Button>
              </div>
              <div className="relative rounded-lg border p-6">
                <h3 className="mb-2 text-lg font-semibold">Enterprise</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  For large organizations
                </p>
                <div className="mb-6">
                  <span className="text-3xl font-bold">Custom</span>
                </div>
                <ul className="mb-6 space-y-2 text-sm">
                  <li>✓ Unlimited invoices</li>
                  <li>✓ Custom integrations</li>
                  <li>✓ SLA guarantee</li>
                  <li>✓ Dedicated support</li>
                  <li>✓ On-premise option</li>
                </ul>
                <Button className="w-full" variant="outline">
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t bg-muted/50 py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold">
                Ready to Get Started?
              </h2>
              <p className="mb-8 text-lg text-muted-foreground">
                Join thousands of developers building better invoicing experiences
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button size="lg" className="group">
                  Create Free Account
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button size="lg" variant="outline">
                  Talk to Sales
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container py-12">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <h3 className="mb-4 text-sm font-semibold">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    API Reference
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold">Developers</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    SDKs
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    API Status
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            © 2025 InvoiceVista. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}