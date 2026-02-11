-- ========================================
-- SCRIPT PARA CRIAR TABELAS FALTANTES
-- YB Importa Financeiro - Produção
-- ========================================

-- 1. Tabela: itens_venda
-- Armazena os itens de cada venda
CREATE TABLE itens_venda (
  id INT AUTO_INCREMENT PRIMARY KEY,
  idVenda INT NOT NULL,
  idProduto INT NOT NULL,
  idVariacao INT NULL,
  quantidade INT NOT NULL DEFAULT 1,
  valor_unitario DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  valor_total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  desconto_item DECIMAL(10,2) DEFAULT 0.00,
  INDEX idx_idVenda (idVenda),
  INDEX idx_idProduto (idProduto),
  INDEX idx_idVariacao (idVariacao)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tabela: vendas_historico
-- Armazena o histórico de alterações nas vendas
CREATE TABLE vendas_historico (
  id INT AUTO_INCREMENT PRIMARY KEY,
  idVenda INT NOT NULL,
  idUsuario INT NOT NULL,
  data_hora DATETIME NOT NULL,
  campo_alterado VARCHAR(100) NOT NULL,
  valor_anterior TEXT NULL,
  valor_novo TEXT NULL,
  descricao TEXT NULL,
  INDEX idx_idVenda (idVenda),
  INDEX idx_idUsuario (idUsuario),
  INDEX idx_data_hora (data_hora)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tabela: contas_pagar
-- Armazena as contas a pagar
CREATE TABLE contas_pagar (
  idContaPagar INT AUTO_INCREMENT PRIMARY KEY,
  descricao VARCHAR(255) NOT NULL,
  valor_total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  categoria VARCHAR(100) NULL,
  fornecedor VARCHAR(255) NULL,
  parcelado TINYINT(1) DEFAULT 0,
  numero_parcelas INT DEFAULT 1,
  data_cadastro DATE NOT NULL,
  observacoes TEXT NULL,
  ativo TINYINT(1) DEFAULT 1,
  INDEX idx_categoria (categoria),
  INDEX idx_data_cadastro (data_cadastro),
  INDEX idx_ativo (ativo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Tabela: parcelas_contas_pagar
-- Armazena as parcelas de cada conta a pagar
CREATE TABLE parcelas_contas_pagar (
  idParcela INT AUTO_INCREMENT PRIMARY KEY,
  idContaPagar INT NOT NULL,
  numero_parcela INT NOT NULL,
  valor_parcela DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  data_vencimento DATE NOT NULL,
  data_pagamento DATE NULL,
  valor_pago DECIMAL(10,2) NULL,
  status VARCHAR(20) DEFAULT 'pendente',
  observacoes TEXT NULL,
  INDEX idx_idContaPagar (idContaPagar),
  INDEX idx_data_vencimento (data_vencimento),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- FIM DO SCRIPT
-- ========================================

-- INSTRUÇÕES:
-- 1. Conecte ao banco de produção no DBeaver
-- 2. Selecione o banco: USE ybimpo48_ybimporta;
-- 3. Execute este script completo
-- 4. Verifique se todas as tabelas foram criadas: SHOW TABLES;
