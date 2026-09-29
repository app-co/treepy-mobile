export interface CalculadoraRegisterParams {
  gas: number;
  eletricidade: number;
  transporte_individual: number;
  transporte_coletivo: number;
  alimentacao: number;
  residuos: number;
  userId: string;
}

export interface FlorestaRegisterParams {
  nome: string;
  codigo: string;
  lat: string;
  long: string;
  qnt_arvores: number;
  treepycash_disponivel: number;
  projeto: number;
  status: number;
}

export interface LeadEsgParams {
  nomeCompleto: string;
  emailCorporativo: string;
  cargoFuncao: string;
  nomeEmpresa: string;
  industria: 'TECNOLOGIA_SAAS' | 'AGRONEGOCIO' | 'INDUSTRIA' | 'FINANCEIRO' | 'VAREJO' | 'SAUDE' | 'EDUCACAO' | 'ENERGIA' | 'LOGISTICA' | 'OUTROS';
  tamanhoEmpresa: 'ATE_100' | 'DE_101_A_500' | 'DE_501_A_2000' | 'ACIMA_2000';
  reflorestamentoNativo?: boolean;
  neutralizacaoCO2?: boolean;
  biodiversidadeAuditada?: boolean;
  objetivosEstrategicos?: string;
}

export interface PrecificacaoParams {
  price: number;
}

export interface TransactionCardParams {
  value: number;
  cardNumber: string;
  cvv: string;
  expiryYear: string;
  expiryMonth: string;
  userId: string;
  holderName: string;
  history?: boolean;
  installmentCount?: number;
  installmentValue: number;
  cpfCnpj: string;
  postalCode: string;
  addressNumber: string;
  phone: string;
}

export interface TransactionPixParams {
  value: number;
  userId: string;
}

export interface UserRegisterParams {
  nome: string;
  email: string;
  senha: string;
  cpfCnpj?: string;
  photoUrl?: string;
}

export interface LoginParams {
  email: string;
  senha: string;
}

export interface ForgotPassParams {
  email: string;
}

export interface ResetPassParams {
  token: string;
  pas: string;
}

export interface AddTreepycasheParams {
  userId: string;
  treepycashe: number;
  florestaId: number;
}

export interface UserEnderecoParams {
  bairro: string;
  cep: string;
  cidade: string;
  estado: string;
  pais: string;
  numero: string;
  userId: string;
  rua: string;
}

export interface UpdateUserParams {
  id: string;
  nome: string;
  email: string;
  senha?: string;
  photoUrl?: string;
  cpfCnpj: string;
}
