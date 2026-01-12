import { useState, useEffect, useRef } from 'react';

export default function ClienteAutocomplete({ clientes, onSelect }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCliente, setSelectedCliente] = useState(null);
    const wrapperRef = useRef(null);

    // Filtrar clientes baseado na busca
    const clientesFiltrados = clientes.filter(cliente =>
        cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cliente.cpf && cliente.cpf.includes(searchTerm))
    );

    // Fechar dropdown ao clicar fora
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (cliente) => {
        setSelectedCliente(cliente);
        setSearchTerm(cliente.nome);
        setIsOpen(false);
        onSelect(cliente);
    };

    const handleClear = () => {
        setSelectedCliente(null);
        setSearchTerm('');
        onSelect(null);
        setIsOpen(false);
    };

    return (
        <div ref={wrapperRef} className="relative">
            <div className="relative">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setIsOpen(true);
                        if (!e.target.value) {
                            setSelectedCliente(null);
                            onSelect(null);
                        }
                    }}
                    onFocus={() => setIsOpen(true)}
                    placeholder="Digite para buscar cliente..."
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                />
                {selectedCliente && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        ✕
                    </button>
                )}
            </div>

            {isOpen && searchTerm && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {clientesFiltrados.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-gray-500">
                            Nenhum cliente encontrado
                        </div>
                    ) : (
                        clientesFiltrados.map((cliente) => (
                            <button
                                key={cliente.idCliente}
                                type="button"
                                onClick={() => handleSelect(cliente)}
                                className="w-full text-left px-4 py-2 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors"
                            >
                                <div className="font-medium text-gray-900">{cliente.nome}</div>
                                {cliente.cpf && (
                                    <div className="text-sm text-gray-500">CPF: {cliente.cpf}</div>
                                )}
                                {cliente.whatsapp && (
                                    <div className="text-sm text-gray-500">WhatsApp: {cliente.whatsapp}</div>
                                )}
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
