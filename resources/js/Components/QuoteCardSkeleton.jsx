export default function QuoteCardSkeleton() {
    return (
        <div className="bg-white dark:bg-gray-800 px-4 sm:px-5 py-4 sm:py-5 border-b border-gray-200 dark:border-gray-700 animate-pulse">
            {/* User Info Skeleton */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-600 rounded-full"></div>
                    <div className="flex-1">
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32 mb-2"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-24"></div>
                    </div>
                </div>
                <div className="w-5 h-5 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
            </div>

            {/* Quote Content Skeleton */}
            <div className="mt-3">
                <div className="space-y-3 mb-3">
                    <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-11/12"></div>
                    <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                </div>

                {/* Author Skeleton */}
                <div className="pl-4 border-l-4 border-gray-300 dark:border-gray-600 mb-3">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-40 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-32"></div>
                </div>

                {/* Tags Skeleton */}
                <div className="flex gap-2 mb-3">
                    <div className="h-7 bg-purple-100 dark:bg-purple-900/20 rounded-full w-20"></div>
                    <div className="h-7 bg-purple-100 dark:bg-purple-900/20 rounded-full w-24"></div>
                    <div className="h-7 bg-purple-100 dark:bg-purple-900/20 rounded-full w-20"></div>
                </div>
            </div>

            {/* Actions Skeleton */}
            <div className="mt-3 pt-3 flex items-center justify-between border-t border-gray-100 dark:border-gray-700/50">
                <div className="flex gap-5 sm:gap-6">
                    <div className="h-6 w-6 bg-gray-200 dark:bg-gray-600 rounded"></div>
                    <div className="h-6 w-6 bg-gray-200 dark:bg-gray-600 rounded"></div>
                    <div className="h-6 w-6 bg-gray-200 dark:bg-gray-600 rounded"></div>
                </div>
                <div className="h-4 w-12 bg-gray-200 dark:bg-gray-600 rounded"></div>
            </div>
        </div>
    );
}
