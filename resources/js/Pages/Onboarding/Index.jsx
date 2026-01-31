import { useState } from 'react';
import { router } from '@inertiajs/react';
import SeoHead from '@/Components/SeoHead';
import { Sparkles, Heart, User, Users, CheckCircle, ArrowRight, X } from 'lucide-react';
import axios from 'axios';
import Toast from '@/Components/Toast';

export default function Onboarding({ user, currentStep: initialStep, creators }) {
    const [currentStep, setCurrentStep] = useState(initialStep || 'welcome');
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('info');
    const [showSkipModal, setShowSkipModal] = useState(false);

    const steps = [
        { id: 'welcome', title: 'Welcome', icon: Sparkles },
        { id: 'interests', title: 'Interests', icon: Heart },
        { id: 'profile', title: 'Profile', icon: User },
        { id: 'follow', title: 'Follow', icon: Users },
    ];

    const currentStepIndex = steps.findIndex(s => s.id === currentStep);

    const showNotification = (message, type = 'info') => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
    };

    const getCsrfToken = () => {
        return document.head.querySelector('meta[name="csrf-token"]')?.content;
    };

    const handleNext = async (stepData = {}) => {
        setLoading(true);

        try {
            const response = await axios.post('/onboarding/step', {
                step: currentStep,
                data: stepData,
            }, {
                headers: {
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
            });

            if (response.data.success) {
                const nextStepId = response.data.currentStep;

                if (nextStepId === 'complete') {
                    await completeOnboarding();
                } else {
                    setCurrentStep(nextStepId);
                }
            }
        } catch (error) {
            if (error.response?.status === 429) {
                showNotification(error.response.data.message || 'Too many requests. Please slow down.', 'warning');
            } else if (error.response?.status === 419) {
                showNotification('Session expired. Please refresh the page.', 'error');
            } else {
                showNotification('Failed to save progress. Please try again.', 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    const completeOnboarding = async () => {
        try {
            const response = await axios.post('/onboarding/complete', {}, {
                headers: {
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
            });

            if (response.data.success) {
                showNotification(response.data.message, 'success');
                setTimeout(() => {
                    router.visit('/feed');
                }, 1500);
            }
        } catch (error) {
            if (error.response?.status === 429) {
                showNotification('Too many requests. Please wait a moment.', 'warning');
            } else if (error.response?.status === 419) {
                showNotification('Session expired. Please refresh the page.', 'error');
            } else {
                showNotification('Failed to complete onboarding. Please try again.', 'error');
            }
        }
    };

    const handleSkip = () => {
        setShowSkipModal(true);
    };

    const confirmSkip = () => {
        router.post('/onboarding/skip');
    };

    return (
        <>
            <SeoHead title="Welcome to QuotesHub" description="Complete your QuotesHub profile and discover quotes tailored to you." />

            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
                {/* Skip Button */}
                <button
                    onClick={handleSkip}
                    className="absolute top-4 right-4 p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors z-10"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Progress Bar */}
                <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-800 z-50">
                    <div
                        className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500"
                        style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                    />
                </div>

                {/* Content */}
                <div className="flex items-center justify-center min-h-screen p-4 pt-8">
                    <div className="w-full max-w-2xl">
                        {/* Step Indicators */}
                        <div className="flex justify-center mb-8 gap-2">
                            {steps.map((step, index) => {
                                const Icon = step.icon;
                                const isActive = index === currentStepIndex;
                                const isCompleted = index < currentStepIndex;

                                return (
                                    <div
                                        key={step.id}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${isActive
                                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white scale-110'
                                            : isCompleted
                                                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                                : 'bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                                            }`}
                                    >
                                        {isCompleted ? (
                                            <CheckCircle className="w-4 h-4" />
                                        ) : (
                                            <Icon className="w-4 h-4" />
                                        )}
                                        <span className="text-sm font-medium hidden sm:inline">{step.title}</span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Step Content */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 animate-fade-in">
                            {currentStep === 'welcome' && (
                                <WelcomeStep onNext={handleNext} loading={loading} user={user} />
                            )}
                            {currentStep === 'interests' && (
                                <InterestsStep onNext={handleNext} loading={loading} />
                            )}
                            {currentStep === 'profile' && (
                                <ProfileStep onNext={handleNext} loading={loading} user={user} />
                            )}
                            {currentStep === 'follow' && (
                                <FollowStep onNext={handleNext} loading={loading} creators={creators} />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Skip Confirmation Modal */}
            {showSkipModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                    <Sparkles className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Skip Onboarding?
                                    </h3>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowSkipModal(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Are you sure you want to skip the setup? You can always customize your profile and preferences later from your settings.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowSkipModal(false)}
                                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg transition-colors"
                            >
                                Continue Setup
                            </button>
                            <button
                                onClick={confirmSkip}
                                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:shadow-lg transition-all"
                            >
                                Skip for Now
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Toast
                show={showToast}
                onClose={() => setShowToast(false)}
                message={toastMessage}
                type={toastType}
            />
        </>
    );
}

// Welcome Step Component
function WelcomeStep({ onNext, loading, user }) {
    return (
        <div className="text-center">
            <div className="mb-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-4">
                    <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    Welcome to QuotesHub, {user?.name}! 🎉
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                    Let's personalize your experience in just a few steps
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                    <Heart className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Discover Quotes</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Find inspiration daily</p>
                </div>
                <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-xl">
                    <Users className="w-8 h-8 text-pink-600 dark:text-pink-400 mx-auto mb-2" />
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Connect</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Follow like-minded people</p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Share</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Post your favorites</p>
                </div>
            </div>

            <button
                onClick={() => onNext()}
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
            >
                {loading ? 'Loading...' : 'Get Started'}
                <ArrowRight className="w-5 h-5" />
            </button>
        </div>
    );
}

// Interests Step Component
function InterestsStep({ onNext, loading }) {
    const [selectedCategories, setSelectedCategories] = useState([]);

    const categories = [
        { id: 1, name: 'Motivation', emoji: '💪', color: 'purple' },
        { id: 2, name: 'Love', emoji: '❤️', color: 'pink' },
        { id: 3, name: 'Life', emoji: '🌟', color: 'blue' },
        { id: 4, name: 'Success', emoji: '🏆', color: 'yellow' },
        { id: 5, name: 'Wisdom', emoji: '🦉', color: 'indigo' },
        { id: 6, name: 'Happiness', emoji: '😊', color: 'green' },
        { id: 7, name: 'Inspiration', emoji: '✨', color: 'purple' },
        { id: 8, name: 'Friendship', emoji: '🤝', color: 'blue' },
    ];

    const toggleCategory = (categoryId) => {
        setSelectedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const handleNext = () => {
        if (selectedCategories.length === 0) {
            // Show inline error instead of alert
            const errorEl = document.getElementById('category-error');
            if (errorEl) {
                errorEl.classList.remove('hidden');
                errorEl.classList.add('animate-shake');
                setTimeout(() => errorEl.classList.remove('animate-shake'), 500);
            }
            return;
        }
        onNext({ categories: selectedCategories });
    };

    return (
        <div>
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    What interests you?
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Select topics you'd like to see in your feed
                </p>

                {/* Error Message */}
                <div id="category-error" className="hidden mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                        Please select at least one interest to continue
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                {categories.map(category => (
                    <button
                        key={category.id}
                        onClick={() => toggleCategory(category.id)}
                        className={`p-4 rounded-xl border-2 transition-all ${selectedCategories.includes(category.id)
                            ? `border-${category.color}-600 bg-${category.color}-50 dark:bg-${category.color}-900/20 scale-105`
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                    >
                        <div className="text-3xl mb-2">{category.emoji}</div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {category.name}
                        </div>
                    </button>
                ))}
            </div>

            <button
                onClick={handleNext}
                disabled={loading || selectedCategories.length === 0}
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
            >
                {loading ? 'Saving...' : 'Continue'}
                <ArrowRight className="w-5 h-5" />
            </button>
        </div>
    );
}

// Profile Step Component
function ProfileStep({ onNext, loading, user }) {
    const [bio, setBio] = useState(user?.bio || '');

    const handleNext = () => {
        onNext({ bio });
    };

    return (
        <div>
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Tell us about yourself
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Add a bio to your profile (optional)
                </p>
            </div>

            <div className="mb-8">
                <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Write a short bio about yourself..."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                    rows="4"
                    maxLength="160"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {bio.length}/160 characters
                </p>
            </div>

            <button
                onClick={handleNext}
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
            >
                {loading ? 'Saving...' : 'Continue'}
                <ArrowRight className="w-5 h-5" />
            </button>
        </div>
    );
}

// Follow Step Component
function FollowStep({ onNext, loading, creators }) {
    const [selectedUsers, setSelectedUsers] = useState([]);

    const toggleUser = (userId) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleFollowUser = async (userId) => {
        try {
            const response = await axios.post(`/follow/${userId}`, {}, {
                headers: {
                    'X-CSRF-TOKEN': document.head.querySelector('meta[name="csrf-token"]')?.content,
                },
            });
            
            if (response.data.success) {
                setSelectedUsers(prev => [...prev, userId]);
            }
        } catch (error) {
            console.error('Failed to follow user:', error);
        }
    };

    const handleUnfollowUser = async (userId) => {
        try {
            const response = await axios.delete(`/follow/${userId}`, {
                headers: {
                    'X-CSRF-TOKEN': document.head.querySelector('meta[name="csrf-token"]')?.content,
                },
            });
            
            if (response.data.success) {
                setSelectedUsers(prev => prev.filter(id => id !== userId));
            }
        } catch (error) {
            console.error('Failed to unfollow user:', error);
        }
    };

    const handleNext = () => {
        onNext({ following: selectedUsers });
    };

    return (
        <div>
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Follow our creators
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Stay updated with quotes from Aniket Shinde (founder) and QuotesHub official
                </p>
            </div>

            <div className="space-y-3 mb-8">
                {creators?.map(creator => (
                    <div
                        key={creator.id}
                        className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            {creator.avatar ? (
                                <img 
                                    src={creator.avatar} 
                                    alt={creator.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                                    {creator.name.charAt(0)}
                                </div>
                            )}
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">{creator.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    @{creator.username} · {creator.followers_count || 0} followers
                                </p>
                                {creator.bio && (
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                        {creator.bio}
                                    </p>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                if (selectedUsers.includes(creator.id)) {
                                    handleUnfollowUser(creator.id);
                                } else {
                                    handleFollowUser(creator.id);
                                }
                            }}
                            className={`px-4 py-2 rounded-full font-medium transition-all ${
                                selectedUsers.includes(creator.id) || creator.is_following
                                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                            }`}
                        >
                            {selectedUsers.includes(creator.id) || creator.is_following ? 'Following' : 'Follow'}
                        </button>
                    </div>
                ))}
            </div>

            <button
                onClick={handleNext}
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
            >
                {loading ? 'Finishing...' : 'Complete Setup'}
                <CheckCircle className="w-5 h-5" />
            </button>
        </div>
    );
}
