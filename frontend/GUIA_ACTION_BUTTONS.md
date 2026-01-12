# Guia de Uso - ActionButtons Component

## Componente de Botões de Ação Padronizados

Este componente fornece botões de ação consistentes e responsivos para todas as operações CRUD do sistema.

---

## 📦 Importação

```javascript
// Importar componentes necessários
import { 
    ActionButtons,      // Container para agrupar botões
    EditButton,         // Botão de editar
    DeleteButton,       // Botão de excluir
    ViewButton,         // Botão de visualizar
    DownloadButton,     // Botão de download
    PrintButton,        // Botão de imprimir
    DuplicateButton,    // Botão de duplicar
    CheckButton,        // Botão de confirmar
    CloseButton,        // Botão de fechar
    CalendarButton      // Botão de calendário
} from '../../components/ActionButtons';
```

---

## 🎨 Tipos de Botões Disponíveis

### 1. **ViewButton** (Visualizar)
- **Cor**: Azul
- **Ícone**: Olho
- **Uso**: Ver detalhes de um registro

### 2. **EditButton** (Editar)
- **Cor**: Índigo
- **Ícone**: Lápis
- **Uso**: Editar um registro

### 3. **DeleteButton** (Excluir)
- **Cor**: Vermelho
- **Ícone**: Lixeira
- **Uso**: Excluir um registro

### 4. **DownloadButton** (Baixar)
- **Cor**: Verde
- **Ícone**: Seta para baixo
- **Uso**: Download de arquivos

### 5. **PrintButton** (Imprimir)
- **Cor**: Cinza
- **Ícone**: Impressora
- **Uso**: Imprimir documentos

### 6. **DuplicateButton** (Duplicar)
- **Cor**: Roxo
- **Ícone**: Copiar
- **Uso**: Duplicar registros

### 7. **CheckButton** (Confirmar)
- **Cor**: Verde
- **Ícone**: Check
- **Uso**: Confirmar ações

### 8. **CloseButton** (Fechar)
- **Cor**: Cinza
- **Ícone**: X
- **Uso**: Fechar modais/cancelar

### 9. **CalendarButton** (Calendário)
- **Cor**: Azul
- **Ícone**: Calendário
- **Uso**: Abrir calendário/agendar

---

## 💡 Exemplos de Uso

### Exemplo 1: Tabela com Editar e Excluir

```javascript
import { ActionButtons, EditButton, DeleteButton } from '../../components/ActionButtons';

<table>
    <tbody>
        {items.map((item) => (
            <tr key={item.id}>
                <td>{item.nome}</td>
                <td>
                    <ActionButtons>
                        <EditButton to={`/items/${item.id}/editar`} />
                        <DeleteButton onClick={() => handleDelete(item.id)} />
                    </ActionButtons>
                </td>
            </tr>
        ))}
    </tbody>
</table>
```

### Exemplo 2: Com Botão de Visualizar

```javascript
<ActionButtons>
    <ViewButton to={`/vendas/${venda.id}`} />
    <EditButton to={`/vendas/${venda.id}/editar`} />
    <DeleteButton onClick={() => handleDelete(venda.id)} />
</ActionButtons>
```

### Exemplo 3: Com Botões de Ação Customizados

```javascript
<ActionButtons>
    <ViewButton to={`/produtos/${produto.id}`} />
    <EditButton to={`/produtos/${produto.id}/editar`} />
    <DuplicateButton onClick={() => handleDuplicate(produto.id)} />
    <DeleteButton onClick={() => handleDelete(produto.id)} />
</ActionButtons>
```

### Exemplo 4: Botões de Download e Impressão

```javascript
<ActionButtons>
    <ViewButton to={`/relatorios/${relatorio.id}`} />
    <DownloadButton onClick={() => handleDownload(relatorio.id)} />
    <PrintButton onClick={() => handlePrint(relatorio.id)} />
</ActionButtons>
```

### Exemplo 5: Modal com Confirmar e Fechar

```javascript
<ActionButtons>
    <CheckButton onClick={handleConfirm} title="Salvar" />
    <CloseButton onClick={handleClose} title="Cancelar" />
</ActionButtons>
```

