import { RateLimiterMemory } from 'rate-limiter-flexible';
import { NextRequest } from 'next/server';

// Rate limiter instances for different tiers
const rateLimiters = {
  test: new RateLimiterMemory({
    points: 100, // Number of requests
    duration: 900, // Per 15 minutes
  }),
  live: new RateLimiterMemory({
    points: 1000, // Higher limit for live mode
    duration: 900, // Per 15 minutes
  }),
};

export async function checkRateLimit(
  request: NextRequest,
  mode: 'test' | 'live',
  apiKey?: string
): Promise<{ allowed: boolean; remaining?: number; resetAt?: Date }> {
  const limiter = rateLimiters[mode];
  const key = apiKey || request.headers.get('x-forwarded-for') || 'anonymous';
  
  try {
    const result = await limiter.consume(key);
    return {
      allowed: true,
      remaining: result.remainingPoints,
      resetAt: new Date(Date.now() + result.msBeforeNext),
    };
  } catch (rejRes: any) {
    return {
      allowed: false,
      remaining: rejRes.remainingPoints || 0,
      resetAt: new Date(Date.now() + rejRes.msBeforeNext),
    };
  }
}