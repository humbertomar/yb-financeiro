# YB Importa - Sistema de Gestão Financeira

## 📋 Visão Geral

Sistema completo de gestão financeira e controle de vendas desenvolvido para a YB Importa, com foco em importação e venda de produtos. O sistema oferece controle completo de estoque, vendas, clientes, fornecedores e finanças.

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **Framework:** Laravel 11
- **Linguagem:** PHP 8.2+
- **Banco de Dados:** MySQL 8.0
- **Autenticação:** Laravel Sanctum (API Tokens)
- **Arquitetura:** RESTful API

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Roteamento:** React Router DOM
- **Estilização:** CSS Vanilla (responsivo mobile-first)
- **Requisições HTTP:** Axios

### Sistema Legado
- **Linguagem:** PHP (procedural)
- **Localização:** `/system`
- **Status:** Mantido para compatibilidade

---

## 📊 Estrutura do Banco de Dados

### Tabelas Principais

#### 1. **clientes**
Armazena informações dos clientes
```sql
- idCliente (PK)
- nome
- cpf
- numero_rg, orgao_emissor, estado_emissor, data_emissao
- logradouro, complemento, numero_logradouro, bairro, cidade, estado, cep
- contato1, contato2, whatsapp, email
- frete
- created, altered
- ativo (1=ativo, 2=inativo)
```

#### 2. **produtos**
Cadastro de produtos
```sql
- idProduto (PK)
- nome
- descricao
- idCategoria (FK)
- ativo (1=ativo, 2=inativo)
```

#### 3. **produto_variacoes**
Variações de produtos (tamanhos, cores, etc.)
```sql
- id (PK)
- idProduto (FK)
- nome (nome da variação)
- quantidade (estoque)
- valor1, valor2, valor3 (preços: mínimo, médio, máximo)
- ativo
```

#### 4. **categorias**
Categorias de produtos
```sql
- idCategoria (PK)
- nome
- descricao
- ativo (1=ativo, 2=inativo)
```

#### 5. **vendas**
Registro de vendas
```sql
- idVenda (PK)
- data_hora
- idCliente (FK)
- idFormapagamento (FK)
- idFuncionario (FK)
- idProduto (campo legado)
- quantidade, valor (campos legados)
- valor_total
- desconto
- comissao
- observacoes, texto
- vendedor
- ativo (1=ativa, 2=cancelada)
```

#### 6. **itens_venda**
Itens individuais de cada venda
```sql
- id (PK)
- idVenda (FK)
- idProduto (FK)
- idVariacao (FK)
- quantidade
- valor_unitario
- valor_total
- desconto_item
```

#### 7. **formas_pagamentos**
Formas de pagamento aceitas
```sql
- idFormapagamento (PK)
- forma_pagamento
- texto
- ativo (1=ativo, 2=inativo)
```

#### 8. **contas_pagar**
Contas a pagar
```sql
- idContapagar (PK)
- descricao
- valor_total
- data_vencimento
- idFornecedor (FK)
- observacoes
- ativo (1=ativa, 2=cancelada)
```

#### 9. **parcelas_contas_pagar**
Parcelas das contas a pagar
```sql
- id (PK)
- idContapagar (FK)
- numero_parcela
- valor_parcela
- data_vencimento
- data_pagamento
- valor_pago
- status (pendente, paga, atrasada)
```

#### 10. **fornecedores**
Cadastro de fornecedores
```sql
- idFornecedor (PK)
- nome
- cnpj
- telefone, email
- endereco, cidade, estado, cep
- contato
- observacoes
- ativo (1=ativo, 2=inativo)
```

#### 11. **funcionarios**
Cadastro de funcionários
```sql
- idFuncionario (PK)
- nome
- cpf
- telefone, email
- cargo
- salario
- data_admissao
- ativo (1=ativo, 2=inativo)
```

#### 12. **usuarios**
Usuários do sistema
```sql
- idUsuario (PK)
- username
- password
- nome
- email
- nivel (1=admin, 2=funcionário)
- ativo (1=ativo, 2=inativo)
```

#### 13. **venda_historico**
Histórico de alterações em vendas
```sql
- id (PK)
- idVenda (FK)
- idUsuario (FK)
- data_hora
- campo_alterado
- valor_anterior
- valor_novo
- descricao
```

---

## 🎨 Funcionalidades Implementadas

### Dashboard
- ✅ Estatísticas de vendas (hoje, semana, mês)
- ✅ Gráficos de vendas (últimos 7 dias e 12 meses)
- ✅ Alertas de estoque baixo
- ✅ Lista de produtos com estoque crítico
- ✅ Atividades recentes
- ✅ Ações rápidas

### Gestão de Produtos
- ✅ CRUD completo de produtos
- ✅ Gerenciamento de variações (tamanhos, cores, etc.)
- ✅ Controle de estoque por variação
- ✅ Múltiplos níveis de preço (mínimo, médio, máximo)
- ✅ Categorização de produtos
- ✅ Busca e filtros

