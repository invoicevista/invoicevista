import { NextRequest } from 'next/server';
import { z } from '@/lib/openapi';

export interface ApiKey {
  id: string;
  key: string;
  mode: 'test' | 'live';
  userId: string;
  createdAt: Date;
  lastUsed?: Date;
}

// In production, this would be fetched from a database
const API_KEYS: Map<string, ApiKey> = new Map([
  ['test_key_1234567890', {
    id: '1',
    key: 'test_key_1234567890',
    mode: 'test',
    userId: 'user_123',
    createdAt: new Date(),
  }],
  ['live_key_0987654321', {
    id: '2',
    key: 'live_key_0987654321',
    mode: 'live',
    userId: 'user_123',
    createdAt: new Date(),
  }],
]);

export async function validateApiKey(request: NextRequest): Promise<ApiKey | null> {
  const apiKey = request.headers.get('X-API-Key');
  
  if (!apiKey) {
    return null;
  }
  
  // In production, fetch from database
  const key = API_KEYS.get(apiKey);
  
  if (key) {
    // Update last used timestamp
    key.lastUsed = new Date();
  }
  
  return key || null;
}

export function getMode(request: NextRequest): 'test' | 'live' {
  // Check header first
  const modeHeader = request.headers.get('X-Mode');
  if (modeHeader === 'test' || modeHeader === 'live') {
    return modeHeader;
  }
  
  // Check query parameter
  const { searchParams } = new URL(request.url);
  const modeParam = searchParams.get('mode');
  if (modeParam === 'test' || modeParam === 'live') {
    return modeParam;
  }
  
  // Default to test mode
  return 'test';
}