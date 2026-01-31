import { Link } from '@inertiajs/react';
import { Heart, Github, Twitter } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 mt-auto">
            <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#5D41E6] to-[#4b33c2]">
                                QuotesHub
                            </span>
                        </Link>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Discover, save, and share the world's most inspiring quotes. Join our community of wisdom seekers today.
                        </p>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                            Company
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/about" className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#5D41E6] dark:hover:text-[#5D41E6] transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#5D41E6] dark:hover:text-[#5D41E6] transition-colors">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link href="/guidelines" className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#5D41E6] dark:hover:text-[#5D41E6] transition-colors">
                                    Community Guidelines
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                            Legal
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/privacy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#5D41E6] dark:hover:text-[#5D41E6] transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#5D41E6] dark:hover:text-[#5D41E6] transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link href="/cookies" className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#5D41E6] dark:hover:text-[#5D41E6] transition-colors">
                                    Cookie Policy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                            Connect
                        </h3>
                        <div className="flex space-x-4">
                            <a
                                href="https://twitter.com/quoteshub"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-[#5D41E6] transition-colors"
                            >
                                <span className="sr-only">Twitter</span>
                                <Twitter className="h-6 w-6" />
                            </a>
                            <a
                                href="https://github.com/quoteshub"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-[#5D41E6] transition-colors"
                            >
                                <span className="sr-only">GitHub</span>
                                <Github className="h-6 w-6" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-12 border-t border-gray-100 dark:border-gray-700 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center md:text-left">
                        &copy; {currentYear} QuotesHub. All rights reserved.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> by QuotesHub Team
                    </p>
                </div>
            </div>
        </footer>
    );
}