### Gestão de Clientes
- ✅ CRUD completo de clientes
- ✅ Máscaras de entrada (CPF, telefone, CEP)
- ✅ Validação de dados
- ✅ Campos completos (RG, endereço, contatos)
- ✅ Busca por nome, CPF ou WhatsApp
- ✅ Autocomplete em formulários

### Gestão de Vendas
- ✅ Criação de vendas com carrinho
- ✅ Seleção de produtos com autocomplete
- ✅ Filtro por categoria
- ✅ Múltiplos itens por venda
- ✅ Cálculo automático de totais
- ✅ Aplicação de descontos
- ✅ Histórico de alterações
- ✅ Cancelamento de vendas (soft delete)
- ✅ Detalhes completos da venda
- ✅ Comprovante de venda
- ✅ Envio via WhatsApp
- ✅ Impressão de comprovante

### Gestão de Contas a Pagar
- ✅ CRUD completo de contas
- ✅ Parcelamento automático
- ✅ Controle de status (pendente, paga, atrasada)
- ✅ Registro de pagamentos
- ✅ Filtros por período e status
- ✅ Totalizadores

### Relatórios
- ✅ Relatório de vendas por período
- ✅ Filtros por cliente e forma de pagamento
- ✅ Totalizadores (vendas, descontos, ticket médio)
- ✅ Relatório de estoque atual

### Componentes Reutilizáveis
- ✅ ActionButtons (botões padronizados)
- ✅ StatCard (cards de estatísticas)
- ✅ QuickActions (ações rápidas)
- ✅ RecentActivity (atividades recentes)
- ✅ ClienteAutocomplete (busca de clientes)
- ✅ ProdutoAutocomplete (busca de produtos)
- ✅ ComprovanteVenda (comprovante imprimível)

---

## 🎯 Padrões e Convenções

### Soft Delete
Todos os registros usam soft delete com campo `ativo`:
- `1` = Ativo
- `2` = Inativo/Excluído

### Timestamps
- `created` - Data de criação
- `altered` - Data da última alteração

### Máscaras de Entrada
- **CPF:** `000.000.000-00`
- **Telefone:** `(00) 00000-0000`
- **CEP:** `00000-000`

### Formatação de Valores
- Moeda: `R$ 0.000,00`
- Data: `DD/MM/YYYY, HH:mm:ss`

---

## 📱 Responsividade

O sistema é **mobile-first** com:
- Menu hamburguer em dispositivos móveis
- Cards responsivos
- Tabelas adaptativas (transformam em cards no mobile)
- Touch-friendly (botões maiores, espaçamento adequado)
- Breakpoints: `640px` (sm), `768px` (md), `1024px` (lg)

---

## 🔐 Autenticação e Segurança

- Autenticação via Laravel Sanctum
- Tokens de API armazenados em localStorage
- Middleware de autenticação em todas as rotas protegidas
- Validação de dados no backend
- Proteção contra SQL Injection (Eloquent ORM)
- CORS configurado

---

## 📁 Estrutura de Diretórios

```
yb-importa-financeiro/
├── backend/                 # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/
│   │   └── Models/
│   ├── routes/
│   │   └── api.php
│   └── database/
│
├── frontend/               # React App
│   ├── src/
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── pages/         # Páginas do sistema
│   │   ├── services/      # Serviços de API
│   │   ├── hooks/         # Custom hooks
│   │   └── utils/         # Utilitários (máscaras, etc)
│   └── public/
│
└── system/                # Sistema legado (PHP)
```

---

## 🚀 Como Executar

### Backend
```bash
cd backend
php artisan serve
```
Acesso: `http://localhost:8000`

### Frontend
```bash
cd frontend
npm run dev
```
Acesso: `http://localhost:5173`

### Banco de Dados
- **Host:** localhost
- **Porta:** 3306
- **Database:** ybimpo48_ybimporta
- **User:** root
- **Password:** (vazio ou conforme configuração)

---

## 📝 Notas Importantes

1. **Campos Legados:** A tabela `vendas` possui campos legados (`idProduto`, `quantidade`, `valor`) que são preenchidos com dados do primeiro item para manter compatibilidade.

2. **Relacionamentos:** O sistema usa a tabela `itens_venda` para armazenar múltiplos produtos por venda, permitindo carrinho de compras.

3. **Estoque:** O estoque é controlado por variação de produto, permitindo diferentes tamanhos/cores do mesmo produto.

4. **Histórico:** Todas as alterações em vendas são registradas na tabela `venda_historico` para auditoria.

---

## 🎨 Design System

### Cores Principais
- **Primária:** Azul (`#2563eb`)
- **Sucesso:** Verde (`#16a34a`)
- **Perigo:** Vermelho (`#dc2626`)
- **Aviso:** Amarelo (`#eab308`)

### Componentes
- Botões com ícones SVG
- Cards com sombra suave
- Inputs com foco destacado
- Tabelas zebradas
- Modais centralizados

---

**Desenvolvido para YB Importa**
*Sistema de Gestão Financeira e Controle de Vendas*
