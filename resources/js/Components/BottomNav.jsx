import { Link, usePage } from '@inertiajs/react';
import { Home, Search, PlusCircle, Bookmark, Bell } from 'lucide-react';

export default function BottomNav({ isVisible = true, auth = {}, unreadCount = 0 }) {
    const { url } = usePage();
    const isGuest = !auth?.user;

    const navItems = [
        { name: 'Home', href: '/feed', icon: Home, guestAware: false },
        { name: 'Search', href: '/search', icon: Search, guestAware: false },
        { name: 'Create', href: '/quotes/create', icon: PlusCircle, guestAware: true },
        { name: 'Saved', href: '/saved', icon: Bookmark, guestAware: true },
        { name: 'Notifications', href: '/notifications', icon: Bell, guestAware: true, badge: unreadCount },
    ].map((item) => ({
        ...item,
        href: item.guestAware && isGuest ? '/login' : item.href,
        isGuestLink: item.guestAware && isGuest,
    }));

    const isActive = (item) => {
        if (item.isGuestLink) return false;
        if (item.href === '/feed') return url === '/' || url === '/feed';
        if (item.href === '/notifications') return url.startsWith('/notifications');
        return url.startsWith(item.href);
    };

    return (
        <nav
            className={`bottom-nav safe-area-bottom transition-transform duration-300 md:hidden ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}
            aria-label="Main navigation"
        >
            <div className="flex items-center justify-around max-w-lg mx-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item);

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`bottom-nav-item relative ${active ? 'active' : ''} ${item.isGuestLink ? 'bottom-nav-item-guest' : ''}`}
                            aria-current={active ? 'page' : undefined}
                        >
                            <span className="relative inline-flex">
                                <Icon
                                    className={`w-6 h-6 shrink-0 ${active ? 'text-primary-600 dark:text-purple-400' : ''}`}
                                    strokeWidth={active ? 2.5 : 2}
                                    aria-hidden
                                />
                                {item.badge > 0 && (
                                    <span
                                        className="absolute -top-1.5 -right-1.5 min-w-[1rem] h-4 px-1 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full"
                                        aria-label={`${item.badge} unread notifications`}
                                    >
                                        {item.badge > 9 ? '9+' : item.badge}
                                    </span>
                                )}
                            </span>
                            <span className={`text-xs font-medium ${active ? 'font-semibold' : ''}`}>
                                {item.name}
                            </span>
                            {active && (
                                <span
                                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-primary-600 dark:bg-purple-400"
                                    aria-hidden
                                />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
