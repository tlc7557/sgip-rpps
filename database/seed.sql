-- ============================================================================
-- SISTEMA DE GESTÃO DE INSTITUTO DE PREVIDÊNCIA MUNICIPAL (SGIP-RPPS)
-- MASSA DE DADOS DE TESTE (SEEDING - POSTGRESQL)
-- ============================================================================

-- ============================================================================
-- SEED 1: USUÁRIOS E PERMISSÕES
-- Senha de teste padrão criptografada: 'previdencia123' (Hash bcrypt)
-- ============================================================================

INSERT INTO usuarios (nome, cpf, email, senha, perfil, ativo, assinatura_eletronica_token, telefone) VALUES
('Carlos Eduardo da Silva', '001.002.003-01', 'admin@previdencia.gov.br', '$2a$10$tZ/n0wYxI4g7M64VwF05.O3j10V3p8R/o5r2h9K0r3c5T0S0U0I0O', 'Administrador', TRUE, 'TOKEN_ASSINATURA_ADMIN_SHA256_A9B', '(85) 99999-9991'),
('Maria Tereza de Souza', '001.002.003-02', 'diretor@previdencia.gov.br', '$2a$10$tZ/n0wYxI4g7M64VwF05.O3j10V3p8R/o5r2h9K0r3c5T0S0U0I0O', 'Diretor', TRUE, 'TOKEN_ASSINATURA_DIRETOR_SHA256_F8C', '(85) 99999-9992'),
('Procurador Geral Dr. André', '001.002.003-03', 'procurador@previdencia.gov.br', '$2a$10$tZ/n0wYxI4g7M64VwF05.O3j10V3p8R/o5r2h9K0r3c5T0S0U0I0O', 'Procurador', TRUE, 'TOKEN_ASSINATURA_PROC_SHA256_X4R', '(85) 99999-9993'),
('Joana Darc de Oliveira', '001.002.003-04', 'rh@previdencia.gov.br', '$2a$10$tZ/n0wYxI4g7M64VwF05.O3j10V3p8R/o5r2h9K0r3c5T0S0U0I0O', 'Recursos Humanos', TRUE, 'TOKEN_ASSINATURA_RH_SHA256_D2B', '(85) 99999-9994'),
('Dr. Roberto Martins Custódio', '001.002.003-05', 'juridico@previdencia.gov.br', '$2a$10$tZ/n0wYxI4g7M64VwF05.O3j10V3p8R/o5r2h9K0r3c5T0S0U0I0O', 'Jurídico', TRUE, 'TOKEN_ASSINATURA_JUR_SHA256_Z7E', '(85) 99999-9995'),
('Geraldo Ferreira dos Santos', '001.002.003-06', 'financeiro@previdencia.gov.br', '$2a$10$tZ/n0wYxI4g7M64VwF05.O3j10V3p8R/o5r2h9K0r3c5T0S0U0I0O', 'Financeiro', TRUE, 'TOKEN_ASSINATURA_FIN_SHA256_L9W', '(85) 99999-9996'),
('Cláudia Roberta Mendes', '001.002.003-07', 'protocolo@previdencia.gov.br', '$2a$10$tZ/n0wYxI4g7M64VwF05.O3j10V3p8R/o5r2h9K0r3c5T0S0U0I0O', 'Protocolo', TRUE, 'TOKEN_ASSINATURA_PROT_SHA256_P8Q', '(85) 99999-9997'),
('Marcos Antônio Scanner', '001.002.003-08', 'digitalizacao@previdencia.gov.br', '$2a$10$tZ/n0wYxI4g7M64VwF05.O3j10V3p8R/o5r2h9K0r3c5T0S0U0I0O', 'Digitalização', TRUE, 'TOKEN_ASSINATURA_DIG_SHA256_M6G', '(85) 99999-9998'),
('Ana Lúcia Ribeiro', '001.002.003-09', 'consulta@previdencia.gov.br', '$2a$10$tZ/n0wYxI4g7M64VwF05.O3j10V3p8R/o5r2h9K0r3c5T0S0U0I0O', 'Consulta', TRUE, NULL, '(85) 99999-9999');

