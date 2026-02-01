import { Link } from '@inertiajs/react';
import { Heart } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 mt-auto py-8">
            <div className="max-w-lg mx-auto px-4 flex flex-col items-center space-y-6">

                {/* Links */}
                <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                    <Link href="/about" className="hover:text-[#5D41E6] transition-colors">About</Link>
                    <Link href="/guidelines" className="hover:text-[#5D41E6] transition-colors">Guidelines</Link>
                    <Link href="/privacy" className="hover:text-[#5D41E6] transition-colors">Privacy</Link>
                    <Link href="/terms" className="hover:text-[#5D41E6] transition-colors">Terms</Link>
                    <Link href="/contact" className="hover:text-[#5D41E6] transition-colors">Contact</Link>
                </nav>

                {/* Copyright & Brand */}
                <div className="flex flex-col items-center gap-2 text-xs text-gray-400 dark:text-gray-500 text-center">
                    <Link href="/" className="font-bold text-gray-600 dark:text-gray-300 hover:text-[#5D41E6] transition-colors">
                        QuotesHub
                    </Link>
                    <p className="flex items-center gap-1">
                        &copy; {new Date().getFullYear()} • Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                    </p>
                </div>
            </div>
        </footer>
    );
}
