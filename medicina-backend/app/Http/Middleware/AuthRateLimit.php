<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Symfony\Component\HttpFoundation\Response;

class AuthRateLimit
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, $maxAttempts = 5, $decayMinutes = 1): Response
    {
        // Create a unique key based on IP and endpoint
        $key = $this->resolveRequestSignature($request);
        
        // Check current attempts
        $attempts = RateLimiter::attempts($key);
        
        // Check if the user has exceeded the rate limit
        if (RateLimiter::tooManyAttempts($key, $maxAttempts)) {
            $retryAfter = RateLimiter::availableIn($key);
            
            return response()->json([
                'message' => 'Too many authentication attempts. Please try again in ' . $retryAfter . ' seconds.',
                'retry_after' => $retryAfter,
                'attempts' => $attempts,
                'limit' => $maxAttempts
            ], 429);
        }
        
        // Increment the rate limiter
        RateLimiter::hit($key, $decayMinutes * 60);
        
        // Add rate limit headers to response
        $response = $next($request);
        $response->headers->set('X-RateLimit-Limit', $maxAttempts);
        $response->headers->set('X-RateLimit-Remaining', max(0, $maxAttempts - $attempts - 1));
        
        return $response;
    }
    
    /**
     * Resolve the request signature for rate limiting
     */
    protected function resolveRequestSignature(Request $request): string
    {
        // Use IP address and endpoint path for rate limiting
        return 'auth_rate_limit:' . $request->ip() . ':' . $request->path();
    }
}
