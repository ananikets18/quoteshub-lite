export default function QuoteCardSkeleton() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-4 animate-pulse">
            {/* User Info Skeleton */}
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-24"></div>
                </div>
            </div>

            {/* Quote Content Skeleton */}
            <div className="space-y-3 mb-4">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-4/6"></div>
            </div>

            {/* Author Skeleton */}
            <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-40 mb-4"></div>

            {/* Tags Skeleton */}
            <div className="flex gap-2 mb-4">
                <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded-full w-16"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded-full w-20"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded-full w-16"></div>
            </div>

            {/* Actions Skeleton */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-4">
                    <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded w-16"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded w-16"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded w-16"></div>
                </div>
                <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded-full w-8"></div>
            </div>
        </div>
    );
}
