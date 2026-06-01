# 🏛️ SGIP-RPPS: Sistema de Gestão do Instituto de Previdência Municipal

Bem-vindo ao **SGIP-RPPS**, um sistema web integrado, profissional e de alto desempenho projetado sob medida para a gestão completa de Regimes Próprios de Previdência Social (RPPS) de municípios de qualquer porte.

A plataforma automatiza e centraliza a gestão de segurados, dependentes, histórico funcional, concessões e cálculos de aposentadorias (EC 103/2019), pensões por morte, protocolo digital eletrônico com assinatura criptográfica, gestão documental avançada (GED) com OCR, e controle estrito de acessos de acordo com a **LGPD**.

---

## 🛠️ Tecnologias e Infraestrutura

- **Frontend:** React.js, TypeScript, Material UI 5 (Design System premium, responsive grid, glassmorphism), Recharts (Gráficos), JSZip (Compilação de dossiês).
- **Backend:** Node.js, Express/NestJS modular, TypeScript, JWT (Controle de sessões/perfil).
- **Banco de Dados & Resiliência:** 
  - **PostgreSQL 15** em ambiente de produção containerizado.
  - **SQLite 3 (Fallback Automático):** Caso você não tenha o PostgreSQL ou Docker instalados na máquina local, o backend mudará automaticamente para o SQLite em arquivo, gerando todas as tabelas a partir do script SQL e inserindo a massa de testes na hora. Isso garante que a aplicação rode **de imediato** com `npm run dev`.
- **Containers:** Docker e Docker Compose configurados.

---

## 👥 Perfis de Acesso e Credenciais de Teste (RBAC)

O sistema possui controle rígido de acesso por perfil. Use as credenciais abaixo para testar as permissões de cada módulo. A senha padrão para todos os servidores é **`previdencia123`**:

| Nome do Servidor | CPF de Acesso (Login) | Perfil Corporativo | Módulos Autorizados |
| :--- | :--- | :--- | :--- |
| **Carlos Eduardo da Silva** | `001.002.003-01` | **Administrador** | Acesso total irrestrito a todos os módulos, auditoria LGPD e backups |
| **Maria Tereza de Souza** | `001.002.003-02` | **Diretor** | Visualização de estatísticas, trâmites do workflow e concessão final |
| **Procurador Geral Dr. André** | `001.002.003-03` | **Procurador** | Parecer legal de processos de aposentadoria e trâmites jurídicos |
| **Joana Darc de Oliveira** | `001.002.003-04` | **Recursos Humanos** | Gestão de Segurados, dependentes, histórico funcional e averbações |
| **Marcos Antônio Scanner** | `001.002.003-08` | **Digitalização** | Acesso à estação de captura física, binarização 1-bit, OCR e upload |
| **Ana Lúcia Ribeiro** | `001.002.003-09` | **Consulta** | Apenas consulta de dados e visualização geral de dossiês |

---

## 📂 Estrutura de Pastas do Projeto

