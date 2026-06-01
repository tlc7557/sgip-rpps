-- ============================================================================
-- SISTEMA DE GESTÃO DE INSTITUTO DE PREVIDÊNCIA MUNICIPAL (SGIP-RPPS)
-- SCRIPT DE CRIAÇÃO DO BANCO DE DADOS (POSTGRESQL)
-- ============================================================================

-- Remover tabelas existentes caso rode novamente (ordem correta devido a chaves estrangeiras)
DROP TABLE IF EXISTS logs_auditoria CASCADE;
DROP TABLE IF EXISTS backups_logs CASCADE;
DROP TABLE IF EXISTS nuvem_sincronizacao CASCADE;
DROP TABLE IF EXISTS tramitacoes_workflow CASCADE;
DROP TABLE IF EXISTS protocolos CASCADE;
DROP TABLE IF EXISTS pensoes_pagamentos CASCADE;
DROP TABLE IF EXISTS pensoes CASCADE;
DROP TABLE IF EXISTS dependentes CASCADE;
DROP TABLE IF EXISTS aposentadorias_calculos CASCADE;
DROP TABLE IF EXISTS aposentadorias CASCADE;
DROP TABLE IF EXISTS historico_funcional CASCADE;
DROP TABLE IF EXISTS segurados CASCADE;
DROP TABLE IF EXISTS arquivos_versoes CASCADE;
DROP TABLE IF EXISTS arquivos CASCADE;
DROP TABLE IF EXISTS pastas CASCADE;
DROP TABLE IF EXISTS permissoes CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

-- ============================================================================
-- MÓDULO 1: USUÁRIOS E PERMISSÕES (RBAC)
-- ============================================================================

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL, -- Senha criptografada (bcrypt)
    perfil VARCHAR(50) NOT NULL, -- Administrador, Diretor, Procurador, Recursos Humanos, Jurídico, Financeiro, Protocolo, Digitalização, Consulta
    ativo BOOLEAN DEFAULT TRUE,
    assinatura_eletronica_token VARCHAR(255), -- Token/Assinatura digitalizada
    ultimo_login TIMESTAMP,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE permissoes (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
    modulo VARCHAR(100) NOT NULL, -- Usuarios, Segurados, Aposentadorias, Pensoes, Protocolo, Documentos, Scanner, Auditoria, Configuracoes
    pode_criar BOOLEAN DEFAULT FALSE,
    pode_ler BOOLEAN DEFAULT TRUE,
    pode_atualizar BOOLEAN DEFAULT FALSE,
    pode_deletar BOOLEAN DEFAULT FALSE,
    UNIQUE (usuario_id, modulo)
);

-- ============================================================================
-- MÓDULO 2: SEGURADOS E HISTÓRICO FUNCIONAL
-- ============================================================================