### Exemplo 6: Com Título Customizado

```javascript
<EditButton 
    to={`/produtos/${produto.id}/editar`} 
    title="Modificar Produto" 
/>
```

### Exemplo 7: Com Classes Adicionais

```javascript
<DeleteButton 
    onClick={() => handleDelete(item.id)} 
    className="ml-4"
/>
```

---

## 🎯 Props Disponíveis

### Para todos os botões:

| Prop | Tipo | Obrigatório | Descrição |
|------|------|-------------|-----------|
| `to` | string | Não | Rota para navegação (usa react-router Link) |
| `onClick` | function | Não | Função a ser executada no click |
| `title` | string | Não | Título customizado (substitui o padrão) |
| `className` | string | Não | Classes CSS adicionais |

**Nota**: Use `to` OU `onClick`, não ambos.

---

## 📱 Responsividade

Os botões são **mobile-first** e se adaptam automaticamente:

- **Mobile** (< 640px): Apenas ícones visíveis
- **Desktop** (≥ 640px): Ícones + texto

```javascript
// O texto é ocultado automaticamente em mobile
<span className="hidden sm:inline">{displayTitle}</span>
```

---

## 🎨 Customização de Cores

Cada tipo de botão tem cores pré-definidas:

```javascript
const configs = {
    view: 'text-blue-600 hover:text-blue-900 hover:bg-blue-50',
    edit: 'text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50',
    delete: 'text-red-600 hover:text-red-900 hover:bg-red-50',
    download: 'text-green-600 hover:text-green-900 hover:bg-green-50',
    // ... etc
};
```

---

## ✅ Boas Práticas

### 1. **Sempre use ActionButtons como container**
```javascript
// ✅ Correto
<ActionButtons>
    <EditButton to="/edit" />
    <DeleteButton onClick={handleDelete} />
</ActionButtons>

// ❌ Incorreto
<EditButton to="/edit" />
<DeleteButton onClick={handleDelete} />
```

### 2. **Ordem lógica dos botões**
```javascript
// Ordem recomendada: Visualizar → Editar → Ações secundárias → Excluir
<ActionButtons>
    <ViewButton to="/view" />
    <EditButton to="/edit" />
    <DuplicateButton onClick={handleDuplicate} />
    <DeleteButton onClick={handleDelete} />
</ActionButtons>
```

### 3. **Use títulos descritivos quando necessário**
```javascript
<DeleteButton 
    onClick={() => handleDelete(id)} 
    title="Excluir permanentemente"
/>
```

### 4. **Confirmação antes de ações destrutivas**
```javascript
async function handleDelete(id) {
    if (window.confirm('Tem certeza que deseja excluir?')) {
        await deleteItem(id);
    }
}

<DeleteButton onClick={() => handleDelete(item.id)} />
```

---

## 🔧 Migração de Código Antigo

### Antes:
```javascript
<button
    onClick={() => navigate(`/items/${item.id}/editar`)}
    className="text-indigo-600 hover:text-indigo-900 mr-4"
>
    Editar
</button>
<button
    onClick={() => handleDelete(item.id)}
    className="text-red-600 hover:text-red-900"
>
    Excluir
</button>
```

### Depois:
```javascript
<ActionButtons>
    <EditButton to={`/items/${item.id}/editar`} />
    <DeleteButton onClick={() => handleDelete(item.id)} />
</ActionButtons>
```

---

## 📊 Benefícios

✅ **Consistência**: Todos os botões têm o mesmo estilo  
✅ **Responsividade**: Adaptação automática para mobile  
✅ **Acessibilidade**: Títulos e labels adequados  
✅ **Manutenibilidade**: Mudanças centralizadas  
✅ **Produtividade**: Menos código repetitivo  
✅ **UX**: Ícones intuitivos e cores padronizadas  

---

## 🚀 Próximos Passos

Atualize todas as páginas de listagem para usar os novos botões:

- [x] ListaCategorias
- [x] ListaClientes
- [ ] ListaProdutos
- [ ] ListaVendas
- [ ] ListaFormasPagamento
- [ ] ListaContasPagar
