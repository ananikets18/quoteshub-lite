import { useState, useEffect } from 'react';

export default function useScrollDirection() {
    const [scrollDirection, setScrollDirection] = useState('up');
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        let lastScrollY = window.pageYOffset;
        let ticking = false;

        const updateScrollDirection = () => {
            const scrollY = window.pageYOffset;

            if (Math.abs(scrollY - lastScrollY) < 5) {
                // Ignore small scrolls
                ticking = false;
                return;
            }

            setScrollDirection(scrollY > lastScrollY ? 'down' : 'up');
            setScrollY(scrollY);
            lastScrollY = scrollY > 0 ? scrollY : 0;
            ticking = false;
        };

        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(updateScrollDirection);
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll);

        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return { scrollDirection, scrollY };
}
