import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import QuoteCard from '@/Components/QuoteCard';
import Pagination from '@/Components/Pagination';
import { Heart } from 'lucide-react';

export default function Liked({ auth, profile, quotes, collections = [] }) {
    return (
        <AppLayout user={auth.user} showNav={true}>
            <Head title={`Quotes liked by ${profile.name}`} />

            <div className="px-4 py-6 pb-20">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center mb-2">
                        <Heart className="w-7 h-7 mr-2 text-red-500 dark:text-red-400" />
                        Quotes Liked by {profile.name}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {quotes.total} quote{quotes.total !== 1 ? 's' : ''} liked
                    </p>
                </div>

                {quotes.data.length > 0 ? (
                    <>
                        <div className="space-y-4">
                            {quotes.data.map((quote) => (
                                <QuoteCard 
                                    key={quote.id} 
                                    quote={quote} 
                                    auth={auth}
                                    collections={collections}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {quotes.links.length > 3 && (
                            <Pagination links={quotes.links} />
                        )}
                    </>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                        <Heart className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No liked quotes</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            {profile.name} hasn't liked any quotes yet.
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
