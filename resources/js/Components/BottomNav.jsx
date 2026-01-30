import { Link, usePage } from '@inertiajs/react';
import { Home, Search, PlusCircle, Bookmark, User } from 'lucide-react';

export default function BottomNav({ isVisible = true }) {
    const { url } = usePage();

    const navItems = [
        { name: 'Home', href: '/feed', icon: Home },
        { name: 'Search', href: '/search', icon: Search },
        { name: 'Create', href: '/quotes/create', icon: PlusCircle },
        { name: 'Saved', href: '/saved', icon: Bookmark },
        { name: 'Profile', href: '/profile', icon: User },
    ];

    const isActive = (href) => {
        if (href === '/feed') {
            return url === '/' || url === '/feed';
        }
        return url.startsWith(href);
    };

    return (
        <nav className={`bottom-nav safe-area-bottom transition-transform duration-300 ${isVisible ? 'translate-y-0' : 'translate-y-full'
            }`}>
            <div className="flex items-center justify-around max-w-lg mx-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`bottom-nav-item ${active ? 'active' : ''}`}
                        >
                            <Icon
                                className={`w-6 h-6 ${active ? 'text-purple-600 dark:text-purple-400' : ''
                                    }`}
                                strokeWidth={active ? 2.5 : 2}
                            />
                            <span className={`text-xs font-medium ${active ? 'font-semibold' : ''}`}>
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
