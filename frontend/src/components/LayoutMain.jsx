import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';

export default function LayoutMain({ children }) {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Header */}
            <nav className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            {/* Mobile menu button */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden mr-3 p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {mobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                            <span className="text-xl font-bold text-blue-600">YB Importa</span>
                        </div>

                        <div className="flex items-center space-x-2 sm:space-x-4">
                            <span className="text-sm sm:text-base text-gray-700 font-medium truncate max-w-[120px] sm:max-w-none">
                                {user?.nome}
                            </span>
                            <button
                                onClick={logout}
                                className="text-xs sm:text-sm text-red-600 hover:text-red-800 font-medium px-2 py-1 sm:px-3 sm:py-2 rounded hover:bg-red-50"
                            >
                                Sair
                            </button>
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
                <aside className="w-64 bg-white shadow rounded-lg h-fit p-4 hidden md:block sticky top-20">
                    <nav className="space-y-1">
                        {menuItems.map((item, index) => (
                            item.submenu ? (
                                <div key={index}>
                                    <div className="flex items-center text-xs font-semibold text-gray-500 uppercase px-4 py-2 mt-4">
                                        <span className="mr-2">{item.icon}</span>
                                        {item.label}
                                    </div>
                                    {item.submenu.map((subitem) => (
                                        <Link
                                            key={subitem.path}
                                            to={subitem.path}
                                            className={`flex items-center px-6 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === subitem.path
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
                                    className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors relative ${location.pathname === item.path || location.pathname.startsWith(item.path + '/')
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <span className="mr-2 text-lg">{item.icon}</span>
                                    {item.label}
                                    {(location.pathname === item.path || location.pathname.startsWith(item.path + '/')) && (
                                        <span className="ml-auto">✓</span>
                                    )}
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
