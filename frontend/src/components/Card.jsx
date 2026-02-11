/**
 * Card Component - Sistema de Design YB Importa
 * Com suporte a cards coloridos e gradientes
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
        <div className={`px-4 sm:px-6 py-4 ${gradient ? 'bg-gradient-to-r from-[#8B6F47] to-[#6B5536] text-white' : 'border-b border-gray-200'} ${className}`}>
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

export function StatsCard({ icon, label, value, trend, trendValue, color = 'bronze' }) {
    const colors = {
        bronze: 'border-[#A68A5E] hover:border-[#8B6F47]',
        cream: 'border-[#E8E3D8] hover:border-[#A68A5E]',
        dark: 'border-[#6B5536] hover:border-[#8B6F47]',
        green: 'border-green-200 hover:border-green-300',
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

/**
 * ActionCard - Cards coloridos para ações rápidas
 */
export function ActionCard({ icon, label, onClick, color = 'bronze' }) {
    const colors = {
        bronze: 'bg-gradient-to-br from-[#8B6F47] to-[#6B5536] hover:from-[#6B5536] hover:to-[#8B6F47]',
        'bronze-light': 'bg-gradient-to-br from-[#A68A5E] to-[#8B6F47] hover:from-[#8B6F47] hover:to-[#A68A5E]',
        'bronze-dark': 'bg-gradient-to-br from-[#6B5536] to-[#5A4529] hover:from-[#5A4529] hover:to-[#6B5536]',
        cream: 'bg-gradient-to-br from-[#E8E3D8] to-[#D4CFC4] hover:from-[#D4CFC4] hover:to-[#E8E3D8] text-[#6B5536]',
        // Manter verde e vermelho para feedback específico
        green: 'bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
        red: 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
    };

    return (
        <button
            onClick={onClick}
            className={`${colors[color]} ${color === 'cream' ? 'text-[#6B5536]' : 'text-white'} rounded-xl p-4 sm:p-5 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex flex-col items-center justify-center gap-2 min-h-[110px] sm:min-h-[120px]`}
        >
            <span className="text-3xl sm:text-4xl">{icon}</span>
            <span className="font-semibold text-sm sm:text-base">{label}</span>
        </button>
    );
}

/**
 * AlertCard - Cards de alerta estilizados
 */
export function AlertCard({ type = 'warning', title, message, count }) {
    const types = {
        warning: {
            bg: 'bg-yellow-50 border-yellow-200',
            icon: '⚠️',
            iconBg: 'bg-yellow-100',
            textColor: 'text-yellow-800',
            titleColor: 'text-yellow-900'
        },
        danger: {
            bg: 'bg-red-50 border-red-200',
            icon: '🔴',
            iconBg: 'bg-red-100',
            textColor: 'text-red-800',
            titleColor: 'text-red-900'
        },
        info: {
            bg: 'bg-blue-50 border-blue-200',
            icon: 'ℹ️',
            iconBg: 'bg-blue-100',
            textColor: 'text-blue-800',
            titleColor: 'text-blue-900'
        },
        success: {
            bg: 'bg-green-50 border-green-200',
            icon: '✅',
            iconBg: 'bg-green-100',
            textColor: 'text-green-800',
            titleColor: 'text-green-900'
        }
    };

    const style = types[type];

    return (
        <div className={`${style.bg} border rounded-lg p-4 flex items-start gap-3`}>
            <div className={`${style.iconBg} rounded-lg p-2 text-2xl flex-shrink-0`}>
                {style.icon}
            </div>
            <div className="flex-1">
                <h3 className={`font-bold text-sm ${style.titleColor}`}>{title}</h3>
                <p className={`text-sm ${style.textColor} mt-1`}>{message}</p>
            </div>
            {count && (
                <div className={`${style.iconBg} rounded-full px-3 py-1 text-sm font-bold ${style.titleColor}`}>
                    {count}
                </div>
            )}
        </div>
    );
}
