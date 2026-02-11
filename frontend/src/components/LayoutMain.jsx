import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';

export default function LayoutMain({ children }) {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const menuItems = [
        { label: 'Dashboard', path: '/dashboard', icon: '📊' },
        { label: 'Categorias', path: '/categorias', icon: '🏷️' },
        { label: 'Produtos', path: '/produtos', icon: '📦' },
        { label: 'Clientes', path: '/clientes', icon: '👥' },
        { label: 'Vendas', path: '/vendas', icon: '🛒' },
        { label: 'Formas de Pagamento', path: '/formaspagamento', icon: '💳' },
        { label: 'Contas a Pagar', path: '/contas-pagar', icon: '💰' },
        {
            label: 'Relatórios',
            icon: '📈',
            submenu: [
                { label: 'Vendas', path: '/relatorios/vendas', icon: '📊' },
                { label: 'Estoque', path: '/relatorios/estoque', icon: '📋' }
            ]
        },
    ];

    const handleMenuClick = () => {
        setMobileMenuOpen(false);
    };

    // Função para obter iniciais do nome
    const getInitials = (name) => {
        if (!name) return 'U';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Header */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center gap-3">
                            {/* Mobile menu button */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none transition-colors"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {mobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>

                            {/* Logo */}
                            <Link to="/dashboard" className="flex items-center group">
                                <div className="bg-gradient-to-r from-[#8B6F47] to-[#6B5536] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-bold text-base sm:text-lg transition-all group-hover:shadow-lg">
                                    YB Importa
                                </div>
                            </Link>
                        </div>

                        {/* User Menu */}
                        <div className="flex items-center">
                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#8B6F47] focus:ring-offset-2"
                                >
                                    {/* Avatar */}
                                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-[#8B6F47] to-[#6B5536] flex items-center justify-center text-white font-semibold text-sm shadow-md">
                                        {getInitials(user?.nome)}
                                    </div>

                                    {/* User Info - Hidden on mobile */}
                                    <div className="hidden sm:block text-left">
                                        <div className="text-sm font-semibold text-gray-900 leading-tight">
                                            {user?.nome}
                                        </div>
                                        <div className="text-xs text-gray-500 leading-tight">
                                            Administrador
                                        </div>
                                    </div>

                                    {/* Dropdown Icon */}
                                    <svg
                                        className={`hidden sm:block w-4 h-4 text-gray-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Dropdown Menu */}
                                {userMenuOpen && (
                                    <>
                                        {/* Backdrop para fechar ao clicar fora */}
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setUserMenuOpen(false)}
                                        ></div>

                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                                            {/* User Info - Mobile */}
                                            <div className="sm:hidden px-4 py-3 border-b border-gray-100">
                                                <div className="text-sm font-semibold text-gray-900">
                                                    {user?.nome}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    Administrador
                                                </div>
                                            </div>

                                            {/* Menu Items */}
                                            <Link
                                                to="/dashboard"
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                </svg>
                                                Dashboard
                                            </Link>

                                            <div className="border-t border-gray-100 my-1"></div>

                                            <button
                                                onClick={() => {
                                                    setUserMenuOpen(false);
                                                    logout();
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                Sair
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>


                {/* Mobile Menu Dropdown */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-200 bg-white">
                        <nav className="px-2 pt-2 pb-4 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
                            {menuItems.map((item, index) => (
                                item.submenu ? (
                                    <div key={index}>
                                        <div className="flex items-center text-xs font-semibold text-gray-500 uppercase px-4 py-2 mt-2">
                                            <span className="mr-2">{item.icon}</span>
                                            {item.label}
                                        </div>
                                        {item.submenu.map((subitem) => (
                                            <Link
                                                key={subitem.path}
                                                to={subitem.path}
                                                onClick={handleMenuClick}
                                                className={`flex items-center px-6 py-3 rounded-md text-sm font-medium transition-colors ${location.pathname === subitem.path
                                                    ? 'bg-blue-600 text-white shadow-md'
                                                    : 'text-gray-700 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <span className="mr-2">{subitem.icon}</span>
                                                {subitem.label}
                                                {location.pathname === subitem.path && (
                                                    <span className="ml-auto">✓</span>
                                                )}
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={handleMenuClick}
                                        className={`flex items-center px-4 py-3 rounded-md text-sm font-medium transition-colors ${location.pathname === item.path || location.pathname.startsWith(item.path + '/')
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <span className="mr-2">{item.icon}</span>
                                        {item.label}
                                        {(location.pathname === item.path || location.pathname.startsWith(item.path + '/')) && (
                                            <span className="ml-auto">✓</span>
                                        )}
                                    </Link>
                                )
                            ))}
                        </nav>
                    </div>
                )}
            </nav>

            {/* Main Content with Sidebar */}
            <div className="flex flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-8 py-3 sm:py-6 gap-3 sm:gap-6">
                {/* Desktop Sidebar */}
                <aside className="w-64 bg-white rounded-lg h-fit p-3 hidden md:block sticky top-20 border border-gray-200">
                    <nav className="space-y-1">
                        {menuItems.map((item, index) => (
                            item.submenu ? (
                                <div key={index} className="pt-4 first:pt-0">
                                    <div className="flex items-center text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 py-2">
                                        <span className="mr-2 text-base">{item.icon}</span>
                                        {item.label}
                                    </div>
                                    <div className="mt-1 space-y-0.5">
                                        {item.submenu.map((subitem) => (
                                            <Link
                                                key={subitem.path}
                                                to={subitem.path}
                                                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === subitem.path
                                                    ? 'bg-[#F5F2ED] text-[#6B5536]'
                                                    : 'text-gray-700 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <span className="text-base">{subitem.icon}</span>
                                                <span className="flex-1">{subitem.label}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === item.path || location.pathname.startsWith(item.path + '/')
                                        ? 'bg-[#F5F2ED] text-[#6B5536]'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <span className="text-base">{item.icon}</span>
                                    <span className="flex-1">{item.label}</span>
                                </Link>
                            )
                        ))}
                    </nav>
                </aside>

                {/* Content Area */}
                <main className="flex-1 min-w-0">
                    {children}
                </main>
            </div>
        </div>
    );
}