-- Injetar Permissões Padrão por Módulo
INSERT INTO permissoes (usuario_id, modulo, pode_criar, pode_ler, pode_atualizar, pode_deletar) VALUES
-- Admin tem acesso total
(1, 'Usuarios', TRUE, TRUE, TRUE, TRUE),
(1, 'Segurados', TRUE, TRUE, TRUE, TRUE),
(1, 'Aposentadorias', TRUE, TRUE, TRUE, TRUE),
(1, 'Protocolo', TRUE, TRUE, TRUE, TRUE),
(1, 'Documentos', TRUE, TRUE, TRUE, TRUE),
(1, 'Auditoria', TRUE, TRUE, TRUE, TRUE),
-- Diretor
(2, 'Usuarios', FALSE, TRUE, FALSE, FALSE),
(2, 'Segurados', TRUE, TRUE, TRUE, FALSE),
(2, 'Aposentadorias', TRUE, TRUE, TRUE, FALSE),
(2, 'Protocolo', TRUE, TRUE, TRUE, FALSE),
(2, 'Documentos', TRUE, TRUE, TRUE, FALSE),
-- Procurador
(3, 'Usuarios', FALSE, TRUE, FALSE, FALSE),
(3, 'Segurados', FALSE, TRUE, FALSE, FALSE),
(3, 'Aposentadorias', TRUE, TRUE, TRUE, FALSE),
(3, 'Protocolo', FALSE, TRUE, TRUE, FALSE),
(3, 'Documentos', TRUE, TRUE, TRUE, FALSE),
-- RH
(4, 'Segurados', TRUE, TRUE, TRUE, TRUE),
(4, 'Documentos', TRUE, TRUE, TRUE, FALSE),
-- Digitalizador
(8, 'Scanner', TRUE, TRUE, TRUE, FALSE),
(8, 'Documentos', TRUE, TRUE, TRUE, FALSE);

-- ============================================================================
-- SEED 2: SEGURADOS E HISTÓRICO FUNCIONAL
-- ============================================================================

INSERT INTO segurados (nome, cpf, rg, pis_pasep, matricula, data_nascimento, estado_civil, endereco_rua, endereco_numero, endereco_bairro, endereco_cidade, endereco_estado, endereco_cep, telefone, email, cargo_atual, orgao_lotacao, data_admissao, status_funcional) VALUES
('MARIA JOSÉ DOS SANTOS', '109.843.204-55', 'MG-12.345.678', '123.40598.22-3', 'MAT-1961A', '1961-04-12', 'Casado', 'Rua das Flores', '150', 'Centro', 'Belo Horizonte', 'MG', '30120-000', '(31) 98765-4321', 'maria.santos@email.com', 'PROFESSOR DE ENSINO BÁSICO', 'Secretaria Municipal de Educação', '1985-02-01', 'ATIVO'),
('CARLOS EDUARDO RODRIGUES', '342.981.405-90', 'SP-98.765.432', '144.20593.11-8', 'MAT-1958B', '1958-11-08', 'Divorciado', 'Av. Paulista', '2200', 'Bela Vista', 'São Paulo', 'SP', '01310-300', '(11) 99999-8888', 'carlos.rodrigues@email.com', 'ASSISTENTE ADMINISTRATIVO', 'Secretaria Municipal de Planejamento', '1990-06-15', 'ATIVO'),
('FRANCISCO ALVES DA SILVA', '201.394.053-11', 'CE-34.920.103', '109.43920.88-0', 'MAT-1974C', '1974-07-23', 'Solteiro', 'Rua do Ceará', '98', 'Aldeota', 'Fortaleza', 'CE', '60150-160', '(85) 98888-7777', 'francisco.silva@email.com', 'GUARDA CIVIL MUNICIPAL', 'Secretaria de Segurança e Trânsito', '1998-03-10', 'ATIVO'),
('ANA BEATRIZ GOMES', '450.193.842-88', 'RJ-45.920.193', '167.39103.55-9', 'MAT-1982D', '1982-09-15', 'Viúvo', 'Rua Copacabana', '450', 'Copacabana', 'Rio de Janeiro', 'RJ', '22020-002', '(21) 97777-6666', 'ana.gomes@email.com', 'ENFERMEIRO PADRÃO', 'Secretaria Municipal de Saúde', '2005-08-01', 'ATIVO');

