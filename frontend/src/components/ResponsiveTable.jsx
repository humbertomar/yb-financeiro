/**
 * ResponsiveTable Component
 * 
 * Exibe tabela em desktop e cards em mobile
 * 
 * Props:
 * - columns: Array de objetos { key, label, render?, className? }
 * - data: Array de objetos com os dados
 * - keyExtractor: Função para extrair key única de cada item
 * - actions: Componente de ações para cada linha
 * - emptyMessage: Mensagem quando não há dados
 */

export default function ResponsiveTable({
    columns,
    data,
    keyExtractor,
    actions,
    emptyMessage = 'Nenhum registro encontrado.'
}) {
    if (!data || data.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                {emptyMessage}
            </div>
        );
    }

    return (
        <>
            {/* Desktop: Tabela */}
            <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${col.className || ''}`}
                                >
                                    {col.label}
                                </th>
                            ))}
                            {actions && (
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ações
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.map((item) => (
                            <tr key={keyExtractor(item)} className="hover:bg-gray-50">
                                {columns.map((col) => (
                                    <td
                                        key={col.key}
                                        className={`px-6 py-4 text-sm ${col.className || ''}`}
                                    >
                                        {col.render ? col.render(item) : item[col.key]}
                                    </td>
                                ))}
                                {actions && (
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {actions(item)}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile: Cards */}
            <div className="md:hidden space-y-4">
                {data.map((item) => (
                    <div
                        key={keyExtractor(item)}
                        className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                        {columns.map((col) => (
                            <div key={col.key} className="mb-3 last:mb-0">
                                <div className="text-xs font-semibold text-gray-500 uppercase mb-1">
                                    {col.label}
                                </div>
                                <div className={`text-sm ${col.className || 'text-gray-900'}`}>
                                    {col.render ? col.render(item) : item[col.key]}
                                </div>
                            </div>
                        ))}
                        {actions && (
                            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
                                {actions(item)}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
}
