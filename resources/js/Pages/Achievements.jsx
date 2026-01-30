import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Trophy, Lock, Star, TrendingUp, Users, BookMarked, Flame, Award } from 'lucide-react';

export default function Achievements({ auth, achievements, progress, totalPoints }) {
    const categories = {
        creation: { name: 'Creation', icon: '✍️', color: 'purple' },
        popularity: { name: 'Popularity', icon: '⭐', color: 'yellow' },
        social: { name: 'Social', icon: '👥', color: 'blue' },
        collection: { name: 'Collection', icon: '🔖', color: 'green' },
        engagement: { name: 'Engagement', icon: '🔥', color: 'orange' },
        special: { name: 'Special', icon: '👑', color: 'pink' },
    };

    const groupedProgress = Object.entries(progress).reduce((acc, [type, data]) => {
        const category = data.definition.category;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push({ type, ...data });
        return acc;
    }, {});

    const getColorClasses = (color, unlocked) => {
        const colors = {
            purple: unlocked ? 'bg-purple-100 border-purple-300 text-purple-900' : 'bg-gray-100 border-gray-300 text-gray-500',
            yellow: unlocked ? 'bg-yellow-100 border-yellow-300 text-yellow-900' : 'bg-gray-100 border-gray-300 text-gray-500',
            blue: unlocked ? 'bg-blue-100 border-blue-300 text-blue-900' : 'bg-gray-100 border-gray-300 text-gray-500',
            green: unlocked ? 'bg-green-100 border-green-300 text-green-900' : 'bg-gray-100 border-gray-300 text-gray-500',
            orange: unlocked ? 'bg-orange-100 border-orange-300 text-orange-900' : 'bg-gray-100 border-gray-300 text-gray-500',
            pink: unlocked ? 'bg-pink-100 border-pink-300 text-pink-900' : 'bg-gray-100 border-gray-300 text-gray-500',
        };
        return colors[color] || colors.purple;
    };

    const unlockedCount = Object.values(progress).filter(p => p.unlocked).length;
    const totalCount = Object.keys(progress).length;
    const completionPercentage = Math.round((unlockedCount / totalCount) * 100);

    return (
        <AppLayout user={auth.user} showNav={true}>
            <Head title="Achievements" />

            <div className="px-4 py-6 pb-20">
                <div className="max-w-7xl mx-auto">
                    {/* Header Stats */}
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-lg p-6 mb-6 text-white">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div>
                                <h1 className="text-2xl font-bold flex items-center gap-2">
                                    <Trophy className="w-7 h-7" />
                                    Achievements
                                </h1>
                                <p className="mt-1 text-purple-100 text-sm">
                                    Track your progress and unlock rewards
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="text-4xl font-bold">{totalPoints}</div>
                                <div className="text-purple-100 text-sm">Total Points</div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-6">
                            <div className="flex items-center justify-between text-sm mb-2">
                                <span>{unlockedCount} of {totalCount} unlocked</span>
                                <span>{completionPercentage}%</span>
                            </div>
                            <div className="w-full bg-purple-800 rounded-full h-3">
                                <div
                                    className="bg-white rounded-full h-3 transition-all duration-500"
                                    style={{ width: `${completionPercentage}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Achievement Categories */}
                    {Object.entries(categories).map(([categoryKey, category]) => {
                        const categoryAchievements = groupedProgress[categoryKey] || [];
                        if (categoryAchievements.length === 0) return null;

                        const categoryUnlocked = categoryAchievements.filter(a => a.unlocked).length;

                        return (
                            <div key={categoryKey} className="mb-6">
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                                    <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                                <span className="text-2xl">{category.icon}</span>
                                                {category.name}
                                            </h2>
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                {categoryUnlocked}/{categoryAchievements.length}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {categoryAchievements.map((achievement) => (
                                                <div
                                                    key={achievement.type}
                                                    className={`relative rounded-lg border-2 p-4 transition-all hover:shadow-md ${getColorClasses(category.color, achievement.unlocked)
                                                        } ${!achievement.unlocked && 'opacity-60'}`}
                                                >
                                                    {/* Lock Icon for Locked Achievements */}
                                                    {!achievement.unlocked && (
                                                        <div className="absolute top-2 right-2">
                                                            <Lock className="w-5 h-5 text-gray-400" />
                                                        </div>
                                                    )}

                                                    {/* Achievement Icon */}
                                                    <div className="text-4xl mb-3">
                                                        {achievement.definition.icon}
                                                    </div>

                                                    {/* Achievement Info */}
                                                    <h3 className="font-bold text-lg mb-1">
                                                        {achievement.definition.name}
                                                    </h3>
                                                    <p className="text-sm mb-3 opacity-90">
                                                        {achievement.definition.description}
                                                    </p>

                                                    {/* Points */}
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-white bg-opacity-50">
                                                            {achievement.definition.points} pts
                                                        </span>
                                                        {achievement.unlocked && achievement.unlocked_at && (
                                                            <span className="text-xs opacity-75">
                                                                {new Date(achievement.unlocked_at).toLocaleDateString()}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Unlocked Badge */}
                                                    {achievement.unlocked && (
                                                        <div className="absolute -top-2 -right-2">
                                                            <div className="bg-green-500 text-white rounded-full p-1">
                                                                <Award className="w-4 h-4" />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Recent Achievements */}
                    {achievements.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Star className="w-6 h-6 text-yellow-500" />
                                Recent Achievements
                            </h2>
                            <div className="space-y-3">
                                {achievements.slice(0, 5).map((achievement) => (
                                    <div
                                        key={achievement.id}
                                        className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                                    >
                                        <div className="text-3xl">{achievement.definition.icon}</div>
                                        <div className="flex-1">
                                            <div className="font-semibold text-gray-900 dark:text-white">
                                                {achievement.definition.name}
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                {achievement.definition.description}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-purple-600">
                                                +{achievement.definition.points}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {new Date(achievement.completed_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
