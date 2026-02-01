export default function ApplicationLogo({ className = '', variant = 'default', ...props }) {
    // Enhanced logo with gradient support
    const logoId = `logo-gradient-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
        <svg 
            viewBox="0 0 100 100" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg" 
            className={className}
            {...props}
        >
            <defs>
                {/* Purple-Pink Gradient (Brand Primary) */}
                <linearGradient id={`${logoId}-primary`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
                
                {/* Purple Gradient (Subtle) */}
                <linearGradient id={`${logoId}-purple`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#5b21b6" />
                </linearGradient>
                
                {/* Inner glow effect */}
                <radialGradient id={`${logoId}-glow`} cx="50%" cy="50%">
                    <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
                </radialGradient>
            </defs>
            
            {/* Background glow circle (subtle) */}
            <circle 
                cx="50" 
                cy="50" 
                r="45" 
                fill={`url(#${logoId}-glow)`}
                opacity="0.3"
            />
            
            {/* Main quote mark shape - stylized "Q" */}
            <g>
                {/* Outer rounded square (quote bubble) */}
                <rect
                    x="18"
                    y="18"
                    width="64"
                    height="64"
                    rx="24"
                    stroke={variant === 'gradient' ? `url(#${logoId}-primary)` : 'currentColor'}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-all duration-300"
                />
                
                {/* Quote tail/stem extending from bottom right */}
                <path
                    d="M72 72L86 86"
                    stroke={variant === 'gradient' ? `url(#${logoId}-primary)` : 'currentColor'}
                    strokeWidth="8"
                    strokeLinecap="round"
                    className="transition-all duration-300"
                />
                
                {/* Decorative quotation marks inside */}
                <g opacity="0.9">
                    {/* Left quote mark */}
                    <path
                        d="M35 40C35 37 37 35 40 35C43 35 45 37 45 40C45 42 44 43 42 44L38 48V52"
                        stroke={variant === 'gradient' ? `url(#${logoId}-purple)` : 'currentColor'}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                        opacity="0.7"
                    />
                    
                    {/* Right quote mark (mirrored) */}
                    <path
                        d="M55 40C55 37 57 35 60 35C63 35 65 37 65 40C65 42 64 43 62 44L58 48V52"
                        stroke={variant === 'gradient' ? `url(#${logoId}-purple)` : 'currentColor'}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                        opacity="0.7"
                    />
                </g>
                
                {/* Center connecting hub dot */}
                <circle 
                    cx="50" 
                    cy="62" 
                    r="4" 
                    fill={variant === 'gradient' ? `url(#${logoId}-primary)` : 'currentColor'}
                    className="transition-all duration-300"
                />
            </g>
        </svg>
    );
}
