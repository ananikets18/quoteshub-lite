export default function ApplicationLogo(props) {
    return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            {/* Minimalist Squircle Q */}
            <rect
                x="20"
                y="20"
                width="60"
                height="60"
                rx="20"
                stroke="currentColor"
                strokeWidth="10"
            />
            <path
                d="M70 70L85 85"
                stroke="currentColor"
                strokeWidth="10"
                strokeLinecap="round"
            />
            {/* Inner Dot for 'Hub' / Center */}
            <circle cx="50" cy="50" r="6" fill="currentColor" />
        </svg>
    );
}
