import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import QuoteCard from '@/Components/QuoteCard';
import Pagination from '@/Components/Pagination';
import { Heart } from 'lucide-react';

export default function Liked({ auth, profile, quotes, collections = [] }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Quotes liked by ${profile.name}`} />

            <div className="max-w-5xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                        <Heart className="w-6 h-6 mr-2 text-red-500" />
                        Quotes Liked by {profile.name}
                    </h1>
                    <p className="text-gray-600 mt-2">
                        {quotes.total} quote{quotes.total !== 1 ? 's' : ''} liked
                    </p>
                </div>

                {quotes.data.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No liked quotes</h3>
                        <p className="text-gray-600">
                            {profile.name} hasn't liked any quotes yet.
                        </p>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
