import { Link } from '@inertiajs/react';
import { getSafePaginationLabel } from '@/Utils/sanitize';

export default function Pagination({ links }) {
    if (!links || links.length <= 3) {
        return null;
    }

    return (
        <div className="mt-6 flex justify-center space-x-2">
            {links.map((link, index) => (
                link.url ? (
                    <Link
                        key={index}
                        href={link.url}
                        className={`px-4 py-2 rounded-lg ${link.active
                                ? 'bg-purple-600 text-white'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                    >
                        {getSafePaginationLabel(link.label)}
                    </Link>
                ) : (
                    <span
                        key={index}
                        className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    >
                        {getSafePaginationLabel(link.label)}
                    </span>
                )
            ))}
        </div>
    );
}
