import { useState, useEffect, useRef, useCallback } from "react";
import { usePage, Link } from "@inertiajs/react";
import { createPortal } from "react-dom";
import axios from "axios";
import { Flame, Bell, Settings } from "lucide-react";
import NotificationDropdown from "./NotificationDropdown";
import ApplicationLogo from "./ApplicationLogo";
import { useStreakContext } from "@/Contexts/StreakContext";

export default function Header({
    title,
    showStreak = true,
    showNotifications = true,
    showLogo = false,
    isVisible = true,
    unreadCount: unreadCountProp,
    refreshUnreadCount: refreshUnreadCountProp,
}) {
    const { auth } = usePage().props;
    const [showNotificationDropdown, setShowNotificationDropdown] =
        useState(false);
    const [localUnreadCount, setLocalUnreadCount] = useState(0);
    const [isMounted, setIsMounted] = useState(false);
    const bellButtonRef = useRef(null);
    const { currentStreak } = useStreakContext();

    const useSharedCount = refreshUnreadCountProp != null;
    const unreadCount = useSharedCount
        ? (unreadCountProp ?? 0)
        : localUnreadCount;

    const fetchUnreadCount = useCallback(async () => {
        if (!auth?.user) return;
        try {
            const { data } = await axios.get("/api/notifications/unread-count");
            setLocalUnreadCount(data.count);
        } catch (e) {
            if (e.response?.status !== 401) console.error("Unread count:", e);
        }
    }, [auth?.user]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (auth?.user && showNotifications && !useSharedCount) {
            fetchUnreadCount();
            const interval = setInterval(() => {
                if (document.visibilityState === "visible") fetchUnreadCount();
            }, 60000);
            return () => clearInterval(interval);
        }
    }, [auth?.user, showNotifications, useSharedCount, fetchUnreadCount]);

    const refreshUnreadCount = useSharedCount
        ? refreshUnreadCountProp
        : fetchUnreadCount;

    const handleBellClick = () => {
        setShowNotificationDropdown(!showNotificationDropdown);
        if (!showNotificationDropdown) refreshUnreadCount?.();
    };

    const handleDropdownClose = () => {
        setShowNotificationDropdown(false);
        refreshUnreadCount?.();
    };

    return (
        <header
            className={`sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 safe-area-top transition-transform duration-300 ${isVisible ? "translate-y-0" : "-translate-y-full"
                }`}
        >
            <div className="flex items-center justify-between px-4 sm:px-6 py-2 sm:py-3.5 max-w-3xl mx-auto w-full">
                {/* Left: Title or Logo */}
                <div className="flex-1 min-w-0 mr-2 sm:mr-3 max-w-[60%] sm:max-w-none">
                    {showLogo ? (
                        <Link
                            href="/"
                            className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
                        >
                            <ApplicationLogo className="w-6 h-6 sm:w-8 sm:h-8 text-[#5D41E6] dark:text-purple-400 flex-shrink-0" />
                            <span className="text-lg sm:text-2xl font-black tracking-tight text-gray-900 dark:text-white leading-none">
                                QuotesHub
                            </span>
                        </Link>
                    ) : (
                        <h1
                            className="text-base sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white truncate"
                            title={title || "QuotesHub"}
                        >
                            {title || "QuotesHub"}
                        </h1>
                    )}
                </div>

                {/* Right: Streak & Actions */}
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                    {showStreak && auth?.user && (
                        <Link
                            href="/achievements"
                            className="streak-badge hover:scale-105 transition-transform active:scale-95 cursor-pointer"
                        >
                            <Flame className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="text-xs sm:text-base font-semibold">{currentStreak}</span>
                        </Link>
                    )}

                    {showNotifications && auth?.user && (
                        <div className="relative">
                            <button
                                ref={bellButtonRef}
                                onClick={handleBellClick}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
                                aria-label="Notifications"
                            >
                                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                        {unreadCount > 9 ? "9+" : unreadCount}
                                    </span>
                                )}
                            </button>

                            {isMounted &&
                                typeof window !== "undefined" &&
                                createPortal(
                                    <NotificationDropdown
                                        show={showNotificationDropdown}
                                        onClose={handleDropdownClose}
                                        buttonRef={bellButtonRef}
                                    />,
                                    document.body,
                                )}
                        </div>
                    )}

                    <Link
                        href="/settings"
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </Link>

                    {auth?.user && (
                        <Link href={`/${auth.user.username}`} className="flex-shrink-0">
                            <img
                                src={
                                    auth.user.avatar
                                        ? `/storage/${auth.user.avatar}`
                                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(auth.user.name)}&background=random`
                                }
                                alt={auth.user.name}
                                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-gray-200 dark:border-gray-700 object-cover hover:ring-2 hover:ring-[#5D41E6] transition-all"
                            />
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