-- Dependentes
INSERT INTO dependentes (segurado_id, nome, cpf, grau_parentesco, data_nascimento, invalidez, estudante, ativo) VALUES
(1, 'ROBERTO DOS SANTOS (FILHO)', '111.222.333-01', 'Filho(a)', '2010-05-15', FALSE, TRUE, TRUE),
(1, 'ANTONIO DOS SANTOS (CONJUGE)', '111.222.333-02', 'Conjuge', '1959-03-22', FALSE, FALSE, TRUE),
(2, 'JULIA RODRIGUES (FILHA)', '111.222.333-03', 'Filho(a)', '2012-10-08', FALSE, TRUE, TRUE);

-- Histórico Funcional
INSERT INTO historico_funcional (segurado_id, cargo, tipo_evento, data_evento, salario_base, documento_portaria, observacao) VALUES
(1, 'PROFESSOR DE ENSINO BÁSICO I', 'Admissão', '1985-02-01', 1200.00, 'PORT-85/01', 'Nomeação em concurso público'),
(1, 'PROFESSOR DE ENSINO BÁSICO II', 'Promoção', '1995-03-01', 2500.00, 'PORT-95/44', 'Promoção por titulação acadêmica'),
(1, 'PROFESSOR DE ENSINO BÁSICO III', 'Progressão', '2015-08-01', 4800.00, 'PORT-15/812', 'Progressão por antiguidade');

-- ============================================================================
-- SEED 3: APOSENTADORIAS
-- ============================================================================

INSERT INTO aposentadorias (segurado_id, tipo_aposentadoria, data_solicitacao, data_concessao, status_processo, tempo_contribuicao_anos, regra_aplicada, parecer_juridico, parecer_procurador, calculo_media_beneficio, valor_beneficio, portaria_concessao) VALUES
(1, 'Por Idade', '2026-05-01', NULL, 'ANALISE', 35, 'EC 103/2019 - Transição por Idade Mínima Progressiva', 'Análise preliminar dos documentos do CNIS e CTPS indica cumprimento da idade e contribuição necessária.', 'Pendente', 4800.00, 4800.00, NULL),
(2, 'Por Tempo de Contribuição', '2026-05-10', '2026-05-31', 'CONCEDIDO', 36, 'EC 103/2019 - Pedágio de 100%', 'Homologado e deferido conforme emendas constitucionais vigentes.', 'Aprovado', 5500.00, 5500.00, 'PORT-CONC-2026-004');

-- Cálculos da aposentadoria 1 (Competências simuladas)
INSERT INTO aposentadorias_calculos (aposentadoria_id, ano_competencia, mes_competencia, salario_contribuicao, valor_indice_correcao, salario_corrigido) VALUES
(1, 2026, 1, 4800.00, 1.0000, 4800.00),
(1, 2026, 2, 4800.00, 1.0000, 4800.00),
(1, 2025, 12, 4500.00, 1.0200, 4590.00),
(1, 2025, 11, 4500.00, 1.0200, 4590.00);

-- ============================================================================
-- SEED 5: PROTOCOLOS E WORKFLOWS
-- ============================================================================

INSERT INTO protocolos (numero_protocolo, segurado_id, usuario_abertura_id, assunto, descricao, status, prioridade) VALUES
('2026.0531.0001', 1, 7, 'Requerimento de Aposentadoria por Idade', 'Processo completo com documentos anexados para homologação de Maria José dos Santos.', 'EM_ANDAMENTO', 'ALTA'),
('2026.0531.0002', 2, 7, 'Requerimento de Aposentadoria por Tempo de Contribuição', 'Requerimento de aposentadoria de Carlos Eduardo Rodrigues.', 'CONCLUIDO', 'NORMAL'),
('2026.0531.0003', 3, 7, 'Certidão de Tempo de Contribuição (CTC)', 'Solicitação de CTC para averbação de tempo externo.', 'ABERTO', 'NORMAL');

