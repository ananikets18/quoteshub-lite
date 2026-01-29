import { Link } from '@inertiajs/react';
import { Trophy, Award } from 'lucide-react';
import AchievementBadge from './AchievementBadge';

export default function AchievementsWidget({ achievements = [], totalPoints = 0, username }) {
    const displayAchievements = achievements.slice(0, 6); // Show max 6 badges
    const remainingCount = Math.max(0, achievements.length - 6);

    if (achievements.length === 0) {
        return null;
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    Achievements
                </h3>
                <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-600" />
                    <span className="font-bold text-purple-600">{totalPoints}</span>
                    <span className="text-sm text-gray-500">pts</span>
                </div>
            </div>

            {/* Achievement Badges */}
            <div className="flex flex-wrap gap-3 mb-4">
                {displayAchievements.map((achievement, index) => (
                    <AchievementBadge
                        key={achievement.id || index}
                        achievement={achievement}
                        size="md"
                        showTooltip={true}
                    />
                ))}
                {remainingCount > 0 && (
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 font-bold">
                        +{remainingCount}
                    </div>
                )}
            </div>

            {/* View All Link */}
            <Link
                href={route('achievements')}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1 group"
            >
                View all achievements
                <svg
                    className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                    />
                </svg>
            </Link>
        </div>
    );
}
