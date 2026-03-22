<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PushSubscriptionController extends Controller
{
    /**
     * Store a push subscription for the authenticated user.
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'endpoint'    => 'required|url',
            'keys.auth'   => 'required|string',
            'keys.p256dh' => 'required|string'
        ]);

        $endpoint = $request->input('endpoint');
        $key = $request->input('keys.p256dh');
        $token = $request->input('keys.auth');
        $contentEncoding = $request->input('encoding', 'aesgcm'); // defaults to aesgcm if null

        // Update web-push library uses User trait: updatePushSubscription
        $user = $request->user();
        $user->updatePushSubscription($endpoint, $key, $token, $contentEncoding);

        return response()->json(['success' => true], 200);
    }

    /**
     * Delete a push subscription.
     */
    public function destroy(Request $request)
    {
        $this->validate($request, ['endpoint' => 'required|url']);

        $user = $request->user();
        $user->deletePushSubscription($request->input('endpoint'));

        return response()->json(['success' => true], 200);
    }
}