-- Tramitações
INSERT INTO tramitacoes_workflow (protocolo_id, usuario_origem_id, usuario_destino_id, etapa_anterior, etapa_atual, despacho, recebido, data_recebimento) VALUES
(1, 7, 4, 'RECEBIMENTO', 'ANALISE', 'Encaminhado ao RH para validação da certidão funcional e tempo de contribuição.', TRUE, '2026-05-31 11:00:00'),
(1, 4, 5, 'ANALISE', 'JURIDICO', 'Tempo funcional verificado e averbado. Encaminhado ao jurídico para parecer legal.', FALSE, NULL);

-- ============================================================================
-- SEED 6: GESTÃO DOCUMENTAL (PASTAS)
-- Estrutura requerida: Instituto -> Servidores, Aposentados, Licitações, etc.
-- ============================================================================

INSERT INTO pastas (nome, descricao, pai_id, nivel_acesso) VALUES
('INSTITUTO', 'Pasta raiz do Instituto de Previdência', NULL, 'CONSULTA'),
('SERVIDORES', 'Pasta geral de servidores públicos ativos', 1, 'RH'),
('APOSENTADOS', 'Pasta contendo pastas de beneficiários aposentados', 1, 'CONSULTA'),
('PENSIONISTAS', 'Pasta contendo processos de pensionistas', 1, 'CONSULTA'),
('PROCESSOS', 'Processos administrativos de previdência', 1, 'CONSULTA'),
('JURÍDICO', 'Pasta da assessoria jurídica do instituto', 1, 'JURIDICO'),
('FINANCEIRO', 'Relatórios contábeis e folhas de pagamento', 1, 'FINANCEIRO'),
('RH', 'Assuntos de Recursos Humanos do instituto', 1, 'RH'),
('LICITAÇÕES', 'Processos de compras e certames licitatórios', 1, 'ADMINISTRADOR'),
('CONTRATOS', 'Contratos vigentes com fornecedores e terceiros', 1, 'CONSULTA');

-- Subpastas de servidores (Exemplo de subpastas ilimitadas)
INSERT INTO pastas (nome, descricao, pai_id, nivel_acesso) VALUES
('MARIA JOSÉ DOS SANTOS', 'Documentos cadastrais de Maria', 2, 'RH'),
('CARLOS EDUARDO RODRIGUES', 'Documentos cadastrais de Carlos', 2, 'RH');

-- Arquivos
INSERT INTO arquivos (pasta_id, segurado_id, protocolo_id, nome_arquivo, extensao, tamanho_bytes, mime_type, caminho_storage, ocr_processado, ocr_conteudo_texto, versao_atual, criado_por) VALUES
(11, 1, 1, '01_identidade_rg', 'png', 35400, 'image/png', 'storage/dossier/1/01_rg.png', TRUE, 'REPÚBLICA FEDERATIVA DO BRASIL REGISTRO GERAL NOME: MARIA JOSÉ DOS SANTOS CPF: 109.843.204-55 SSP-MG', 1, 8),
(11, 1, 1, '02_cnis_extrato', 'png', 104200, 'image/png', 'storage/dossier/1/02_cnis.png', TRUE, 'INSS EXTRATO CNIS SEGURADO MARIA JOSÉ DOS SANTOS CPF 109.843.204-55 NIT 123.40598.22-3 VINCULO MUNICÍPIO BELO HORIZONTE ADMISSÃO 01/02/1985', 1, 8);

-- ============================================================================
-- SEED 13: LOGS DE AUDITORIA (LGPD)
-- ============================================================================

INSERT INTO logs_auditoria (usuario_id, cpf_usuario, perfil_usuario, modulo, acao, tabela_afetada, registro_id, valores_anteriores, valores_novos, ip_origem, user_agent) VALUES
(1, '001.002.003-01', 'Administrador', 'Auth', 'LOGIN', 'usuarios', 1, NULL, '{"login": "sucesso"}', '192.168.0.10', 'Mozilla/5.0 Chrome/120.0'),
(8, '001.002.003-08', 'Digitalização', 'Scanner', 'UPLOAD', 'arquivos', 1, NULL, '{"nome_arquivo": "01_identidade_rg.png"}', '192.168.0.18', 'Mozilla/5.0 Edge/120.0'),
(8, '001.002.003-08', 'Digitalização', 'Scanner', 'UPLOAD', 'arquivos', 2, NULL, '{"nome_arquivo": "02_cnis_extrato.png"}', '192.168.0.18', 'Mozilla/5.0 Edge/120.0');