O sistema está organizado em monorepo corporativo em:
👉 **[sgip-rpps](file:///C:/Users/Bolinha%20Bav/.gemini/antigravity/scratch/sgip-rpps)**

- `docker-compose.yml`: Infraestrutura de orquestração local de containers.
- `database/`: Scripts DDL completos de criação (`schema.sql`) e sementes previdenciárias (`seed.sql`).
- `backend/`: Código NestJS/Express, criptografia e conexões resilientes.
- `frontend/`: Interface React, Material UI e roteador SPA integrado de 14 telas.

---

## 🚀 Como Instalar e Executar (Manual de Instalação)

### Método 1: Execução Corporativa com Docker (Recomendado)
Se você possui o Docker instalado na máquina, basta abrir o terminal no diretório `C:\Users\Bolinha Bav\.gemini\antigravity\scratch\sgip-rpps` e rodar:
```bash
docker-compose up --build
```
*O Docker subirá o PostgreSQL, o backend na porta 5000 e o painel React na porta 80.*

---

### Método 2: Execução Local Imediata (Resiliente em SQLite)
Caso não possua o Docker, o sistema está preparado para rodar **imediatamente** utilizando a base em arquivo SQLite local criada na hora. Siga as instruções:

#### 1. Iniciar o Servidor API Backend:
1. Abra o terminal na pasta:
   `C:\Users\Bolinha Bav\.gemini\antigravity\scratch\sgip-rpps\backend`
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor em modo de desenvolvimento:
   ```bash
   npm run dev
   ```
   *O console exibirá que o PostgreSQL está offline e que o fallback SQLite foi ativado com sucesso, gerando o arquivo `sgip_previdencia.db` e semeando as tabelas e dados previdenciários automaticamente!*

#### 2. Iniciar o Painel Frontend React:
1. Abra um segundo terminal na pasta:
   `C:\Users\Bolinha Bav\.gemini\antigravity\scratch\sgip-rpps\frontend`
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o painel de desenvolvimento:
   ```bash
   npm run dev
   ```
4. O painel corporativo estará rodando na porta **3000**! Acesse no navegador:
   👉 **http://localhost:3000**

---

## 📝 Manual do Usuário e Roteiro de Homologação

Para testar todos os 15 módulos integrados em 5 minutos, siga este roteiro guiado clássico de concessão previdenciária:

### Passo 1: Autenticação de Operador e Dashboard
1. Acesse `http://localhost:3000`.
2. Faça login com o perfil de **Recursos Humanos** utilizando o CPF `001.002.003-04` e senha `previdencia123`.
3. Navegue pelo **Dashboard** e veja os indicadores em tempo real (gráfico de digitalização e proporção de segurados).

### Passo 2: Mapeamento de Segurado e Dependente
1. Vá na aba **Segurados RPPS** no menu.
2. Clique em **Cadastrar Segurado** para adicionar um novo funcionário público à base municipal RPPS.
3. Insira Nome, CPF e Matrícula. Salve. O segurado estará ativo imediatamente e seu histórico funcional inicial de admissão será criado.

### Passo 3: Estação de Digitalização de Documentos com OCR e Assinatura ICP-Brasil
1. Navegue até o módulo **Módulo Scanner & OCR**.
2. Selecione o Segurado Alvo recém-criado ou um dos existentes (ex: **Maria José dos Santos**).
3. No seletor de modelos de teste na direita, clique em **"Template CNIS"**. O extrato oficial do CNIS será impresso no canvas do visor.
4. Experimente mudar o dispositivo de captura no seletor para **"Multifuncional Flatbed (Mesa Vidro)"**: note que o visor atualizará dinamicamente seu status na hora!
5. Clique em **Digitalizar**. O feixe de laser verde começará a varrer o documento.
6. Ao concluir, o **Motor OCR Previdenciário extrairá na hora** Nome, CPF e NIT do documento com nota de confiança, inserindo a **Assinatura Digital ICP-Brasil** carimbada.
7. Clique em **"Homologar e Salvar no Dossiê"**. O arquivo será arquivado sob a estrutura de pastas e incorporado no prontuário do segurado.

### Passo 4: Dossiê Digital Timeline
1. Vá na aba **Dossiê Timeline**.
2. Selecione o segurado. Veja o prontuário completo estilo prontuário eletrônico unificado, exibindo a timeline cronológica das digitalizações efetuadas e trâmites de processos vinculados!

### Passo 5: Cálculo Previdenciário e Workflow de Aposentadoria
1. Navegue para a aba **Aposentadorias**.
2. Selecione a segurada **Maria José dos Santos**.
3. Clique em **Calcular Proventos**. A plataforma calculará automaticamente o tempo de contribuição da segurada baseado em sua admissão, a média aritmética de suas contribuições e aplicará a alíquota constitucional brasileira da **EC 103/2019** (60% + 2% por ano extra), retornando o valor mensal do benefício.
4. Clique em **"Autuar Processo & Protocolo"**.
5. Um novo **Protocolo Digital** eletrônico será autuado na hora.
6. Veja na direita o processo listado na fila de workflows previdenciários municipais.
7. Clique em **"Avançar Trâmite"** para tramitar o processo pelas etapas do workflow (Recebimento -> Análise -> Jurídico -> Diretoria -> Concedido). Ao atingir o status final, a portaria de concessão do benefício é assinada eletronicamente e o status funcional da segurada é alterado automaticamente para **APOSENTADO**.

### Passo 6: Exportação de Relatórios e Auditoria LGPD
1. Vá em **Relatórios** e baixe instantaneamente planilhas CSV contendo as informações completas dos Segurados, Processos e Logs de Auditoria do Instituto.
2. Acesse a aba **Auditoria LGPD** (faça login como administrador para ver esta aba) para auditar cada clique, upload, login ou consulta de dados sensíveis efetuados pelos operadores, assegurando plena conformidade com as diretrizes da LGPD brasileira.
3. Vá em **Configurações** para simular o agendamento de backups e a sincronização nas nuvens do Google Drive e OneDrive.

---
*SGIP-RPPS - Desenvolvido em parceria com a equipe de Engenharia de Sistemas Previdenciários de Elite.*
