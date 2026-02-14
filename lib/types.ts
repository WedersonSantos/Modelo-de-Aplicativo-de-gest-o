/**
 * Tipos e interfaces do sistema AACB Gestão de Associados
 * Versão 2.0 - Profissional
 */

// ============================================
// TIPOS DE USUÁRIO E PERMISSÕES
// ============================================

export type UserRole = "admin" | "usuario";

export interface User {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  avatar?: string;
  telefone?: string;
  cpf?: string;
  dataNascimento?: Date;
  dataCriacao: Date;
  ultimoAcesso?: Date;
  notificacoesAtivas: boolean;
  temaPreferido: "claro" | "escuro" | "automatico";
  cadastroCompleto: boolean;
  valorTotal?: number;
  numeroParcelas?: number;
  parcelasPagas?: number;
}

export interface AuthContextType {
  user: User | null;
  isSignedIn: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

// ============================================
// ASSOCIADOS
// ============================================

export interface Associado {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  telefone?: string;
  endereco?: string;
  dataAdesao: Date;
  status: "ativo" | "inativo" | "suspenso";
  avatar?: string;
  observacoes?: string;
}

// ============================================
// PAGAMENTOS E COBRANÇAS
// ============================================

export interface Pagamento {
  id: string;
  associadoId: string;
  valor: number;
  dataPagamento: Date;
  mesReferencia: string;
  formaPagamento?: "boleto" | "pix" | "cartao" | "dinheiro";
  comprovante?: string;
}

export interface Devedor {
  id: string;
  associadoId: string;
  mesAtraso: string;
  valorPendente: number;
  diasAtraso: number;
  dataVencimento: Date;
  status: "pendente" | "vencido" | "negociado";
}

export interface Boleto {
  id: string;
  devedorId: string;
  numero: string;
  valor: number;
  dataVencimento: Date;
  dataCriacao: Date;
  status: "gerado" | "enviado" | "pago" | "vencido" | "cancelado";
  tentativasEnvio: number;
  codigoBarras?: string;
  linkPdf?: string;
}

export interface NotificacaoCobranca {
  id: string;
  boletoId: string;
  tipo: "email" | "sms" | "push";
  dataPedido: Date;
  dataEnvio?: Date;
  status: "pendente" | "enviado" | "falhou" | "lido";
  mensagem?: string;
}

// ============================================
// DASHBOARD E ESTATÍSTICAS
// ============================================

export interface DashboardStats {
  totalAssociados: number;
  associadosAtivos: number;
  associadosInativos: number;
  totalCobrancasPendentes: number;
  valorTotalPendente: number;
  pagamentosMes: number;
  valorPagamentosMes: number;
  taxaInadimplencia: number;
}

export interface DashboardUsuario {
  valorDevedor: number;
  valorTotal: number;
  valorPago: number;
  proximoVencimento?: Date;
  debitosPendentes: number;
  ultimoPagamento?: Date;
  parcelas: Parcela[];
}

export interface Parcela {
  id: string;
  numero: number;
  valor: number;
  dataVencimento: Date;
  dataPagamento?: Date;
  status: "pendente" | "pago" | "vencido";
  formaPagamento?: "boleto" | "pix" | "cartao" | "dinheiro";
}

export interface DadosCadastro {
  nomeCompleto: string;
  dataNascimento: Date;
  valorTotal: number;
  numeroParcelas: number;
}

export interface ChavePix {
  tipo: "cpf" | "cnpj" | "email" | "telefone" | "aleatoria";
  chave: string;
  nome: string;
  cidade: string;
}

// ============================================
// NOTIFICAÇÕES DO APP
// ============================================

export interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: "info" | "alerta" | "sucesso" | "erro";
  lida: boolean;
  dataCriacao: Date;
  link?: string;
}

// ============================================
// CONFIGURAÇÕES
// ============================================

export interface ConfiguracaoUsuario {
  notificacoesPush: boolean;
  notificacoesEmail: boolean;
  notificacoesSms: boolean;
  lembretesVencimento: boolean;
  diasAntesLembrete: number;
  tema: "claro" | "escuro" | "automatico";
  idioma: "pt-BR" | "en-US" | "es-ES";
}

// ============================================
// RELATÓRIOS (ADMIN)
// ============================================

export interface RelatorioMensal {
  mes: string;
  totalArrecadado: number;
  totalPendente: number;
  novosAssociados: number;
  associadosInativos: number;
  taxaInadimplencia: number;
}

// ============================================
// ATIVIDADES E LOGS
// ============================================

export interface AtividadeLog {
  id: string;
  userId: string;
  acao: string;
  descricao: string;
  data: Date;
  ip?: string;
  dispositivo?: string;
}

// ============================================
// LOADING STATES
// ============================================

export interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
}

// ============================================
// API RESPONSES
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
