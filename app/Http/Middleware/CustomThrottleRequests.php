<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Routing\Middleware\ThrottleRequests;
use Symfony\Component\HttpFoundation\Response;

class CustomThrottleRequests extends ThrottleRequests
{
    /**
     * Create a 'too many attempts' exception with custom message.
     *
     * @param  string  $key
     * @param  int  $maxAttempts
     * @return \Symfony\Component\HttpKernel\Exception\HttpException
     */
    protected function buildException($key, $maxAttempts)
    {
        $retryAfter = $this->limiter->availableIn($key);
        
        $message = $this->getCustomMessage($maxAttempts, $retryAfter);

        $headers = $this->getHeaders(
            $maxAttempts,
            $this->calculateRemainingAttempts($key, $maxAttempts, $retryAfter),
            $retryAfter
        );

        return response()->json([
            'message' => $message,
            'retry_after' => $retryAfter,
        ], Response::HTTP_TOO_MANY_REQUESTS, $headers);
    }

    /**
     * Get custom message based on the action.
     *
     * @param  int  $maxAttempts
     * @param  int  $retryAfter
     * @return string
     */
    protected function getCustomMessage($maxAttempts, $retryAfter)
    {
        $minutes = ceil($retryAfter / 60);

        if (request()->is('*/save')) {
            return "You're saving quotes too quickly. Please wait {$minutes} minute(s) before trying again.";
        }

        if (request()->is('*/like')) {
            return "You're liking quotes too quickly. Please wait {$minutes} minute(s) before trying again.";
        }

        if (request()->is('collections*')) {
            return "You're managing collections too quickly. Please wait {$minutes} minute(s) before trying again.";
        }

        if (request()->is('profile')) {
            return "You're updating your profile too frequently. Please wait {$minutes} minute(s) before trying again.";
        }

        return "Too many attempts. Please wait {$minutes} minute(s) before trying again.";
    }
}
