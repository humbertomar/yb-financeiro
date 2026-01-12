export default function StatCard({ title, value, icon, trend, color = 'blue', subtitle }) {
    const colorClasses = {
        blue: 'from-blue-500 to-blue-600',
        green: 'from-green-500 to-green-600',
        purple: 'from-purple-500 to-purple-600',
        orange: 'from-orange-500 to-orange-600',
        red: 'from-red-500 to-red-600',
        indigo: 'from-indigo-500 to-indigo-600'
    };

    const iconBgClasses = {
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        purple: 'bg-purple-100 text-purple-600',
        orange: 'bg-orange-100 text-orange-600',
        red: 'bg-red-100 text-red-600',
        indigo: 'bg-indigo-100 text-indigo-600'
    };

    return (
        <div className={`relative overflow-hidden rounded-lg sm:rounded-xl bg-gradient-to-br ${colorClasses[color]} p-4 sm:p-6 text-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105`}>
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-20 sm:h-24 w-20 sm:w-24 rounded-full bg-white opacity-10"></div>
            <div className="absolute bottom-0 left-0 -mb-6 sm:-mb-8 -ml-6 sm:-ml-8 h-24 sm:h-32 w-24 sm:w-32 rounded-full bg-white opacity-5"></div>

            <div className="relative">
                <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0 pr-2">
                        <p className="text-xs sm:text-sm font-medium text-white/80 mb-1">{title}</p>
                        <h3 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 break-words">{value}</h3>
                        {subtitle && (
                            <p className="text-xs sm:text-sm text-white/70 line-clamp-2">{subtitle}</p>
                        )}
                    </div>
                    <div className={`${iconBgClasses[color]} p-2 sm:p-3 rounded-lg flex-shrink-0`}>
                        <span className="text-xl sm:text-2xl">{icon}</span>
                    </div>
                </div>

                {trend && (
                    <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm">
                        <span className={`flex items-center ${trend.direction === 'up' ? 'text-green-200' : 'text-red-200'}`}>
                            {trend.direction === 'up' ? '↑' : '↓'}
                            <span className="ml-1 font-semibold">{trend.value}</span>
                        </span>
                        <span className="ml-2 text-white/70">{trend.label}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
