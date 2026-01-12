import { useState, useEffect, useRef } from 'react';

export default function ProdutoCombobox({ produtos, categoriaSelecionada, onSelect, value }) {
    const [busca, setBusca] = useState('');
    const [aberto, setAberto] = useState(false);
    const [produtosFiltrados, setProdutosFiltrados] = useState([]);
    const [indiceSelecionado, setIndiceSelecionado] = useState(-1);
    const wrapperRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        // Filtrar produtos por busca e categoria
        let filtrados = produtos;

        if (categoriaSelecionada) {
            filtrados = filtrados.filter(p => p.idCategoria == categoriaSelecionada);
        }

        if (busca.trim()) {
            filtrados = filtrados.filter(p =>
                p.nome.toLowerCase().includes(busca.toLowerCase())
            );
        }

        setProdutosFiltrados(filtrados);
        setIndiceSelecionado(-1);
    }, [busca, produtos, categoriaSelecionada]);

    // Fechar ao clicar fora
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setAberto(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    function handleSelecionarProduto(produto) {
        setBusca(produto.nome);
        setAberto(false);
        onSelect(produto);
    }

    function handleInputChange(e) {
        setBusca(e.target.value);
        setAberto(true);
    }

    function handleToggle() {
        setAberto(!aberto);
        if (!aberto) {
            inputRef.current?.focus();
        }
    }

    function handleKeyDown(e) {
        if (!aberto) {
            if (e.key === 'ArrowDown' || e.key === 'Enter') {
                setAberto(true);
                e.preventDefault();
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setIndiceSelecionado(prev =>
                    prev < produtosFiltrados.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setIndiceSelecionado(prev => prev > 0 ? prev - 1 : -1);
                break;
            case 'Enter':
                e.preventDefault();
                if (indiceSelecionado >= 0 && produtosFiltrados[indiceSelecionado]) {
                    handleSelecionarProduto(produtosFiltrados[indiceSelecionado]);
                }
                break;
            case 'Escape':
                setAberto(false);
                break;
        }
    }

    // Scroll automático para item selecionado
    useEffect(() => {
        if (indiceSelecionado >= 0) {
            const elemento = document.getElementById(`produto-item-${indiceSelecionado}`);
            elemento?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    }, [indiceSelecionado]);

    return (
        <div ref={wrapperRef} className="relative">
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={busca}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setAberto(true)}
                    placeholder="Selecione ou digite para buscar..."
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <button
                    type="button"
                    onClick={handleToggle}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                    <svg
                        className={`w-5 h-5 transition-transform ${aberto ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>

            {aberto && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {produtosFiltrados.length > 0 ? (
                        produtosFiltrados.map((produto, index) => (
                            <div
                                id={`produto-item-${index}`}
                                key={produto.idProduto}
                                onClick={() => handleSelecionarProduto(produto)}
                                className={`px-4 py-2 cursor-pointer border-b border-gray-100 last:border-b-0 ${index === indiceSelecionado
                                        ? 'bg-blue-500 text-white'
                                        : 'hover:bg-blue-50'
                                    }`}
                            >
                                <div className={`font-medium ${index === indiceSelecionado ? 'text-white' : 'text-gray-900'}`}>
                                    {produto.nome}
                                </div>
                                <div className={`text-xs ${index === indiceSelecionado ? 'text-blue-100' : 'text-gray-500'}`}>
                                    {produto.categoria?.nome || 'Sem categoria'} • {produto.variacoes?.length || 0} variações
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-3 text-gray-500 text-center">
                            {busca.trim() ? 'Nenhum produto encontrado' : 'Digite para buscar produtos'}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
