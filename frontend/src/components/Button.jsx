/**
 * Button Components - Sistema de Design YB Importa
 * Botões padronizados com cores da marca
 */

export function Button({ children, onClick, variant = 'primary', size = 'md', className = '', disabled = false, type = 'button' }) {
    const variants = {
        primary: 'bg-gradient-to-r from-[#8B6F47] to-[#6B5536] hover:from-[#6B5536] hover:to-[#8B6F47] text-white shadow-md hover:shadow-lg',
        secondary: 'bg-white border-2 border-[#8B6F47] text-[#6B5536] hover:bg-[#F5F2ED]',
        success: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md hover:shadow-lg',
        danger: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md hover:shadow-lg',
        ghost: 'bg-transparent hover:bg-[#F5F2ED] text-[#6B5536]'
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg'
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
                ${variants[variant]}
                ${sizes[size]}
                rounded-lg font-semibold
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                focus:outline-none focus:ring-2 focus:ring-[#8B6F47] focus:ring-offset-2
                ${className}
            `}
        >
            {children}
        </button>
    );
}

export function IconButton({ icon, onClick, variant = 'ghost', size = 'md', className = '', title }) {
    const variants = {
        primary: 'bg-gradient-to-r from-[#8B6F47] to-[#6B5536] hover:from-[#6B5536] hover:to-[#8B6F47] text-white',
        ghost: 'bg-transparent hover:bg-[#F5F2ED] text-[#6B5536]',
        danger: 'bg-transparent hover:bg-red-50 text-red-600'
    };

    const sizes = {
        sm: 'p-1.5 text-sm',
        md: 'p-2 text-base',
        lg: 'p-3 text-lg'
    };

    return (
        <button
            onClick={onClick}
            title={title}
            className={`
                ${variants[variant]}
                ${sizes[size]}
                rounded-lg
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-[#8B6F47] focus:ring-offset-2
                ${className}
            `}
        >
            {icon}
        </button>
    );
}
