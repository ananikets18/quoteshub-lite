import { Trophy } from 'lucide-react';

export default function AchievementBadge({ achievement, size = 'md', showTooltip = true }) {
    const sizes = {
        sm: 'w-8 h-8 text-lg',
        md: 'w-12 h-12 text-2xl',
        lg: 'w-16 h-16 text-3xl',
    };

    const { definition } = achievement;

    return (
        <div className="relative group">
            <div
                className={`${sizes[size]} flex items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg transform transition-transform hover:scale-110`}
                title={showTooltip ? `${definition.name}: ${definition.description}` : ''}
            >
                <span className="filter drop-shadow-sm">{definition.icon}</span>
            </div>

            {/* Tooltip on Hover */}
            {showTooltip && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    <div className="font-bold">{definition.name}</div>
                    <div className="text-gray-300">{definition.description}</div>
                    <div className="text-yellow-400 mt-1">+{definition.points} points</div>
                    {/* Arrow */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                        <div className="border-4 border-transparent border-t-gray-900"></div>
                    </div>
                </div>
            )}
        </div>
    );
}
