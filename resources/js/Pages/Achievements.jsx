import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Trophy, Lock, Star, Flame, Zap, Award, Target, Share2, Crown } from 'lucide-react';

export default function Achievements({ auth, achievements, progress, totalPoints }) {
    const categories = {
        creation: { name: 'Creation', icon: '✍️', color: 'purple', description: 'Crafting quotes' },
        popularity: { name: 'Popularity', icon: '⭐', color: 'yellow', description: 'Getting recognized' },
        social: { name: 'Social', icon: '👥', color: 'blue', description: 'Community interaction' },
        collection: { name: 'Collection', icon: '🔖', color: 'green', description: 'Curating content' },
        engagement: { name: 'Engagement', icon: '🔥', color: 'orange', description: 'Daily activity' },
        special: { name: 'Special', icon: '👑', color: 'pink', description: 'Rare milestones' },
    };

    const groupedProgress = Object.entries(progress).reduce((acc, [type, data]) => {
        const category = data.definition.category;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push({ type, ...data });
        return acc;
    }, {});

    const unlockedCount = Object.values(progress).filter(p => p.unlocked).length;
    const totalCount = Object.keys(progress).length;
    const completionPercentage = Math.round((unlockedCount / totalCount) * 100);

    // Level System Calculation
    const currentLevel = Math.floor(totalPoints / 1000) + 1;
    const nextLevelPoints = currentLevel * 1000;
    const levelProgress = ((totalPoints % 1000) / 1000) * 100;

    return (
        <AppLayout user={auth.user} showNav={true}>
            <Head title="Achievements & Streak" />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
                {/* 1. Streak Hero Section */}
                <div className="relative bg-gray-900 text-white overflow-hidden rounded-b-[2.5rem] shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-gray-900 opacity-90" />

                    {/* Animated Background Elements */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30">
                        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500 rounded-full mix-blend-overlay filter blur-3xl animate-pulse" />
                        <div className="absolute bottom-10 right-10 w-48 h-48 bg-indigo-500 rounded-full mix-blend-overlay filter blur-3xl animate-pulse delay-1000" />
                    </div>

                    <div className="relative relative z-10 px-6 pt-8 pb-12 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-6">
                            <Crown className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm font-medium text-yellow-100 tracking-wide uppercase">Your Legacy</span>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="relative mb-4 group">
                                <div className="absolute inset-0 bg-orange-500 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity animate-pulse" />
                                <Flame className="w-20 h-20 text-orange-500 relative z-10 drop-shadow-[0_0_15px_rgba(249,115,22,0.5)] animate-bounce-slow" />
                                <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full border-2 border-gray-900 transform rotate-12">
                                    ON FIRE
                                </div>
                            </div>

                            <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400 filter drop-shadow-lg mb-1">
                                {auth.user.daily_streak || 0}
                            </div>
                            <div className="text-orange-200 font-medium text-lg tracking-wide mb-6">Day Streak</div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto mt-4">
                            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3 border border-white/10">
                                <Trophy className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                                <div className="text-xl font-bold">{totalPoints}</div>
                                <div className="text-xs text-purple-200/70">Points</div>
                            </div>
                            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3 border border-white/10">
                                <Target className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                                <div className="text-xl font-bold">{currentLevel}</div>
                                <div className="text-xs text-blue-200/70">Level</div>
                            </div>
                            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3 border border-white/10">
                                <Award className="w-5 h-5 text-green-400 mx-auto mb-1" />
                                <div className="text-xl font-bold">{unlockedCount}</div>
                                <div className="text-xs text-green-200/70">Unlocked</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Level Progress */}
                <div className="px-4 -mt-6 relative z-20 mb-8 max-w-2xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-5 border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-end mb-2">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Level Progress</h3>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    Level {currentLevel}
                                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400 self-center">
                                        / {currentLevel + 1}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                                    {totalPoints % 1000}
                                </span>
                                <span className="text-xs text-gray-400"> / 1000 XP</span>
                            </div>
                        </div>
                        <div className="h-3 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${levelProgress}%` }}
                            />
                        </div>
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                            Only <span className="font-bold text-gray-700 dark:text-gray-300">{1000 - (totalPoints % 1000)} XP</span> needed for Level {currentLevel + 1}
                        </p>
                    </div>
                </div>

                {/* 3. Achievements Content */}
                <div className="px-4 max-w-4xl mx-auto space-y-8">

                    {/* Recent Unlocks (Horizontal Scroll) */}
                    {achievements.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-4 px-2">
                                <Zap className="w-5 h-5 text-yellow-500" />
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Unlocks</h2>
                            </div>
                            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x">
                                {achievements.slice(0, 5).map((achievement) => (
                                    <div
                                        key={achievement.id}
                                        className="snap-center flex-shrink-0 w-64 bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center relative overflow-hidden group hover:shadow-md transition-all"
                                    >
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-500" />
                                        <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                                            {achievement.definition.icon}
                                        </div>
                                        <h3 className="font-bold text-gray-900 dark:text-white mb-1 truncate w-full">
                                            {achievement.definition.name}
                                        </h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                                            {achievement.definition.description}
                                        </p>
                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 text-xs font-bold rounded-full">
                                            +{achievement.definition.points} XP
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* All Categories */}
                    <div>
                        <div className="flex items-center gap-2 mb-6 px-2">
                            <Trophy className="w-5 h-5 text-purple-500" />
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Badge Collection</h2>
                        </div>

                        <div className="space-y-6">
                            {Object.entries(categories).map(([categoryKey, category]) => {
                                const categoryAchievements = groupedProgress[categoryKey] || [];
                                if (categoryAchievements.length === 0) return null;

                                const categoryUnlocked = categoryAchievements.filter(a => a.unlocked).length;
                                const isAllUnlocked = categoryUnlocked === categoryAchievements.length;

                                return (
                                    <div key={categoryKey} className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-${category.color}-50 dark:bg-gray-700`}>
                                                    {category.icon}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">{category.name}</h3>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{category.description}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-2xl font-black text-gray-900 dark:text-white">{categoryUnlocked}</span>
                                                <span className="text-sm text-gray-400">/{categoryAchievements.length}</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                            {categoryAchievements.map((achievement) => (
                                                <div
                                                    key={achievement.type}
                                                    className={`group relative flex flex-col items-center p-4 rounded-2xl border transition-all duration-200 ${achievement.unlocked
                                                            ? 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-500/50'
                                                            : 'bg-gray-50/50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 grayscale opacity-60 hover:opacity-100'
                                                        }`}
                                                >
                                                    <div className={`text-4xl mb-3 transition-transform duration-300 ${achievement.unlocked ? 'group-hover:scale-110 group-hover:rotate-6' : ''}`}>
                                                        {achievement.definition.icon}
                                                    </div>

                                                    <h4 className="font-bold text-sm text-center text-gray-900 dark:text-white leading-tight mb-1">
                                                        {achievement.definition.name}
                                                    </h4>

                                                    {/* Lock Overlay */}
                                                    {!achievement.unlocked && (
                                                        <div className="absolute top-2 right-2">
                                                            <Lock className="w-3 h-3 text-gray-400" />
                                                        </div>
                                                    )}

                                                    {/* Unlocked Date or Points */}
                                                    <div className="mt-2 text-center">
                                                        {achievement.unlocked ? (
                                                            <span className="text-[10px] font-medium text-green-600 dark:text-green-400 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 rounded-full">
                                                                Unlocked
                                                            </span>
                                                        ) : (
                                                            <span className="text-[10px] font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                                                                {achievement.definition.points} XP
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Tooltip for Description (Visible on Hover/Focus) */}
                                                    <div className="absolute inset-0 bg-gray-900/90 backdrop-blur-sm rounded-2xl p-4 flex flex-col items-center justify-center text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                                                        <p className="text-xs text-gray-200 font-medium leading-relaxed">
                                                            {achievement.definition.description}
                                                        </p>
                                                        {!achievement.unlocked && (
                                                            <p className="mt-2 text-[10px] text-yellow-400 font-bold uppercase tracking-wide">
                                                                Locked
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
