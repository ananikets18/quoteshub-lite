<?php

namespace App\Http\Controllers;

use App\Services\AchievementService;
use Illuminate\Http\Request;

class AchievementController extends Controller
{
    protected $achievementService;

    public function __construct(AchievementService $achievementService)
    {
        $this->achievementService = $achievementService;
    }

    /**
     * Display the achievements page
     */
    public function index()
    {
        $user = auth()->user();

        $achievements = $this->achievementService->getUserAchievements($user);
        $progress = $this->achievementService->getProgress($user);
        $totalPoints = $this->achievementService->getTotalPoints($user);

        return view('achievements', compact('achievements', 'progress', 'totalPoints'));
    }

    /**
     * Get achievements for a specific user (for profile display)
     */
    public function userAchievements($username)
    {
        $user = \App\Models\User::where('username', $username)->firstOrFail();

        $achievements = $this->achievementService->getUserAchievements($user);
        $totalPoints = $this->achievementService->getTotalPoints($user);

        return response()->json([
            'achievements' => $achievements,
            'totalPoints' => $totalPoints,
        ]);
    }
}