CREATE TABLE segurados (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    rg VARCHAR(20) NOT NULL,
    pis_pasep VARCHAR(20) UNIQUE,
    matricula VARCHAR(50) UNIQUE NOT NULL,
    data_nascimento DATE NOT NULL,
    estado_civil VARCHAR(50) NOT NULL, -- Solteiro, Casado, Divorciado, Viúvo, União Estável
    endereco_rua VARCHAR(200) NOT NULL,
    endereco_numero VARCHAR(20),
    endereco_bairro VARCHAR(100) NOT NULL,
    endereco_cidade VARCHAR(100) NOT NULL,
    endereco_estado VARCHAR(2) NOT NULL,
    endereco_cep VARCHAR(9) NOT NULL,
    telefone VARCHAR(15) NOT NULL,
    email VARCHAR(150),
    cargo_atual VARCHAR(100) NOT NULL,
    orgao_lotacao VARCHAR(100) NOT NULL, -- Prefeitura, Câmara, Autarquia, etc.
    data_admissao DATE NOT NULL,
    status_funcional VARCHAR(50) DEFAULT 'ATIVO', -- ATIVO, APOSENTADO, PENSIONISTA, EXONERADO, AFASTADO
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE dependentes (
    id SERIAL PRIMARY KEY,
    segurado_id INT REFERENCES segurados(id) ON DELETE CASCADE,
    nome VARCHAR(150) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    grau_parentesco VARCHAR(50) NOT NULL, -- Conjuge, Filho(a), Pai/Mãe, Enteado(a), Outro
    data_nascimento DATE NOT NULL,
    invalidez BOOLEAN DEFAULT FALSE, -- Relevante para concessão de pensão
    estudante BOOLEAN DEFAULT FALSE,
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE historico_funcional (
    id SERIAL PRIMARY KEY,
    segurado_id INT REFERENCES segurados(id) ON DELETE CASCADE,
    cargo VARCHAR(100) NOT NULL,
    tipo_evento VARCHAR(100) NOT NULL, -- Admissão, Promoção, Progressão, Afastamento, Licença
    data_evento DATE NOT NULL,
    salario_base NUMERIC(12, 2) NOT NULL,
    documento_portaria VARCHAR(100), -- Portaria de nomeação/promoção
    observacao TEXT
);

-- ============================================================================
-- MÓDULO 3: APOSENTADORIAS
-- ============================================================================

CREATE TABLE aposentadorias (
    id SERIAL PRIMARY KEY,
    segurado_id INT REFERENCES segurados(id) ON DELETE CASCADE,
    tipo_aposentadoria VARCHAR(100) NOT NULL, -- Por Idade, Por Tempo de Contribuição, Especial, Por Invalidez, Compulsória
    data_solicitacao DATE DEFAULT CURRENT_DATE,
    data_concessao DATE,
    status_processo VARCHAR(50) DEFAULT 'RECEBIMENTO', -- RECEBIMENTO, ANALISE, JURIDICO, DIRETORIA, HOMOLOGACAO, CONCEDIDO, REJEITADO
    tempo_contribuicao_anos INT NOT NULL,
    regra_aplicada VARCHAR(150) NOT NULL, -- Ex: EC 103/2019 - Transição Pedágio 100%
    parecer_juridico TEXT,
    parecer_procurador VARCHAR(100), -- Aprovado, Rejeitado, Diligência
    calculo_media_beneficio NUMERIC(12, 2),
    valor_beneficio NUMERIC(12, 2),
    portaria_concessao VARCHAR(50),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE aposentadorias_calculos (
    id SERIAL PRIMARY KEY,
    aposentadoria_id INT REFERENCES aposentadorias(id) ON DELETE CASCADE,
    ano_competencia INT NOT NULL,
    mes_competencia INT NOT NULL,
    salario_contribuicao NUMERIC(12, 2) NOT NULL,
    valor_indice_correcao NUMERIC(6, 4) DEFAULT 1.0000,
    salario_corrigido NUMERIC(12, 2) NOT NULL
);

-- ============================================================================
-- MÓDULO 4: PENSÕES
-- ============================================================================

CREATE TABLE pensoes (
    id SERIAL PRIMARY KEY,
    segurado_id INT REFERENCES segurados(id) ON DELETE CASCADE, -- Segurado instituidor (falecido)
    dependente_id INT REFERENCES dependentes(id), -- Pensionista recebedor
    data_obito DATE NOT NULL,
    certidao_obito_numero VARCHAR(100) NOT NULL,
    data_concessao DATE,
    valor_beneficio NUMERIC(12, 2) NOT NULL,
    porcentagem_cota NUMERIC(5, 2) DEFAULT 100.00, -- Rateio de cotas da pensão
    status VARCHAR(50) DEFAULT 'ATIVO', -- ATIVO, SUSPENSO, CANCELADO
    portaria_concessao VARCHAR(50),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pensoes_pagamentos (
    id SERIAL PRIMARY KEY,
    pensao_id INT REFERENCES pensoes(id) ON DELETE CASCADE,
    competencia VARCHAR(7) NOT NULL, -- MM/AAAA
    data_pagamento DATE NOT NULL,
    valor_pago NUMERIC(12, 2) NOT NULL,
    status_pagamento VARCHAR(50) DEFAULT 'PAGO', -- PAGO, BLOQUEADO, PENDENTE
    observacao VARCHAR(255)
);

-- ============================================================================
-- MÓDULO 5 E 14: PROTOCOLO DIGITAL E WORKFLOW
-- ============================================================================

CREATE TABLE protocolos (
    id SERIAL PRIMARY KEY,
    numero_protocolo VARCHAR(30) UNIQUE NOT NULL, -- NB + sequencial automático (Ex: 2026.0531.0001)
    segurado_id INT REFERENCES segurados(id) ON DELETE SET NULL,
    usuario_abertura_id INT REFERENCES usuarios(id) ON DELETE SET NULL,
    assunto VARCHAR(200) NOT NULL, -- Aposentadoria, Pensão, Certidão de Tempo de Contribuição (CTC), Revisão
    descricao TEXT,
    data_abertura TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_fechamento TIMESTAMP,
    status VARCHAR(50) DEFAULT 'ABERTO', -- ABERTO, EM_ANDAMENTO, PENDENTE, CONCLUIDO, CANCELADO
    prioridade VARCHAR(20) DEFAULT 'NORMAL', -- BAIXA, NORMAL, ALTA, URGENTE
    hash_assinatura_digital VARCHAR(255) -- Hash do protocolo assinado digitalmente
);

CREATE TABLE tramitacoes_workflow (
    id SERIAL PRIMARY KEY,
    protocolo_id INT REFERENCES protocolos(id) ON DELETE CASCADE,
    usuario_origem_id INT REFERENCES usuarios(id),
    usuario_destino_id INT REFERENCES usuarios(id),
    etapa_anterior VARCHAR(50), -- RECEBIMENTO, ANALISE, JURIDICO, DIRETORIA, HOMOLOGACAO, ARQUIVAMENTO
    etapa_atual VARCHAR(50) NOT NULL,
    despacho TEXT NOT NULL,
    data_tramitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    recebido BOOLEAN DEFAULT FALSE,
    data_recebimento TIMESTAMP
);

-- ============================================================================
-- MÓDULO 6: GESTÃO DOCUMENTAL
-- ============================================================================

CREATE TABLE pastas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(255),
    pai_id INT REFERENCES pastas(id) ON DELETE CASCADE, -- Autorreferenciamento para subpastas ilimitadas
    nivel_acesso VARCHAR(50) DEFAULT 'CONSULTA', -- Administrador, RH, Juridico, Consulta, etc.
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE arquivos (
    id SERIAL PRIMARY KEY,
    pasta_id INT REFERENCES pastas(id) ON DELETE CASCADE,
    segurado_id INT REFERENCES segurados(id) ON DELETE SET NULL, -- Dossiê do Segurado
    protocolo_id INT REFERENCES protocolos(id) ON DELETE SET NULL, -- Vinculado a um processo
    nome_arquivo VARCHAR(255) NOT NULL,
    extensao VARCHAR(10) NOT NULL, -- pdf, docx, xlsx, jpg, png
    tamanho_bytes INT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    caminho_storage VARCHAR(255) NOT NULL, -- Caminho físico / local
    resolucao_dpi INT, -- Padrão digitalização (ex: 300 DPI)
    padrao_pdf_a BOOLEAN DEFAULT FALSE, -- Garantia de preservação A3
    ocr_processado BOOLEAN DEFAULT FALSE,
    ocr_conteudo_texto TEXT, -- Texto extraído pelo OCR para pesquisa avançada
    versao_atual INT DEFAULT 1,
    criado_por INT REFERENCES usuarios(id),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    excluido_logico BOOLEAN DEFAULT FALSE
);

CREATE TABLE arquivos_versoes (
    id SERIAL PRIMARY KEY,
    arquivo_id INT REFERENCES arquivos(id) ON DELETE CASCADE,
    versao INT NOT NULL,
    caminho_storage VARCHAR(255) NOT NULL,
    tamanho_bytes INT NOT NULL,
    alterado_por INT REFERENCES usuarios(id),
    motivo_alteracao VARCHAR(255),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- MÓDULO 12: INTEGRAÇÃO COM NUVEM (GOOGLE DRIVE / ONEDRIVE)
-- ============================================================================

CREATE TABLE nuvem_sincronizacao (
    id SERIAL PRIMARY KEY,
    arquivo_id INT REFERENCES arquivos(id) ON DELETE CASCADE,
    provedor_nuvem VARCHAR(50) NOT NULL, -- GOOGLE_DRIVE, ONEDRIVE
    nuvem_file_id VARCHAR(255) NOT NULL, -- ID do arquivo retornado pelo provedor
    sincronizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status_sincronia VARCHAR(50) DEFAULT 'SUCESSO', -- SUCESSO, ERRO, PENDENTE
    hash_verificacao VARCHAR(255)
);

-- ============================================================================
-- MÓDULO 13: LOGS DE AUDITORIA E HISTÓRICO (LGPD)
-- ============================================================================

CREATE TABLE logs_auditoria (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id) ON DELETE SET NULL,
    cpf_usuario VARCHAR(14) NOT NULL, -- Backup caso o usuário seja removido
    perfil_usuario VARCHAR(50) NOT NULL,
    modulo VARCHAR(100) NOT NULL, -- Auth, Segurados, Aposentadorias, Protocolo, Documentos, Scanner
    acao VARCHAR(100) NOT NULL, -- LOGIN, LOGOUT, INCLUSAO, ALTERACAO, EXCLUSAO, DOWNLOAD, UPLOAD, CONSULTA
    tabela_afetada VARCHAR(100),
    registro_id INT,
    valores_anteriores TEXT, -- Dump JSON antes da alteração (para histórico)
    valores_novos TEXT, -- Dump JSON depois da alteração
    ip_origem VARCHAR(45) NOT NULL,
    user_agent VARCHAR(255),
    data_evento TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- MÓDULO 15: INFRAESTRUTURA DE BACKUP
-- ============================================================================

CREATE TABLE backups_logs (
    id SERIAL PRIMARY KEY,
    nome_backup VARCHAR(150) NOT NULL,
    provedor_destino VARCHAR(100) NOT NULL, -- LOCAL, GOOGLE_DRIVE, ONEDRIVE
    tamanho_bytes BIGINT NOT NULL,
    caminho_destino VARCHAR(255) NOT NULL,
    sucesso BOOLEAN DEFAULT TRUE,
    mensagem_erro TEXT,
    executado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
