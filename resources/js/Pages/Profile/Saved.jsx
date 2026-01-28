import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import QuoteCard from '@/Components/QuoteCard';
import Pagination from '@/Components/Pagination';
import { Bookmark, FolderPlus } from 'lucide-react';

export default function Saved({ auth, quotes, collections = [] }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Saved Quotes" />

            <div className="max-w-5xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                                <Bookmark className="w-6 h-6 mr-2 text-purple-600" />
                                Saved Quotes
                            </h1>
                            <p className="text-gray-600 mt-2">
                                {quotes.total} quote{quotes.total !== 1 ? 's' : ''} saved
                            </p>
                        </div>
                        <Link
                            href={route('collections.index')}
                            className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
                        >
                            <FolderPlus className="w-4 h-4 mr-2" />
                            Manage Collections
                        </Link>
                    </div>
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

                        <Pagination links={quotes.links} />
                    </>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <Bookmark className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved quotes yet</h3>
                        <p className="text-gray-600 mb-6">
                            Start saving your favorite quotes to read them later!
                        </p>
                        <Link
                            href={route('feed')}
                            className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
                        >
                            Explore Quotes
                        </Link>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
