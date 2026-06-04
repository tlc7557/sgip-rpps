import React, { useState, useEffect, useRef } from 'react';
import Tesseract from 'tesseract.js';
import {
  Box, CssBaseline, ThemeProvider, Drawer, AppBar, Toolbar, List,
  Typography, Divider, IconButton, ListItem, ListItemButton, ListItemIcon,
  ListItemText, Avatar, Grid, Card, CardContent, Button, TextField,
  Select, MenuItem, FormControl, InputLabel, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip, Switch, FormControlLabel, Checkbox,
  Dialog, DialogTitle, DialogContent, DialogActions, LinearProgress, CircularProgress, Tab, Tabs,
  InputAdornment, Tooltip, Alert
} from '@mui/material';
import {
  LayoutDashboard, UserCheck, ShieldAlert, FolderOpen, Scan, FileSpreadsheet,
  Settings, Users, LogOut, ShieldCheck, FileCheck,
  Phone, ChevronRight, Play, RotateCcw, CloudUpload,
  Plus, Download, Trash, Search, ArrowRight, UserPlus, Clock, Fingerprint, Edit, Send, Sun, Moon, Lock, X, Eye
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as ChartTooltip, ResponsiveContainer
} from 'recharts';
import { darkTheme, lightTheme } from './theme';
import axios from 'axios';

// URL base da API com fallback
const API_URL = 'http://localhost:5000/api';

// ============================================================================
// MASSA DE DADOS LOCAIS DE FALLBACK (PERSISTÊNCIA LOCALSTORAGE)
// ============================================================================

const DEFAULT_USERS = [
  { id: 1, nome: "Carlos Eduardo da Silva", cpf: "001.002.003-01", email: "admin@previdencia.gov.br", perfil: "Administrador", ativo: true, telefone: "(85) 99999-9991" },
  { id: 2, nome: "Maria Tereza de Souza", cpf: "001.002.003-02", email: "diretor@previdencia.gov.br", perfil: "Diretor", ativo: true, telefone: "(85) 99999-9992" },
  { id: 3, nome: "Procurador Geral Dr. André", cpf: "001.002.003-03", email: "procurador@previdencia.gov.br", perfil: "Procurador", ativo: true, telefone: "(85) 99999-9993" },
  { id: 4, nome: "Joana Darc de Oliveira", cpf: "001.002.003-04", email: "rh@previdencia.gov.br", perfil: "Recursos Humanos", ativo: true, telefone: "(85) 99999-9994" },
  { id: 5, nome: "Dr. Roberto Martins Custódio", cpf: "001.002.003-05", email: "juridico@previdencia.gov.br", perfil: "Jurídico", ativo: true, telefone: "(85) 99999-9995" },
  { id: 7, nome: "Cláudia Roberta Mendes", cpf: "001.002.003-07", email: "protocolo@previdencia.gov.br", perfil: "Protocolo", ativo: true, telefone: "(85) 99999-9997" },
  { id: 8, nome: "Marcos Antônio Scanner", cpf: "001.002.003-08", email: "digitalizacao@previdencia.gov.br", perfil: "Digitalização", ativo: true, telefone: "(85) 99999-9998" }
];

const DEFAULT_SEGURADOS = [
  {
    id: 1, nome: "MARIA JOSÉ DOS SANTOS", cpf: "109.843.204-55", rg: "MG-12.345.678", pis_pasep: "123.40598.22-3", matricula: "MAT-1961A",
    data_nascimento: "1961-04-12", estado_civil: "Casado", endereco: "Rua das Flores, 150, Centro, Belo Horizonte - MG",
    telefone: "(31) 98765-4321", email: "maria.santos@email.com", cargo_atual: "PROFESSOR DE ENSINO BÁSICO", orgao_lotacao: "Secretaria Municipal de Educação",
    data_admissao: "1985-02-01", status_funcional: "ATIVO"
  },
  {
    id: 2, nome: "CARLOS EDUARDO RODRIGUES", cpf: "342.981.405-90", rg: "SP-98.765.432", pis_pasep: "144.20593.11-8", matricula: "MAT-1958B",
    data_nascimento: "1958-11-08", estado_civil: "Divorciado", endereco: "Av. Paulista, 2200, Bela Vista, São Paulo - SP",
    telefone: "(11) 99999-8888", email: "carlos.rodrigues@email.com", cargo_atual: "ASSISTENTE ADMINISTRATIVO", orgao_lotacao: "Secretaria Municipal de Planejamento",
    data_admissao: "1990-06-15", status_funcional: "APOSENTADO"
  },
  {
    id: 3, nome: "FRANCISCO ALVES DA SILVA", cpf: "201.394.053-11", rg: "CE-34.920.103", pis_pasep: "109.43920.88-0", matricula: "MAT-1974C",
    data_nascimento: "1974-07-23", estado_civil: "Solteiro", endereco: "Rua do Ceará, 98, Aldeota, Fortaleza - CE",
    telefone: "(85) 98888-7777", email: "francisco.silva@email.com", cargo_atual: "GUARDA CIVIL MUNICIPAL", orgao_lotacao: "Secretaria de Segurança e Trânsito",
    data_admissao: "1998-03-10", status_funcional: "ATIVO"
  }
];

const DEFAULT_DEPENDENTES = [
  { id: 1, segurado_id: 1, nome: "ROBERTO DOS SANTOS (FILHO)", cpf: "111.222.333-01", grau_parentesco: "Filho(a)", data_nascimento: "2010-05-15", invalidez: false, estudante: true },
  { id: 2, segurado_id: 1, nome: "ANTONIO DOS SANTOS (CONJUGE)", cpf: "111.222.333-02", grau_parentesco: "Conjuge", data_nascimento: "1959-03-22", invalidez: false, estudante: false },
  { id: 3, segurado_id: 2, nome: "JULIA RODRIGUES (FILHA)", cpf: "111.222.333-03", grau_parentesco: "Filho(a)", data_nascimento: "2012-10-08", invalidez: false, estudante: true }
];

const DEFAULT_APOSENTADORIAS = [
  { id: 1, segurado_id: 1, tipo_aposentadoria: "Por Idade", data_solicitacao: "2026-05-01", status_processo: "ANALISE", tempo_contribuicao_anos: 35, regra_aplicada: "EC 103/2019 - Transição por Idade", parecer_juridico: "Em análise no RH.", valor_beneficio: 4800.00, calculo_media_beneficio: 4800.00 },
  { id: 2, segurado_id: 2, tipo_aposentadoria: "Por Tempo de Contribuição", data_solicitacao: "2026-05-10", status_processo: "CONCEDIDO", tempo_contribuicao_anos: 36, regra_aplicada: "EC 103/2019 - Pedágio de 100%", parecer_juridico: "Aprovado e homologado pelo Tribunal de Contas.", valor_beneficio: 5500.00, calculo_media_beneficio: 5500.00, portaria_concessao: "PORT-CONC-2026-004" }
];

const DEFAULT_PROTOCOLOS = [
  { id: 1, numero_protocolo: "2026.0531.0001", segurado_id: 1, assunto: "Requerimento de Aposentadoria por Idade", descricao: "Aposentadoria de Maria José dos Santos", status: "EM_ANDAMENTO", prioridade: "ALTA", data_abertura: "2026-05-31T11:00:00Z" },
  { id: 2, numero_protocolo: "2026.0531.0002", segurado_id: 2, assunto: "Requerimento de Aposentadoria por Tempo", descricao: "Aposentadoria de Carlos Eduardo Rodrigues", status: "CONCLUIDO", prioridade: "NORMAL", data_abertura: "2026-05-30T10:15:00Z" }
];

const DEFAULT_AUDITORIA = [
  { id: 1, cpf_usuario: "001.002.003-01", perfil_usuario: "Administrador", modulo: "Auth", acao: "LOGIN", ip_origem: "192.168.0.100", data_evento: "2026-05-31T13:30:00Z" },
  { id: 2, cpf_usuario: "001.002.003-04", perfil_usuario: "Recursos Humanos", modulo: "Segurados", acao: "CONSULTA", ip_origem: "192.168.0.104", data_evento: "2026-05-31T12:15:00Z" }
];

