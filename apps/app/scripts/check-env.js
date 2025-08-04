#!/usr/bin/env node

// Load environment variables from .env.local file
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local file if it exists
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, ...valueParts] = trimmedLine.split('=');
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
}

const requiredEnvVars = [
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'CLERK_SECRET_KEY'
];

const warnings = [];

// Check if env vars exist and have proper format
requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  
  if (!value) {
    warnings.push(`❌ Missing required environment variable: ${varName}`);
  } else if (varName === 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY' && !value.startsWith('pk_')) {
    warnings.push(`⚠️  ${varName} should start with 'pk_'`);
  } else if (varName === 'CLERK_SECRET_KEY' && !value.startsWith('sk_')) {
    warnings.push(`⚠️  ${varName} should start with 'sk_'`);
  }
});

if (warnings.length > 0) {
  console.log('\n🔧 Environment Configuration Check\n');
  warnings.forEach(w => console.log(w));
  console.log('\n📝 To fix this:');
  console.log('1. Sign up at https://clerk.com');
  console.log('2. Create a new application');
  console.log('3. Copy your keys from the Clerk dashboard');
  console.log('4. Update your .env.local file\n');
  console.log('⚠️  Build may fail without proper Clerk configuration\n');
} else {
  console.log('\n✅ Environment Configuration Check\n');
  console.log('All required environment variables are properly configured.');
  console.log(`  • NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: ${process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.substring(0, 20)}...`);
  console.log(`  • CLERK_SECRET_KEY: ${process.env.CLERK_SECRET_KEY.substring(0, 20)}...`);
  console.log('\n🚀 Ready to build!\n');
}

// Exit with success to not block the build
process.exit(0);