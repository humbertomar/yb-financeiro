/**
 * Card Component - Sistema de Design Minimalista
 */

export function Card({ children, className = '', variant = 'default' }) {
    const variants = {
        default: 'bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow',
        gradient: 'bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden',
        stats: 'bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all'
    };

    return (
        <div className={`rounded-lg ${variants[variant]} ${className}`}>
            {children}
        </div>
    );
}

export function CardHeader({ children, className = '', gradient = false }) {
    return (
        <div className={`px-4 sm:px-6 py-4 ${gradient ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'border-b border-gray-200'} ${className}`}>
            {children}
        </div>
    );
}

export function CardTitle({ children, className = '' }) {
    return (
        <h3 className={`text-lg sm:text-xl font-bold ${className}`}>
            {children}
        </h3>
    );
}

export function CardContent({ children, className = '' }) {
    return (
        <div className={`px-4 sm:px-6 py-4 ${className}`}>
            {children}
        </div>
    );
}

export function StatsCard({ icon, label, value, trend, trendValue, color = 'blue' }) {
    const colors = {
        blue: 'border-blue-200 hover:border-blue-300',
        green: 'border-green-200 hover:border-green-300',
        purple: 'border-purple-200 hover:border-purple-300',
        orange: 'border-orange-200 hover:border-orange-300',
        red: 'border-red-200 hover:border-red-300'
    };

    return (
        <div className={`bg-white rounded-lg border ${colors[color]} p-4 sm:p-5 transition-all hover:shadow-sm`}>
            <p className="text-xs sm:text-sm font-medium text-gray-500 mb-2">{label}</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{value}</p>
            {trend && (
                <div className={`flex items-center gap-1 mt-2 text-xs sm:text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {trend === 'up' ? (
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    ) : (
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    )}
                    <span className="font-medium">{trendValue}</span>
                </div>
            )}
        </div>
    );
}