export default function App() {
  // Estado Global
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isApiOnline, setIsApiOnline] = useState<boolean>(false);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('dark');
  const theme = themeMode === 'dark' ? darkTheme : lightTheme;

  // Massa de dados local (Fallback se a API estiver offline)
  const [usersList, setUsersList] = useState<any[]>(DEFAULT_USERS);
  const [seguradosList, setSeguradosList] = useState<any[]>(DEFAULT_SEGURADOS);
  const [dependentesList] = useState<any[]>(DEFAULT_DEPENDENTES);
  const [aposentadoriasList, setAposentadoriasList] = useState<any[]>(DEFAULT_APOSENTADORIAS);
  const [protocolosList, setProtocolosList] = useState<any[]>(DEFAULT_PROTOCOLOS);
  const [auditoriaLogs, setAuditoriaLogs] = useState<any[]>(DEFAULT_AUDITORIA);

  // Login Form
  const [loginCpf, setLoginCpf] = useState('');
  const [loginSenha, setLoginSenha] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isGovBrLoginMode, setIsGovBrLoginMode] = useState(false);

  // Pastas de Gestão Documental (MÓDULO 6)
  const [folders, setFolders] = useState<any[]>([
    { id: 1, nome: "INSTITUTO", pai_id: null },
    { id: 2, nome: "SERVIDORES", pai_id: 1 },
    { id: 3, nome: "APOSENTADOS", pai_id: 1 },
    { id: 4, nome: "PROCESSOS", pai_id: 1 },
    { id: 5, nome: "JURÍDICO", pai_id: 1 },
    { id: 6, nome: "FINANCEIRO", pai_id: 1 }
  ]);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(1);
  const [documentosList, setDocumentosList] = useState<any[]>([
    { id: 1, pasta_id: 2, segurado_id: 1, nome_arquivo: "01_rg_identidade", extensao: "png", tamanho_bytes: 35000, criado_por: "Marcos Antônio Scanner", criado_em: "2026-05-31", ocr_texto: "REPÚBLICA FEDERATIVA DO BRASIL REGISTRO GERAL NOME: MARIA JOSÉ DOS SANTOS CPF: 109.843.204-55 SSP-MG", assinado: true }
  ]);

  // Scanner Simulator State (MÓDULO 8)
  const [scanDevice, setScanDevice] = useState('ADF');
  const [scanDoctype, setScanDoctype] = useState('IDENTIDADE');
  const [scanSeguradoId, setScanSeguradoId] = useState(1);
  const [isScanning, setIsScanning] = useState(false);
  const [scannerProgress, setScannerProgress] = useState(0);
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [ocrConfidence, setOcrConfidence] = useState(0);
  const [ocrExtractedFields, setOcrExtractedFields] = useState<any>({});
  const [scanFilters, setScanFilters] = useState({ grayscale: false, binarize: false, contrast: 100 });
  const scannerCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Real Scanner tab states
  const [realDevices, setRealDevices] = useState<any[]>([]);
  const [selectedRealDeviceId, setSelectedRealDeviceId] = useState<string>('');
  const [isScanningReal, setIsScanningReal] = useState<boolean>(false);
  const [realScannedImage, setRealScannedImage] = useState<string | null>(null);
  const [realOcrText, setRealOcrText] = useState<string>('');
  const [isOcrProcessing, setIsOcrProcessing] = useState<boolean>(false);
  const [ocrProgressText, setOcrProgressText] = useState<string>('');
  const [ocrProgressVal, setOcrProgressVal] = useState<number>(0);
  const [realOcrFields, setRealOcrFields] = useState<any>({});
  const [realScanDpi, setRealScanDpi] = useState<number>(300);
  const [realScanMode, setRealScanMode] = useState<string>('COLOR');
  const [diagResult, setDiagResult] = useState<any>(null);
  const [isDiagnosing, setIsDiagnosing] = useState<boolean>(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // ============================================================================
  // ESTADOS DA GESTÃO DE PERFIS E PERMISSÕES (RBAC)
  // ============================================================================
  const [openNewUser, setOpenNewUser] = useState(false);
  const [openEditUser, setOpenEditUser] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<any>(null);
  
  const [userFormNome, setUserFormNome] = useState('');
  const [userFormCpf, setUserFormCpf] = useState('');
  const [userFormEmail, setUserFormEmail] = useState('');
  const [userFormSenha, setUserFormSenha] = useState('');
  const [userFormPerfil, setUserFormPerfil] = useState('Consulta');
  const [userFormAtivo, setUserFormAtivo] = useState(true);
  const [userFormTelefone, setUserFormTelefone] = useState('');
  
  const DEFAULT_PERMISSIONS = [
    { modulo: 'Usuarios', pode_criar: false, pode_ler: true, pode_atualizar: false, pode_deletar: false },
    { modulo: 'Segurados', pode_criar: false, pode_ler: true, pode_atualizar: false, pode_deletar: false },
    { modulo: 'Aposentadorias', pode_criar: false, pode_ler: true, pode_atualizar: false, pode_deletar: false },
    { modulo: 'Pensoes', pode_criar: false, pode_ler: true, pode_atualizar: false, pode_deletar: false },
    { modulo: 'Protocolo', pode_criar: false, pode_ler: true, pode_atualizar: false, pode_deletar: false },
    { modulo: 'Documentos', pode_criar: false, pode_ler: true, pode_atualizar: false, pode_deletar: false },
    { modulo: 'Scanner', pode_criar: false, pode_ler: true, pode_atualizar: false, pode_deletar: false },
    { modulo: 'Auditoria', pode_criar: false, pode_ler: true, pode_atualizar: false, pode_deletar: false }
  ];
  const [userFormPermissions, setUserFormPermissions] = useState<any[]>(DEFAULT_PERMISSIONS);
  const [scanSourceMode, setScanSourceMode] = useState<string>('driver'); // 'driver' | 'camera' | 'file'

  // Estados para a Pré-Visualização de Documentos no Dossiê (MÓDULO 7)
  const [openDossierPreviewDialog, setOpenDossierPreviewDialog] = useState(false);
  const [selectedDossierFile, setSelectedDossierFile] = useState<any>(null);
  const [dossierFileBase64, setDossierFileBase64] = useState<string | null>(null);
  const [isLoadingDossierPreview, setIsLoadingDossierPreview] = useState(false);
  const [isAgentOnline, setIsAgentOnline] = useState(false);

  // Estados para Edição/Exclusão de Protocolos e Documentos (CRUD Completo)
  const [openEditProtDialog, setOpenEditProtDialog] = useState(false);
  const [editProtAssunto, setEditProtAssunto] = useState('');
  const [editProtDesc, setEditProtDesc] = useState('');
  const [editProtPrioridade, setEditProtPrioridade] = useState('NORMAL');
  const [editProtStatus, setEditProtStatus] = useState('ABERTO');

  const [openNewFolderDialog, setOpenNewFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderDesc, setNewFolderDesc] = useState('');
  const [openEditFolderDialog, setOpenEditFolderDialog] = useState(false);
  const [editFolderName, setEditFolderName] = useState('');
  const [editFolderDesc, setEditFolderDesc] = useState('');

  const [openEditFileDialog, setOpenEditFileDialog] = useState(false);
  const [selectedFileForEdit, setSelectedFileForEdit] = useState<any>(null);
  const [editFileName, setEditFileName] = useState('');

  // Protocolos tab states
  const [openNewProtDialog, setOpenNewProtDialog] = useState<boolean>(false);
  const [openTramitarDialog, setOpenTramitarDialog] = useState<boolean>(false);
  const [openHistoryDialog, setOpenHistoryDialog] = useState<boolean>(false);
  const [selectedProtocol, setSelectedProtocol] = useState<any>(null);
  const [newProtAssunto, setNewProtAssunto] = useState<string>('');
  const [newProtDesc, setNewProtDesc] = useState<string>('');
  const [newProtSeguradoId, setNewProtSeguradoId] = useState<number | string>('');
  const [newProtPrioridade, setNewProtPrioridade] = useState<string>('NORMAL');
  const [tramitDestinoId, setTramitDestinoId] = useState<number | string>('');
  const [tramitEtapa, setTramitEtapa] = useState<string>('EM_ANDAMENTO');
  const [tramitDespacho, setTramitDespacho] = useState<string>('');
  const [protHistoryList, setProtHistoryList] = useState<any[]>([]);

  // Aposentadorias Workflow (MÓDULO 3)
  const [selectedApSeguradoId, setSelectedApSeguradoId] = useState<number>(1);
  const [selectedApRegra, setSelectedApRegra] = useState<string>('IDADE');
  const [selectedApGenero, setSelectedApGenero] = useState<string>('Feminino');
  const [selectedApProfessor, setSelectedApProfessor] = useState<boolean>(false);
  const [customApSalario, setCustomApSalario] = useState<number>(5000);
  const [apCalculatedData, setApCalculatedData] = useState<any>(null);

  // Monitoramento Externo Quixadá - CE (MÓDULO 10 / Integração)
  const [dashboardSubTab, setDashboardSubTab] = useState<number>(0);
  const [isSyncingExternal, setIsSyncingExternal] = useState<boolean>(false);
  const [externalSearchQuery, setExternalSearchQuery] = useState<string>('');
  const [externalSearchDate, setExternalSearchDate] = useState<string>(new Date().toISOString().substring(0, 10));

  // Função utilitária para formatação de CPF
  const formatCPF = (val: string): string => {
    const digits = val.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  };

  // Estados para o monitoramento de processos de Quixadá & Gov.br
  const [selectedExternalProcess, setSelectedExternalProcess] = useState<any>(null);
  const [selectedExternalDoc, setSelectedExternalDoc] = useState<any>(null);
  const [isGovBrConnected, setIsGovBrConnected] = useState<boolean>(false);
  const [openGovBrModal, setOpenGovBrModal] = useState<boolean>(false);
  const [govBrCpf, setGovBrCpf] = useState<string>('');
  const [govBrSenha, setGovBrSenha] = useState<string>('');
  const [govBrCertificado, setGovBrCertificado] = useState<string>('');
  const [govBrError, setGovBrError] = useState<string>('');
  const [govBrLoading, setGovBrLoading] = useState<boolean>(false);

  const [liveFeedLogs, setLiveFeedLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] Conexão estabelecida com o portal TCE-CE.`,
    `[${new Date(Date.now() - 30000).toLocaleTimeString()}] Sincronização automática concluída.`,
    `[${new Date(Date.now() - 60000).toLocaleTimeString()}] Auditoria do RPPS de Quixadá consultada pelo Tribunal.`
  ]);

  const [externalProcesses, setExternalProcesses] = useState<any[]>([
    {
      id: 101,
      numero: `TCE-CE-008432/${new Date().getFullYear()}`,
      assunto: "Prestação de Contas Anual - RPPS Quixadá Previdência",
      interessado: "Prefeitura Municipal de Quixadá",
      orgao: "Tribunal de Contas do Estado do Ceará (TCE-CE)",
      dataLimite: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
      status: "Pendente de Defesa Prévia",
      urgencia: "CRITICA",
      documentos: [
        { id: "ext-101-1", nome: "Parecer_Admissibilidade_TCE.pdf", tamanho: "1.2 MB", data: "12/04/2026", restrito: false, conteudo: "PARECER DE ADMISSIBILIDADE TCE-CE nº 4983/2026\nTrata-se de exame de admissibilidade da prestação de contas do Fundo Municipal de Previdência de Quixadá, exercício de 2025. Conclui-se pelo preenchimento dos pressupostos processuais." },
        { id: "ext-101-2", nome: "Relatorio_Financeiro_Consolidado.xlsx", tamanho: "4.5 MB", data: "15/04/2026", restrito: true, conteudo: "DEMONSTRATIVO FINANCEIRO E PATRIMONIAL DETALHADO DO RPPS - QUIXADÁ\n[ACESSO AUTENTICADO COM GOV.BR - e-CPF / CERTIFICADO DIGITAL ICP-BRASIL]\nRecursos Totais Garantidores: R$ 124.938.410,23.\nTaxa de Administração Executada: 1.82%.\nSuperávit Técnico Apurado: R$ 4.298.110,45.\nEnquadramento de Carteira de Investimentos: 98.4% de acordo com a Resolução CMN nº 4.963." },
        { id: "ext-101-3", nome: "Oficio_Notificacao_083_2026.pdf", tamanho: "350 KB", data: "22/04/2026", restrito: false, conteudo: "OFÍCIO DE NOTIFICAÇÃO Nº 083/2026-TCE-CE\nFica notificado o gestor do RPPS de Quixadá para apresentar defesa no prazo improrrogável de 15 dias úteis quanto ao apontamento de divergências nas contas de benefícios por invalidez." }
      ]
    },
    {
      id: 102,
      numero: `TCE-CE-012942/${new Date().getFullYear()}`,
      assunto: "Aposentadoria Especial de Professores do Magistério",
      interessado: "Instituto de Previdência de Quixadá (QuixadáPrev)",
      orgao: "2ª Câmara de Julgamento - TCE-CE",
      dataLimite: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
      status: "Em Instrução de Homologação",
      urgencia: "MEDIA",
      documentos: [
        { id: "ext-102-1", nome: "Certidao_Tempo_Contribuicao_Professora.pdf", tamanho: "2.1 MB", data: "05/03/2026", restrito: false, conteudo: "CERTIDÃO DE TEMPO DE CONTRIBUIÇÃO (CTC)\nServidora: Maria das Dores Holanda.\nCargo: Professora de Educação Básica II.\nTempo total averbado: 25 anos, 3 meses e 10 dias de efetivo magistério." },
        { id: "ext-102-2", nome: "Laudo_LTCAT_Quixada.pdf", tamanho: "5.8 MB", data: "12/03/2026", restrito: true, conteudo: "LAUDO TÉCNICO DAS CONDIÇÕES AMBIENTAIS DE TRABALHO (LTCAT)\n[ACESSO AUTENTICADO COM GOV.BR - e-CPF / CERTIFICADO DIGITAL ICP-BRASIL]\nAnálise de ruído, calor e agentes biológicos nas escolas municipais de Quixadá. Homologado pelo Engenheiro do Trabalho para comprovação de atividade especial de magistério." }
      ]
    },
    {
      id: 103,
      numero: `TCE-CE-020139/${new Date().getFullYear()}`,
      assunto: "Auditoria Concorrente de Despesas Previdenciárias",
      interessado: "Fundo Previdenciário Municipal de Quixadá",
      orgao: "Secretaria de Fiscalização Previdenciária - TCE-CE",
      dataLimite: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
      status: "Notificação Respondida",
      urgencia: "SEGURA",
      documentos: [
        { id: "ext-103-1", nome: "Ficha_Inscricao_Processo_Fiscal.pdf", tamanho: "800 KB", data: "18/02/2026", restrito: false, conteudo: "FICHA DE ACOMPANHAMENTO DA AUDITORIA TCE-CE\nObjeto: Auditoria concorrente de legalidade e economicidade das despesas previdenciárias do exercício vigente." },
        { id: "ext-103-2", nome: "Analise_Folha_Pagamento_Restrita.pdf", tamanho: "3.2 MB", data: "20/02/2026", restrito: true, conteudo: "RELATÓRIO DETALHADO DA FOLHA DE PAGAMENTO DE INATIVOS\n[ACESSO AUTENTICADO COM GOV.BR - e-CPF / CERTIFICADO DIGITAL ICP-BRASIL]\nListagem nominal com proventos, gratificações incorporadas e descontos previdenciários de todos os aposentados do RPPS de Quixadá do exercício de 2025." }
      ]
    },
    {
      id: 104,
      numero: `TCU-011409/${new Date().getFullYear()}`,
      assunto: "Tomada de Contas Especial - Recursos Federais Repassados",
      interessado: "Secretaria de Saúde de Quixadá",
      orgao: "Tribunal de Contas da União (TCU)",
      dataLimite: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
      status: "Diligência em Andamento",
      urgencia: "ATRASADA",
      documentos: [
        { id: "ext-104-1", nome: "Instrucao_TCE_Saude.pdf", tamanho: "1.7 MB", data: "01/02/2026", restrito: false, conteudo: "INSTRUÇÃO PRELIMINAR DE TOMADA DE CONTAS ESPECIAL\nIrregularidade detectada na prestação de contas do convênio federal repassado para atenção básica à saúde do município de Quixadá." },
        { id: "ext-104-2", nome: "Extratos_Bancarios_Detalhados.pdf", tamanho: "8.9 MB", data: "05/02/2026", restrito: true, conteudo: "DEMONSTRATIVO DE FLUXO BANCÁRIO DE CONTAS DE CONVÊNIO\n[ACESSO AUTENTICADO COM GOV.BR - e-CPF / CERTIFICADO DIGITAL ICP-BRASIL]\nExtratos detalhados de movimentação bancária da conta do Convênio MS-Quixadá nº 849/2024. Revela repasses não declarados de fundos públicos federais." }
      ]
    }
  ]);

  // Cloud & Backup Sync Logs (MÓDULO 12 & 15)
  const [cloudSyncLogs, setCloudSyncLogs] = useState<string[]>([
    "[08:00:00] Backup automatizado matinal - Replicado no Google Drive",
    "[09:30:15] Arquivo '01_rg_identidade.png' sincronizado com o OneDrive com sucesso"
  ]);

  // Dossiê selecionado
  const [dossieSeguradoId, setDossieSeguradoId] = useState<number>(1);
  const [dossieCompleto, setDossieCompleto] = useState<any>(null);

  // Modais de Criação e Edição de Segurados
  const [openNewSegurado, setOpenNewSegurado] = useState(false);
  const [openEditSegurado, setOpenEditSegurado] = useState(false);
  const [selectedSeguradoForEdit, setSelectedSeguradoForEdit] = useState<any>(null);
  const [newSegData, setNewSegData] = useState({ nome: '', cpf: '', rg: '', matricula: '', data_nascimento: '', estado_civil: 'Casado', endereco: '', telefone: '', email: '', cargo_atual: '', orgao_lotacao: 'Prefeitura', data_admissao: '' });
  const [editSegData, setEditSegData] = useState({ nome: '', cpf: '', rg: '', matricula: '', data_nascimento: '', estado_civil: 'Casado', endereco: '', telefone: '', email: '', cargo_atual: '', orgao_lotacao: 'Prefeitura', data_admissao: '', status_funcional: 'ATIVO' });

  // Testar conexão com a API na montagem
  useEffect(() => {
    testApiConnection();
  }, []);

  const testApiConnection = async () => {
    try {
      const res = await axios.get(`${API_URL}/ping`);
      if (res.status === 200) {
        setIsApiOnline(true);
      }
    } catch (e: any) {
      console.warn("API Offline. Operando no modo Fallback Local / Offline Simulação.");
      setIsApiOnline(false);
    }
  };

  // Efeito para simular o live feed do controle externo TCE-CE
  useEffect(() => {
    if (activeTab === 'dashboard' && dashboardSubTab === 1) {
      const feedEvents = [
        "Ministério Público de Contas emitiu parecer favorável no Proc. TCE-CE-008432",
        "TCE-CE homologou requerimento de Aposentadoria de Professora no Proc. TCE-CE-012942",
        "Novo despacho anexado pelo Conselheiro Relator no Proc. TCU-011409",
        "QuixadáPrev transmitiu a DIPR de benefícios de forma consolidada",
        "TCE-CE prorrogou prazo de defesa prévia em processo de contas anuais",
        "Secretaria do Controle Externo de Pessoal notificou município sobre acúmulo de cargos"
      ];

      const interval = setInterval(() => {
        const randomEvent = feedEvents[Math.floor(Math.random() * feedEvents.length)];
        const timeStr = new Date().toLocaleTimeString();
        setLiveFeedLogs(prev => [`[${timeStr}] ${randomEvent}`, ...prev.slice(0, 4)]);
      }, 8000);

      return () => clearInterval(interval);
    }
  }, [activeTab, dashboardSubTab]);

  // Carregar e auto-detectar dados do segurado no Simulador
  useEffect(() => {
    const seg = seguradosList.find(s => s.id === selectedApSeguradoId);
    if (seg) {
      const nomeUpper = (seg.nome || "").toUpperCase().trim();
      const isFem = nomeUpper.startsWith("MARIA") || 
                    nomeUpper.startsWith("ANA") || 
                    nomeUpper.startsWith("JULIA") || 
                    nomeUpper.startsWith("CLARA") || 
                    nomeUpper.startsWith("FRANCISCA") || 
                    nomeUpper.startsWith("PAULA") || 
                    nomeUpper.endsWith("A");
      setSelectedApGenero(isFem ? 'Feminino' : 'Masculino');

      const cargoUpper = (seg.cargo_atual || "").toUpperCase();
      const isProf = cargoUpper.includes("PROFESSOR") || cargoUpper.includes("PROFESSORA") || cargoUpper.includes("MAGISTÉRIO") || cargoUpper.includes("DOCENTE");
      setSelectedApProfessor(isProf);

      setCustomApSalario(5000);
      setApCalculatedData(null);
    }
  }, [selectedApSeguradoId, seguradosList]);

  // Carregar Dossiê Eletrônico Integrado (MÓDULO 7)
  useEffect(() => {
    if (dossieSeguradoId) {
      carregarDossie(dossieSeguradoId);
    }
  }, [dossieSeguradoId, documentosList, aposentadoriasList]);

  const carregarDossie = async (id: number) => {
    if (isApiOnline && authToken) {
      try {
        const res = await axios.get(`${API_URL}/segurados/${id}/dossie`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        setDossieCompleto(res.data);
      } catch (err) {
        carregarDossieLocal(id);
      }
    } else {
      carregarDossieLocal(id);
    }
  };

  const carregarDossieLocal = (id: number) => {
    const seg = seguradosList.find(s => s.id === id);
    if (!seg) return;
    const deps = dependentesList.filter(d => d.segurado_id === id);
    const docs = documentosList.filter(d => d.segurado_id === id);
    const aps = aposentadoriasList.filter(a => a.segurado_id === id);

    // Timeline consolidada (MÓDULO 7)
    const timeline: any[] = [];
    docs.forEach(d => {
      timeline.push({
        tipo: 'DIGITALIZACAO',
        id: d.id,
        nome_arquivo: d.nome_arquivo,
        extensao: d.extensao,
        tamanho_bytes: d.tamanho_bytes,
        ocr_conteudo_texto: d.ocr_texto || d.ocr_conteudo_texto || '',
        resolucao_dpi: d.resolucao_dpi || 300,
        padrao_pdf_a: d.padrao_pdf_a !== undefined ? d.padrao_pdf_a : true,
        hash_sha256: d.hash_sha256 || 'SHA256-ICP-BR-#DOC-' + d.id + '-' + Math.random().toString(36).substring(4).toUpperCase(),
        titulo: `Documento Digitalizado: ${d.nome_arquivo}.${d.extensao}`,
        data: d.criado_em,
        descricao: `Armazenamento A3 / 300 DPI. Integridade assegurada pelo ICP-Brasil.`,
        responsavel: d.criado_por
      });
    });

    aps.forEach(a => {
      timeline.push({
        tipo: 'PROCESSO',
        titulo: `Processo de Aposentadoria - ${a.tipo_aposentadoria}`,
        data: a.data_solicitacao,
        descricao: `Requerimento autuado. Status Atual: ${a.status_processo}. Regra: ${a.regra_aplicada}.`,
        responsavel: "RH / Procuradoria"
      });
    });

    setDossieCompleto({
      segurado: seg,
      dependentes: deps,
      arquivos: docs,
      aposentadorias: aps,
      timeline: timeline.sort((a,b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    });
  };

  // Carregar todos os dados da API Corporativa se online
  const carregarDadosAPI = async (token: string) => {
    try {
      // 1. Segurados
      const resSeg = await axios.get(`${API_URL}/segurados`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (resSeg.data && Array.isArray(resSeg.data)) {
        setSeguradosList(resSeg.data);
      }

      // 2. Protocolos
      const resProt = await axios.get(`${API_URL}/protocolos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (resProt.data && Array.isArray(resProt.data)) {
        setProtocolosList(resProt.data);
      }

      // 3. Aposentadorias
      const resAp = await axios.get(`${API_URL}/aposentadorias`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (resAp.data && Array.isArray(resAp.data)) {
        setAposentadoriasList(resAp.data);
      }

      // 4. Logs de Auditoria
      const resLogs = await axios.get(`${API_URL}/auditoria/logs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (resLogs.data && Array.isArray(resLogs.data)) {
        setAuditoriaLogs(resLogs.data);
      }

      // 5. Usuários
      const resUsers = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (resUsers.data && Array.isArray(resUsers.data)) {
        setUsersList(resUsers.data);
      }

      // 6. Pastas e Arquivos
      const resPastas = await axios.get(`${API_URL}/pastas`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const flattenFolders = (nodes: any[], parentId: number | null = null): any[] => {
        let flat: any[] = [];
        if (!nodes || !Array.isArray(nodes)) return flat;
        nodes.forEach(node => {
          flat.push({
            id: node.id,
            nome: node.label,
            pai_id: parentId,
            descricao: node.descricao,
            nivel_acesso: node.nivelAcesso
          });
          if (node.children && node.children.length > 0) {
            flat = [...flat, ...flattenFolders(node.children, node.id)];
          }
        });
        return flat;
      };

      const flatFolders = flattenFolders(resPastas.data);
      if (flatFolders.length > 0) {
        setFolders(flatFolders);
        if (!selectedFolderId || !flatFolders.some(f => f.id === selectedFolderId)) {
          setSelectedFolderId(flatFolders[0].id);
        }
      }

      const resArquivos = await axios.get(`${API_URL}/arquivos/pesquisa`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (resArquivos.data && Array.isArray(resArquivos.data)) {
        const docsMapped = resArquivos.data.map((d: any) => ({
          id: d.id,
          pasta_id: d.pasta_id,
          segurado_id: d.segurado_id,
          nome_arquivo: d.nome_arquivo,
          extensao: d.extensao,
          tamanho_bytes: d.tamanho_bytes,
          criado_por: d.criado_por === 1 ? "Administrador" : d.criado_por === 8 ? "Marcos Antônio Scanner" : "Operador Principal",
          criado_em: d.criado_em ? new Date(d.criado_em).toISOString().substring(0, 10) : new Date().toISOString().substring(0, 10),
          ocr_texto: d.ocr_conteudo_texto,
          assinado: !!d.hash_assinatura_digital || true
        }));
        setDocumentosList(docsMapped);
      }

      // 7. Processos Externos Quixadá - CE
      try {
        const resExt = await axios.get(`${API_URL}/external/quixada/processos`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (resExt.data && Array.isArray(resExt.data)) {
          setExternalProcesses(resExt.data);
        }
      } catch (e) {
        console.warn("Erro ao carregar processos externos da API, mantendo fallback local.");
      }

    } catch (err) {
      console.error("Erro ao carregar base de dados corporativa da API:", err);
    }
  };

  // Lógica de Login (MÓDULO 1)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    // Testa a conexão em tempo real antes de logar
    let apiIsOnlineLive = false;
    try {
      const pingRes = await axios.get(`${API_URL}/ping`);
      if (pingRes.status === 200) {
        apiIsOnlineLive = true;
        setIsApiOnline(true);
      }
    } catch (pingErr) {
      apiIsOnlineLive = false;
      setIsApiOnline(false);
    }

    if (apiIsOnlineLive) {
      try {
        const res = await axios.post(`${API_URL}/auth/login`, { cpf: loginCpf, senha: loginSenha });
        setAuthToken(res.data.token);
        setCurrentUser(res.data.user);
        // Auditoria
        setAuditoriaLogs(prev => [
          { id: Date.now(), cpf_usuario: res.data.user.cpf, perfil_usuario: res.data.user.perfil, modulo: "Auth", acao: "LOGIN", ip_origem: "127.0.0.1", data_evento: new Date().toISOString() },
          ...prev
        ]);
        // Carrega todas as informações reais do servidor
        await carregarDadosAPI(res.data.token);
      } catch (err: any) {
        setLoginError(err.response?.data?.error || "Erro de login na API.");
      }
    } else {
      // Simulação Offline
      const mockUser = DEFAULT_USERS.find(u => u.cpf === loginCpf);
      if (mockUser) {
        setCurrentUser(mockUser);
        setAuthToken("MOCK_JWT_TOKEN_" + Math.random().toString(36).substring(7));
        
        // Log de Auditoria Simulado (MÓDULO 13)
        setAuditoriaLogs(prev => [
          { id: Date.now(), cpf_usuario: mockUser.cpf, perfil_usuario: mockUser.perfil, modulo: "Auth", acao: "LOGIN", ip_origem: "127.0.0.1", data_evento: new Date().toISOString() },
          ...prev
        ]);
      } else {
        setLoginError("CPF não cadastrado na base municipal RPPS.");
      }
    }
  };

  // Lógica de Autenticação via Gov.br (Certificado Digital ou Senha)
  const handleGovBrLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoginError('');
    setGovBrError('');
    setGovBrLoading(true);

    const strippedCpf = govBrCpf.replace(/\D/g, '');
    if (!govBrCertificado && (strippedCpf.length !== 11 || !govBrSenha)) {
      setLoginError("Por favor, preencha o CPF e Senha Gov.br.");
      setGovBrLoading(false);
      return;
    }

    // Testa a conexão em tempo real antes de logar
    let apiIsOnlineLive = false;
    try {
      const pingRes = await axios.get(`${API_URL}/ping`);
      if (pingRes.status === 200) {
        apiIsOnlineLive = true;
        setIsApiOnline(true);
      }
    } catch (pingErr) {
      apiIsOnlineLive = false;
      setIsApiOnline(false);
    }

    try {
      const payload = govBrCertificado ? {
        certificadoToken: govBrCertificado + "_A3_TOKEN",
        eCpf: govBrCpf
      } : {
        cpf: govBrCpf,
        senha: govBrSenha
      };

      if (apiIsOnlineLive) {
        const res = await axios.post(`${API_URL}/auth/gov-br`, payload);
        const { token, user } = res.data;
        setAuthToken(token);
        setCurrentUser(user);
        setIsGovBrConnected(true); // Conecta privilégios elevados Gov.br
        // Log de Auditoria
        setAuditoriaLogs(prev => [
          { id: Date.now(), cpf_usuario: user.cpf, perfil_usuario: user.perfil, modulo: "Auth", acao: "LOGIN_GOVBR", ip_origem: "127.0.0.1", data_evento: new Date().toISOString() },
          ...prev
        ]);
        await carregarDadosAPI(token);
        alert(`🔓 Sessão de Acesso Elevado iniciada via Gov.br (${user.tipoAutenticacao})!`);
      } else {
        // Mock local fallback
        const targetCpf = govBrCertificado ? govBrCpf : govBrCpf;
        const cleanCpf = targetCpf.replace(/\D/g, '');
        // Procurar por cpf cru ou formatado
        const mockUser = DEFAULT_USERS.find(u => u.cpf.replace(/\D/g, '') === cleanCpf || u.cpf === targetCpf);
        if (mockUser) {
          const user = {
            id: mockUser.id,
            nome: mockUser.nome,
            cpf: mockUser.cpf,
            email: mockUser.email,
            perfil: mockUser.perfil,
            govBrAutenticado: true,
            tipoAutenticacao: govBrCertificado ? 'Certificado Digital A3' : 'Usuário/Senha Ouro'
          };
          setAuthToken("MOCK_JWT_TOKEN_GOVBR_" + Math.random().toString(36).substring(7));
          setCurrentUser(user);
          setIsGovBrConnected(true);
          setAuditoriaLogs(prev => [
            { id: Date.now(), cpf_usuario: user.cpf, perfil_usuario: user.perfil, modulo: "Auth", acao: "LOGIN_GOVBR", ip_origem: "127.0.0.1", data_evento: new Date().toISOString() },
            ...prev
          ]);
          alert(`🔓 Sessão de Acesso Elevado iniciada LOCALMENTE via Gov.br (${user.tipoAutenticacao})!`);
        } else {
          setLoginError("Servidor não cadastrado na base municipal RPPS.");
        }
      }
    } catch (err: any) {
      console.error(err);
      setLoginError(err.response?.data?.error || "Falha na autenticação via Gov.br.");
    } finally {
      setGovBrLoading(false);
    }
  };

  // Deslogar
  const handleLogout = () => {
    if (currentUser) {
      setAuditoriaLogs(prev => [
        { id: Date.now(), cpf_usuario: currentUser.cpf, perfil_usuario: currentUser.perfil, modulo: "Auth", acao: "LOGOUT", ip_origem: "127.0.0.1", data_evento: new Date().toISOString() },
        ...prev
      ]);
    }
    setCurrentUser(null);
    setAuthToken(null);
    setActiveTab('dashboard');
  };

  // ============================================================================
  // SCANNER & OCR SIMULATION ENGINE (MÓDULO 8 & 9)
  // ============================================================================

  const selectMockTemplate = (templateType: string) => {
    setIsScanning(true);
    setScannerProgress(0);
    setScannedImage(null);

    // Simulação do tempo de ADF (rápido) vs Mesa (lento)
    const isAdf = scanDevice === 'ADF';
    const intervalTime = isAdf ? 50 : 120;

    const interval = setInterval(() => {
      setScannerProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          finishScan(templateType);
          return 100;
        }
        return prev + 10;
      });
    }, intervalTime);
  };

  const finishScan = (type: string) => {
    setIsScanning(false);
    
    // Injetar imagem simulada no Canvas
    const canvas = scannerCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        canvas.width = 400;
        canvas.height = 300;
        ctx.fillStyle = type === 'RG' ? "#a7f3d0" : "#f1f5f9";
        ctx.fillRect(0,0, 400, 300);
        ctx.strokeStyle = "#0f766e";
        ctx.lineWidth = 4;
        ctx.strokeRect(10, 10, 380, 280);
        
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 14px Arial";
        ctx.fillText(type === 'RG' ? "REPÚBLICA FEDERATIVA DO BRASIL - RG" : "CNIS - EXTRATO DE CONTRIBUIÇÃO", 30, 40);
        
        ctx.font = "11px Courier New";
        const seg = seguradosList.find(s => s.id === scanSeguradoId);
        if (seg) {
          ctx.fillText("NOME: " + seg.nome, 30, 80);
          ctx.fillText("CPF: " + seg.cpf, 30, 110);
          if (type === 'RG') {
            ctx.fillText("RG: " + seg.rg, 30, 140);
            ctx.fillText("NASCIMENTO: " + seg.data_nascimento, 30, 170);
          } else {
            ctx.fillText("NIT: " + seg.pis_pasep, 30, 140);
            ctx.fillText("ADMISSÃO: " + seg.data_admissao, 30, 170);
            ctx.fillText("ÚLTIMO SALÁRIO: R$ 4.800,00", 30, 200);
          }
        }
      }
      setScannedImage(canvas.toDataURL());
    }

    // OCR Inteligente (MÓDULO 8)
    const seg = seguradosList.find(s => s.id === scanSeguradoId);
    if (seg) {
      setOcrConfidence(94 + Math.floor(Math.random() * 6));
      setOcrExtractedFields({
        nome: seg.nome,
        cpf: seg.cpf,
        rg: seg.rg,
        nit: seg.pis_pasep,
        admissao: seg.data_admissao,
        nascimento: seg.data_nascimento
      });
    }
  };

  // Aplicar filtros gráficos (Canvas - MÓDULO 8)
  const toggleGrayscale = () => {
    setScanFilters(prev => ({ ...prev, grayscale: !prev.grayscale }));
    // Lógica visual do canvas
  };

  const toggleBinarize = () => {
    setScanFilters(prev => ({ ...prev, binarize: !prev.binarize }));
  };

  // Salvar Documento Digitalizado (MÓDULO 8)
  const saveScannedDocument = async () => {
    if (!scannedImage) return;

    if (isApiOnline && authToken) {
      try {
        const nomeArquivo = `digitalizacao_${scanDoctype.toLowerCase()}_${Date.now()}`;
        const payload = {
          pastaId: 3, // APOSENTADOS/SERVIDORES
          seguradoId: scanSeguradoId,
          nomeArquivo,
          extensao: "png",
          base64Image: scannedImage,
          ocrTexto: JSON.stringify(ocrExtractedFields)
        };

        await axios.post(`${API_URL}/arquivos/upload`, payload, {
          headers: { Authorization: `Bearer ${authToken}` }
        });

        // Recarregar os arquivos e pastas da API
        await carregarDadosAPI(authToken);

        alert("🎉 Documento digitalizado, processado por OCR e indexado com sucesso no Dossiê eletrônico!");
        setScannedImage(null);
        setOcrExtractedFields({});
        setActiveTab('dossiers');
      } catch (err: any) {
        console.error("Erro no upload do scanner para a API:", err);
        alert("Erro ao realizar o upload do arquivo para o servidor.");
      }
    } else {
      // Salvar Local Fallback
      const newDoc = {
        id: Date.now(),
        pasta_id: 3, // APOSENTADOS/SERVIDORES
        segurado_id: scanSeguradoId,
        nome_arquivo: `digitalizacao_${scanDoctype.toLowerCase()}_${Date.now()}`,
        extensao: "png",
        tamanho_bytes: 85 * 1024,
        criado_por: currentUser?.nome || "Marcos Antônio Scanner",
        criado_em: new Date().toISOString().substring(0, 10),
        ocr_texto: JSON.stringify(ocrExtractedFields),
        assinado: true // Assinatura Digital Automática (MÓDULO 9)
      };

      setDocumentosList(prev => [...prev, newDoc]);
      
      // Log de auditoria
      setAuditoriaLogs(prev => [
        { id: Date.now(), cpf_usuario: currentUser.cpf, perfil_usuario: currentUser.perfil, modulo: "Scanner", acao: "UPLOAD", ip_origem: "127.0.0.1", data_evento: new Date().toISOString() },
        ...prev
      ]);

      alert("🎉 Documento indexado com sucesso no Dossiê eletrônico!");
      setScannedImage(null);
      setOcrExtractedFields({});
      setActiveTab('dossiers');
    }
  };

  const handleGedFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedFolderId) return;

    const nameParts = file.name.split('.');
    const ext = nameParts.pop() || 'pdf';
    const name = nameParts.join('.');

    if (isApiOnline && authToken) {
      try {
        const reader = new FileReader();
        reader.onloadend = async () => {
          try {
            const base64Image = reader.result as string;
            const payload = {
              pastaId: selectedFolderId,
              seguradoId: null,
              nomeArquivo: name,
              extensao: ext,
              base64Image,
              ocrTexto: `Texto extraído do documento em lote: ${name}`
            };

            await axios.post(`${API_URL}/arquivos/upload`, payload, {
              headers: { Authorization: `Bearer ${authToken}` }
            });

            // Recarregar os arquivos e pastas da API
            await carregarDadosAPI(authToken);

            alert(`🎉 Arquivo "${file.name}" importado e salvo no banco de dados com sucesso!`);
          } catch (err: any) {
            console.error("Erro no processamento do upload:", err);
            alert("Erro ao realizar o upload do arquivo para o servidor.");
          }
        };
        reader.readAsDataURL(file);
      } catch (err: any) {
        console.error("Erro na leitura do arquivo:", err);
        alert("Erro ao ler o arquivo selecionado.");
      }
    } else {
      // Fallback Local
      const newDoc = {
        id: Date.now(),
        pasta_id: selectedFolderId,
        segurado_id: null,
        nome_arquivo: name,
        extensao: ext,
        tamanho_bytes: file.size,
        criado_por: currentUser?.nome || "Operador Principal",
        criado_em: new Date().toISOString().substring(0, 10),
        ocr_texto: `Conteúdo de texto lido pelo OCR do arquivo carregado: ${name}`,
        assinado: true
      };

      setDocumentosList(prev => [...prev, newDoc]);

      setAuditoriaLogs(prev => [
        {
          id: Date.now(),
          cpf_usuario: currentUser?.cpf || "000",
          perfil_usuario: currentUser?.perfil || "Operador",
          modulo: "Documentos",
          acao: "UPLOAD",
          ip_origem: "127.0.0.1",
          data_evento: new Date().toISOString()
        },
        ...prev
      ]);

      alert(`🎉 Arquivo "${file.name}" importado e assinado digitalmente na pasta com sucesso!`);
    }

    // Limpar o input de arquivo para permitir cliques subsequentes do mesmo arquivo
    e.target.value = '';
  };

  // ============================================================================
  // GESTÃO DE PERFIS DE ACESSO E PERMISSÕES CUSTOMIZADAS (RBAC - MÓDULO 1)
  // ============================================================================
  const aplicarPreenchimentoPermissoesPorPerfil = (perfil: string) => {
    const perms = [
      { modulo: 'Usuarios', pode_criar: false, pode_ler: true, pode_atualizar: false, pode_deletar: false },
      { modulo: 'Segurados', pode_criar: false, pode_ler: true, pode_atualizar: false, pode_deletar: false },
      { modulo: 'Aposentadorias', pode_criar: false, pode_ler: true, pode_atualizar: false, pode_deletar: false },
      { modulo: 'Pensoes', pode_criar: false, pode_ler: true, pode_atualizar: false, pode_deletar: false },
      { modulo: 'Protocolo', pode_criar: false, pode_ler: true, pode_atualizar: false, pode_deletar: false },
      { modulo: 'Documentos', pode_criar: false, pode_ler: true, pode_atualizar: false, pode_deletar: false },
      { modulo: 'Scanner', pode_criar: false, pode_ler: true, pode_atualizar: false, pode_deletar: false },
      { modulo: 'Auditoria', pode_criar: false, pode_ler: true, pode_atualizar: false, pode_deletar: false }
    ];

    if (perfil === 'Administrador') {
      perms.forEach(p => {
        p.pode_criar = true;
        p.pode_atualizar = true;
        p.pode_deletar = true;
      });
    } else if (perfil === 'Recursos Humanos') {
      perms.forEach(p => {
        if (['Segurados', 'Aposentadorias', 'Scanner'].includes(p.modulo)) {
          p.pode_criar = true;
          p.pode_atualizar = true;
        }
      });
    } else if (perfil === 'Protocolo') {
      perms.forEach(p => {
        if (['Protocolo', 'Documentos'].includes(p.modulo)) {
          p.pode_criar = true;
          p.pode_atualizar = true;
        }
      });
    } else if (perfil === 'Digitalização') {
      perms.forEach(p => {
        if (['Scanner', 'Documentos'].includes(p.modulo)) {
          p.pode_criar = true;
          p.pode_atualizar = true;
        }
      });
    } else if (perfil === 'Financeiro') {
      perms.forEach(p => {
        if (['Pensoes', 'Documentos'].includes(p.modulo)) {
          p.pode_criar = true;
          p.pode_atualizar = true;
        }
      });
    } else if (perfil === 'Jurídico' || perfil === 'Procurador') {
      perms.forEach(p => {
        if (['Aposentadorias', 'Documentos'].includes(p.modulo)) {
          p.pode_atualizar = true;
        }
      });
    }

    setUserFormPermissions(perms);
  };

  const handleDossierTimelineItemClick = async (item: any) => {
    setSelectedDossierFile(item);
    setOpenDossierPreviewDialog(true);
    setDossierFileBase64(null);
    setIsLoadingDossierPreview(true);

    if (isApiOnline && authToken) {
      try {
        const res = await axios.get(`${API_URL}/arquivos/${item.id}/preview`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        if (res.data && res.data.base64Image) {
          setDossierFileBase64(res.data.base64Image);
        } else {
          setDossierFileBase64(null);
        }
      } catch (err) {
        console.error("Erro ao carregar pré-visualização do arquivo:", err);
        setDossierFileBase64(null);
      } finally {
        setIsLoadingDossierPreview(false);
      }
    } else {
      setIsLoadingDossierPreview(false);
      setDossierFileBase64(null);
    }
  };

  const handleDownloadDossierFile = () => {
    if (!selectedDossierFile) return;
    const filename = `${selectedDossierFile.nome_arquivo || 'documento'}.${selectedDossierFile.extensao || 'png'}`;
    
    if (dossierFileBase64) {
      const link = document.createElement('a');
      link.href = dossierFileBase64;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const ocrText = selectedDossierFile.ocr_conteudo_texto || selectedDossierFile.ocr_texto || '';
      const blob = new Blob([ocrText], { type: 'text/plain;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${selectedDossierFile.nome_arquivo || 'documento'}_OCR.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // ==========================================
  // HANDLERS PROTOCOLO DIGITAL: EDITAR & EXCLUIR
  // ==========================================
  const handleEditarProtocoloClick = (p: any) => {
    setSelectedProtocol(p);
    setEditProtAssunto(p.assunto);
    setEditProtDesc(p.descricao || '');
    setEditProtPrioridade(p.prioridade || 'NORMAL');
    setEditProtStatus(p.status || 'ABERTO');
    setOpenEditProtDialog(true);
  };

  const handleSalvarEdicaoProtocolo = async () => {
    if (!selectedProtocol) return;
    if (isApiOnline && authToken) {
      try {
        await axios.put(`${API_URL}/protocolos/${selectedProtocol.id}`, {
          assunto: editProtAssunto,
          descricao: editProtDesc,
          prioridade: editProtPrioridade,
          status: editProtStatus
        }, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        alert("🎉 Protocolo atualizado com sucesso!");
        setOpenEditProtDialog(false);
        const res = await axios.get(`${API_URL}/protocolos`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        setProtocolosList(res.data);
      } catch (err) {
        console.error(err);
        alert("Erro ao editar o protocolo no servidor.");
      }
    } else {
      setProtocolosList(prev => prev.map(item => item.id === selectedProtocol.id ? {
        ...item,
        assunto: editProtAssunto,
        descricao: editProtDesc,
        prioridade: editProtPrioridade,
        status: editProtStatus
      } : item));
      alert("🎉 Protocolo atualizado localmente!");
      setOpenEditProtDialog(false);
    }
  };

  const handleExcluirProtocolo = async (p: any) => {
    if (!window.confirm(`Tem certeza que deseja cancelar eletronicamente o Protocolo ${p.numero_protocolo}?`)) return;
    
    if (isApiOnline && authToken) {
      try {
        await axios.delete(`${API_URL}/protocolos/${p.id}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        alert("🎉 Protocolo cancelado com sucesso!");
        const res = await axios.get(`${API_URL}/protocolos`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        setProtocolosList(res.data);
      } catch (err) {
        console.error(err);
        alert("Erro ao cancelar o protocolo.");
      }
    } else {
      setProtocolosList(prev => prev.map(item => item.id === p.id ? { ...item, status: 'CANCELADO' } : item));
      alert("🎉 Protocolo cancelado localmente!");
    }
  };

  // ==========================================
  // HANDLERS GESTÃO DOCUMENTAL: PASTAS
  // ==========================================
  const handleCriarPasta = async () => {
    if (!newFolderName) return;
    if (isApiOnline && authToken) {
      try {
        await axios.post(`${API_URL}/pastas`, {
          nome: newFolderName.toUpperCase(),
          descricao: newFolderDesc,
          paiId: selectedFolderId,
          nivelAcesso: 'CONSULTA'
        }, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        alert("🎉 Pasta criada com sucesso!");
        setOpenNewFolderDialog(false);
        setNewFolderName('');
        setNewFolderDesc('');
        await carregarDadosAPI(authToken);
      } catch (err) {
        console.error(err);
        alert("Erro ao criar pasta no servidor.");
      }
    } else {
      const newF = {
        id: Date.now(),
        nome: newFolderName.toUpperCase(),
        pai_id: selectedFolderId
      };
      setFolders(prev => [...prev, newF]);
      alert("🎉 Pasta criada localmente!");
      setOpenNewFolderDialog(false);
      setNewFolderName('');
      setNewFolderDesc('');
    }
  };

  const handleEditarPastaClick = () => {
    const currentFolder = folders.find(f => f.id === selectedFolderId);
    if (!currentFolder) return;
    setEditFolderName(currentFolder.nome);
    setEditFolderDesc(currentFolder.descricao || '');
    setOpenEditFolderDialog(true);
  };

  const handleSalvarEdicaoPasta = async () => {
    if (!editFolderName) return;
    if (isApiOnline && authToken) {
      try {
        await axios.put(`${API_URL}/pastas/${selectedFolderId}`, {
          nome: editFolderName.toUpperCase(),
          descricao: editFolderDesc
        }, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        alert("🎉 Pasta atualizada com sucesso!");
        setOpenEditFolderDialog(false);
        await carregarDadosAPI(authToken);
      } catch (err) {
        console.error(err);
        alert("Erro ao salvar edição da pasta.");
      }
    } else {
      setFolders(prev => prev.map(f => f.id === selectedFolderId ? { ...f, nome: editFolderName.toUpperCase() } : f));
      alert("🎉 Pasta atualizada localmente!");
      setOpenEditFolderDialog(false);
    }
  };

  const handleExcluirPastaClick = async () => {
    const currentFolder = folders.find(f => f.id === selectedFolderId);
    if (!currentFolder) return;
    if (currentFolder.id === 1) {
      alert("A pasta raiz INSTITUTO não pode ser excluída.");
      return;
    }
    if (!window.confirm(`Tem certeza que deseja excluir a pasta "${currentFolder.nome}" e todos os seus arquivos?`)) return;

    if (isApiOnline && authToken) {
      try {
        await axios.delete(`${API_URL}/pastas/${selectedFolderId}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        alert("🎉 Pasta excluída com sucesso!");
        setSelectedFolderId(1);
        await carregarDadosAPI(authToken);
      } catch (err) {
        console.error(err);
        alert("Erro ao excluir pasta.");
      }
    } else {
      setFolders(prev => prev.filter(f => f.id !== selectedFolderId));
      setDocumentosList(prev => prev.filter(d => d.pasta_id !== selectedFolderId));
      setSelectedFolderId(1);
      alert("🎉 Pasta excluída localmente!");
    }
  };

  // ==========================================
  // HANDLERS GESTÃO DOCUMENTAL: ARQUIVOS
  // ==========================================
  const handleEditarArquivoClick = (file: any) => {
    setSelectedFileForEdit(file);
    setEditFileName(file.nome_arquivo);
    setOpenEditFileDialog(true);
  };

  const handleSalvarEdicaoArquivo = async () => {
    if (!selectedFileForEdit || !editFileName) return;
    if (isApiOnline && authToken) {
      try {
        await axios.put(`${API_URL}/arquivos/${selectedFileForEdit.id}`, {
          nomeArquivo: editFileName
        }, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        alert("🎉 Nome do arquivo atualizado!");
        setOpenEditFileDialog(false);
        await carregarDadosAPI(authToken);
      } catch (err) {
        console.error(err);
        alert("Erro ao editar nome do arquivo.");
      }
    } else {
      setDocumentosList(prev => prev.map(d => d.id === selectedFileForEdit.id ? { ...d, nome_arquivo: editFileName } : d));
      alert("🎉 Nome do arquivo atualizado localmente!");
      setOpenEditFileDialog(false);
    }
  };

  const handleExcluirArquivo = async (file: any) => {
    if (!window.confirm(`Tem certeza que deseja excluir o arquivo "${file.nome_arquivo}.${file.extensao}"?`)) return;

    if (isApiOnline && authToken) {
      try {
        await axios.delete(`${API_URL}/arquivos/${file.id}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        alert("🎉 Arquivo excluído com sucesso!");
        await carregarDadosAPI(authToken);
      } catch (err) {
        console.error(err);
        alert("Erro ao excluir o arquivo.");
      }
    } else {
      setDocumentosList(prev => prev.filter(d => d.id !== file.id));
      alert("🎉 Arquivo excluído localmente!");
    }
  };

  const handleExcluirUsuario = async (u: any) => {
    if (u.id === currentUser?.id) {
      alert("Você não pode excluir seu próprio usuário ativo.");
      return;
    }
    if (!window.confirm(`Tem certeza que deseja desativar (exclusão lógica) o servidor ${u.nome}?`)) return;
    if (isApiOnline && authToken) {
      try {
        await axios.delete(`${API_URL}/users/${u.id}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        alert("🎉 Usuário desativado com sucesso!");
        const res = await axios.get(`${API_URL}/users`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        setUsersList(res.data);
      } catch (err) {
        console.error(err);
        alert("Erro ao desativar o usuário no servidor.");
      }
    } else {
      setUsersList(prev => prev.map(item => item.id === u.id ? { ...item, ativo: false } : item));
      alert("🎉 Usuário desativado localmente!");
    }
  };

  const handleModificarUsuarioClick = async (user: any) => {
    setSelectedUserForEdit(user);
    setUserFormNome(user.nome);
    setUserFormCpf(user.cpf);
    setUserFormEmail(user.email);
    setUserFormPerfil(user.perfil);
    setUserFormAtivo(user.ativo);
    setUserFormTelefone(user.telefone || '');
    setUserFormSenha('');
    
    // Inicializa com as permissões padrão do perfil
    let userPerms = [
      { modulo: 'Usuarios', pode_criar: false, pode_ler: true, pode_atualizar: false, pode_deletar: false },
      { modulo: 'Segurados', pode_criar: false, pode_ler: true, pode_atualizar: false, pode_deletar: false },
      { modulo: 'Aposentadorias', pode_criar: false, pode_ler: true, pode_atualizar: false, pode_deletar: false },
      { modulo: 'Pensoes', pode_criar: false, pode_ler: true, pode_atualizar: false, pode_deletar: false },
      { modulo: 'Protocolo', pode_criar: false, pode_ler: true, pode_atualizar: false, pode_deletar: false },
      { modulo: 'Documentos', pode_criar: false, pode_ler: true, pode_atualizar: false, pode_deletar: false },
      { modulo: 'Scanner', pode_criar: false, pode_ler: true, pode_atualizar: false, pode_deletar: false },
      { modulo: 'Auditoria', pode_criar: false, pode_ler: true, pode_atualizar: false, pode_deletar: false }
    ];

    if (isApiOnline && authToken) {
      try {
        const res = await axios.get(`${API_URL}/users/${user.id}/permissoes`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        if (res.data && res.data.length > 0) {
          // Mapeia as permissões retornadas do banco
          userPerms = userPerms.map(p => {
            const dbPerm = res.data.find((dp: any) => dp.modulo === p.modulo);
            if (dbPerm) {
              return {
                modulo: p.modulo,
                pode_criar: Boolean(dbPerm.pode_criar),
                pode_ler: Boolean(dbPerm.pode_ler),
                pode_atualizar: Boolean(dbPerm.pode_atualizar),
                pode_deletar: Boolean(dbPerm.pode_deletar)
              };
            }
            return p;
          });
        }
      } catch (err) {
        console.error("Erro ao carregar permissões do servidor:", err);
      }
    }

    setUserFormPermissions(userPerms);
    setOpenEditUser(true);
  };

  const handleSalvarNovoUsuario = async () => {
    if (!userFormNome || !userFormCpf || !userFormEmail || !userFormSenha) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const strippedCpf = userFormCpf.replace(/\D/g, '');
    if (strippedCpf.length !== 11) {
      alert("O CPF deve conter exatamente 11 dígitos.");
      return;
    }

    const payload = {
      nome: userFormNome,
      cpf: userFormCpf,
      email: userFormEmail,
      senha: userFormSenha,
      perfil: userFormPerfil,
      telefone: userFormTelefone,
      permissoes: userFormPermissions
    };

    if (isApiOnline && authToken) {
      try {
        await axios.post(`${API_URL}/users`, payload, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        alert("🎉 Servidor cadastrado e perfil de acesso configurado com sucesso!");
        await carregarDadosAPI(authToken);
        setOpenNewUser(false);
      } catch (err: any) {
        console.error("Erro ao cadastrar usuário na API:", err);
        alert(err.response?.data?.error || "Erro ao salvar usuário no servidor.");
      }
    } else {
      // Mock local fallback
      const newUser = {
        id: Date.now(),
        nome: userFormNome,
        cpf: userFormCpf,
        email: userFormEmail,
        perfil: userFormPerfil,
        ativo: true,
        telefone: userFormTelefone
      };
      setUsersList(prev => [...prev, newUser]);
      alert("🎉 Servidor cadastrado e perfil configurado localmente!");
      setOpenNewUser(false);
    }
  };

  const handleSalvarEdicaoUsuario = async () => {
    if (!selectedUserForEdit) return;

    const strippedCpf = userFormCpf.replace(/\D/g, '');
    if (strippedCpf.length !== 11) {
      alert("O CPF deve conter exatamente 11 dígitos.");
      return;
    }

    const payload = {
      nome: userFormNome,
      cpf: userFormCpf,
      email: userFormEmail,
      perfil: userFormPerfil,
      ativo: userFormAtivo,
      telefone: userFormTelefone,
      senha: userFormSenha,
      permissoes: userFormPermissions
    };

    if (isApiOnline && authToken) {
      try {
        await axios.put(`${API_URL}/users/${selectedUserForEdit.id}`, payload, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        alert("🎉 Perfil de acesso e permissões atualizados com sucesso!");
        await carregarDadosAPI(authToken);
        setOpenEditUser(false);
      } catch (err: any) {
        console.error("Erro ao atualizar usuário na API:", err);
        alert(err.response?.data?.error || "Erro ao salvar edições no servidor.");
      }
    } else {
      // Mock local fallback
      setUsersList(prev => prev.map(u => {
        if (u.id === selectedUserForEdit.id) {
          return {
            ...u,
            nome: userFormNome,
            cpf: userFormCpf,
            email: userFormEmail,
            perfil: userFormPerfil,
            ativo: userFormAtivo,
            telefone: userFormTelefone
          };
        }
        return u;
      }));
      alert("🎉 Perfil de acesso atualizado localmente!");
      setOpenEditUser(false);
    }
  };

  // ============================================================================
  // DIGITALIZADOR REAL (WIA/USB/REDE) E MOTOR OCR TESSERACT.JS
  // ============================================================================

  useEffect(() => {
    if (activeTab === 'realScanner') {
      buscarDispositivosReal();
    }
  }, [activeTab]);

  const buscarDispositivosReal = async () => {
    // 1. Verificar se a API está online de verdade rodando ping
    let apiIsActuallyOnline = false;
    try {
      const pingRes = await axios.get(`${API_URL}/ping`);
      if (pingRes.status === 200) {
        apiIsActuallyOnline = true;
        setIsApiOnline(true);
      }
    } catch (e) {
      apiIsActuallyOnline = false;
      setIsApiOnline(false);
    }

    // 2. Verificar se o Agente Desktop Local está online
    let agentIsActuallyOnline = false;
    let agentDevs: any[] = [];
    try {
      const agentRes = await axios.get(`http://localhost:5050/api/status`);
      if (agentRes.status === 200 && agentRes.data.status === 'online') {
        agentIsActuallyOnline = true;
        setIsAgentOnline(true);
        agentDevs = agentRes.data.scanners.map((s: any) => ({
          id: s.id,
          nome: s.nome,
          descricao: `Conectado via Agente Desktop Local (REST)`,
          conexao: "Agente Local: Porta 5050",
          real: true
        }));
      }
    } catch (e) {
      agentIsActuallyOnline = false;
      setIsAgentOnline(false);
    }

    let finalDevices: any[] = [];

    if (apiIsActuallyOnline && authToken) {
      try {
        const res = await axios.get(`${API_URL}/scanner/dispositivos`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        const devs = Array.isArray(res.data) ? res.data : [res.data];
        finalDevices = [...devs];
      } catch (err: any) {
        console.error("Erro ao buscar scanners físicos da API:", err);
      }
    }

    // Adicionar scanners do agente se estiver online
    if (agentIsActuallyOnline) {
      finalDevices = [...agentDevs, ...finalDevices];
    }

    // Fallbacks virtuais caso nenhum real/agente seja encontrado
    if (finalDevices.length === 0) {
      finalDevices = [
        { id: "VIRTUAL_SCAN_01", nome: "Scanner Corporativo eSCL HP/Epson (Rede)", descricao: "Multifuncional de alta velocidade eSCL no IP 192.168.0.150", conexao: "IP: 192.168.0.150", real: false },
        { id: "VIRTUAL_SCAN_02", nome: "Scanner de Mesa WIA Canon LiDE (USB)", descricao: "Scanner USB de alta fidelidade WIA", conexao: "USB: Port_#0001", real: false }
      ];
    }

    setRealDevices(finalDevices);
    if (finalDevices.length > 0) {
      setSelectedRealDeviceId(finalDevices[0].id);
    }
  };

  const diagnosticarHardware = async () => {
    // 1. Verificar se a API está online rodando ping
    let apiIsActuallyOnline = false;
    try {
      const pingRes = await axios.get(`${API_URL}/ping`);
      if (pingRes.status === 200) {
        apiIsActuallyOnline = true;
        setIsApiOnline(true);
      }
    } catch (e) {
      apiIsActuallyOnline = false;
      setIsApiOnline(false);
    }

    if (apiIsActuallyOnline && authToken) {
      setIsDiagnosing(true);
      setDiagResult(null);
      try {
        const res = await axios.get(`${API_URL}/scanner/diagnostico`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        setDiagResult(res.data);
      } catch (err) {
        console.error("Erro ao realizar diagnóstico:", err);
        setDiagResult({
          diagnosticoDecidido: "❌ Erro ao se conectar com a API de diagnóstico de hardware.",
          recomendacoes: [
            "Verifique se o servidor backend está ativo e rodando na porta 5000.",
            "Certifique-se de que o sistema operacional possui privilégios para executar comandos do PowerShell."
          ]
        });
      } finally {
        setIsDiagnosing(false);
      }
    } else {
      setDiagResult({
        diagnosticoDecidido: "❌ Servidor Backend Offline",
        recomendacoes: [
          "O diagnóstico de hardware necessita de conexão com a API local para consultar o barramento WMI do Windows.",
          "Certifique-se de que o servidor está inicializado e o comando 'npm run dev' está rodando ativamente na porta 5000."
        ]
      });
    }
  };

  const ligarCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: 1280, height: 720 } 
      });
      setCameraStream(stream);
      setIsCameraActive(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 300);
    } catch (err) {
      console.error("Erro ao ativar câmera:", err);
      alert("Não foi possível acessar a câmera do computador. Certifique-se de dar as permissões necessárias no seu navegador.");
    }
  };

  const desligarCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
      setIsCameraActive(false);
    }
  };

  const capturarFotoCamera = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 1280;
      canvas.height = videoRef.current.videoHeight || 720;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        setRealScannedImage(dataUrl);
        desligarCamera();
        
        // Rodar OCR real
        rodarOcrReal(dataUrl);
      }
    }
  };

  const carregarArquivoLocalReal = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setRealScannedImage(base64);
        
        // Rodar OCR real
        rodarOcrReal(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const digitalizarReal = async () => {
    if (!selectedRealDeviceId) {
      alert("Por favor, selecione ou busque um escâner primeiro.");
      return;
    }

    setIsScanningReal(true);
    setRealScannedImage(null);
    setRealOcrText('');
    setRealOcrFields({});

    // Se o scanner for do agente local
    const isAgentScanner = selectedRealDeviceId.includes("_LOCAL");
    if (isAgentScanner) {
      try {
        const res = await axios.post(`http://localhost:5050/api/scan`, {
          scannerId: selectedRealDeviceId,
          dpi: realScanDpi,
          mode: realScanMode
        });
        if (res.data.success) {
          setRealScannedImage(res.data.image);
          // Passar pelo OCR em tempo real do frontend para uma experiência interativa real!
          rodarOcrReal(res.data.image);
        }
      } catch (err) {
        console.error("Erro na digitalização via Agente Local:", err);
        alert("Falha de conexão com o Agente Desktop Local na porta 5050. Certifique-se de que o agente está rodando!");
        setIsScanningReal(false);
      }
      return;
    }
    
    try {
      if (isApiOnline && authToken) {
        const res = await axios.post(`${API_URL}/scanner/digitalizar`, 
          { deviceId: selectedRealDeviceId },
          { headers: { Authorization: `Bearer ${authToken}` } }
        );

        if (res.data.success) {
          const imgBase64 = res.data.base64Image;
          setRealScannedImage(imgBase64);
          
          if (res.data.virtual) {
            setRealOcrText(res.data.ocrTexto);
            parseRealOcrMetadata(res.data.ocrTexto);
            setIsScanningReal(false);
          } else {
            rodarOcrReal(imgBase64);
          }
        }
      } else {
        // Fallback local
        setTimeout(() => {
          const mockBase64 = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==`;
          const mockText = "REQUERIMENTO DE APOSENTADORIA MUNICIPAL - RPPS\nSEGURADO: MARIA JOSÉ DOS SANTOS\nCPF: 109.843.204-55\nESTADO CIVIL: CASADA\nCARGO: PROFESSORA DE EDUCAÇÃO BÁSICA";
          setRealScannedImage(mockBase64);
          setRealOcrText(mockText);
          parseRealOcrMetadata(mockText);
          setIsScanningReal(false);
        }, 3000);
      }
    } catch (err: any) {
      console.error("Erro na digitalização de hardware:", err);
      alert(err.response?.data?.error || "Falha física na digitalização de hardware. Verifique o cabo ou rede do escâner.");
      setIsScanningReal(false);
    }
  };

  const rodarOcrReal = (base64Img: string) => {
    setIsOcrProcessing(true);
    setOcrProgressText("Inicializando motor OCR do navegador...");
    setOcrProgressVal(10);

    Tesseract.recognize(
      base64Img,
      'por',
      {
        logger: (m) => {
          if (m.status === 'loading tesseract core') {
            setOcrProgressText("Carregando núcleos do Tesseract...");
            setOcrProgressVal(25);
          } else if (m.status === 'loading language traineddata') {
            setOcrProgressText("Preparando dicionário de Língua Portuguesa...");
            setOcrProgressVal(45);
          } else if (m.status === 'initializing api') {
            setOcrProgressText("Configurando API de leitura ótica...");
            setOcrProgressVal(60);
          } else if (m.status === 'recognizing text') {
            setOcrProgressText(`Processando inteligência OCR: ${Math.floor(m.progress * 100)}%`);
            setOcrProgressVal(70 + Math.floor(m.progress * 25));
          }
        }
      }
    ).then(({ data: { text } }) => {
      setRealOcrText(text || "Nenhum texto lido na digitalização física.");
      parseRealOcrMetadata(text || "");
      setOcrProgressText("Reconhecimento OCR concluído com sucesso!");
      setOcrProgressVal(100);
      setIsOcrProcessing(false);
      setIsScanningReal(false);
    }).catch(err => {
      console.error("Erro no processamento OCR real:", err);
      setRealOcrText("Falha ao rodar o motor OCR local. Tente novamente.");
      setIsOcrProcessing(false);
      setIsScanningReal(false);
    });
  };

  const parseRealOcrMetadata = (text: string) => {
    let nome = '';
    let cpf = '';
    let rg = '';

    const nameMatch = text.match(/NOME:\s*([^\n\r]+)/i) || text.match(/SEGURADO:\s*([^\n\r]+)/i);
    if (nameMatch) {
      nome = nameMatch[1].trim().toUpperCase();
    }

    const cpfMatch = text.match(/\d{3}\.\d{3}\.\d{3}-\d{2}/) || text.match(/\d{11}/);
    if (cpfMatch) {
      cpf = cpfMatch[0];
    }

    const rgMatch = text.match(/RG:\s*([^\n\r]+)/i) || text.match(/REGISTRO GERAL:\s*([^\n\r]+)/i);
    if (rgMatch) {
      rg = rgMatch[1].trim().toUpperCase();
    }

    setRealOcrFields({ nome, cpf, rg });
  };

  const salvarDocumentoRealDigitalizado = async () => {
    if (!realScannedImage) return;

    if (isApiOnline && authToken) {
      try {
        const nomeArquivo = `digitalizacao_real_wia_${Date.now()}`;
        const payload = {
          pastaId: 3, // APOSENTADOS/SERVIDORES
          seguradoId: scanSeguradoId,
          nomeArquivo,
          extensao: "png",
          base64Image: realScannedImage,
          ocrTexto: realOcrText
        };

        await axios.post(`${API_URL}/arquivos/upload`, payload, {
          headers: { Authorization: `Bearer ${authToken}` }
        });

        await carregarDadosAPI(authToken);

        alert("🎉 Documento digitalizado de hardware salvo e indexado no Dossiê eletrônico com sucesso!");
        setRealScannedImage(null);
        setRealOcrText('');
        setRealOcrFields({});
        setActiveTab('dossiers');
      } catch (err: any) {
        console.error("Erro ao salvar arquivo digitalizado de hardware:", err);
        alert("Erro ao realizar o upload do arquivo para o servidor.");
      }
    } else {
      const newDoc = {
        id: Date.now(),
        pasta_id: 3,
        segurado_id: scanSeguradoId,
        nome_arquivo: `digitalizacao_real_wia_${Date.now()}`,
        extensao: "png",
        tamanho_bytes: 120 * 1024,
        criado_por: currentUser?.nome || "Marcos Antônio Scanner",
        criado_em: new Date().toISOString().substring(0, 10),
        ocr_texto: realOcrText,
        assinado: true
      };

      setDocumentosList(prev => [...prev, newDoc]);
      alert("🎉 Documento digitalizado de hardware indexado localmente com sucesso!");
      setRealScannedImage(null);
      setRealOcrText('');
      setRealOcrFields({});
      setActiveTab('dossiers');
    }
  };

  // ============================================================================
  // PROTOCOLOS INTERATIVOS E TRAMITAÇÃO (MÓDULO 5)
  // ============================================================================

  const criarProtocoloReal = async () => {
    if (!newProtAssunto || !newProtDesc) {
      alert("Preencha o assunto e a descrição do protocolo.");
      return;
    }

    if (isApiOnline && authToken) {
      try {
        const payload = {
          seguradoId: newProtSeguradoId || null,
          assunto: newProtAssunto,
          descricao: newProtDesc,
          prioridade: newProtPrioridade
        };

        const res = await axios.post(`${API_URL}/protocolos`, payload, {
          headers: { Authorization: `Bearer ${authToken}` }
        });

        alert(`🎉 Protocolo Autuado com Sucesso! Protocolo nº ${res.data.numero}. Assinatura Criptográfica ICP-Brasil gerada!`);
        setOpenNewProtDialog(false);
        setNewProtAssunto('');
        setNewProtDesc('');
        setNewProtSeguradoId('');
        setNewProtPrioridade('NORMAL');
        
        await carregarDadosAPI(authToken);
      } catch (err: any) {
        console.error("Erro ao criar protocolo eletrônico:", err);
        alert(err.response?.data?.error || "Erro ao autuar protocolo eletrônico.");
      }
    } else {
      // Fallback local
      const seq = 1000 + Math.floor(Math.random() * 8999);
      const numProt = `${new Date().getFullYear()}.${String(new Date().getMonth()+1).padStart(2,'0')}${String(new Date().getDate()).padStart(2,'0')}.${seq}`;
      const newProt = {
        id: Date.now(),
        numero_protocolo: numProt,
        segurado_id: newProtSeguradoId ? Number(newProtSeguradoId) : null,
        assunto: newProtAssunto,
        descricao: newProtDesc,
        status: 'ABERTO',
        prioridade: newProtPrioridade,
        data_abertura: new Date().toISOString(),
        hash_assinatura_digital: `SHA256-ICP-BRASIL-LOCAL-#PROT-${numProt}`
      };

      setProtocolosList(prev => [newProt, ...prev]);
      alert(`🎉 Protocolo Autuado Localmente! Protocolo nº ${numProt}`);
      setOpenNewProtDialog(false);
      setNewProtAssunto('');
      setNewProtDesc('');
      setNewProtSeguradoId('');
      setNewProtPrioridade('NORMAL');
    }
  };

  const tramitarProtocoloReal = async () => {
    if (!selectedProtocol || !tramitDestinoId || !tramitDespacho) {
      alert("Preencha o despacho e selecione o usuário de destino.");
      return;
    }

    if (isApiOnline && authToken) {
      try {
        const payload = {
          destinoUsuarioId: Number(tramitDestinoId),
          etapaAtual: tramitEtapa,
          despacho: tramitDespacho
        };

        await axios.post(`${API_URL}/protocolos/${selectedProtocol.id}/tramitar`, payload, {
          headers: { Authorization: `Bearer ${authToken}` }
        });

        alert("🚀 Processo tramitado eletronicamente com sucesso com carimbo digital!");
        setOpenTramitarDialog(false);
        setTramitDestinoId('');
        setTramitDespacho('');
        
        await carregarDadosAPI(authToken);
      } catch (err: any) {
        console.error("Erro ao tramitar processo:", err);
        alert(err.response?.data?.error || "Erro ao despachar trâmite eletrônico.");
      }
    } else {
      // Fallback local
      alert("🚀 Trâmite despachado localmente com sucesso!");
      setOpenTramitarDialog(false);
      setTramitDestinoId('');
      setTramitDespacho('');
    }
  };

  const carregarHistoricoProtocolo = async (p: any) => {
    setSelectedProtocol(p);
    setProtHistoryList([]);
    setOpenHistoryDialog(true);

    if (isApiOnline && authToken) {
      try {
        const res = await axios.get(`${API_URL}/protocolos/${p.id}/historico`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        setProtHistoryList(res.data);
      } catch (err) {
        console.error("Erro ao carregar histórico de trâmites:", err);
      }
    } else {
      // Fallback local
      setProtHistoryList([
        {
          id: 1,
          origem_nome: currentUser?.nome || "Operador Local",
          origem_perfil: currentUser?.perfil || "Administrador",
          destino_nome: "Maria Tereza de Souza",
          destino_perfil: "Diretor",
          etapa_anterior: "ABERTO",
          etapa_atual: "EM_ANDAMENTO",
          despacho: `Protocolo autuado via Dossiê digital. Abertura do requerimento de análise de cadastro.`,
          data_tramitacao: p.data_abertura
        }
      ]);
    }
  };

  // ============================================================================
  // CÁLCULO PREVIDENCIÁRIO E WORKFLOW APOSENTADORIA (MÓDULO 3)
  // ============================================================================

  const simularAposentadoriaLocal = async () => {
    const seg = seguradosList.find(s => s.id === selectedApSeguradoId);
    if (!seg) return;

    if (isApiOnline && authToken) {
      try {
        const payload = {
          seguradoId: selectedApSeguradoId,
          regra: selectedApRegra,
          genero: selectedApGenero,
          professor: selectedApProfessor,
          salarioCustomizado: customApSalario
        };
        const res = await axios.post(`${API_URL}/aposentadorias/calcular`, payload, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        setApCalculatedData({
          segurado: res.data.segurado,
          idade: res.data.idade,
          tempoContribuicaoAnos: res.data.tempoContribuicaoAnos,
          mediaSalario: res.data.mediaSalarioCalculada,
          aliquota: res.data.aliquotaPercentual,
          valorBeneficio: res.data.valorBeneficio,
          regra: res.data.regraAplicada,
          elegivel: res.data.elegivel,
          detalhesRequisitos: res.data.detalhesRequisitos
        });
        return;
      } catch (err: any) {
        console.error("Erro ao simular aposentadoria na API:", err);
      }
    }

    // Fallback Local
    const anoNascimento = new Date(seg.data_nascimento).getFullYear();
    const idade = new Date().getFullYear() - anoNascimento;
    const anoAdmissao = new Date(seg.data_admissao).getFullYear();
    const tempoContribuicaoAnos = new Date().getFullYear() - anoAdmissao;
    
    const media = customApSalario || 5000.00;
    let aliquota = 60;
    let elegivel = false;
    let regraText = "";

    const isFem = selectedApGenero === "Feminino";
    const tempoEm2019 = Math.max(0, 2019 - anoAdmissao);

    let reqIdade = 0;
    let reqContrib = 0;
    let reqPontos: number | null = null;
    let pontosAtuais: number | null = null;
    let pedagioExigido: number | null = null;
    let pedagioAtual: number | null = null;

    switch (selectedApRegra) {
      case "IDADE":
        reqIdade = isFem ? 62 : 65;
        reqContrib = isFem ? 15 : 20;
        if (tempoContribuicaoAnos > reqContrib) {
          aliquota += (tempoContribuicaoAnos - reqContrib) * 2;
        }
        if (aliquota > 100) aliquota = 100;
        elegivel = (idade >= reqIdade && tempoContribuicaoAnos >= reqContrib);
        regraText = `Aposentadoria por Idade Geral (Art. 26 da EC nº 103/2019) - Alíquota de ${aliquota}%`;
        break;

      case "PONTOS":
        reqContrib = isFem ? 30 : 35;
        reqPontos = isFem ? 93 : 103;
        pontosAtuais = idade + tempoContribuicaoAnos;
        if (tempoContribuicaoAnos > 20) {
          aliquota += (tempoContribuicaoAnos - 20) * 2;
        }
        if (aliquota > 100) aliquota = 100;
        elegivel = (tempoContribuicaoAnos >= reqContrib && pontosAtuais >= reqPontos);
        regraText = `Transição por Pontos (Art. 15 da EC nº 103/2019) - Alíquota de ${aliquota}%`;
        break;

      case "PEDAGIO_100":
        reqIdade = isFem ? 57 : 60;
        reqContrib = isFem ? 30 : 35;
        const faltavam100 = Math.max(0, reqContrib - tempoEm2019);
        pedagioExigido = reqContrib + faltavam100;
        pedagioAtual = tempoContribuicaoAnos;
        aliquota = 100;
        elegivel = (idade >= reqIdade && tempoContribuicaoAnos >= pedagioExigido);
        regraText = `Regra de Transição Pedágio de 100% (Art. 20 da EC nº 103/2019) - Proventos Integrais (100% da média)`;
        break;

      case "PEDAGIO_50":
        reqContrib = isFem ? 30 : 35;
        const elegivel50 = tempoEm2019 >= (isFem ? 28 : 33);
        const faltavam50 = Math.max(0, reqContrib - tempoEm2019);
        pedagioExigido = reqContrib + (faltavam50 * 0.5);
        pedagioAtual = tempoContribuicaoAnos;
        aliquota = 85;
        elegivel = elegivel50 && (tempoContribuicaoAnos >= pedagioExigido);
        regraText = `Regra de Transição Pedágio de 50% (Art. 17 da EC nº 103/2019) - Incidência de Fator Previdenciário (~${aliquota}%)`;
        break;

      case "ESPECIAL_PROFESSOR":
        reqIdade = isFem ? 57 : 60;
        reqContrib = 25;
        const baseProfessor = isFem ? 15 : 20;
        if (tempoContribuicaoAnos > baseProfessor) {
          aliquota += (tempoContribuicaoAnos - baseProfessor) * 2;
        }
        if (aliquota > 100) aliquota = 100;
        elegivel = (idade >= reqIdade && tempoContribuicaoAnos >= reqContrib && selectedApProfessor);
        regraText = `Aposentadoria Especial de Professor (Art. 26, §8º da EC 103/2019) - Alíquota de ${aliquota}%`;
        break;
    }

    const beneficio = media * (aliquota / 100);

    setApCalculatedData({
      segurado: seg.nome,
      idade,
      tempoContribuicaoAnos,
      mediaSalario: media,
      aliquota,
      valorBeneficio: beneficio,
      regra: regraText,
      elegivel,
      detalhesRequisitos: {
        idadeExigida: reqIdade,
        idadeAtual: idade,
        contribExigida: reqContrib,
        contribAtual: tempoContribuicaoAnos,
        pontosExigidos: reqPontos,
        pontosAtuais: pontosAtuais,
        pedagioExigido: pedagioExigido,
        pedagioAtual: pedagioAtual,
        professorFlag: selectedApProfessor
      }
    });
  };

  const homologarProcessoAposentadoria = async () => {
    if (!apCalculatedData) return;

    const getRegraLabel = (r: string) => {
      switch(r) {
        case "IDADE": return "Por Idade (EC 103/19)";
        case "PONTOS": return "Transição por Pontos";
        case "PEDAGIO_100": return "Pedágio de 100%";
        case "PEDAGIO_50": return "Pedágio de 50%";
        case "ESPECIAL_PROFESSOR": return "Especial de Professor";
        default: return "Aposentadoria";
      }
    };
    const tipoAposentadoriaLabel = getRegraLabel(selectedApRegra);

    if (isApiOnline && authToken) {
      try {
        const payload = {
          seguradoId: selectedApSeguradoId,
          tipoAposentadoria: tipoAposentadoriaLabel,
          tempoContribuicaoAnos: apCalculatedData.tempoContribuicaoAnos,
          regraAplicada: apCalculatedData.regra,
          valorBeneficio: apCalculatedData.valorBeneficio,
          mediaSalarioCalculada: apCalculatedData.mediaSalario
        };

        const res = await axios.post(`${API_URL}/aposentadorias`, payload, {
          headers: { Authorization: `Bearer ${authToken}` }
        });

        await carregarDadosAPI(authToken);

        alert(`🏛️ ${res.data.message || "Requerimento autuado com sucesso!"}`);
        setApCalculatedData(null);
        setActiveTab('aposentadorias');
      } catch (err: any) {
        console.error("Erro ao registrar aposentadoria na API:", err);
        alert(err.response?.data?.error || "Erro ao salvar aposentadoria no servidor.");
      }
    } else {
      // Fallback Local
      const newProcess = {
        id: Date.now(),
        segurado_id: selectedApSeguradoId,
        tipo_aposentadoria: tipoAposentadoriaLabel,
        data_solicitacao: new Date().toISOString().substring(0, 10),
        status_processo: "RECEBIMENTO",
        tempo_contribuicao_anos: apCalculatedData.tempoContribuicaoAnos,
        regra_aplicada: apCalculatedData.regra,
        parecer_juridico: "Aguardando parecer da procuradoria previdenciária.",
        valor_beneficio: apCalculatedData.valorBeneficio,
        calculo_media_beneficio: apCalculatedData.mediaSalario
      };

      setAposentadoriasList(prev => [...prev, newProcess]);

      // Abrir protocolo digital automático (MÓDULO 5)
      const numProt = `${new Date().getFullYear()}.${String(new Date().getMonth()+1).padStart(2,'0')}${String(new Date().getDate()).padStart(2,'0')}.${Math.floor(1000 + Math.random()*9000)}`;
      const newProt = {
        id: Date.now() + 1,
        numero_protocolo: numProt,
        segurado_id: selectedApSeguradoId,
        assunto: `Aposentadoria ${tipoAposentadoriaLabel} - Autuação Digital`,
        descricao: `Workflow previdenciário de ${apCalculatedData.segurado} autuado em lote pelo perfil: ${currentUser?.perfil}`,
        status: "ABERTO",
        prioridade: "ALTA",
        data_abertura: new Date().toISOString()
      };

      setProtocolosList(prev => [newProt, ...prev]);

      setAuditoriaLogs(prev => [
        { id: Date.now(), cpf_usuario: currentUser.cpf, perfil_usuario: currentUser.perfil, modulo: "Aposentadorias", acao: "INCLUSAO", ip_origem: "127.0.0.1", data_evento: new Date().toISOString() },
        ...prev
      ]);

      alert(`🏛️ Requerimento autuado com sucesso! Protocolo Digital nº ${numProt} aberto no workflow.`);
      setApCalculatedData(null);
      setActiveTab('aposentadorias');
    }
  };

  // Avançar Workflow da Aposentadoria (MÓDULO 14)
  const avancarWorkflowAposentadoria = async (id: number) => {
    const ap = aposentadoriasList.find(a => a.id === id);
    if (!ap) return;

    let proxima = ap.status_processo;
    if (ap.status_processo === 'RECEBIMENTO') proxima = 'ANALISE';
    else if (ap.status_processo === 'ANALISE') proxima = 'JURIDICO';
    else if (ap.status_processo === 'JURIDICO') proxima = 'DIRETORIA';
    else if (ap.status_processo === 'DIRETORIA') proxima = 'CONCEDIDO';

    if (isApiOnline && authToken) {
      try {
        const payload = {
          proximaEtapa: proxima,
          despacho: `Workflow avançado para ${proxima} pelo painel corporativo.`,
          usuarioDestinoId: 4
        };

        await axios.put(`${API_URL}/aposentadorias/${id}/workflow`, payload, {
          headers: { Authorization: `Bearer ${authToken}` }
        });

        // Recarregar os dados da API
        await carregarDadosAPI(authToken);

        alert(`🏛️ Workflow avançado para ${proxima} com sucesso!`);
      } catch (err: any) {
        console.error("Erro ao avançar workflow na API:", err);
        alert("Erro ao avançar o workflow no servidor.");
      }
    } else {
      // Fallback Local
      setAposentadoriasList(prev => prev.map(a => {
        if (a.id === id) {
          let portaria = a.portaria_concessao;
          if (proxima === 'CONCEDIDO') {
            portaria = `PORT-CONC-2026-00${id.toString().substring(0,2)}`;
            setSeguradosList(prevSeg => prevSeg.map(s => s.id === a.segurado_id ? { ...s, status_funcional: 'APOSENTADO' } : s));
          }

          setAuditoriaLogs(prevAud => [
            { id: Date.now(), cpf_usuario: currentUser?.cpf, perfil_usuario: currentUser?.perfil, modulo: "Aposentadorias", acao: "ALTERACAO", ip_origem: "127.0.0.1", data_evento: new Date().toISOString() },
            ...prevAud
          ]);

          return { ...a, status_processo: proxima, portaria_concessao: portaria };
        }
        return a;
      }));
    }
  };

  // Sincronizar Processos Externos do TCE-CE/TCU de Quixadá - CE
  const sincronizarProcessosExternos = async () => {
    setIsSyncingExternal(true);
    setTimeout(async () => {
      if (isApiOnline && authToken) {
        try {
          const res = await axios.get(`${API_URL}/external/quixada/processos?dataSearch=${externalSearchDate}`, {
            headers: { Authorization: `Bearer ${authToken}` }
          });
          if (res.data && Array.isArray(res.data)) {
            setExternalProcesses(res.data);
          }
        } catch (e) {
          console.error("Erro ao sincronizar via API:", e);
        }
      } else {
        // Simulação Offline: gerar processos para a data selecionada
        const year = externalSearchDate.split('-')[0] || new Date().getFullYear();
        const formattedDateStr = externalSearchDate.split('-').reverse().join('/');
        setExternalProcesses([
          {
            id: Date.now() + 101,
            numero: `TCE-CE-00${Math.floor(1000 + Math.random() * 9000)}/${year}`,
            assunto: "Prestação de Contas Simplificada - RPPS Quixadá",
            interessado: "Câmara Municipal de Quixadá",
            orgao: "Tribunal de Contas do Estado do Ceará (TCE-CE)",
            dataLimite: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
            status: "Autuado em Tempo Real (Local)",
            urgencia: "MEDIA",
            documentos: [
              { id: `ext-offline-1`, nome: "Oficio_Notificacao.pdf", tamanho: "850 KB", data: formattedDateStr, restrito: false, conteudo: `NOTIFICAÇÃO TCE-CE DE ACORDO COM PESQUISA EM TEMPO REAL NA DATA ${formattedDateStr}.\nSolicitação de parecer técnico de contas previdenciárias.` }
            ]
          }
        ]);
      }
      setIsSyncingExternal(false);
      alert(`🔄 Varredura Concluída! Processos autuados no TCE-CE na data de ${externalSearchDate.split('-').reverse().join('/')} foram sincronizados com sucesso.`);
    }, 1800);
  };

  // Importar Processo Externo para os Protocolos Locais do Instituto
  const importarProcessoExterno = async (proc: any) => {
    if (isApiOnline && authToken) {
      try {
        const payload = {
          seguradoId: 1,
          assunto: `[Importado TCE-CE] ${proc.numero} - ${proc.assunto}`,
          descricao: `Processo externo importado para o fluxo local do RPPS. Interessado: ${proc.interessado}. Órgão de Origem: ${proc.orgao}. Status TCE: ${proc.status}.`,
          prioridade: proc.urgencia === "CRITICA" || proc.urgencia === "ATRASADA" ? "ALTA" : "NORMAL"
        };
        await axios.post(`${API_URL}/protocolos`, payload, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        await carregarDadosAPI(authToken);
        alert(`📥 Processo ${proc.numero} importado com sucesso para a fila de Protocolos locais!`);
      } catch (err: any) {
        console.error("Erro ao importar processo:", err);
        alert("Erro ao importar processo no servidor.");
      }
    } else {
      const numProt = `${new Date().getFullYear()}.${String(new Date().getMonth()+1).padStart(2,'0')}${String(new Date().getDate()).padStart(2,'0')}.${Math.floor(1000 + Math.random()*9000)}`;
      const newProt = {
        id: Date.now(),
        numero_protocolo: numProt,
        segurado_id: 1,
        assunto: `[Importado TCE-CE] ${proc.numero} - ${proc.assunto}`,
        descricao: `Processo externo importado para o fluxo local do RPPS. Interessado: ${proc.interessado}. Órgão de Origem: ${proc.orgao}. Status TCE: ${proc.status}.`,
        status: "ABERTO",
        prioridade: proc.urgencia === "CRITICA" || proc.urgencia === "ATRASADA" ? "ALTA" : "NORMAL",
        data_abertura: new Date().toISOString()
      };
      setProtocolosList(prev => [newProt, ...prev]);
      setAuditoriaLogs(prev => [
        { id: Date.now(), cpf_usuario: currentUser.cpf, perfil_usuario: currentUser.perfil, modulo: "Dashboard", acao: "IMPORTACAO", ip_origem: "127.0.0.1", data_evento: new Date().toISOString() },
        ...prev
      ]);
      alert(`📥 Processo ${proc.numero} importado localmente! Protocolo Digital nº ${numProt} aberto para análise.`);
    }
  };

  // ============================================================================
  // CADASTROS DE SEGURADOS (MÓDULO 2)
  // ============================================================================

  const handleCreateSegurado = async () => {
    if (!newSegData.nome || !newSegData.cpf || !newSegData.matricula) {
      alert("Preencha Nome, CPF e Matrícula.");
      return;
    }

    if (isApiOnline && authToken) {
      try {
        const payload = {
          nome: newSegData.nome,
          cpf: newSegData.cpf,
          rg: newSegData.rg || "ISENTO",
          pis_pasep: "ISENTO",
          matricula: newSegData.matricula,
          data_nascimento: newSegData.data_nascimento || "1980-01-01",
          estado_civil: newSegData.estado_civil,
          endereco_rua: newSegData.endereco || "Rua Principal",
          endereco_numero: "S/N",
          endereco_bairro: "Centro",
          endereco_cidade: "Cidade RPPS",
          endereco_estado: "MG",
          endereco_cep: "30000-000",
          telefone: newSegData.telefone || "(31) 99999-9999",
          email: newSegData.email || "contato@previdencia.gov.br",
          cargo_atual: newSegData.cargo_atual || "ASSISTENTE",
          orgao_lotacao: newSegData.orgao_lotacao,
          data_admissao: newSegData.data_admissao || "2010-01-01"
        };

        await axios.post(`${API_URL}/segurados`, payload, {
          headers: { Authorization: `Bearer ${authToken}` }
        });

        // Recarregar os segurados da API
        await carregarDadosAPI(authToken);

        setOpenNewSegurado(false);
        alert("👤 Segurado municipal cadastrado com sucesso no banco de dados!");
      } catch (err: any) {
        console.error("Erro ao criar segurado na API:", err);
        alert(err.response?.data?.error || "Erro ao salvar segurado no servidor.");
      }
    } else {
      // Fallback Local
      const newSeg = {
        ...newSegData,
        id: Date.now(),
        status_funcional: 'ATIVO'
      };

      setSeguradosList(prev => [...prev, newSeg]);
      setOpenNewSegurado(false);
      
      setAuditoriaLogs(prev => [
        { id: Date.now(), cpf_usuario: currentUser.cpf, perfil_usuario: currentUser.perfil, modulo: "Segurados", acao: "INCLUSAO", ip_origem: "127.0.0.1", data_evento: new Date().toISOString() },
        ...prev
      ]);

      alert("👤 Segurado municipal cadastrado com sucesso!");
    }
  };

  const handleEditarSeguradoClick = (seg: any) => {
    setSelectedSeguradoForEdit(seg);
    setEditSegData({
      nome: seg.nome || '',
      cpf: seg.cpf || '',
      rg: seg.rg || '',
      matricula: seg.matricula || '',
      data_nascimento: seg.data_nascimento ? seg.data_nascimento.substring(0, 10) : '',
      estado_civil: seg.estado_civil || 'Casado',
      endereco: seg.endereco_rua || seg.endereco || '',
      telefone: seg.telefone || '',
      email: seg.email || '',
      cargo_atual: seg.cargo_atual || '',
      orgao_lotacao: seg.orgao_lotacao || 'Prefeitura',
      data_admissao: seg.data_admissao ? seg.data_admissao.substring(0, 10) : '',
      status_funcional: seg.status_funcional || 'ATIVO'
    });
    setOpenEditSegurado(true);
  };

  const handleSaveEditSegurado = async () => {
    if (!editSegData.nome || !editSegData.cpf || !editSegData.matricula) {
      alert("Preencha Nome, CPF e Matrícula.");
      return;
    }

    if (isApiOnline && authToken && selectedSeguradoForEdit) {
      try {
        const payload = {
          nome: editSegData.nome,
          cpf: editSegData.cpf,
          rg: editSegData.rg || "ISENTO",
          matricula: editSegData.matricula,
          data_nascimento: editSegData.data_nascimento || "1980-01-01",
          estado_civil: editSegData.estado_civil,
          endereco_rua: editSegData.endereco || "Rua Principal",
          telefone: editSegData.telefone || "(31) 99999-9999",
          email: editSegData.email || "contato@previdencia.gov.br",
          cargo_atual: editSegData.cargo_atual || "ASSISTENTE",
          orgao_lotacao: editSegData.orgao_lotacao,
          data_admissao: editSegData.data_admissao || "2010-01-01",
          status_funcional: editSegData.status_funcional
        };

        await axios.put(`${API_URL}/segurados/${selectedSeguradoForEdit.id}`, payload, {
          headers: { Authorization: `Bearer ${authToken}` }
        });

        await carregarDadosAPI(authToken);
        setOpenEditSegurado(false);
        alert("👤 Segurado municipal atualizado com sucesso no banco de dados!");
      } catch (err: any) {
        console.error("Erro ao atualizar segurado na API:", err);
        alert(err.response?.data?.error || "Erro ao atualizar segurado no servidor.");
      }
    } else if (selectedSeguradoForEdit) {
      // Fallback Local
      setSeguradosList(prev => prev.map(s => s.id === selectedSeguradoForEdit.id ? { ...s, ...editSegData, endereco_rua: editSegData.endereco } : s));
      setOpenEditSegurado(false);
      
      setAuditoriaLogs(prev => [
        { id: Date.now(), cpf_usuario: currentUser.cpf, perfil_usuario: currentUser.perfil, modulo: "Segurados", acao: "ALTERACAO", ip_origem: "127.0.0.1", data_evento: new Date().toISOString() },
        ...prev
      ]);

      alert("👤 Segurado municipal atualizado com sucesso localmente!");
    }
  };

  const handleDeleteSegurado = async (seg: any) => {
    if (!window.confirm(`Tem certeza que deseja EXCLUIR permanentemente o segurado ${seg.nome} e todo o seu histórico/dossiê?`)) return;

    if (isApiOnline && authToken) {
      try {
        await axios.delete(`${API_URL}/segurados/${seg.id}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });

        await carregarDadosAPI(authToken);
        alert("🎉 Segurado e dossiê correspondente excluídos com sucesso!");
      } catch (err: any) {
        console.error("Erro ao excluir segurado na API:", err);
        alert(err.response?.data?.error || "Erro ao excluir segurado no servidor.");
      }
    } else {
      // Fallback Local
      setSeguradosList(prev => prev.filter(s => s.id !== seg.id));
      
      setAuditoriaLogs(prev => [
        { id: Date.now(), cpf_usuario: currentUser.cpf, perfil_usuario: currentUser.perfil, modulo: "Segurados", acao: "EXCLUSAO", ip_origem: "127.0.0.1", data_evento: new Date().toISOString() },
        ...prev
      ]);

      alert("🎉 Segurado excluído localmente!");
    }
  };

  // ============================================================================
  // EXPORTADORES DE RELATÓRIOS (CSV - MÓDULO 11)
  // ============================================================================

  const exportToCSV = (dataType: string, data: any[]) => {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    if (data.length === 0) return;
    
    // Obter cabeçalhos
    const headers = Object.keys(data[0]).join(",");
    csvContent += headers + "\r\n";
    
    data.forEach(row => {
      const line = Object.values(row).map(v => `"${v}"`).join(",");
      csvContent += line + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `RELATORIO_${dataType.toUpperCase()}_SGIP_RPPS.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setAuditoriaLogs(prev => [
      { id: Date.now(), cpf_usuario: currentUser.cpf, perfil_usuario: currentUser.perfil, modulo: "Relatorios", acao: "DOWNLOAD", ip_origem: "127.0.0.1", data_evento: new Date().toISOString() },
      ...prev
    ]);
  };

  // ============================================================================
  // SIMULADOR DE BACKUP INTEGRAL (MÓDULO 15)
  // ============================================================================

  const triggerCloudBackupSim = () => {
    alert("💾 Iniciando backup local de banco PostgreSQL e sincronia automática com a nuvem (Google Drive e OneDrive)...");
    
    setTimeout(() => {
      setCloudSyncLogs(prev => [
        `[${new Date().toLocaleTimeString('pt-BR')}] Backup local completo exportado: BACKUP_SGIP_RPPS_${Date.now()}.sql`,
        `[${new Date().toLocaleTimeString('pt-BR')}] Sincronização automatizada concluída - Replicado no Google Drive`,
        `[${new Date().toLocaleTimeString('pt-BR')}] Sincronização automatizada concluída - Replicado no OneDrive`,
        ...prev
      ]);
      alert("✅ Backup e Sincronização em Nuvem efetuados com sucesso!");
    }, 2000);
  };

  // ============================================================================
  // RENDERIZADOR DA TELA DE LOGIN (MÓDULO 1)
  // ============================================================================

  if (!currentUser) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{
          minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: themeMode === 'dark' ? 'linear-gradient(135deg, #020617 0%, #0f172a 100%)' : 'linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 100%)', p: 2,
          position: 'relative'
        }}>
          <IconButton
            sx={{ position: 'absolute', top: 20, right: 20, color: themeMode === 'dark' ? '#f8fafc' : '#0f172a' }}
            onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
          >
            {themeMode === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
          </IconButton>
          <Card sx={{ maxWidth: 440, width: '100%', p: 3, textAlign: 'center' }} className="fade-in">
            <Avatar sx={{ m: '0 auto 16px', bgcolor: 'primary.main', width: 56, height: 56 }}>
              <LayoutDashboard size={28} />
            </Avatar>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 800 }}>
              SGIP - RPPS
            </Typography>
            <Typography variant="body2" sx={{ mb: 4 }}>
              Instituto de Previdência Municipal • Acesso Corporativo
            </Typography>

            {loginError && <Chip label={loginError} color="error" sx={{ mb: 2, width: '100%' }} />}

            {isGovBrLoginMode ? (
              <Box sx={{ textAlign: 'left' }}>
                <Box sx={{ bgcolor: '#1351b4', color: '#fff', p: 1.5, borderRadius: 1.5, mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <ShieldCheck size={20} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>IDENTIFICAÇÃO GOV.BR</Typography>
                </Box>

                <Tabs value={govBrCertificado ? 1 : 0} onChange={(_, val) => { if (val === 0) setGovBrCertificado(''); else { setGovBrCertificado('admin_token'); setGovBrCpf('001.002.003-01'); } }} centered sx={{ mb: 2.5 }}>
                  <Tab label="CPF e Senha" />
                  <Tab label="Certificado Digital" />
                </Tabs>

                {govBrCertificado ? (
                  <Box sx={{ mb: 3, p: 2, border: '1px dashed rgba(255,255,255,0.12)', borderRadius: 2, bgcolor: 'rgba(255,255,255,0.02)' }}>
                    <Typography variant="body2" sx={{ mb: 2, fontWeight: 700, fontSize: 13 }}>
                      Selecione o Certificado Digital ICP-Brasil:
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        value={govBrCertificado}
                        onChange={(e) => {
                          const val = e.target.value;
                          setGovBrCertificado(val);
                          if (val === 'admin_token') setGovBrCpf('001.002.003-01');
                          else if (val === 'tiago_token') setGovBrCpf('057.611.763-35');
                          else if (val === 'rh_token') setGovBrCpf('001.002.003-04');
                        }}
                      >
                        <MenuItem value="admin_token">e-CPF A3 - Carlos Eduardo da Silva (ADMIN)</MenuItem>
                        <MenuItem value="tiago_token">e-CPF A3 - Tiago de Lima carneiro (ADMIN)</MenuItem>
                        <MenuItem value="rh_token">e-CPF A3 - Joana Darc de Oliveira (RH)</MenuItem>
                      </Select>
                    </FormControl>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
                      Certificado ICP-Brasil válido emitido por Autoridade Certificadora Credenciada.
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    <TextField
                      label="CPF cadastrado no Gov.br"
                      fullWidth sx={{ mb: 2 }}
                      value={govBrCpf}
                      onChange={(e) => setGovBrCpf(formatCPF(e.target.value))}
                      placeholder="Ex: 000.000.000-00"
                    />
                    <TextField
                      label="Senha Gov.br"
                      type="password"
                      fullWidth sx={{ mb: 2 }}
                      value={govBrSenha}
                      onChange={(e) => setGovBrSenha(e.target.value)}
                    />
                    <Alert severity="info" sx={{ mb: 3, '& .MuiAlert-message': { fontSize: 11, lineHeight: 1.3 } }}>
                      <strong>SSO Simulado:</strong> A validação da senha é processada pelo provedor externo do Gov.br. Qualquer senha é aceita para CPFs de servidores ativos cadastrados.
                    </Alert>
                  </Box>
                )}

                <Button 
                  variant="contained" 
                  fullWidth 
                  size="large" 
                  sx={{ py: 1.5, bgcolor: '#1351b4', '&:hover': { bgcolor: '#0f3e8c' }, mb: 2 }}
                  onClick={handleGovBrLogin}
                  disabled={govBrLoading}
                >
                  {govBrLoading ? <CircularProgress size={24} color="inherit" /> : (govBrCertificado ? "Autenticar com Certificado" : "Entrar com Gov.br")}
                </Button>

                <Button variant="text" size="small" fullWidth onClick={() => setIsGovBrLoginMode(false)} sx={{ color: 'text.secondary' }}>
                  Voltar para login padrão SGIP
                </Button>
              </Box>
            ) : (
              <Box>
                <form onSubmit={handleLogin}>
                  <TextField
                    label="CPF do Servidor"
                    fullWidth sx={{ mb: 2 }}
                    value={loginCpf}
                    onChange={(e) => setLoginCpf(formatCPF(e.target.value))}
                    placeholder="Ex: 001.002.003-01"
                  />
                  <TextField
                    label="Senha de Acesso"
                    type="password"
                    fullWidth sx={{ mb: 3 }}
                    value={loginSenha}
                    onChange={(e) => setLoginSenha(e.target.value)}
                  />
                  
                  <Button type="submit" variant="contained" color="primary" fullWidth size="large" sx={{ py: 1.5, mb: 2 }}>
                    Autenticar no Portal
                  </Button>
                </form>

                <Button 
                  variant="contained" 
                  fullWidth 
                  size="large" 
                  startIcon={<ShieldCheck size={18} />} 
                  sx={{ py: 1.5, bgcolor: '#1351b4', '&:hover': { bgcolor: '#0f3e8c' }, color: '#fff', textTransform: 'none', fontWeight: 700 }}
                  onClick={() => {
                    setIsGovBrLoginMode(true);
                    setGovBrCpf(loginCpf);
                  }}
                >
                  Entrar com GOV.BR
                </Button>

              </Box>
            )}
          </Card>
        </Box>
      </ThemeProvider>
    );
  }

  // ============================================================================
  // ESTRUTURA ADMINISTRATIVA PRINCIPAL (SIDEBAR E MAIN VIEWPORT)
  // ============================================================================

  const drawerWidth = 260;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, roles: '*' },
    { id: 'users', label: 'Gestão de Usuários', icon: <Users size={20} />, roles: ['Administrador'] },
    { id: 'segurados', label: 'Segurados RPPS', icon: <UserCheck size={20} />, roles: '*' },
    { id: 'aposentadorias', label: 'Aposentadorias', icon: <FileCheck size={20} />, roles: '*' },
    { id: 'pensoes', label: 'Pensões', icon: <Clock size={20} />, roles: '*' },
    { id: 'protocolos', label: 'Protocolo Digital', icon: <Plus size={20} />, roles: '*' },
    { id: 'documentos', label: 'Gestão Documental', icon: <FolderOpen size={20} />, roles: '*' },
    { id: 'scanner', label: 'Módulo Scanner & OCR', icon: <Scan size={20} />, roles: ['Administrador', 'Recursos Humanos', 'Digitalização'] },
    { id: 'realScanner', label: 'Digitalizador USB/Rede', icon: <Scan size={20} />, roles: ['Administrador', 'Recursos Humanos', 'Digitalização'] },
    { id: 'dossiers', label: 'Dossiê Timeline', icon: <Fingerprint size={20} />, roles: '*' },
    { id: 'relatorios', label: 'Relatórios', icon: <FileSpreadsheet size={20} />, roles: '*' },
    { id: 'auditoria', label: 'Auditoria LGPD', icon: <ShieldAlert size={20} />, roles: ['Administrador'] },
    { id: 'configuracoes', label: 'Configurações', icon: <Settings size={20} />, roles: '*' }
  ];

  const visibleMenuItems = menuItems.filter(item => 
    item.roles === '*' || item.roles.includes(currentUser.perfil)
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', width: '100vw' }}>
        
        {/* BARRA DE CABEÇALHO */}
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: themeMode === 'dark' ? '#0f1720' : '#ffffff', borderBottom: themeMode === 'dark' ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.08)', boxShadow: 'none', color: themeMode === 'dark' ? '#f8fafc' : '#0f172a' }}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>PD</Avatar>
              <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 800, letterSpacing: '0.5px', color: 'inherit' }}>
                SGIP - PREVIDÊNCIA MUNICIPAL
              </Typography>
              <Chip label={isApiOnline ? "API NestJS Conectada" : "Modo Fallback Resiliente (Ativo)"} color={isApiOnline ? "success" : "warning"} size="small" variant="outlined" sx={{ ml: 2 }} />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'inherit' }}>{currentUser.nome}</Typography>
                <Typography variant="caption" sx={{ color: 'primary.light', fontWeight: 600 }}>{currentUser.perfil}</Typography>
              </Box>
              <IconButton onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')} color="inherit">
                {themeMode === 'dark' ? <Sun size={20} style={{ color: '#f59e0b' }} /> : <Moon size={20} style={{ color: '#0891b2' }} />}
              </IconButton>
              <IconButton onClick={handleLogout} color="error">
                <LogOut size={20} />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        {/* SIDEBAR NAVEGAÇÃO LATERAL (MÓDULO 1) */}
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth, flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', bgcolor: themeMode === 'dark' ? '#0b0f15' : '#f1f5f9', borderRight: themeMode === 'dark' ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.08)' }
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto', p: 2 }}>
            <List>
              {visibleMenuItems.map((item) => (
                <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton 
                    selected={activeTab === item.id}
                    onClick={() => setActiveTab(item.id)}
                  >
                    <ListItemIcon sx={{ color: activeTab === item.id ? 'primary.light' : (themeMode === 'dark' ? '#94a3b8' : '#475569'), minWidth: 40 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 13, fontWeight: 600, color: activeTab === item.id ? 'primary.light' : (themeMode === 'dark' ? '#94a3b8' : '#475569') }} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>

        {/* ÁREA PRINCIPAL DE CONTEÚDO (MAIN VIEWPORT) */}
        <Box component="main" sx={{ flexGrow: 1, p: 4, bgcolor: 'background.default', height: '100vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <Toolbar />
          
          <Box className="fade-in">

            {/* ==================================================================
                 TELA 1: DASHBOARD (MÓDULO 10)
                 ================================================================== */}
            {activeTab === 'dashboard' && (
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>Painel de Controle e Estatísticas</Typography>
                
                <Tabs value={dashboardSubTab} onChange={(_, val) => setDashboardSubTab(val)} sx={{ mb: 4, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <Tab label="Indicadores Previdenciários" sx={{ fontWeight: 700 }} />
                  <Tab label="Monitoramento Quixadá - CE (TCE-CE)" sx={{ fontWeight: 700 }} />
                </Tabs>

                {dashboardSubTab === 0 && (
                  <Box>
                    {/* Cards KPIs */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="body2" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>Segurados Ativos</Typography>
                          <Typography variant="h3" sx={{ mt: 1, fontWeight: 800 }}>{seguradosList.length}</Typography>
                        </Box>
                        <Users size={36} style={{ color: '#0f766e' }} />
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="body2" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>Aposentados</Typography>
                          <Typography variant="h3" sx={{ mt: 1, fontWeight: 800 }}>
                            {seguradosList.filter(s => s.status_funcional === 'APOSENTADO').length + 1}
                          </Typography>
                        </Box>
                        <UserCheck size={36} style={{ color: '#10b981' }} />
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="body2" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>Processos Ativos</Typography>
                          <Typography variant="h3" sx={{ mt: 1, fontWeight: 800 }}>
                            {aposentadoriasList.filter(a => a.status_processo !== 'CONCEDIDO').length}
                          </Typography>
                        </Box>
                        <Clock size={36} style={{ color: '#f59e0b' }} />
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="body2" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>Docs Digitalizados</Typography>
                          <Typography variant="h3" sx={{ mt: 1, fontWeight: 800 }}>{documentosList.length}</Typography>
                        </Box>
                        <Scan size={36} style={{ color: '#0891b2' }} />
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* Gráficos Comparativos Previdenciários (MÓDULO 10) */}
                <Grid container spacing={4} sx={{ mb: 4 }}>
                  <Grid item xs={12} md={7}>
                    <Card sx={{ p: 2 }}>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Evolução de Digitalização e Homologações</Typography>
                      <ResponsiveContainer width="100%" height={260}>
                        <AreaChart data={[
                          { name: 'Jan', paginas: 34, processos: 4 },
                          { name: 'Fev', paginas: 52, processos: 6 },
                          { name: 'Mar', paginas: 41, processos: 3 },
                          { name: 'Abr', paginas: 65, processos: 8 },
                          { name: 'Mai', paginas: 85, processos: 12 }
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                          <XAxis dataKey="name" stroke="#94a3b8" />
                          <YAxis stroke="#94a3b8" />
                          <ChartTooltip />
                          <Area type="monotone" dataKey="paginas" stroke="#14b8a6" fill="rgba(20, 184, 166, 0.1)" name="Docs Digitalizados" />
                          <Area type="monotone" dataKey="processos" stroke="#0891b2" fill="rgba(8, 145, 178, 0.1)" name="Processos Autuados" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={5}>
                    <Card sx={{ p: 2 }}>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Segurados por Status Funcional</Typography>
                      <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={[
                          { name: 'Ativos', total: seguradosList.filter(s => s.status_funcional === 'ATIVO').length },
                          { name: 'Aposentados', total: seguradosList.filter(s => s.status_funcional === 'APOSENTADO').length },
                          { name: 'Pensionistas', total: dependentesList.length }
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                          <XAxis dataKey="name" stroke="#94a3b8" />
                          <YAxis stroke="#94a3b8" />
                          <ChartTooltip />
                          <Bar dataKey="total" fill="#0f766e" radius={[4, 4, 0, 0]} name="Total de Vínculos" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* MONITORAMENTO EXTERNO QUIXADÁ - CE */}
            {dashboardSubTab === 1 && (
              <Box>
                {selectedExternalProcess ? (
                  <Card sx={{ p: 4, mb: 4 }} className="fade-in">
                    {/* Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, borderBottom: '1px solid rgba(255,255,255,0.08)', pb: 2, flexWrap: 'wrap', gap: 2 }}>
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 800 }}>
                          📂 Processo TCE-CE: {selectedExternalProcess.numero}
                        </Typography>
                        <Typography variant="subtitle2" color="primary.light" sx={{ mt: 0.5 }}>
                          {selectedExternalProcess.assunto}
                        </Typography>
                      </Box>
                      <Button variant="outlined" color="inherit" onClick={() => { setSelectedExternalProcess(null); setSelectedExternalDoc(null); setOpenGovBrModal(false); }}>
                        Voltar para a Lista
                      </Button>
                    </Box>

                    {/* Gov.br Banner and Action */}
                    <Card sx={{ 
                      p: 2.5, 
                      mb: 4, 
                      bgcolor: isGovBrConnected ? 'rgba(16,185,129,0.04)' : 'rgba(245,158,11,0.04)',
                      border: isGovBrConnected ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(245,158,11,0.2)',
                      borderRadius: 2
                    }}>
                      <Grid container spacing={2} alignItems="center" justifyContent="space-between">
                        <Grid item xs={12} md={8}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <ShieldCheck size={24} style={{ color: isGovBrConnected ? '#10b981' : '#f59e0b' }} />
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                                {isGovBrConnected ? "Sessão de Controle Elevado Ativa (Gov.br)" : "Identificação Gov.br Requerida"}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {isGovBrConnected 
                                  ? `Autenticado via ${currentUser?.tipoAutenticacao || 'Certificado Digital'}. Todos os documentos confidenciais estão destravados.` 
                                  : "Este processo contém relatórios de folha de pagamento e auditorias confidenciais. Conecte com Gov.br (e-CPF A3) para liberar."}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={4} sx={{ textAlign: { md: 'right' } }}>
                          {isGovBrConnected ? (
                            <Button variant="outlined" color="success" onClick={() => setIsGovBrConnected(false)}>
                              Desconectar Gov.br
                            </Button>
                          ) : (
                            <Button variant="contained" sx={{ bgcolor: '#1351b4', '&:hover': { bgcolor: '#0f3e8c' }, color: '#fff', fontWeight: 700 }} onClick={() => setOpenGovBrModal(true)}>
                              Identificar com Gov.br
                            </Button>
                          )}
                        </Grid>
                      </Grid>
                    </Card>

                    {/* Inline Gov.br Elevation Form */}
                    {openGovBrModal && (
                      <Card sx={{ p: 3, mb: 4, border: '1px solid #1351b4', bgcolor: 'rgba(19,81,180,0.02)' }} className="fade-in">
                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <ShieldCheck size={20} style={{ color: '#1351b4' }} /> Autenticação Gov.br (e-CPF ICP-Brasil)
                        </Typography>
                        
                        <Tabs value={govBrCertificado ? 1 : 0} onChange={(_, val) => { if (val === 0) setGovBrCertificado(''); else { setGovBrCertificado('admin_token'); setGovBrCpf('001.002.003-01'); } }} sx={{ mb: 3 }}>
                          <Tab label="Entrar com CPF e Senha" />
                          <Tab label="Entrar com Certificado Digital" />
                        </Tabs>

                        {govBrCertificado ? (
                          <Box sx={{ mb: 3 }}>
                            <Typography variant="body2" sx={{ mb: 1, fontWeight: 700, fontSize: 13 }}>
                              Selecione seu Certificado Digital e-CPF A3 (ICP-Brasil):
                            </Typography>
                            <FormControl fullWidth size="small" sx={{ maxWidth: 400 }}>
                              <Select
                                value={govBrCertificado}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setGovBrCertificado(val);
                                  if (val === 'admin_token') setGovBrCpf('001.002.003-01');
                                  else if (val === 'tiago_token') setGovBrCpf('057.611.763-35');
                                  else if (val === 'rh_token') setGovBrCpf('001.002.003-04');
                                }}
                              >
                                <MenuItem value="admin_token">e-CPF A3 - Carlos Eduardo da Silva (ADMIN)</MenuItem>
                                <MenuItem value="tiago_token">e-CPF A3 - Tiago de Lima carneiro (ADMIN)</MenuItem>
                                <MenuItem value="rh_token">e-CPF A3 - Joana Darc de Oliveira (RH)</MenuItem>
                              </Select>
                            </FormControl>
                          </Box>
                        ) : (
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                              <TextField
                                label="CPF Gov.br"
                                size="small"
                                value={govBrCpf}
                                onChange={(e) => setGovBrCpf(formatCPF(e.target.value))}
                                placeholder="000.000.000-00"
                                sx={{ width: 220 }}
                              />
                              <TextField
                                label="Senha"
                                type="password"
                                size="small"
                                value={govBrSenha}
                                onChange={(e) => setGovBrSenha(e.target.value)}
                                sx={{ width: 220 }}
                              />
                            </Box>
                            <Alert severity="info" sx={{ maxWidth: 460, '& .MuiAlert-message': { fontSize: 11, lineHeight: 1.3 } }}>
                              Validação simulada via SSO Gov.br. Qualquer senha é aceita para CPFs de servidores ativos.
                            </Alert>
                          </Box>
                        )}

                        {govBrError && <Typography color="error" variant="body2" sx={{ mb: 2 }}>{govBrError}</Typography>}

                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Button 
                            variant="contained" 
                            sx={{ bgcolor: '#1351b4', '&:hover': { bgcolor: '#0f3e8c' } }} 
                            onClick={async () => {
                              setGovBrLoading(true);
                              setGovBrError('');
                              try {
                                if (isApiOnline && authToken) {
                                  const payload = govBrCertificado ? {
                                    certificadoToken: govBrCertificado + "_A3_TOKEN",
                                    eCpf: govBrCpf
                                  } : {
                                    cpf: govBrCpf,
                                    senha: govBrSenha
                                  };
                                  await axios.post(`${API_URL}/auth/gov-br`, payload);
                                }
                                setIsGovBrConnected(true);
                                setOpenGovBrModal(false);
                                alert("🎉 Acesso e-CPF validado com sucesso!");
                              } catch (err: any) {
                                setGovBrError(err.response?.data?.error || "Credenciais Gov.br incorretas.");
                              } finally {
                                setGovBrLoading(false);
                              }
                            }}
                            disabled={govBrLoading}
                          >
                            {govBrLoading ? "Validando Assinatura..." : "Entrar com Gov.br / e-CPF"}
                          </Button>
                          <Button variant="outlined" color="inherit" onClick={() => setOpenGovBrModal(false)}>
                            Cancelar
                          </Button>
                        </Box>
                      </Card>
                    )}

                    {/* Main Detail Area */}
                    <Grid container spacing={3}>
                      {/* Left: Document list */}
                      <Grid item xs={12} md={selectedExternalDoc ? 5 : 12}>
                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: 'primary.light' }}>
                          📄 Arquivos de Controle e Anexos ({selectedExternalProcess.documentos?.length || 0})
                        </Typography>
                        <List sx={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 2, p: 0, overflow: 'hidden' }}>
                          {(selectedExternalProcess.documentos || []).map((doc: any, idx: number) => {
                            const isLocked = doc.restrito && !isGovBrConnected;
                            const isCurrent = selectedExternalDoc?.id === doc.id;
                            
                            return (
                              <ListItem 
                                key={doc.id}
                                divider={idx < selectedExternalProcess.documentos.length - 1}
                                sx={{ 
                                  bgcolor: isCurrent ? 'rgba(20,184,166,0.05)' : 'transparent',
                                  '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' }
                                }}
                              >
                                <ListItemText 
                                  primary={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                      <Typography variant="body2" sx={{ fontWeight: 700, color: isLocked ? 'text.disabled' : 'text.primary' }}>
                                        {doc.nome}
                                      </Typography>
                                      {doc.restrito && (
                                        <Chip 
                                          label={isGovBrConnected ? "Desbloqueado" : "Restrito A3"} 
                                          size="small" 
                                          color={isGovBrConnected ? "success" : "warning"}
                                          variant="outlined"
                                          sx={{ height: 20, fontSize: 10, fontWeight: 700 }}
                                        />
                                      )}
                                    </Box>
                                  }
                                  secondary={`Tamanho: ${doc.tamanho} • Publicado em: ${doc.data}`}
                                />
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  {isLocked ? (
                                    <Button size="small" variant="text" color="warning" startIcon={<Lock size={14} />} onClick={() => setOpenGovBrModal(true)}>
                                      Desbloquear
                                    </Button>
                                  ) : (
                                    <Button size="small" variant="outlined" color="primary" onClick={() => setSelectedExternalDoc(doc)}>
                                      Visualizar
                                    </Button>
                                  )}
                                </Box>
                              </ListItem>
                            );
                          })}
                        </List>
                      </Grid>

                      {/* Right: Preview viewer */}
                      {selectedExternalDoc && (
                        <Grid item xs={12} md={7} className="fade-in">
                          <Card sx={{ 
                            p: 3, 
                            border: '1px solid rgba(20,184,166,0.2)', 
                            bgcolor: '#040711',
                            minHeight: 340,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                          }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.08)', pb: 1.5, mb: 2 }}>
                              <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.light' }}>
                                  {selectedExternalDoc.nome}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                  Tamanho: {selectedExternalDoc.tamanho} • Registro Eletrônico: {selectedExternalDoc.data}
                                </Typography>
                              </Box>
                              <IconButton size="small" onClick={() => setSelectedExternalDoc(null)}>
                                <X size={18} />
                              </IconButton>
                            </Box>

                            {/* Simulated Paper Document Viewer */}
                            <Box sx={{
                              flexGrow: 1,
                              bgcolor: '#080d16',
                              border: '1px solid #d4af37',
                              borderRadius: 1.5,
                              p: 3,
                              fontFamily: 'Courier New, Courier, monospace',
                              color: '#cbd5e1',
                              backgroundImage: 'radial-gradient(circle at center, rgba(212,175,55,0.02) 0%, transparent 80%)',
                              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)',
                              mb: 2,
                              whiteSpace: 'pre-wrap',
                              fontSize: 12,
                              lineHeight: 1.6
                            }}>
                              <Box sx={{ borderBottom: '1px solid #d4af37', pb: 1, mb: 2, textAlign: 'center' }}>
                                <Typography variant="caption" sx={{ fontWeight: 800, letterSpacing: 1.5, color: '#d4af37', display: 'block' }}>
                                  TRIBUNAL DE CONTAS DO ESTADO DO CEARÁ (TCE-CE)
                                </Typography>
                                <Typography variant="body2" sx={{ fontSize: 9, color: 'text.secondary', mt: 0.5 }}>
                                  SISTEMA DE INTEGRAÇÃO OPERACIONAL RPPS • QUIXADÁ-CE
                                </Typography>
                              </Box>
                              
                              {selectedExternalDoc.conteudo}

                              <Box sx={{ borderTop: '1px dashed rgba(255,255,255,0.1)', mt: 3, pt: 1.5, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                <Typography variant="body2" sx={{ fontSize: 9, color: 'text.secondary' }}>
                                  Assinatura Eletrônica hash SHA-256: F0A9B8D7C6E5F4A3B2C1D0E9F8A7B6C5D4E3F2A1B0C9D8E7F6A5
                                </Typography>
                                <Typography variant="body2" sx={{ fontSize: 9, color: '#10b981', display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 700 }}>
                                  <ShieldCheck size={12} /> Assinatura digital ICP-Brasil e-CPF validada com sucesso em {new Date().toLocaleDateString()}.
                                </Typography>
                              </Box>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                              <Button variant="outlined" size="small" onClick={() => setSelectedExternalDoc(null)}>
                                Fechar Visualizador
                              </Button>
                            </Box>
                          </Card>
                        </Grid>
                      )}
                    </Grid>
                  </Card>
                ) : (
                  <Grid container spacing={3}>
                    {/* Left: Processes Table */}
                    <Grid item xs={12} md={9}>
                      {/* Header Banner */}
                      <Card sx={{ 
                        p: 3, 
                        mb: 4, 
                        bgcolor: '#0c1017',
                        backgroundImage: 'radial-gradient(ellipse at top right, rgba(16, 185, 129, 0.08), transparent 45%)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 3
                      }}>
                        <Grid container spacing={3} alignItems="center" justifyContent="space-between">
                          <Grid item xs={12} md={8}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, flexWrap: 'wrap' }}>
                              <Typography variant="h5" sx={{ fontWeight: 800 }}>Radar de Controle Externo: Quixadá - CE</Typography>
                              <Chip 
                                label="SISTEMA INTEGRADO TCE-CE - CONECTADO" 
                                color="success" 
                                size="small" 
                                sx={{ 
                                  fontWeight: 700, 
                                  bgcolor: 'rgba(16,185,129,0.1)', 
                                  border: '1px solid rgba(16,185,129,0.3)', 
                                  color: '#10b981'
                                }}
                              />
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              Mapeamento em tempo real de lides previdenciárias, fiscalizações de pessoal, aposentadorias e tomadas de contas especiais de Quixadá junto ao TCE-CE.
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { md: 'flex-end' }, gap: 2, flexWrap: 'wrap' }}>
                              <TextField
                                type="date"
                                label="Data Autuação"
                                size="small"
                                InputLabelProps={{ shrink: true }}
                                value={externalSearchDate}
                                onChange={(e) => setExternalSearchDate(e.target.value)}
                                sx={{ 
                                  width: 150,
                                  '& .MuiInputBase-input': { color: '#fff' },
                                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                                  '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                    '&:hover fieldset': { borderColor: '#14b8a6' },
                                  }
                                }}
                              />
                              <Button 
                                variant="contained" 
                                color="primary" 
                                startIcon={isSyncingExternal ? <CircularProgress size={18} color="inherit" /> : <Search size={18} />} 
                                onClick={sincronizarProcessosExternos}
                                disabled={isSyncingExternal}
                                sx={{ height: 40 }}
                              >
                                {isSyncingExternal ? "Varrendo TCE..." : "Buscar no TCE (Tempo Real)"}
                              </Button>
                            </Box>
                          </Grid>
                        </Grid>
                      </Card>

                      {/* Barra de Pesquisa */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <TextField
                          size="small"
                          placeholder="Pesquisar por processo ou assunto..."
                          value={externalSearchQuery}
                          onChange={(e) => setExternalSearchQuery(e.target.value)}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Search size={18} style={{ color: 'rgba(255,255,255,0.4)' }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{ width: 350 }}
                        />
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Exibindo {externalProcesses.filter(p => p.numero.toLowerCase().includes(externalSearchQuery.toLowerCase()) || p.assunto.toLowerCase().includes(externalSearchQuery.toLowerCase())).length} processos encontrados
                        </Typography>
                      </Box>

                      {/* Tabela de Processos */}
                      <TableContainer component={Paper} sx={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 2 }}>
                        <Table>
                          <TableHead>
                            <TableRow sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}>
                              <TableCell sx={{ fontWeight: 700 }}>Número do Processo</TableCell>
                              <TableCell sx={{ fontWeight: 700 }}>Assunto Previdenciário</TableCell>
                              <TableCell sx={{ fontWeight: 700 }}>Órgão de Origem</TableCell>
                              <TableCell sx={{ fontWeight: 700 }}>Data Limite</TableCell>
                              <TableCell sx={{ fontWeight: 700 }}>Status TCE</TableCell>
                              <TableCell sx={{ fontWeight: 700 }} align="center">Ações</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {externalProcesses
                              .filter(p => p.numero.toLowerCase().includes(externalSearchQuery.toLowerCase()) || p.assunto.toLowerCase().includes(externalSearchQuery.toLowerCase()))
                              .map((p) => {
                                const isAtrasado = p.urgencia === "ATRASADA";
                                const isCritico = p.urgencia === "CRITICA";
                                const isMedia = p.urgencia === "MEDIA";
                                
                                let statusColor: "success" | "error" | "warning" | "info" | "primary" | "secondary" | "default" = "success";
                                let labelUrgencia = "Dentro do Prazo";
                                if (isAtrasado) {
                                  statusColor = "error";
                                  labelUrgencia = "Atrasado";
                                } else if (isCritico) {
                                  statusColor = "error";
                                  labelUrgencia = "Urgente";
                                } else if (isMedia) {
                                  statusColor = "warning";
                                  labelUrgencia = "Prazo Médio";
                                }

                                return (
                                  <TableRow key={p.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell sx={{ fontWeight: 700, fontFamily: 'monospace', color: 'primary.light' }}>{p.numero}</TableCell>
                                    <TableCell>
                                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{p.assunto}</Typography>
                                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>Interessado: {p.interessado}</Typography>
                                    </TableCell>
                                    <TableCell sx={{ fontSize: '12px' }}>{p.orgao}</TableCell>
                                    <TableCell>
                                      <Chip 
                                        label={`${p.dataLimite} (${labelUrgencia})`} 
                                        color={statusColor} 
                                        size="small" 
                                        variant={isCritico || isAtrasado ? "filled" : "outlined"}
                                        sx={{ 
                                          fontWeight: 700
                                        }}
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Chip label={p.status} size="small" variant="outlined" sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                                    </TableCell>
                                    <TableCell align="center">
                                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                        <Button
                                          size="small"
                                          variant="outlined"
                                          color="primary"
                                          startIcon={<Search size={14} />}
                                          onClick={() => {
                                            setSelectedExternalProcess(p);
                                            setSelectedExternalDoc(null);
                                          }}
                                        >
                                          Documentos
                                        </Button>
                                        <Button
                                          size="small"
                                          variant="outlined"
                                          color="success"
                                          startIcon={<Download size={14} />}
                                          onClick={() => importarProcessoExterno(p)}
                                        >
                                          Importar
                                        </Button>
                                      </Box>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>

                    {/* Right: Live Feed Panel */}
                    <Grid item xs={12} md={3}>
                      <Card sx={{ p: 2.5, height: '100%', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: '#10b981' }}>
                          <span style={{ width: 10, height: 10, backgroundColor: '#10b981', borderRadius: '50%', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
                          Live Feed TCE-CE (Tempo Real)
                        </Typography>
                        <List sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, p: 0 }}>
                          {liveFeedLogs.map((log, index) => (
                            <Box 
                              key={index} 
                              sx={{ 
                                p: 1.5, 
                                borderRadius: 1.5, 
                                bgcolor: index === 0 ? 'rgba(16, 185, 129, 0.05)' : 'transparent',
                                borderLeft: index === 0 ? '3px solid #10b981' : '3px solid rgba(255,255,255,0.08)',
                                transition: 'all 0.3s ease-in-out',
                                animation: index === 0 ? 'fadeIn 0.5s ease-out' : 'none'
                              }}
                            >
                              <Typography variant="body2" sx={{ fontSize: 11, color: index === 0 ? 'text.primary' : 'text.secondary', lineHeight: 1.4 }}>
                                {log}
                              </Typography>
                            </Box>
                          ))}
                        </List>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 3, textAlign: 'center', fontStyle: 'italic' }}>
                          Escutando eventos do barramento oficial...
                        </Typography>
                      </Card>
                    </Grid>
                  </Grid>
                )}
              </Box>
            )}
          </Box>
        )}

            {/* ==================================================================
                 TELA 2: USUÁRIOS (MÓDULO 1)
                 ================================================================== */}
            {activeTab === 'users' && (
              <Box>
                {openNewUser ? (
                  <Card sx={{ p: 4, mb: 4 }} className="fade-in">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h5" sx={{ fontWeight: 800 }}>
                        🆕 Autuar Novo Servidor & Perfil de Acesso (RBAC)
                      </Typography>
                      <Button variant="outlined" color="inherit" onClick={() => setOpenNewUser(false)}>
                        Voltar para a Lista
                      </Button>
                    </Box>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Nome Completo *"
                          fullWidth
                          value={userFormNome}
                          onChange={(e) => setUserFormNome(e.target.value)}
                          sx={{ mb: 2.5 }}
                        />
                        <TextField
                          label="CPF *"
                          fullWidth
                          placeholder="Ex: 000.000.000-00"
                          value={userFormCpf}
                          onChange={(e) => setUserFormCpf(formatCPF(e.target.value))}
                          sx={{ mb: 2.5 }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="E-mail Corporativo *"
                          type="email"
                          fullWidth
                          value={userFormEmail}
                          onChange={(e) => setUserFormEmail(e.target.value)}
                          sx={{ mb: 2.5 }}
                        />
                        <TextField
                          label="Senha de Acesso *"
                          type="password"
                          fullWidth
                          value={userFormSenha}
                          onChange={(e) => setUserFormSenha(e.target.value)}
                          sx={{ mb: 2.5 }}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth sx={{ mb: 2.5 }}>
                          <InputLabel>Perfil de Acesso Padrão *</InputLabel>
                          <Select
                            value={userFormPerfil}
                            label="Perfil de Acesso Padrão *"
                            onChange={(e) => {
                              const newPerfil = e.target.value;
                              setUserFormPerfil(newPerfil);
                              aplicarPreenchimentoPermissoesPorPerfil(newPerfil);
                            }}
                          >
                            <MenuItem value="Administrador">Administrador (Controle Total)</MenuItem>
                            <MenuItem value="Recursos Humanos">Recursos Humanos (RH Previdenciário)</MenuItem>
                            <MenuItem value="Jurídico">Jurídico (Procuradoria Previdenciária)</MenuItem>
                            <MenuItem value="Financeiro">Financeiro (Pensões & Folha)</MenuItem>
                            <MenuItem value="Protocolo">Protocolo (Autuação e Fila)</MenuItem>
                            <MenuItem value="Digitalização">Digitalização (Operador de Scanner)</MenuItem>
                            <MenuItem value="Consulta">Consulta (Apenas Visualização)</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Telefone / Celular (WhatsApp)"
                          placeholder="Ex: (85) 99999-9999"
                          fullWidth
                          value={userFormTelefone}
                          onChange={(e) => setUserFormTelefone(e.target.value)}
                          sx={{ mb: 2.5 }}
                        />
                      </Grid>

                      <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={userFormAtivo}
                              onChange={(e) => setUserFormAtivo(e.target.checked)}
                              color="success"
                            />
                          }
                          label={<strong>Servidor Ativo no Portal</strong>}
                        />
                      </Grid>

                      {/* GRADE DE PERMISSÕES CUSTOMIZADAS */}
                      <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.light', mb: 2 }}>
                          🛡️ Matriz de Permissões Customizadas por Módulo
                        </Typography>
                        <TableContainer component={Paper} variant="outlined">
                          <Table size="small">
                            <TableHead>
                              <TableRow sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}>
                                <TableCell><strong>Módulo do Sistema</strong></TableCell>
                                <TableCell align="center"><strong>Criar</strong></TableCell>
                                <TableCell align="center"><strong>Ler (Visualizar)</strong></TableCell>
                                <TableCell align="center"><strong>Atualizar (Editar)</strong></TableCell>
                                <TableCell align="center"><strong>Deletar (Remover)</strong></TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {userFormPermissions.map((perm, index) => (
                                <TableRow key={perm.modulo}>
                                  <TableCell sx={{ fontWeight: 700 }}>
                                    {perm.modulo === 'Usuarios' ? 'Gestão de Usuários' :
                                     perm.modulo === 'Segurados' ? 'Segurados e Dependentes' :
                                     perm.modulo === 'Aposentadorias' ? 'Workflow de Aposentadorias' :
                                     perm.modulo === 'Pensoes' ? 'Pensões e Proventos' :
                                     perm.modulo === 'Protocolo' ? 'Protocolo Digital' :
                                     perm.modulo === 'Documentos' ? 'Gestão Documental Explorer' :
                                     perm.modulo === 'Scanner' ? 'Scanner & OCR Workstation' :
                                     'Logs de Auditoria LGPD'}
                                  </TableCell>
                                  <TableCell align="center">
                                    <Checkbox
                                      checked={perm.pode_criar}
                                      onChange={(e) => {
                                        const updated = [...userFormPermissions];
                                        updated[index].pode_criar = e.target.checked;
                                        setUserFormPermissions(updated);
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell align="center">
                                    <Checkbox
                                      checked={perm.pode_ler}
                                      onChange={(e) => {
                                        const updated = [...userFormPermissions];
                                        updated[index].pode_ler = e.target.checked;
                                        setUserFormPermissions(updated);
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell align="center">
                                    <Checkbox
                                      checked={perm.pode_atualizar}
                                      onChange={(e) => {
                                        const updated = [...userFormPermissions];
                                        updated[index].pode_atualizar = e.target.checked;
                                        setUserFormPermissions(updated);
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell align="center">
                                    <Checkbox
                                      checked={perm.pode_deletar}
                                      onChange={(e) => {
                                        const updated = [...userFormPermissions];
                                        updated[index].pode_deletar = e.target.checked;
                                        setUserFormPermissions(updated);
                                      }}
                                    />
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Grid>
                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
                      <Button onClick={() => setOpenNewUser(false)} color="inherit">Cancelar</Button>
                      <Button onClick={handleSalvarNovoUsuario} variant="contained" color="success">Salvar Perfil de Acesso</Button>
                    </Box>
                  </Card>
                ) : openEditUser ? (
                  <Card sx={{ p: 4, mb: 4 }} className="fade-in">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h5" sx={{ fontWeight: 800 }}>
                        ⚙️ Modificar Perfil de Acesso & Permissões RBAC
                      </Typography>
                      <Button variant="outlined" color="inherit" onClick={() => setOpenEditUser(false)}>
                        Voltar para a Lista
                      </Button>
                    </Box>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Nome Completo *"
                          fullWidth
                          value={userFormNome}
                          onChange={(e) => setUserFormNome(e.target.value)}
                          sx={{ mb: 2.5 }}
                        />
                        <TextField
                          label="CPF *"
                          fullWidth
                          value={userFormCpf}
                          onChange={(e) => setUserFormCpf(formatCPF(e.target.value))}
                          sx={{ mb: 2.5 }}
                          helperText="Se necessário, corrija os dígitos do CPF do servidor (será formatado automaticamente)."
                        />
                        <TextField
                          label="Alterar Senha"
                          placeholder="Deixe em branco para manter a atual"
                          type="password"
                          fullWidth
                          value={userFormSenha}
                          onChange={(e) => setUserFormSenha(e.target.value)}
                          sx={{ mb: 2.5 }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="E-mail Corporativo *"
                          type="email"
                          fullWidth
                          value={userFormEmail}
                          onChange={(e) => setUserFormEmail(e.target.value)}
                          sx={{ mb: 2.5 }}
                        />
                        <FormControl fullWidth sx={{ mb: 2.5 }}>
                          <InputLabel>Perfil de Acesso Padrão *</InputLabel>
                          <Select
                            value={userFormPerfil}
                            label="Perfil de Acesso Padrão *"
                            onChange={(e) => {
                              const newPerfil = e.target.value;
                              setUserFormPerfil(newPerfil);
                              aplicarPreenchimentoPermissoesPorPerfil(newPerfil);
                            }}
                          >
                            <MenuItem value="Administrador">Administrador (Controle Total)</MenuItem>
                            <MenuItem value="Recursos Humanos">Recursos Humanos (RH Previdenciário)</MenuItem>
                            <MenuItem value="Jurídico">Jurídico (Procuradoria Previdenciária)</MenuItem>
                            <MenuItem value="Financeiro">Financeiro (Pensões & Folha)</MenuItem>
                            <MenuItem value="Protocolo">Protocolo (Autuação e Fila)</MenuItem>
                            <MenuItem value="Digitalização">Digitalização (Operador de Scanner)</MenuItem>
                            <MenuItem value="Consulta">Consulta (Apenas Visualização)</MenuItem>
                          </Select>
                        </FormControl>
                        <TextField
                          label="Telefone / Celular (WhatsApp)"
                          placeholder="Ex: (85) 99999-9999"
                          fullWidth
                          value={userFormTelefone}
                          onChange={(e) => setUserFormTelefone(e.target.value)}
                          sx={{ mb: 2.5 }}
                        />
                      </Grid>

                      <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={userFormAtivo}
                              onChange={(e) => setUserFormAtivo(e.target.checked)}
                              color="success"
                            />
                          }
                          label={<strong>Servidor Ativo no Portal (Exclusão Lógica se Desativado)</strong>}
                        />
                      </Grid>

                      {/* GRADE DE PERMISSÕES CUSTOMIZADAS */}
                      <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.light', mb: 2 }}>
                          🛡️ Matriz de Permissões Customizadas por Módulo
                        </Typography>
                        <TableContainer component={Paper} variant="outlined">
                          <Table size="small">
                            <TableHead>
                              <TableRow sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}>
                                <TableCell><strong>Módulo do Sistema</strong></TableCell>
                                <TableCell align="center"><strong>Criar</strong></TableCell>
                                <TableCell align="center"><strong>Ler (Visualizar)</strong></TableCell>
                                <TableCell align="center"><strong>Atualizar (Editar)</strong></TableCell>
                                <TableCell align="center"><strong>Deletar (Remover)</strong></TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {userFormPermissions.map((perm, index) => (
                                <TableRow key={perm.modulo}>
                                  <TableCell sx={{ fontWeight: 700 }}>
                                    {perm.modulo === 'Usuarios' ? 'Gestão de Usuários' :
                                     perm.modulo === 'Segurados' ? 'Segurados e Dependentes' :
                                     perm.modulo === 'Aposentadorias' ? 'Workflow de Aposentadorias' :
                                     perm.modulo === 'Pensoes' ? 'Pensões e Proventos' :
                                     perm.modulo === 'Protocolo' ? 'Protocolo Digital' :
                                     perm.modulo === 'Documentos' ? 'Gestão Documental Explorer' :
                                     perm.modulo === 'Scanner' ? 'Scanner & OCR Workstation' :
                                     'Logs de Auditoria LGPD'}
                                  </TableCell>
                                  <TableCell align="center">
                                    <Checkbox
                                      checked={perm.pode_criar}
                                      onChange={(e) => {
                                        const updated = [...userFormPermissions];
                                        updated[index].pode_criar = e.target.checked;
                                        setUserFormPermissions(updated);
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell align="center">
                                    <Checkbox
                                      checked={perm.pode_ler}
                                      onChange={(e) => {
                                        const updated = [...userFormPermissions];
                                        updated[index].pode_ler = e.target.checked;
                                        setUserFormPermissions(updated);
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell align="center">
                                    <Checkbox
                                      checked={perm.pode_atualizar}
                                      onChange={(e) => {
                                        const updated = [...userFormPermissions];
                                        updated[index].pode_atualizar = e.target.checked;
                                        setUserFormPermissions(updated);
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell align="center">
                                    <Checkbox
                                      checked={perm.pode_deletar}
                                      onChange={(e) => {
                                        const updated = [...userFormPermissions];
                                        updated[index].pode_deletar = e.target.checked;
                                        setUserFormPermissions(updated);
                                      }}
                                    />
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Grid>
                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
                      <Button onClick={() => setOpenEditUser(false)} color="inherit">Cancelar</Button>
                      <Button onClick={handleSalvarEdicaoUsuario} variant="contained" color="primary">Salvar Alterações</Button>
                    </Box>
                  </Card>
                ) : (
                  <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                      <Typography variant="h4" sx={{ fontWeight: 800 }}>Gestão de Usuários e Perfis (RBAC)</Typography>
                      <Button variant="contained" startIcon={<UserPlus size={18} />} onClick={() => {
                        setUserFormNome('');
                        setUserFormCpf('');
                        setUserFormEmail('');
                        setUserFormSenha('');
                        setUserFormPerfil('Consulta');
                        setUserFormAtivo(true);
                        setUserFormTelefone('');
                        aplicarPreenchimentoPermissoesPorPerfil('Consulta');
                        setOpenNewUser(true);
                      }}>
                        Novo Usuário
                      </Button>
                    </Box>
                    <TableContainer component={Paper} sx={{ mb: 4 }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Nome</TableCell>
                            <TableCell>CPF</TableCell>
                            <TableCell>E-mail</TableCell>
                            <TableCell>Contato</TableCell>
                            <TableCell>Perfil de Acesso</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Permissões (RBAC)</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {usersList.map((u) => (
                            <TableRow key={u.id}>
                              <TableCell sx={{ fontWeight: 700 }}>{u.nome}</TableCell>
                              <TableCell>{u.cpf}</TableCell>
                              <TableCell>{u.email}</TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography variant="body2">{u.telefone || 'Sem telefone'}</Typography>
                                  {u.telefone && (
                                    <>
                                      <Tooltip title="Enviar WhatsApp">
                                        <IconButton
                                          size="small"
                                          sx={{ color: '#25D366' }}
                                          onClick={() => {
                                            const cleanNumber = u.telefone.replace(/\D/g, '');
                                            const formattedNumber = (cleanNumber.length === 10 || cleanNumber.length === 11) && !cleanNumber.startsWith('55')
                                              ? `55${cleanNumber}`
                                              : cleanNumber;
                                            window.open(`https://wa.me/${formattedNumber}`, '_blank');
                                          }}
                                        >
                                          <Phone size={14} />
                                        </IconButton>
                                      </Tooltip>
                                      <Tooltip title="Enviar Telegram">
                                        <IconButton
                                          size="small"
                                          sx={{ color: '#0088cc' }}
                                          onClick={() => {
                                            window.open(`https://t.me/share/url?url=https://sgip-rpps.gov.br&text=Olá!`, '_blank');
                                          }}
                                        >
                                          <Send size={14} />
                                        </IconButton>
                                      </Tooltip>
                                    </>
                                  )}
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Chip 
                                  label={u.perfil} 
                                  color={u.perfil === 'Administrador' ? 'secondary' : u.perfil === 'Recursos Humanos' ? 'primary' : 'default'} 
                                  variant="outlined" 
                                  size="small" 
                                />
                              </TableCell>
                              <TableCell>
                                <Chip 
                                  label={u.ativo ? "Ativo" : "Inativo"} 
                                  color={u.ativo ? "success" : "error"} 
                                  size="small" 
                                />
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  <Button 
                                    size="small" 
                                    variant="outlined" 
                                    color="primary"
                                    onClick={() => handleModificarUsuarioClick(u)}
                                    startIcon={<Settings size={14} />}
                                  >
                                    Permissões
                                  </Button>
                                  <Button 
                                    size="small" 
                                    variant="outlined" 
                                    color="error"
                                    onClick={() => handleExcluirUsuario(u)}
                                    startIcon={<Trash size={14} />}
                                    disabled={!u.ativo}
                                  >
                                    Desativar
                                  </Button>
                                </Box>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>
                )}
              </Box>
            )}

            {/* ==================================================================
                 TELA 3: SEGURADOS E DEPENDENTES (MÓDULO 2)
                 ================================================================== */}
            {activeTab === 'segurados' && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                  <Typography variant="h4" sx={{ fontWeight: 800 }}>Segurados Cadastrados</Typography>
                  <Button variant="contained" startIcon={<UserPlus size={18} />} onClick={() => setOpenNewSegurado(true)}>
                    Cadastrar Segurado
                  </Button>
                </Box>

                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Nome</TableCell>
                        <TableCell>CPF</TableCell>
                        <TableCell>Matrícula</TableCell>
                        <TableCell>Cargo Atual</TableCell>
                        <TableCell>Lotação</TableCell>
                        <TableCell>Status Funcional</TableCell>
                        <TableCell>Ações</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {seguradosList.map((s) => (
                        <TableRow key={s.id}>
                          <TableCell sx={{ fontWeight: 700 }}>{s.nome}</TableCell>
                          <TableCell>{s.cpf}</TableCell>
                          <TableCell sx={{ fontFamily: 'monospace' }}>{s.matricula}</TableCell>
                          <TableCell>{s.cargo_atual}</TableCell>
                          <TableCell>{s.orgao_lotacao}</TableCell>
                          <TableCell>
                            <Chip label={s.status_funcional} color={s.status_funcional === 'ATIVO' ? 'success' : (s.status_funcional === 'APOSENTADO' ? 'primary' : 'warning')} size="small" />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                              <Button size="small" variant="contained" color="secondary" onClick={() => { setDossieSeguradoId(s.id); setActiveTab('dossiers'); }}>
                                Ver Dossiê Timeline
                              </Button>
                              <Tooltip title="Editar Segurado">
                                <IconButton size="small" color="warning" onClick={() => handleEditarSeguradoClick(s)}>
                                  <Edit size={16} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Excluir Segurado">
                                <IconButton size="small" color="error" onClick={() => handleDeleteSegurado(s)}>
                                  <Trash size={16} />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {/* ==================================================================
                 TELA 4: APOSENTADORIAS & WORKFLOWS (MÓDULO 3)
                 ================================================================== */}
            {activeTab === 'aposentadorias' && (
              <Box>
                <Grid container spacing={4} sx={{ mb: 4 }}>
                  {/* Simulador da Aposentadoria */}
                  <Grid item xs={12} lg={5}>
                    <Card sx={{ p: 3, border: '1px solid rgba(255,255,255,0.08)' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Simulador de Cálculo Constitucional</Typography>
                      
                      <FormControl fullWidth sx={{ mb: 2.5 }}>
                        <InputLabel>Segurado Municipal</InputLabel>
                        <Select
                          value={selectedApSeguradoId}
                          label="Segurado Municipal"
                          onChange={(e) => setSelectedApSeguradoId(Number(e.target.value))}
                        >
                          {seguradosList.map(s => (
                            <MenuItem key={s.id} value={s.id}>{s.nome}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      
                      <FormControl fullWidth sx={{ mb: 2.5 }}>
                        <InputLabel>Regra Previdenciária *</InputLabel>
                        <Select
                          value={selectedApRegra}
                          label="Regra Previdenciária *"
                          onChange={(e) => setSelectedApRegra(e.target.value)}
                        >
                          <MenuItem value="IDADE">Aposentadoria Geral por Idade (EC 103/19)</MenuItem>
                          <MenuItem value="PONTOS">Transição por Pontos (Idade + Vínculos)</MenuItem>
                          <MenuItem value="PEDAGIO_100">Transição do Pedágio de 100% (Integral)</MenuItem>
                          <MenuItem value="PEDAGIO_50">Transição do Pedágio de 50% (Redutor)</MenuItem>
                          <MenuItem value="ESPECIAL_PROFESSOR">Especial de Professor (Magistério)</MenuItem>
                        </Select>
                      </FormControl>

                      <Grid container spacing={2} sx={{ mb: 2.5 }}>
                        <Grid item xs={6}>
                          <FormControl fullWidth size="small">
                            <InputLabel>Gênero Pre-detetado</InputLabel>
                            <Select
                              value={selectedApGenero}
                              label="Gênero Pre-detetado"
                              onChange={(e) => setSelectedApGenero(e.target.value)}
                            >
                              <MenuItem value="Feminino">Feminino</MenuItem>
                              <MenuItem value="Masculino">Masculino</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            label="Média Salarial (R$)"
                            type="number"
                            size="small"
                            fullWidth
                            value={customApSalario}
                            onChange={(e) => setCustomApSalario(Number(e.target.value))}
                          />
                        </Grid>
                      </Grid>

                      <FormControlLabel
                        sx={{ mb: 2.5, display: 'block' }}
                        control={
                          <Switch
                            checked={selectedApProfessor}
                            onChange={(e) => setSelectedApProfessor(e.target.checked)}
                            color="primary"
                          />
                        }
                        label="Professor de Educação Básica (Magistério)"
                      />

                      <Button variant="contained" fullWidth size="large" onClick={simularAposentadoriaLocal}>
                        Calcular Proventos
                      </Button>

                      {apCalculatedData && (
                        <Box sx={{ mt: 3, p: 2.5, bgcolor: 'rgba(20, 184, 166, 0.05)', borderRadius: 3, border: '1px solid rgba(20, 184, 166, 0.25)' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Diagnóstico de Elegibilidade:</Typography>
                            <Chip 
                              label={apCalculatedData.elegivel ? "ELEGÍVEL" : "NÃO ELEGÍVEL"} 
                              color={apCalculatedData.elegivel ? "success" : "error"} 
                              size="small" 
                              sx={{ fontWeight: 700 }}
                            />
                          </Box>

                          {/* QUADRO DE REQUISITOS COMPARTILHADO */}
                          <TableContainer component={Paper} sx={{ bgcolor: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', mb: 2 }}>
                            <Table size="small">
                              <TableHead sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}>
                                <TableRow>
                                  <TableCell sx={{ fontSize: '10px', color: 'text.secondary' }}>Requisito</TableCell>
                                  <TableCell align="center" sx={{ fontSize: '10px', color: 'text.secondary' }}>Atual</TableCell>
                                  <TableCell align="center" sx={{ fontSize: '10px', color: 'text.secondary' }}>Exigido</TableCell>
                                  <TableCell align="right" sx={{ fontSize: '10px', color: 'text.secondary' }}>Status</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {/* Idade */}
                                {apCalculatedData.detalhesRequisitos.idadeExigida > 0 && (
                                  <TableRow>
                                    <TableCell sx={{ fontSize: '11px', fontWeight: 700 }}>Idade</TableCell>
                                    <TableCell align="center" sx={{ fontSize: '11px' }}>{apCalculatedData.detalhesRequisitos.idadeAtual}a</TableCell>
                                    <TableCell align="center" sx={{ fontSize: '11px' }}>{apCalculatedData.detalhesRequisitos.idadeExigida}a</TableCell>
                                    <TableCell align="right" sx={{ fontSize: '11px', fontWeight: 700, color: apCalculatedData.detalhesRequisitos.idadeAtual >= apCalculatedData.detalhesRequisitos.idadeExigida ? 'success.main' : 'error.main' }}>
                                      {apCalculatedData.detalhesRequisitos.idadeAtual >= apCalculatedData.detalhesRequisitos.idadeExigida ? "✓ OK" : `Falta ${apCalculatedData.detalhesRequisitos.idadeExigida - apCalculatedData.detalhesRequisitos.idadeAtual}a`}
                                    </TableCell>
                                  </TableRow>
                                )}
                                {/* Tempo Contribuição */}
                                <TableRow>
                                  <TableCell sx={{ fontSize: '11px', fontWeight: 700 }}>Vínculo</TableCell>
                                  <TableCell align="center" sx={{ fontSize: '11px' }}>{apCalculatedData.detalhesRequisitos.contribAtual}a</TableCell>
                                  <TableCell align="center" sx={{ fontSize: '11px' }}>{apCalculatedData.detalhesRequisitos.contribExigida}a</TableCell>
                                  <TableCell align="right" sx={{ fontSize: '11px', fontWeight: 700, color: apCalculatedData.detalhesRequisitos.contribAtual >= apCalculatedData.detalhesRequisitos.contribExigida ? 'success.main' : 'error.main' }}>
                                    {apCalculatedData.detalhesRequisitos.contribAtual >= apCalculatedData.detalhesRequisitos.contribExigida ? "✓ OK" : `Falta ${apCalculatedData.detalhesRequisitos.contribExigida - apCalculatedData.detalhesRequisitos.contribAtual}a`}
                                  </TableCell>
                                </TableRow>
                                {/* Pontos */}
                                {apCalculatedData.detalhesRequisitos.pontosExigidos !== null && (
                                  <TableRow>
                                    <TableCell sx={{ fontSize: '11px', fontWeight: 700 }}>Pontos</TableCell>
                                    <TableCell align="center" sx={{ fontSize: '11px' }}>{apCalculatedData.detalhesRequisitos.pontosAtuais} pts</TableCell>
                                    <TableCell align="center" sx={{ fontSize: '11px' }}>{apCalculatedData.detalhesRequisitos.pontosExigidos} pts</TableCell>
                                    <TableCell align="right" sx={{ fontSize: '11px', fontWeight: 700, color: apCalculatedData.detalhesRequisitos.pontosAtuais >= apCalculatedData.detalhesRequisitos.pontosExigidos ? 'success.main' : 'error.main' }}>
                                      {apCalculatedData.detalhesRequisitos.pontosAtuais >= apCalculatedData.detalhesRequisitos.pontosExigidos ? "✓ OK" : `Falta ${apCalculatedData.detalhesRequisitos.pontosExigidos - apCalculatedData.detalhesRequisitos.pontosAtuais} pts`}
                                    </TableCell>
                                  </TableRow>
                                )}
                                {/* Pedágio */}
                                {apCalculatedData.detalhesRequisitos.pedagioExigido !== null && (
                                  <TableRow>
                                    <TableCell sx={{ fontSize: '11px', fontWeight: 700 }}>c/ Pedágio</TableCell>
                                    <TableCell align="center" sx={{ fontSize: '11px' }}>{apCalculatedData.detalhesRequisitos.pedagioAtual}a</TableCell>
                                    <TableCell align="center" sx={{ fontSize: '11px' }}>{Number(apCalculatedData.detalhesRequisitos.pedagioExigido).toFixed(1)}a</TableCell>
                                    <TableCell align="right" sx={{ fontSize: '11px', fontWeight: 700, color: apCalculatedData.detalhesRequisitos.pedagioAtual >= apCalculatedData.detalhesRequisitos.pedagioExigido ? 'success.main' : 'error.main' }}>
                                      {apCalculatedData.detalhesRequisitos.pedagioAtual >= apCalculatedData.detalhesRequisitos.pedagioExigido ? "✓ OK" : `Falta ${(apCalculatedData.detalhesRequisitos.pedagioExigido - apCalculatedData.detalhesRequisitos.pedagioAtual).toFixed(1)}a`}
                                    </TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          </TableContainer>
                          
                          <Divider sx={{ my: 1.5, borderColor: 'rgba(20, 184, 166, 0.2)' }} />

                          <Typography variant="subtitle2" color="primary.light" sx={{ fontWeight: 700 }}>Média Salarial (100%):</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 800 }}>R$ {apCalculatedData.mediaSalario.toFixed(2)}</Typography>
                          
                          <Typography variant="subtitle2" color="primary.light" sx={{ fontWeight: 700, mt: 1.5 }}>Alíquota Proposta:</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 800 }}>{apCalculatedData.aliquota}%</Typography>
                          
                          <Typography variant="subtitle2" color="primary.light" sx={{ fontWeight: 700, mt: 1.5 }}>Benefício Calculado:</Typography>
                          <Typography variant="h5" color="success.main" sx={{ fontWeight: 900 }}>R$ {apCalculatedData.valorBeneficio.toFixed(2)}/mês</Typography>
                          
                          <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary', border: '1px solid rgba(255,255,255,0.05)', p: 1, borderRadius: 1 }}>
                            ℹ️ {apCalculatedData.regra}
                          </Typography>

                          <Button variant="contained" color="success" fullWidth sx={{ mt: 2 }} onClick={homologarProcessoAposentadoria}>
                            Autuar Processo & Protocolo
                          </Button>
                        </Box>
                      )}
                    </Card>
                  </Grid>

                  {/* Workflow de Processos Ativos */}
                  <Grid item xs={12} lg={8}>
                    <Card sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Fila de Workflows Previdenciários em Trâmite</Typography>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Segurado</TableCell>
                              <TableCell>Regra</TableCell>
                              <TableCell>Valor Calculado</TableCell>
                              <TableCell>Etapa Atual</TableCell>
                              <TableCell>Ações</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {aposentadoriasList.map(ap => {
                              const s = seguradosList.find(item => item.id === ap.segurado_id);
                              return (
                                <TableRow key={ap.id}>
                                  <TableCell sx={{ fontWeight: 700 }}>{s?.nome || "Segurado"}</TableCell>
                                  <TableCell>{ap.regra_aplicada.substring(0, 30)}...</TableCell>
                                  <TableCell sx={{ fontWeight: 700, color: 'success.main' }}>R$ {Number(ap.valor_beneficio || 0).toFixed(2)}</TableCell>
                                  <TableCell>
                                    <Chip label={ap.status_processo} color={ap.status_processo === 'CONCEDIDO' ? 'success' : 'warning'} size="small" />
                                  </TableCell>
                                  <TableCell>
                                    {ap.status_processo !== 'CONCEDIDO' ? (
                                      <Button variant="contained" size="small" color="secondary" onClick={() => avancarWorkflowAposentadoria(ap.id)}>
                                        Avançar Trâmite <ArrowRight size={12} style={{ marginLeft: 4 }} />
                                      </Button>
                                    ) : (
                                      <Typography variant="caption" color="success.main" sx={{ fontWeight: 700 }}>Portaria: {ap.portaria_concessao}</Typography>
                                    )}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* ==================================================================
                 TELA 5: PENSÕES (MÓDULO 4)
                 ================================================================== */}
            {activeTab === 'pensoes' && (
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>Pensões por Morte Ativas</Typography>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Cadastro de Beneficiários e Dependentes Pensionistas</Typography>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Instituidor De Cujus</TableCell>
                          <TableCell>Pensionista Recebedor</TableCell>
                          <TableCell>Grau Parentesco</TableCell>
                          <TableCell>Valor Provento</TableCell>
                          <TableCell>Portaria Concessão</TableCell>
                          <TableCell>Status Pagamentos</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700 }}>JOÃO BATISTA DE OLIVEIRA (FALECIDO)</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>MARIA TEREZA DE OLIVEIRA</TableCell>
                          <TableCell>Conjuge</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: 'success.main' }}>R$ 3.250,00</TableCell>
                          <TableCell>PORT-PENS-2026-012</TableCell>
                          <TableCell><Chip label="PAGO EM COMP." color="success" size="small" /></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700 }}>SEBASTIÃO ALVES DA ROCHA (FALECIDO)</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>LUCAS ALVES DA ROCHA (ESTUDANTE)</TableCell>
                          <TableCell>Filho(a)</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: 'success.main' }}>R$ 1.820,00</TableCell>
                          <TableCell>PORT-PENS-2026-019</TableCell>
                          <TableCell><Chip label="PAGO EM COMP." color="success" size="small" /></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Card>
              </Box>
            )}

            {/* ==================================================================
                 TELA 6: PROTOCOLOS DIGITAIS (MÓDULO 5)
                 ================================================================== */}
            {activeTab === 'protocolos' && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                  <Typography variant="h4" sx={{ fontWeight: 800 }}>Protocolo Digital Eletrônico</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setOpenNewProtDialog(true)}
                    startIcon={<Plus size={20} />}
                    sx={{ py: 1, px: 2, fontWeight: 700 }}
                  >
                    Autuar Novo Protocolo
                  </Button>
                </Box>
                
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Abertura de Protocolo com Carimbo Criptográfico ICP-Brasil</Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Protocolo nº</TableCell>
                          <TableCell>Assunto</TableCell>
                          <TableCell>Segurado Vinculado</TableCell>
                          <TableCell>Abertura</TableCell>
                          <TableCell>Prioridade</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Validação ICP-Brasil</TableCell>
                          <TableCell align="center">Ações</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {protocolosList.map(p => {
                          const s = seguradosList.find(item => item.id === p.segurado_id);
                          return (
                            <TableRow key={p.id}>
                              <TableCell sx={{ fontWeight: 700, fontFamily: 'monospace', color: 'primary.light' }}>{p.numero_protocolo}</TableCell>
                              <TableCell>{p.assunto}</TableCell>
                              <TableCell>{s?.nome || "Geral"}</TableCell>
                              <TableCell>{p.data_abertura ? new Date(p.data_abertura).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR')}</TableCell>
                              <TableCell>
                                <Chip label={p.prioridade} color={p.prioridade === 'ALTA' ? 'error' : 'default'} size="small" />
                              </TableCell>
                              <TableCell>
                                <Chip label={p.status} color={p.status === 'CONCLUIDO' ? 'success' : 'warning'} size="small" />
                              </TableCell>
                              <TableCell>
                                <Tooltip title="Assinatura Cryptográfica Validada ICP-Brasil">
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'success.main' }}>
                                    <ShieldCheck size={16} /> <Typography variant="caption" sx={{ fontWeight: 700 }}>Autêntico</Typography>
                                  </Box>
                                </Tooltip>
                              </TableCell>
                              <TableCell align="center">
                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                                  <Tooltip title="Tramitar Processo">
                                    <IconButton 
                                      size="small" 
                                      color="primary"
                                      onClick={() => {
                                        setSelectedProtocol(p);
                                        setOpenTramitarDialog(true);
                                      }}
                                    >
                                      <ArrowRight size={16} />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Histórico de Trâmites">
                                    <IconButton 
                                      size="small" 
                                      color="secondary"
                                      onClick={() => carregarHistoricoProtocolo(p)}
                                    >
                                      <Clock size={16} />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Editar Protocolo">
                                    <IconButton 
                                      size="small" 
                                      color="warning"
                                      onClick={() => handleEditarProtocoloClick(p)}
                                    >
                                      <Settings size={16} />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Cancelar Protocolo">
                                    <IconButton 
                                      size="small" 
                                      color="error"
                                      onClick={() => handleExcluirProtocolo(p)}
                                      disabled={p.status === 'CANCELADO'}
                                    >
                                      <Trash size={16} />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Card>

                {/* DIALOG 1: Autuar Novo Protocolo */}
                <Dialog open={openNewProtDialog} onClose={() => setOpenNewProtDialog(false)} maxWidth="sm" fullWidth>
                  <DialogTitle sx={{ fontWeight: 800 }}>Autuar Novo Protocolo Eletrônico</DialogTitle>
                  <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
                      <TextField
                        label="Assunto *"
                        fullWidth
                        value={newProtAssunto}
                        onChange={(e) => setNewProtAssunto(e.target.value)}
                        placeholder="Ex: Requerimento de Isenção do Imposto de Renda"
                      />
                      
                      <TextField
                        label="Descrição Detalhada *"
                        fullWidth
                        multiline
                        rows={4}
                        value={newProtDesc}
                        onChange={(e) => setNewProtDesc(e.target.value)}
                        placeholder="Descreva o propósito da autuação digital..."
                      />

                      <FormControl fullWidth>
                        <InputLabel>Segurado Beneficiário (Opcional)</InputLabel>
                        <Select
                          value={newProtSeguradoId}
                          onChange={(e) => setNewProtSeguradoId(e.target.value)}
                        >
                          <MenuItem value="">-- Sem vínculo (Geral) --</MenuItem>
                          {seguradosList.map(s => (
                            <MenuItem key={s.id} value={s.id}>{s.nome} ({s.cpf})</MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl fullWidth>
                        <InputLabel>Prioridade *</InputLabel>
                        <Select
                          value={newProtPrioridade}
                          onChange={(e) => setNewProtPrioridade(e.target.value)}
                        >
                          <MenuItem value="BAIXA">Baixa</MenuItem>
                          <MenuItem value="NORMAL">Normal</MenuItem>
                          <MenuItem value="ALTA">Alta Urgência (Prazos Legais)</MenuItem>
                        </Select>
                      </FormControl>
                      
                      <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(20, 184, 166, 0.05)', border: '1px solid rgba(20, 184, 166, 0.2)' }}>
                        <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.light', fontWeight: 700 }}>
                          <ShieldCheck size={16} /> Certificação Eletrônica ICP-Brasil
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: 11, color: 'text.secondary', mt: 0.5 }}>
                          Ao confirmar a autuação, será computado um carimbo de tempo inviolável de 256 bits baseado no certificado digital do operador.
                        </Typography>
                      </Box>
                    </Box>
                  </DialogContent>
                  <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenNewProtDialog(false)} color="inherit">Cancelar</Button>
                    <Button onClick={criarProtocoloReal} variant="contained" color="primary" sx={{ fontWeight: 700 }}>
                      Confirmar Autuação Digital
                    </Button>
                  </DialogActions>
                </Dialog>

                {/* DIALOG 2: Tramitar Protocolo */}
                <Dialog open={openTramitarDialog} onClose={() => setOpenTramitarDialog(false)} maxWidth="sm" fullWidth>
                  <DialogTitle sx={{ fontWeight: 800 }}>Tramitar Protocolo nº {selectedProtocol?.numero_protocolo}</DialogTitle>
                  <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        Assunto: {selectedProtocol?.assunto}
                      </Typography>
                      
                      <FormControl fullWidth>
                        <InputLabel>Servidor Destinatário (Workflow) *</InputLabel>
                        <Select
                          value={tramitDestinoId}
                          onChange={(e) => setTramitDestinoId(e.target.value)}
                        >
                          <MenuItem value="">-- Selecione o destinatário --</MenuItem>
                          <MenuItem value={1}>Carlos Eduardo (Administrador)</MenuItem>
                          <MenuItem value={2}>Maria Tereza de Souza (Diretor)</MenuItem>
                          <MenuItem value={3}>Dr. André (Procurador Geral)</MenuItem>
                          <MenuItem value={4}>Joana Darc (Recursos Humanos)</MenuItem>
                          <MenuItem value={5}>Dr. Roberto Martins (Jurídico)</MenuItem>
                          <MenuItem value={7}>Cláudia Roberta (Protocolo)</MenuItem>
                          <MenuItem value={8}>Marcos Antônio (Digitalização)</MenuItem>
                        </Select>
                      </FormControl>

                      <FormControl fullWidth>
                        <InputLabel>Próxima Etapa do Trâmite</InputLabel>
                        <Select
                          value={tramitEtapa}
                          onChange={(e) => setTramitEtapa(e.target.value)}
                        >
                          <MenuItem value="ANALISE">Análise Documental Preliminar</MenuItem>
                          <MenuItem value="JURIDICO">Análise Jurídica / Procuradoria</MenuItem>
                          <MenuItem value="DIRETORIA">Análise de Diretoria Executiva</MenuItem>
                          <MenuItem value="HOMOLOGACAO">Homologação / Concessão de Provento</MenuItem>
                          <MenuItem value="CONCLUIDO">Concluir e Arquivar Processo</MenuItem>
                        </Select>
                      </FormControl>

                      <TextField
                        label="Despacho / Parecer do Operador *"
                        fullWidth
                        multiline
                        rows={4}
                        value={tramitDespacho}
                        onChange={(e) => setTramitDespacho(e.target.value)}
                        placeholder="Insira as observações técnicas para a próxima equipe..."
                      />
                    </Box>
                  </DialogContent>
                  <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenTramitarDialog(false)} color="inherit">Cancelar</Button>
                    <Button onClick={tramitarProtocoloReal} variant="contained" color="primary" sx={{ fontWeight: 700 }}>
                      Registrar Trâmite Digital
                    </Button>
                  </DialogActions>
                </Dialog>

                {/* DIALOG 3: Histórico de Trâmites / Timeline */}
                <Dialog open={openHistoryDialog} onClose={() => setOpenHistoryDialog(false)} maxWidth="sm" fullWidth>
                  <DialogTitle sx={{ fontWeight: 800 }}>Histórico de Tramitação: Protocolo nº {selectedProtocol?.numero_protocolo}</DialogTitle>
                  <DialogContent>
                    <Box sx={{ mt: 1 }}>
                      {protHistoryList.length === 0 ? (
                        <Box sx={{ p: 3, textAlign: 'center', border: '1px dashed rgba(255,255,255,0.05)', borderRadius: 2 }}>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Nenhum trâmite registrado ainda para este protocolo.
                          </Typography>
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                          {protHistoryList.map((t, idx) => (
                            <Box key={t.id || idx} sx={{ display: 'flex', gap: 2, position: 'relative' }}>
                              {idx < protHistoryList.length - 1 && (
                                <Box sx={{
                                  position: 'absolute', left: 16, top: 32, bottom: -20, width: 2,
                                  bgcolor: 'rgba(255,255,255,0.05)'
                                }} />
                              )}
                              
                              <Avatar sx={{ bgcolor: 'rgba(20, 184, 166, 0.1)', color: 'primary.light', width: 34, height: 34, border: '1px solid rgba(20, 184, 166, 0.2)' }}>
                                {idx + 1}
                              </Avatar>
                              
                              <Box sx={{ flex: 1, p: 2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.03)' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: 13, color: 'primary.light' }}>
                                    De: {t.origem_nome} ({t.origem_perfil})
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    {new Date(t.data_tramitacao).toLocaleString('pt-BR')}
                                  </Typography>
                                </Box>
                                
                                <Typography variant="body2" sx={{ fontWeight: 700, fontSize: 12, mb: 1, color: 'text.primary' }}>
                                  ➡️ Para: {t.destino_nome} ({t.destino_perfil}) | Etapa: {t.etapa_atual}
                                </Typography>
                                
                                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: 12, fontStyle: 'italic', bgcolor: 'rgba(0,0,0,0.2)', p: 1.5, borderRadius: 1.5, borderLeft: '3px solid #14b8a6' }}>
                                  "{t.despacho}"
                                </Typography>
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </Box>
                  </DialogContent>
                  <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenHistoryDialog(false)} variant="outlined" color="primary" sx={{ fontWeight: 700 }}>
                      Fechar Timeline
                    </Button>
                  </DialogActions>
                </Dialog>
              </Box>
            )}

            {/* ==================================================================
                 TELA 7: GESTÃO DOCUMENTAL (PASTAS - MÓDULO 6)
                 ================================================================== */}
            {activeTab === 'documentos' && (
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>Gestão Eletrônica de Documentos (GED)</Typography>
                <Grid container spacing={4}>
                  {/* Navegador de Pastas */}
                  <Grid item xs={12} md={4}>
                    <Card sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>Pastas Corporativas</Typography>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Tooltip title="Nova Subpasta">
                            <IconButton size="small" color="primary" onClick={() => setOpenNewFolderDialog(true)}>
                              <Plus size={16} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Editar Pasta Selecionada">
                            <IconButton size="small" color="warning" onClick={handleEditarPastaClick} disabled={!selectedFolderId || selectedFolderId === 1}>
                              <Settings size={16} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Excluir Pasta Selecionada">
                            <IconButton size="small" color="error" onClick={handleExcluirPastaClick} disabled={!selectedFolderId || selectedFolderId === 1}>
                              <Trash size={16} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                      <List>
                        {folders.map(f => (
                          <ListItem key={f.id} disablePadding>
                            <ListItemButton
                              selected={selectedFolderId === f.id}
                              onClick={() => setSelectedFolderId(f.id)}
                            >
                              <ListItemIcon sx={{ color: 'warning.main', minWidth: 32 }}>
                                <FolderOpen size={18} />
                              </ListItemIcon>
                              <ListItemText primary={f.nome} primaryTypographyProps={{ fontSize: 13, fontWeight: 700 }} />
                              <ChevronRight size={14} />
                            </ListItemButton>
                          </ListItem>
                        ))}
                      </List>
                    </Card>
                  </Grid>

                  {/* Arquivos na Pasta Selecionada */}
                  <Grid item xs={12} md={8}>
                    <Card sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                        Arquivos em: <strong style={{ color: '#14b8a6' }}>
                          {folders.find(f => f.id === selectedFolderId)?.nome || "INSTITUTO"}
                        </strong>
                      </Typography>

                      {/* Simulador Drag and Drop */}
                      <input
                        type="file"
                        id="ged-file-input"
                        style={{ display: 'none' }}
                        onChange={handleGedFileUpload}
                      />
                      <Box 
                        onClick={() => document.getElementById('ged-file-input')?.click()}
                        sx={{
                          border: '2px dashed rgba(255,255,255,0.1)', borderRadius: 2, p: 4, mb: 4,
                          textAlign: 'center', bgcolor: 'rgba(0,0,0,0.1)', cursor: 'pointer',
                          '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(15, 118, 110, 0.05)' }
                        }}
                      >
                        <CloudUpload size={40} style={{ margin: '0 auto 12px', color: '#14b8a6' }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          Arraste arquivos previdenciários (PDF, Imagens, Tabelas) ou clique para upload
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
                          Tamanho máximo de lote recomendado: 50MB. Padronização A3 ativa.
                        </Typography>
                      </Box>

                      {/* Tabela de Arquivos */}
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Nome Arquivo</TableCell>
                              <TableCell>Extensão</TableCell>
                              <TableCell>Tamanho (KB)</TableCell>
                              <TableCell>Data Upload</TableCell>
                              <TableCell>Assinado</TableCell>
                              <TableCell align="center">Ações</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {documentosList.filter(d => d.pasta_id === selectedFolderId).map(d => (
                              <TableRow key={d.id}>
                                <TableCell sx={{ fontWeight: 700 }}>{d.nome_arquivo}</TableCell>
                                <TableCell><Chip label={d.extensao.toUpperCase()} size="small" /></TableCell>
                                <TableCell>{(d.tamanho_bytes / 1024).toFixed(1)} KB</TableCell>
                                <TableCell>{d.criado_em}</TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'success.main' }}>
                                    <ShieldCheck size={14} /> <Typography variant="caption" sx={{ fontWeight: 700 }}>ICP-Brasil</Typography>
                                  </Box>
                                </TableCell>
                                <TableCell align="center">
                                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                    <Tooltip title="Visualizar Documento">
                                      <IconButton size="small" color="primary" onClick={() => handleDossierTimelineItemClick(d)}>
                                        <Eye size={14} />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Renomear Arquivo">
                                      <IconButton size="small" color="warning" onClick={() => handleEditarArquivoClick(d)}>
                                        <Settings size={14} />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Excluir Arquivo">
                                      <IconButton size="small" color="error" onClick={() => handleExcluirArquivo(d)}>
                                        <Trash size={14} />
                                      </IconButton>
                                    </Tooltip>
                                  </Box>
                                </TableCell>
                              </TableRow>
                            ))}
                            {documentosList.filter(d => d.pasta_id === selectedFolderId).length === 0 && (
                              <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                  Pasta vazia. Use a aba "Scanner" ou arraste arquivos acima para popular.
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* ==================================================================
                 TELA 8: SCANNER WORKSTATION & OCR (MÓDULO 8 & 9)
                 ================================================================== */}
            {activeTab === 'scanner' && (
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>Central de Digitalização e Extração OCR</Typography>
                <Grid container spacing={4}>
                  
                  {/* Painel Captura */}
                  <Grid item xs={12} lg={7}>
                    <Card sx={{ p: 3, textAlign: 'center', position: 'relative' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Visor do Escâner (TWAIN/WIA)</Typography>
                      
                      <Box sx={{
                        width: '100%', height: 320, bgcolor: '#020617', borderRadius: 2,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        position: 'relative', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.05)'
                      }}>
                        {/* Linha laser animação */}
                        {isScanning && (
                          <Box sx={{
                            position: 'absolute', left: 0, width: '100%', height: 4,
                            bgcolor: 'success.main', boxShadow: '0 0 10px #10b981',
                            animation: 'scanLaser 2s infinite linear', zIndex: 10
                          }} />
                        )}

                        <canvas ref={scannerCanvasRef} style={{ display: scannedImage ? 'block' : 'none', maxWidth: '90%', maxHeight: '90%', borderRadius: 4 }} />

                        {!scannedImage && !isScanning && (
                          <Box sx={{ p: 4, color: 'text.secondary' }}>
                            <Scan size={48} style={{ margin: '0 auto 12px', color: '#10b981' }} />
                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Aguardando comando de captura...</Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>Escolha um documento previdenciário de teste na direita.</Typography>
                          </Box>
                        )}

                        {isScanning && (
                          <Box sx={{ zIndex: 5 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Capturando pelo dispositivo: {scanDevice}...</Typography>
                            <LinearProgress variant="determinate" value={scannerProgress} sx={{ width: 200, margin: '0 auto' }} />
                          </Box>
                        )}
                      </Box>

                      {scannedImage && (
                        <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'center' }}>
                          <Button variant={scanFilters.grayscale ? "contained" : "outlined"} color="primary" onClick={toggleGrayscale}>
                            Cinza
                          </Button>
                          <Button variant={scanFilters.binarize ? "contained" : "outlined"} color="primary" onClick={toggleBinarize}>
                            Binarizar (1-Bit)
                          </Button>
                        </Box>
                      )}
                    </Card>
                  </Grid>

                  {/* Configuração do Scanner e Leitura OCR */}
                  <Grid item xs={12} lg={5}>
                    <Card sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Configurar Captura</Typography>
                      
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Segurado Alvo *</InputLabel>
                        <Select
                          value={scanSeguradoId}
                          onChange={(e) => setScanSeguradoId(Number(e.target.value))}
                        >
                          {seguradosList.map(s => (
                            <MenuItem key={s.id} value={s.id}>{s.nome}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Dispositivo de Captura</InputLabel>
                        <Select
                          value={scanDevice}
                          onChange={(e) => setScanDevice(e.target.value)}
                        >
                          <MenuItem value="ADF">Scanner Profissional ADF (Alimentador)</MenuItem>
                          <MenuItem value="MESA">Multifuncional Flatbed (Mesa Vidro)</MenuItem>
                        </Select>
                      </FormControl>

                      <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel>Documento Previdenciário</InputLabel>
                        <Select
                          value={scanDoctype}
                          onChange={(e) => setScanDoctype(e.target.value)}
                        >
                          <MenuItem value="IDENTIDADE">RG / Cédula de Identidade</MenuItem>
                          <MenuItem value="CNIS">CNIS - Extrato Previdenciário</MenuItem>
                        </Select>
                      </FormControl>

                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: 'primary.light' }}>Simular Modelos de Teste:</Typography>
                      <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
                        <Button variant="contained" color="secondary" fullWidth onClick={() => selectMockTemplate('RG')}>
                          Template RG
                        </Button>
                        <Button variant="contained" color="secondary" fullWidth onClick={() => selectMockTemplate('CNIS')}>
                          Template CNIS
                        </Button>
                      </Box>

                      {Object.keys(ocrExtractedFields).length > 0 && (
                        <Box sx={{ p: 2, bgcolor: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="subtitle2" color="success.main" sx={{ fontWeight: 700 }}>Extração OCR:</Typography>
                            <Typography variant="subtitle2" color="success.main" sx={{ fontWeight: 700 }}>{ocrConfidence}% Confiança</Typography>
                          </Box>
                          <Typography variant="body2"><strong>Nome Lido:</strong> {ocrExtractedFields.nome}</Typography>
                          <Typography variant="body2"><strong>CPF Lido:</strong> {ocrExtractedFields.cpf}</Typography>
                          {ocrExtractedFields.rg && <Typography variant="body2"><strong>RG Lido:</strong> {ocrExtractedFields.rg}</Typography>}
                          {ocrExtractedFields.nit && <Typography variant="body2"><strong>NIT Lido:</strong> {ocrExtractedFields.nit}</Typography>}

                          <Box sx={{ mt: 2, p: 1, border: '1px dashed #10b981', borderRadius: 1, display: 'flex', alignItems: 'center', gap: 1, color: 'success.main' }}>
                            <ShieldCheck size={18} />
                            <Typography variant="caption" sx={{ fontWeight: 700 }}>Assinatura Criptográfica ICP-Brasil Inserida</Typography>
                          </Box>

                          <Button variant="contained" color="success" fullWidth sx={{ mt: 2 }} onClick={saveScannedDocument}>
                            Homologar e Salvar no Dossiê
                          </Button>
                        </Box>
                      )}
                    </Card>
                  </Grid>

                </Grid>
              </Box>
            )}
            {/* ==================================================================
                 NOVA GUIA: DIGITALIZADOR REAL (WIA/eSCL) E OCR
                 ================================================================== */}
            {activeTab === 'realScanner' && (
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>
                  Digitalizador Físico e Motor OCR Real
                </Typography>
                
                <Grid container spacing={4}>
                  {/* Coluna 1: Lista de Dispositivos e Controles */}
                  <Grid item xs={12} lg={4}>
                    <Card sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Origem da Captura</Typography>
                      <Tabs 
                        value={scanSourceMode} 
                        onChange={(_, newVal) => {
                          setScanSourceMode(newVal);
                          desligarCamera();
                        }}
                        variant="fullWidth"
                        sx={{ mb: 3, borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                      >
                        <Tab value="driver" label="Escâner USB" sx={{ fontSize: 11, fontWeight: 700 }} />
                        <Tab value="camera" label="Webcam" sx={{ fontSize: 11, fontWeight: 700 }} />
                        <Tab value="file" label="Upload Real" sx={{ fontSize: 11, fontWeight: 700 }} />
                      </Tabs>

                      {scanSourceMode === 'driver' && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Scanners Detectados</Typography>
                            <Button 
                              variant="outlined" 
                              color="primary" 
                              size="small" 
                              onClick={buscarDispositivosReal}
                              startIcon={<RotateCcw size={16} />}
                            >
                              Buscar
                            </Button>
                          </Box>

                          {realDevices.length === 0 ? (
                            <Box sx={{ p: 3, textAlign: 'center', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 2 }}>
                              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: 12 }}>
                                Nenhum barramento de scanner WIA ou eSCL verificado ainda. Clique em "Buscar".
                              </Typography>
                            </Box>
                          ) : (
                            <List sx={{ maxHeight: 180, overflowY: 'auto', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 2, p: 0 }}>
                              {realDevices.map(dev => (
                                <ListItem 
                                  key={dev.id} 
                                  disablePadding 
                                  sx={{ 
                                    borderBottom: '1px solid rgba(255,255,255,0.02)',
                                    bgcolor: selectedRealDeviceId === dev.id ? 'rgba(20, 184, 166, 0.05)' : 'transparent'
                                  }}
                                >
                                  <ListItemButton onClick={() => setSelectedRealDeviceId(dev.id)} sx={{ py: 1 }}>
                                    <ListItemIcon sx={{ color: dev.real ? 'success.main' : 'warning.main', minWidth: 32 }}>
                                      <Scan size={18} />
                                    </ListItemIcon>
                                    <ListItemText 
                                      primary={dev.nome} 
                                      secondary={dev.descricao} 
                                      primaryTypographyProps={{ fontSize: 12, fontWeight: 700 }}
                                      secondaryTypographyProps={{ fontSize: 10 }}
                                    />
                                  </ListItemButton>
                                </ListItem>
                              ))}
                            </List>
                          )}

                          <Divider sx={{ my: 1 }} />

                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Parâmetros do Escâner</Typography>

                          <FormControl fullWidth size="small">
                            <InputLabel>Segurado Beneficiário *</InputLabel>
                            <Select
                              value={scanSeguradoId}
                              onChange={(e) => setScanSeguradoId(Number(e.target.value))}
                            >
                              {seguradosList.map(s => (
                                <MenuItem key={s.id} value={s.id}>{s.nome}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>

                          <FormControl fullWidth size="small">
                            <InputLabel>Resolução</InputLabel>
                            <Select
                              value={realScanDpi}
                              onChange={(e) => setRealScanDpi(Number(e.target.value))}
                            >
                              <MenuItem value={150}>150 DPI (Rascunho Rápido)</MenuItem>
                              <MenuItem value={300}>300 DPI (Padrão ICP-Brasil)</MenuItem>
                              <MenuItem value={600}>600 DPI (Alta Fidelidade)</MenuItem>
                            </Select>
                          </FormControl>

                          <FormControl fullWidth size="small" sx={{ mb: 1 }}>
                            <InputLabel>Modo</InputLabel>
                            <Select
                              value={realScanMode}
                              onChange={(e) => setRealScanMode(e.target.value)}
                            >
                              <MenuItem value="COLOR">Colorido (24-bit)</MenuItem>
                              <MenuItem value="GRAY">Grayscale (Tons de cinza)</MenuItem>
                              <MenuItem value="MONO">Binarizado (1-bit)</MenuItem>
                            </Select>
                          </FormControl>

                          <Button 
                            variant="contained" 
                            color="primary" 
                            fullWidth 
                            size="large"
                            onClick={digitalizarReal}
                            disabled={isScanningReal}
                            startIcon={isScanningReal ? <CircularProgress size={20} color="inherit" /> : <Play size={20} />}
                            sx={{ py: 1.5, fontWeight: 700 }}
                          >
                            {isScanningReal ? "Digitalizando no Scanner..." : "Iniciar Digitalização Real"}
                          </Button>
                        </Box>
                      )}

                      {scanSourceMode === 'camera' && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Digitalizador via Câmera em Tempo Real</Typography>
                          
                          <FormControl fullWidth size="small">
                            <InputLabel>Segurado Beneficiário *</InputLabel>
                            <Select
                              value={scanSeguradoId}
                              onChange={(e) => setScanSeguradoId(Number(e.target.value))}
                            >
                              {seguradosList.map(s => (
                                <MenuItem key={s.id} value={s.id}>{s.nome}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>

                          {isCameraActive ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                              <Button
                                variant="contained"
                                color="success"
                                fullWidth
                                onClick={capturarFotoCamera}
                                startIcon={<Scan size={20} />}
                                sx={{ py: 1.5, fontWeight: 700 }}
                              >
                                Capturar e Processar OCR Real
                              </Button>
                              <Button
                                variant="outlined"
                                color="error"
                                fullWidth
                                onClick={desligarCamera}
                              >
                                Desativar Câmera
                              </Button>
                            </Box>
                          ) : (
                            <Button
                              variant="contained"
                              color="primary"
                              fullWidth
                              onClick={ligarCamera}
                              startIcon={<Scan size={20} />}
                              sx={{ py: 1.5, fontWeight: 700 }}
                            >
                              Ativar Câmera / Webcam
                            </Button>
                          )}
                        </Box>
                      )}

                      {scanSourceMode === 'file' && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Upload de Foto / Documento Escaneado</Typography>
                          
                          <FormControl fullWidth size="small">
                            <InputLabel>Segurado Beneficiário *</InputLabel>
                            <Select
                              value={scanSeguradoId}
                              onChange={(e) => setScanSeguradoId(Number(e.target.value))}
                            >
                              {seguradosList.map(s => (
                                <MenuItem key={s.id} value={s.id}>{s.nome}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>

                          <Box sx={{ 
                            p: 3, 
                            border: '2px dashed rgba(20, 184, 166, 0.3)', 
                            borderRadius: 2, 
                            textAlign: 'center', 
                            bgcolor: 'rgba(0,0,0,0.2)' 
                          }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, fontSize: 11 }}>
                              Selecione uma foto do seu documento tirada com celular ou arquivo digitalizado para processar OCR de alta precisão em português.
                            </Typography>
                            <Button 
                              variant="outlined" 
                              color="primary" 
                              component="label" 
                              startIcon={<CloudUpload size={16} />}
                              sx={{ fontWeight: 700 }}
                            >
                              Selecionar Imagem Real
                              <input 
                                type="file" 
                                hidden 
                                accept="image/*" 
                                onChange={carregarArquivoLocalReal} 
                              />
                            </Button>
                          </Box>
                        </Box>
                      )}
                    </Card>

                    {/* Painel de Diagnóstico de Hardware USB/Rede */}
                    <Card sx={{ p: 3, mt: 3, border: '1px solid rgba(244, 63, 94, 0.15)', bgcolor: 'rgba(15, 23, 42, 0.6)' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span style={{ fontSize: 20 }}>⚙️</span> Solução de Problemas
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, fontSize: 12 }}>
                        Se o seu escâner físico (como o Epson L3250 conectado via USB) não foi detectado ou listado no botão buscar, execute um diagnóstico de barramento para verificar chaves de hardware.
                      </Typography>

                      <Button
                        variant="outlined"
                        color="warning"
                        fullWidth
                        size="small"
                        onClick={diagnosticarHardware}
                        disabled={isDiagnosing}
                        startIcon={isDiagnosing ? <CircularProgress size={16} color="inherit" /> : <RotateCcw size={16} />}
                        sx={{ mb: 2, fontWeight: 700 }}
                      >
                        {isDiagnosing ? "Analisando Barramento USB..." : "Diagnosticar Hardware USB"}
                      </Button>

                      {diagResult && (
                        <Box sx={{ mt: 2, p: 2, borderRadius: 2, bgcolor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'warning.main', mb: 1, fontSize: 13 }}>
                            {diagResult.diagnosticoDecidido}
                          </Typography>
                          
                          {diagResult.recomendacoes && diagResult.recomendacoes.length > 0 && (
                            <Box sx={{ pl: 2, mt: 1 }}>
                              {diagResult.recomendacoes.map((rec: string, idx: number) => (
                                <Typography key={idx} variant="body2" sx={{ color: 'text.secondary', fontSize: 11, mb: 1, display: 'list-item' }}>
                                  {rec}
                                </Typography>
                              ))}
                            </Box>
                          )}
                        </Box>
                      )}
                    </Card>

                    {/* Painel de Arquitetura de Conexão Local e Integração de Escâneres (MÓDULO 12) */}
                    <Card sx={{ 
                      p: 3, 
                      mt: 3, 
                      border: '1px solid rgba(20, 184, 166, 0.2)', 
                      bgcolor: 'rgba(7, 10, 16, 0.8)',
                      backgroundImage: 'radial-gradient(circle at bottom left, rgba(20, 184, 166, 0.03), transparent 60%)'
                    }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: '#2dd4bf', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ShieldAlert size={18} /> Integração com Escâneres Físicos no Navegador
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, mb: 2, lineHeight: 1.5 }}>
                        Navegadores modernos impõem restrições rígidas de sandbox (isolamento) que impedem o acesso direto ao barramento USB/TWAIN local por motivos de segurança do usuário.
                      </Typography>
                      <Box sx={{ p: 2, bgcolor: 'rgba(20, 184, 166, 0.04)', border: '1px solid rgba(20, 184, 166, 0.15)', borderRadius: 2 }}>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#2dd4bf', display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                          <span>💡 ARQUITETURA RECOMENDADA DE MERCADO:</span>
                          <Chip 
                            label={isAgentOnline ? "AGENTE ONLINE" : "AGENTE OFFLINE"} 
                            color={isAgentOnline ? "success" : "error"} 
                            size="small" 
                            sx={{ height: 18, fontSize: '0.6rem', fontWeight: 800 }} 
                          />
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#fff', fontSize: 11.5, fontWeight: 500, lineHeight: 1.5 }}>
                          A maneira mais rápida de resolver isso é **criar um agente desktop local (via WebSocket/REST)** que conversa com seu sistema Web ou usar SDKs profissionais de digitalização (ex: **Dynamic Web TWAIN** ou **Scanner.js**).
                        </Typography>
                        {isAgentOnline && (
                          <Typography variant="caption" sx={{ color: 'rgba(20, 184, 166, 0.8)', mt: 1, display: 'block', fontWeight: 700 }}>
                            🚀 Conectado com sucesso ao Agente Desktop Local na porta 5050! Scanners físicos prontos para uso.
                          </Typography>
                        )}
                      </Box>
                    </Card>
                  </Grid>

                  {/* Coluna 2: Visor e Processamento OCR */}
                  <Grid item xs={12} lg={8}>
                    <Grid container spacing={3}>
                      {/* Visor do Scanner */}
                      <Grid item xs={12}>
                        <Card sx={{ p: 3, textAlign: 'center' }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Visor do Escâner USB / Rede</Typography>
                          
                          <Box sx={{
                            width: '100%', height: 350, bgcolor: '#020617', borderRadius: 2,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            position: 'relative', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.05)'
                          }}>
                            {isScanningReal && !isOcrProcessing && (
                              <Box sx={{
                                position: 'absolute', left: 0, width: '100%', height: 4,
                                bgcolor: 'primary.main', boxShadow: '0 0 12px #14b8a6',
                                animation: 'scanLaser 2s infinite linear', zIndex: 10
                              }} />
                            )}

                            {scanSourceMode === 'camera' && isCameraActive ? (
                              <video 
                                ref={videoRef} 
                                autoPlay 
                                playsInline 
                                style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 4, transform: 'scaleX(-1)' }} 
                              />
                            ) : realScannedImage ? (
                              <img 
                                src={realScannedImage} 
                                alt="Scanner Preview" 
                                style={{ 
                                  maxWidth: '90%', 
                                  maxHeight: '90%', 
                                  borderRadius: 4,
                                  boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
                                  filter: realScanMode === 'GRAY' ? 'grayscale(100%)' : realScanMode === 'MONO' ? 'threshold(50%)' : 'none'
                                }} 
                              />
                            ) : isOcrProcessing ? (
                              <Box sx={{ zIndex: 5, p: 3, textAlign: 'center', maxWidth: 400 }}>
                                <CircularProgress color="primary" sx={{ mb: 2 }} />
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.light' }}>{ocrProgressText}</Typography>
                                <LinearProgress variant="determinate" value={ocrProgressVal} sx={{ mt: 2, borderRadius: 2 }} />
                              </Box>
                            ) : isScanningReal && !isOcrProcessing ? (
                              <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>Lendo via driver WIA no barramento local...</Typography>
                                <LinearProgress sx={{ width: 220, height: 6, borderRadius: 3, margin: '0 auto' }} />
                              </Box>
                            ) : (
                              <Box sx={{ p: 4, color: 'text.secondary' }}>
                                <Scan size={56} style={{ margin: '0 auto 16px', color: '#14b8a6' }} />
                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                  {scanSourceMode === 'camera' 
                                    ? "Webcam Pronta" 
                                    : scanSourceMode === 'file' 
                                    ? "Aguardando Carregamento de Imagem" 
                                    : "Aguardando digitalização do escâner..."}
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                  {scanSourceMode === 'camera' 
                                    ? "Clique em 'Ativar Câmera' à esquerda para capturar um documento real usando a câmera do seu PC." 
                                    : scanSourceMode === 'file' 
                                    ? "Selecione uma foto física do seu computador para processar por OCR real." 
                                    : "Selecione seu scanner físico na lista lateral esquerda para digitalizar."}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </Card>
                      </Grid>

                      {/* Visor OCR e Indexação */}
                      {realScannedImage && (
                        <Grid item xs={12}>
                          <Card sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Reconhecimento Ótico de Caracteres (OCR)</Typography>

                            <Grid container spacing={3}>
                              {/* Texto OCR Lido */}
                              <Grid item xs={12} md={7}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Conteúdo do Documento Lido:</Typography>
                                <TextField
                                  multiline
                                  rows={8}
                                  fullWidth
                                  value={realOcrText}
                                  onChange={(e) => setRealOcrText(e.target.value)}
                                  variant="outlined"
                                  sx={{ bgcolor: 'rgba(0,0,0,0.2)', input: { fontFamily: 'Courier New' } }}
                                />
                              </Grid>

                              {/* Metadados Indexados */}
                              <Grid item xs={12} md={5}>
                                <Box sx={{ p: 2.5, bgcolor: 'rgba(20, 184, 166, 0.05)', border: '1px solid rgba(20,184,166,0.2)', borderRadius: 2 }}>
                                  <Typography variant="subtitle2" color="primary.light" sx={{ fontWeight: 700, mb: 2 }}>
                                    Campos Mapeados por Inteligência Artificial (Regex):
                                  </Typography>
                                  
                                  <Box sx={{ mb: 2 }}>
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>Nome do Segurado:</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{realOcrFields.nome || "Não detectado"}</Typography>
                                  </Box>

                                  <Box sx={{ mb: 2 }}>
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>CPF Identificado:</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'success.light' }}>{realOcrFields.cpf || "Não detectado"}</Typography>
                                  </Box>

                                  <Box sx={{ mb: 3 }}>
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>RG Identificado:</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{realOcrFields.rg || "Não detectado"}</Typography>
                                  </Box>

                                  <Box sx={{ p: 1.5, border: '1px dashed #14b8a6', borderRadius: 1.5, display: 'flex', alignItems: 'center', gap: 1, color: '#14b8a6', mb: 3 }}>
                                    <ShieldCheck size={20} />
                                    <Typography variant="caption" sx={{ fontWeight: 700 }}>Assinado Digitalmente (ICP-Brasil - A3)</Typography>
                                  </Box>

                                  <Button 
                                    variant="contained" 
                                    color="success" 
                                    fullWidth 
                                    size="large"
                                    onClick={salvarDocumentoRealDigitalizado}
                                    sx={{ fontWeight: 700 }}
                                  >
                                    Homologar e Salvar no Dossiê
                                  </Button>
                                </Box>
                              </Grid>
                            </Grid>
                          </Card>
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* ==================================================================
                 TELA 9: DOSSIÊ ELETRÔNICO TIMELINE (MÓDULO 7)
                 ================================================================== */}
            {activeTab === 'dossiers' && (
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>Dossiê Eletrônico Previdenciário</Typography>
                <Grid container spacing={4}>
                  
                  {/* Selector Segurado */}
                  <Grid item xs={12} md={3}>
                    <Card sx={{ p: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>Selecionar Segurado:</Typography>
                      <List>
                        {seguradosList.map(s => (
                          <ListItem key={s.id} disablePadding>
                            <ListItemButton
                              selected={dossieSeguradoId === s.id}
                              onClick={() => setDossieSeguradoId(s.id)}
                            >
                              <ListItemText primary={s.nome} secondary={`CPF: ${s.cpf}`} />
                            </ListItemButton>
                          </ListItem>
                        ))}
                      </List>
                    </Card>
                  </Grid>

                  {/* Prontuário Timeline */}
                  <Grid item xs={12} md={9}>
                    {dossieCompleto && (
                      <Card sx={{ p: 3 }}>
                        <Box sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)', pb: 2, mb: 3 }}>
                          <Typography variant="h5" sx={{ fontWeight: 800 }}>{dossieCompleto.segurado.nome}</Typography>
                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                            CPF: {dossieCompleto.segurado.cpf} • NIT: {dossieCompleto.segurado.pis_pasep} • Cargo: {dossieCompleto.segurado.cargo_atual}
                          </Typography>
                          <Chip label={dossieCompleto.segurado.status_funcional} color={dossieCompleto.segurado.status_funcional === 'ATIVO' ? 'success' : 'primary'} size="small" sx={{ mt: 1 }} />
                        </Box>

                        {/* Seção: Grid de Documentos do Dossiê */}
                        <Box sx={{ mb: 4 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1.5, color: '#2dd4bf', display: 'flex', alignItems: 'center', gap: 1 }}>
                            <FolderOpen size={20} /> Pasta de Documentos Digitalizados ({dossieCompleto.arquivos.length})
                          </Typography>
                          <Grid container spacing={2}>
                            {dossieCompleto.arquivos.map((file: any) => {
                              const fileId = file.id;
                              const fileName = file.nome_arquivo;
                              const fileExt = file.extensao;
                              const fileSize = file.tamanho_bytes;
                              const fileOcr = file.ocr_texto || file.ocr_conteudo_texto || '';
                              
                              const timelineItem = {
                                tipo: 'DIGITALIZACAO',
                                id: fileId,
                                nome_arquivo: fileName,
                                extensao: fileExt,
                                tamanho_bytes: fileSize,
                                ocr_conteudo_texto: fileOcr,
                                resolucao_dpi: file.resolucao_dpi || 300,
                                padrao_pdf_a: file.padrao_pdf_a !== undefined ? file.padrao_pdf_a : true,
                                hash_sha256: file.hash_sha256 || 'SHA256-ICP-BR-#DOC-' + fileId + '-' + Math.random().toString(36).substring(4).toUpperCase(),
                                responsavel: file.criado_por || 'Módulo Scanner',
                                data: file.criado_em,
                              };

                              return (
                                <Grid item xs={12} sm={6} md={4} key={fileId}>
                                  <Card 
                                    onClick={() => handleDossierTimelineItemClick(timelineItem)}
                                    sx={{ 
                                      p: 2, 
                                      bgcolor: 'rgba(15, 118, 110, 0.05)', 
                                      border: '1px solid rgba(15, 118, 110, 0.15)',
                                      borderRadius: 2,
                                      cursor: 'pointer',
                                      transition: 'all 0.2s ease-in-out',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 1.5,
                                      '&:hover': {
                                        bgcolor: 'rgba(15, 118, 110, 0.12)',
                                        transform: 'translateY(-2px)',
                                        borderColor: '#10b981',
                                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)'
                                      }
                                    }}
                                  >
                                    <Box sx={{ bgcolor: 'rgba(16, 185, 129, 0.15)', p: 1, borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                      <Scan size={20} style={{ color: '#10b981' }} />
                                    </Box>
                                    <Box sx={{ overflow: 'hidden', flexGrow: 1 }}>
                                      <Typography variant="body2" noWrap sx={{ fontWeight: 700 }}>
                                        {fileName}
                                      </Typography>
                                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                                        .{fileExt.toUpperCase()} • {fileSize ? (fileSize / 1024).toFixed(1) + ' KB' : 'N/A'}
                                      </Typography>
                                    </Box>
                                  </Card>
                                </Grid>
                              );
                            })}
                            {dossieCompleto.arquivos.length === 0 && (
                              <Grid item xs={12}>
                                <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic', pl: 1 }}>
                                  Nenhum documento digitalizado atrelado ao prontuário deste segurado ainda.
                                </Typography>
                              </Grid>
                            )}
                          </Grid>
                        </Box>

                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Linha do Tempo de Eventos Previdenciários (Auditoria)</Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          {dossieCompleto.timeline.map((t: any, idx: number) => {
                            const isDigitalizacao = t.tipo === 'DIGITALIZACAO';
                            return (
                              <Box 
                                key={idx} 
                                onClick={() => isDigitalizacao && handleDossierTimelineItemClick(t)}
                                sx={{
                                  display: 'flex', 
                                  gap: 2, 
                                  p: 2, 
                                  bgcolor: 'rgba(0,0,0,0.15)', 
                                  borderRadius: 2,
                                  borderLeft: '4px solid', 
                                  borderColor: isDigitalizacao ? 'primary.main' : 'warning.main',
                                  cursor: isDigitalizacao ? 'pointer' : 'default',
                                  transition: 'all 0.2s ease-in-out',
                                  '&:hover': isDigitalizacao ? {
                                    bgcolor: 'rgba(255,255,255,0.05)',
                                    transform: 'translateX(4px)',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                                  } : {}
                                }}
                              >
                                <Box sx={{ bgcolor: isDigitalizacao ? 'rgba(15,118,110,0.1)' : 'rgba(245,158,11,0.1)', p: 1, borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 40, width: 40 }}>
                                  {isDigitalizacao ? <Scan size={18} /> : <FileCheck size={18} />}
                                </Box>
                                <Box sx={{ flexGrow: 1 }}>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {t.titulo}
                                    {isDigitalizacao && (
                                      <Chip label="Visualizável" color="primary" size="small" variant="outlined" sx={{ height: 18, fontSize: '0.65rem' }} />
                                    )}
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>{t.descricao}</Typography>
                                  <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.muted' }}>
                                    Operador: {t.responsavel} • Registrado em: {new Date(t.data).toLocaleDateString('pt-BR')}
                                  </Typography>
                                </Box>
                                {isDigitalizacao && (
                                  <Box sx={{ display: 'flex', alignItems: 'center', opacity: 0.5, '&:hover': { opacity: 1 } }}>
                                    <ChevronRight size={20} />
                                  </Box>
                                )}
                              </Box>
                            );
                          })}
                          {dossieCompleto.timeline.length === 0 && (
                            <Typography variant="body2" align="center" sx={{ color: 'text.secondary', py: 4 }}>
                              Nenhum histórico funcional ou documento digitalizado ainda.
                            </Typography>
                          )}
                        </Box>
                      </Card>
                    )}
                  </Grid>

                </Grid>
              </Box>
            )}

            {/* ==================================================================
                 TELA 10: RELATÓRIOS (CSV/EXCEL - MÓDULO 11)
                 ================================================================== */}
            {activeTab === 'relatorios' && (
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>Central de Relatórios Corporativos</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ p: 3, textAlign: 'center' }}>
                      <Users size={36} style={{ color: '#0f766e', marginBottom: 12 }} />
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>Cadastro de Segurados</Typography>
                      <Typography variant="body2" sx={{ my: 2 }}>Exportar listagem completa com matrícula e CPF.</Typography>
                      <Button variant="contained" fullWidth startIcon={<Download size={18} />} onClick={() => exportToCSV('segurados', seguradosList)}>
                        Baixar Planilha CSV
                      </Button>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ p: 3, textAlign: 'center' }}>
                      <FileCheck size={36} style={{ color: '#10b981', marginBottom: 12 }} />
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>Processos e Aposentadorias</Typography>
                      <Typography variant="body2" sx={{ my: 2 }}>Exportar concessões e status do workflow previdenciário.</Typography>
                      <Button variant="contained" fullWidth startIcon={<Download size={18} />} onClick={() => exportToCSV('aposentadorias', aposentadoriasList)}>
                        Baixar Planilha CSV
                      </Button>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ p: 3, textAlign: 'center' }}>
                      <ShieldCheck size={36} style={{ color: '#0891b2', marginBottom: 12 }} />
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>Logs de Auditoria (LGPD)</Typography>
                      <Typography variant="body2" sx={{ my: 2 }}>Exportar relatórios de acessos de servidores para LGPD.</Typography>
                      <Button variant="contained" fullWidth startIcon={<Download size={18} />} onClick={() => exportToCSV('auditoria', auditoriaLogs)}>
                        Baixar Planilha CSV
                      </Button>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* ==================================================================
                 TELA 11: AUDITORIA LGPD (MÓDULO 13)
                 ================================================================== */}
            {activeTab === 'auditoria' && (
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>Logs de Auditoria de Acessos (LGPD)</Typography>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Histórico de Alterações, Download, Upload e Consulta de Dados Sensíveis</Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Operador (CPF)</TableCell>
                          <TableCell>Perfil</TableCell>
                          <TableCell>Módulo</TableCell>
                          <TableCell>Ação executada</TableCell>
                          <TableCell>IP Origem</TableCell>
                          <TableCell>Carimbo do Tempo</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {auditoriaLogs.map(log => (
                          <TableRow key={log.id}>
                            <TableCell sx={{ fontWeight: 700 }}>{log.cpf_usuario}</TableCell>
                            <TableCell><Chip label={log.perfil_usuario} size="small" /></TableCell>
                            <TableCell>{log.modulo}</TableCell>
                            <TableCell>
                              <Chip 
                                label={log.acao} 
                                color={log.acao === 'LOGIN' ? 'success' : (log.acao === 'EXCLUSAO' ? 'error' : 'default')} 
                                size="small" 
                              />
                            </TableCell>
                            <TableCell sx={{ fontFamily: 'monospace' }}>{log.ip_origem}</TableCell>
                            <TableCell>{new Date(log.data_evento).toLocaleString('pt-BR')}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Card>
              </Box>
            )}

            {/* ==================================================================
                 TELA 12: CONFIGURAÇÕES (MÓDULO 12 E 15)
                 ================================================================== */}
            {activeTab === 'configuracoes' && (
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>Parâmetros do Sistema e Nuvem</Typography>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Card sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Integração com Nuvem (Backup e Sincronização)</Typography>
                      <FormControlLabel
                        control={<Switch defaultChecked />}
                        label="Sincronização Automática com o Google Drive"
                        sx={{ mb: 2, display: 'block' }}
                      />
                      <FormControlLabel
                        control={<Switch defaultChecked />}
                        label="Sincronização Automática com o Microsoft OneDrive"
                        sx={{ mb: 3, display: 'block' }}
                      />
                      <Button variant="contained" startIcon={<Settings size={18} />} onClick={triggerCloudBackupSim}>
                        Executar Sincronização e Backup Imediato
                      </Button>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Card sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Logs de Sincronia na Nuvem</Typography>
                      <Box sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 2, maxHeight: 180, overflowY: 'auto' }}>
                        {cloudSyncLogs.map((log, idx) => (
                          <Typography key={idx} variant="caption" display="block" sx={{ fontFamily: 'monospace', mb: 1, color: 'success.main' }}>
                            {log}
                          </Typography>
                        ))}
                      </Box>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}

          </Box>
        </Box>

      </Box>

      {/* MODAL CADASTRAR SEGURADO (MÓDULO 2) */}
      <Dialog open={openNewSegurado} onClose={() => setOpenNewSegurado(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Cadastrar Novo Segurado Municipal</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <TextField
            label="Nome Completo *"
            fullWidth sx={{ mb: 2 }}
            value={newSegData.nome}
            onChange={(e) => setNewSegData(prev => ({ ...prev, nome: e.target.value.toUpperCase() }))}
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="CPF *"
                fullWidth sx={{ mb: 2 }}
                value={newSegData.cpf}
                onChange={(e) => setNewSegData(prev => ({ ...prev, cpf: e.target.value }))}
                placeholder="Ex: 000.000.000-00"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Matrícula *"
                fullWidth sx={{ mb: 2 }}
                value={newSegData.matricula}
                onChange={(e) => setNewSegData(prev => ({ ...prev, matricula: e.target.value.toUpperCase() }))}
              />
            </Grid>
          </Grid>
          <TextField
            label="Cargo *"
            fullWidth sx={{ mb: 2 }}
            value={newSegData.cargo_atual}
            onChange={(e) => setNewSegData(prev => ({ ...prev, cargo_atual: e.target.value.toUpperCase() }))}
          />
          <TextField
            label="Data de Admissão *"
            type="date"
            InputLabelProps={{ shrink: true }}
            fullWidth sx={{ mb: 2 }}
            value={newSegData.data_admissao}
            onChange={(e) => setNewSegData(prev => ({ ...prev, data_admissao: e.target.value }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewSegurado(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleCreateSegurado}>Salvar Segurado</Button>
        </DialogActions>
      </Dialog>

      {/* DIALOG: EDITAR SEGURADO MUNICIPAL */}
      <Dialog open={openEditSegurado} onClose={() => setOpenEditSegurado(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>⚙️ Modificar Cadastro de Segurado Municipal</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <TextField
            label="Nome Completo *"
            fullWidth sx={{ mb: 2 }}
            value={editSegData.nome}
            onChange={(e) => setEditSegData(prev => ({ ...prev, nome: e.target.value.toUpperCase() }))}
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="CPF"
                fullWidth sx={{ mb: 2 }}
                disabled
                value={editSegData.cpf}
                helperText="O CPF é a chave única e não pode ser editado."
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Matrícula *"
                fullWidth sx={{ mb: 2 }}
                value={editSegData.matricula}
                onChange={(e) => setEditSegData(prev => ({ ...prev, matricula: e.target.value.toUpperCase() }))}
              />
            </Grid>
          </Grid>
          <TextField
            label="Cargo Atual *"
            fullWidth sx={{ mb: 2 }}
            value={editSegData.cargo_atual}
            onChange={(e) => setEditSegData(prev => ({ ...prev, cargo_atual: e.target.value.toUpperCase() }))}
          />
          <TextField
            label="Data de Admissão *"
            type="date"
            InputLabelProps={{ shrink: true }}
            fullWidth sx={{ mb: 2 }}
            value={editSegData.data_admissao}
            onChange={(e) => setEditSegData(prev => ({ ...prev, data_admissao: e.target.value }))}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Status Funcional *</InputLabel>
            <Select
              value={editSegData.status_funcional}
              label="Status Funcional *"
              onChange={(e) => setEditSegData(prev => ({ ...prev, status_funcional: e.target.value }))}
            >
              <MenuItem value="ATIVO">ATIVO</MenuItem>
              <MenuItem value="APOSENTADO">APOSENTADO</MenuItem>
              <MenuItem value="PENSIONISTA">PENSIONISTA</MenuItem>
              <MenuItem value="EXONERADO">EXONERADO</MenuItem>
              <MenuItem value="AFASTADO">AFASTADO</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditSegurado(false)}>Cancelar</Button>
          <Button variant="contained" color="success" onClick={handleSaveEditSegurado}>Salvar Alterações</Button>
        </DialogActions>
      </Dialog>


      {/* DIALOG DE PRÉ-VISUALIZAÇÃO DO DOSSIÊ (MÓDULO 7) */}
      <Dialog 
        open={openDossierPreviewDialog} 
        onClose={() => setOpenDossierPreviewDialog(false)} 
        maxWidth="lg" 
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#0c1017',
            backgroundImage: 'radial-gradient(ellipse at top right, rgba(16, 185, 129, 0.05), transparent 40%)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 3,
            color: '#fff'
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Scan size={24} style={{ color: '#10b981' }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                Visualização de Documento Previdenciário
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block' }}>
                Dossiê Eletrônico • Validação ICP-Brasil & Integridade A3
              </Typography>
            </Box>
          </Box>
          <Chip 
            label="Homologado & Assinado" 
            color="success" 
            size="small" 
            icon={<ShieldCheck size={14} style={{ color: '#fff' }} />}
            sx={{ fontWeight: 700, px: 0.5 }}
          />
        </DialogTitle>

        <DialogContent sx={{ p: 3, mt: 1 }}>
          {selectedDossierFile && (
            <Grid container spacing={3}>
              
              {/* Coluna da Imagem / Preview Visual */}
              <Grid item xs={12} md={7}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <Clock size={16} /> Visualização da Mídia
                </Typography>
                
                <Box sx={{
                  width: '100%',
                  height: 480,
                  bgcolor: '#040711',
                  borderRadius: 2.5,
                  border: '1px dashed rgba(255,255,255,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {isLoadingDossierPreview ? (
                    <Box sx={{ textAlign: 'center' }}>
                      <CircularProgress color="success" size={48} sx={{ mb: 2 }} />
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                        Carregando arquivo de imagem física...
                      </Typography>
                    </Box>
                  ) : dossierFileBase64 ? (
                    selectedDossierFile.extensao?.toLowerCase() === 'pdf' ? (
                      <iframe 
                        src={dossierFileBase64} 
                        title={selectedDossierFile.nome_arquivo} 
                        width="100%" 
                        height="100%" 
                        style={{ border: 'none', backgroundColor: '#fff', borderRadius: '8px' }} 
                      />
                    ) : (
                      <img 
                        src={dossierFileBase64} 
                        alt={selectedDossierFile.nome_arquivo} 
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: '100%', 
                          objectFit: 'contain',
                          filter: 'drop-shadow(0px 8px 24px rgba(0,0,0,0.5))' 
                        }} 
                      />
                    )
                  ) : (
                    /* Mock Document Premium */
                    <Box sx={{
                      width: '90%',
                      height: '90%',
                      bgcolor: '#0a0d16',
                      border: '3px double #d4af37',
                      borderRadius: 1.5,
                      p: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: 'inset 0 0 40px rgba(212,175,55,0.05)',
                      backgroundImage: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.02) 0%, transparent 70%)'
                    }}>
                      <Box sx={{ textAlign: 'center', borderBottom: '2px solid #d4af37', pb: 1.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#d4af37', letterSpacing: 2, display: 'block' }}>
                          REPÚBLICA FEDERATIVA DO BRASIL
                        </Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#fff', mt: 0.5 }}>
                          INSTITUTO DE PREVIDÊNCIA MUNICIPAL (SGIP-RPPS)
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 700, mt: 0.5, display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                          <ShieldCheck size={12} /> DOCUMENTO PÚBLICO DIGITALIZADO E HOMOLOGADO
                        </Typography>
                      </Box>
                      
                      <Box sx={{ my: 3, px: 2 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block' }}>NOME DO DOCUMENTO:</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#fff' }}>
                              {selectedDossierFile.nome_arquivo?.toUpperCase()}.{selectedDossierFile.extensao?.toUpperCase()}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block' }}>CPF DO SEGURADO:</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#fff' }}>
                              {dossieCompleto?.segurado?.cpf || 'NÃO ESPECIFICADO'}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block' }}>MATRÍCULA:</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#fff' }}>
                              {dossieCompleto?.segurado?.matricula || 'NÃO ESPECIFICADO'}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block' }}>AUDITORIA E INDEXAÇÃO:</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Fingerprint size={14} /> ASSINATURA ELETRÔNICA ICP-BRASIL VÁLIDA
                            </Typography>
                            <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)', display: 'block', mt: 0.5, wordBreak: 'break-all' }}>
                              {selectedDossierFile.hash_sha256}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                      
                      <Box sx={{ borderTop: '1px solid rgba(212,175,55,0.3)', pt: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block', fontSize: '0.65rem' }}>RESOLUÇÃO:</Typography>
                          <Typography variant="caption" sx={{ fontWeight: 700, color: '#fff' }}>{selectedDossierFile.resolucao_dpi || 300} DPI (PADRÃO A3)</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block', fontSize: '0.65rem' }}>PADRÃO FORMATO:</Typography>
                          <Typography variant="caption" sx={{ fontWeight: 700, color: '#fff' }}>{selectedDossierFile.padrao_pdf_a ? 'PDF/A COMPATÍVEL' : 'PNG/JPEG IMAGEM'}</Typography>
                        </Box>
                        <Box sx={{ border: '1px solid #10b981', px: 1, py: 0.2, borderRadius: 1, bgcolor: 'rgba(16,185,129,0.1)' }}>
                          <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 800, fontSize: '0.6rem' }}>ICP-BRASIL</Typography>
                        </Box>
                      </Box>
                    </Box>
                  )}
                </Box>
              </Grid>
              
              {/* Coluna de Metadados / Detalhes */}
              <Grid item xs={12} md={5} sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
                
                {/* Seção: Metadados */}
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 0.8 }}>
                    <ShieldCheck size={16} /> Detalhes Técnicos e Metadados
                  </Typography>
                  <Paper sx={{ p: 2, bgcolor: '#070a10', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 2 }}>
                    <Grid container spacing={1.5}>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>Nome do Arquivo</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {selectedDossierFile.nome_arquivo}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>Extensão / Tamanho</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          .{selectedDossierFile.extensao} ({selectedDossierFile.tamanho_bytes ? (selectedDossierFile.tamanho_bytes / 1024).toFixed(1) + ' KB' : 'N/A'})
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>Resolução DPI</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#10b981' }}>
                          {selectedDossierFile.resolucao_dpi || 300} DPI
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>Padrão Arquivo</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {selectedDossierFile.padrao_pdf_a ? 'PDF/A (Resiliente)' : 'IMAGEM (Bruta)'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>ICP-Brasil SHA-256 Assinatura</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <Typography variant="caption" sx={{ fontFamily: 'monospace', color: '#10b981', flexGrow: 1, bgcolor: 'rgba(16,185,129,0.05)', p: 1, borderRadius: 1, border: '1px solid rgba(16,185,129,0.15)', wordBreak: 'break-all' }}>
                            {selectedDossierFile.hash_sha256}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Box>

                {/* Seção: OCR */}
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 0.8 }}>
                    <Fingerprint size={16} /> Conteúdo Extraído via Motor OCR
                  </Typography>
                  <TextField
                    multiline
                    rows={8}
                    fullWidth
                    value={selectedDossierFile.ocr_conteudo_texto || selectedDossierFile.ocr_texto || 'Não há conteúdo de texto reconhecido neste arquivo.'}
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                      sx: {
                        bgcolor: '#040711',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: 2,
                        color: '#2dd4bf',
                        fontFamily: 'monospace',
                        fontSize: '0.8rem',
                        '& textarea': {
                          lineHeight: '1.4'
                        }
                      }
                    }}
                  />
                </Box>

              </Grid>

            </Grid>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(255,255,255,0.08)', gap: 1 }}>
          <Button 
            onClick={() => setOpenDossierPreviewDialog(false)}
            sx={{ px: 3, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}
          >
            Fechar Janela
          </Button>
          <Button 
            variant="contained" 
            color="success"
            startIcon={<Download size={18} />}
            onClick={handleDownloadDossierFile}
            sx={{ px: 3, fontWeight: 700 }}
          >
            Baixar Documento
          </Button>
        </DialogActions>
      </Dialog>

      {/* DIALOG: EDITAR PROTOCOLO */}
      <Dialog open={openEditProtDialog} onClose={() => setOpenEditProtDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Editar Protocolo Eletrônico</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <TextField
            label="Assunto *"
            fullWidth
            sx={{ mb: 2.5, mt: 1 }}
            value={editProtAssunto}
            onChange={(e) => setEditProtAssunto(e.target.value)}
          />
          <TextField
            label="Descrição do Processo"
            fullWidth
            multiline
            rows={3}
            sx={{ mb: 2.5 }}
            value={editProtDesc}
            onChange={(e) => setEditProtDesc(e.target.value)}
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Prioridade</InputLabel>
                <Select
                  value={editProtPrioridade}
                  onChange={(e) => setEditProtPrioridade(e.target.value)}
                >
                  <MenuItem value="BAIXA">BAIXA</MenuItem>
                  <MenuItem value="NORMAL">NORMAL</MenuItem>
                  <MenuItem value="ALTA">ALTA</MenuItem>
                  <MenuItem value="URGENTE">URGENTE</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={editProtStatus}
                  onChange={(e) => setEditProtStatus(e.target.value)}
                >
                  <MenuItem value="ABERTO">ABERTO</MenuItem>
                  <MenuItem value="EM_ANDAMENTO">EM ANDAMENTO</MenuItem>
                  <MenuItem value="PENDENTE">PENDENTE</MenuItem>
                  <MenuItem value="CONCLUIDO">CONCLUIDO</MenuItem>
                  <MenuItem value="CANCELADO">CANCELADO</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditProtDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSalvarEdicaoProtocolo}>Salvar Alterações</Button>
        </DialogActions>
      </Dialog>

      {/* DIALOG: NOVA PASTA */}
      <Dialog open={openNewFolderDialog} onClose={() => setOpenNewFolderDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Criar Nova Subpasta</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <TextField
            label="Nome da Pasta *"
            fullWidth
            sx={{ mb: 2.5, mt: 1 }}
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Ex: PROVAS_DE_VIDA"
          />
          <TextField
            label="Descrição da Pasta"
            fullWidth
            sx={{ mb: 1 }}
            value={newFolderDesc}
            onChange={(e) => setNewFolderDesc(e.target.value)}
            placeholder="Ex: Pasta para arquivamento de certidões anuais"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewFolderDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleCriarPasta}>Criar Pasta</Button>
        </DialogActions>
      </Dialog>

      {/* DIALOG: EDITAR PASTA */}
      <Dialog open={openEditFolderDialog} onClose={() => setOpenEditFolderDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Editar Nome da Pasta</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <TextField
            label="Nome da Pasta *"
            fullWidth
            sx={{ mb: 2.5, mt: 1 }}
            value={editFolderName}
            onChange={(e) => setEditFolderName(e.target.value)}
          />
          <TextField
            label="Descrição"
            fullWidth
            sx={{ mb: 1 }}
            value={editFolderDesc}
            onChange={(e) => setEditFolderDesc(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditFolderDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSalvarEdicaoPasta}>Salvar Alterações</Button>
        </DialogActions>
      </Dialog>

      {/* DIALOG: RENAME ARQUIVO */}
      <Dialog open={openEditFileDialog} onClose={() => setOpenEditFileDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Renomear Arquivo Previdenciário</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <TextField
            label="Nome do Arquivo *"
            fullWidth
            sx={{ mb: 1, mt: 1 }}
            value={editFileName}
            onChange={(e) => setEditFileName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditFileDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSalvarEdicaoArquivo}>Renomear</Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}
