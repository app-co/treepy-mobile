export interface IUser {
  accessToken: string;
  nome: string;
  email: string;
  usuarioId: string;
  associadoId: string | null;
  enumNivel: number;
  fotoUrl: string;
  cpfCnpj: string;
  associado: false;
  placas: string[];
  errors: string[];
  isValid: boolean;
}
export interface IHomeInfo {
  combustivelMaisAbastecido: string;
  totalEconomizado: string;
  errors: any[];
  isValid: boolean;
}
export interface IVirtualCard {
  codCartao: string;
  dataValidade: string;
  nomeGrupo: string;
  nomeAssociado: string;
  errors: any[];
  isValid: boolean;
}

interface PrecoCombustivel {
  id: string;
  precoClubGas: string;
  precoBomba: string;
  titulo: string;
  ordemPreco: string;
}

interface Observacoe {
  id: string;
  informacao: string;
  enumOrdem: string;
}

export interface IGetPostos {
  id: string;
  latitude: number;
  longitude: number;
  distancia: number;
  postoNome: string;
  horarioFechamento: string;
  horarioAbertura: string;
  fotoBandeiraPosto: string;
  fotoLogoPosto: string;
  nomeCidade: string;
  enderecoPosto: string;
  cidadeEstado: string;
  observacoes: Observacoe[];
  precoCombustivel: PrecoCombustivel[];
}
export interface IGetInfoPosto {
  id: string;
  posto: Posto;
  errors: any[];
  isValid: boolean;
}

interface Posto {
  tituloPainel: string;
  nomePostoApp: string;
  rede: null;
  razaoSocial: string;
  cnpj: string;
  responsavel: string;
  email: string;
  telefone: string;
  latitude: number;
  longitude: number;
  bandeira: string;
  fotoBandeira: null;
  fotoLogo: null;
  endpointPrecosCombustiveis: null;
  statusFase: string;
  enumStatusPosto: string;
  abertura: string;
  fechamento: string;
  exibirnoApp: boolean;
  cartaoIdentifid: string;
  precosCombustiveis: PrecosCombustivei[];
  tokenPortal: string;
  infoPostos: InfoPosto[];
  usuariosSistemas: null;
  logradouro: string;
  numero: string;
  cep: string;
  bairro: string;
  regiao: string;
  complemento: string;
  nomeCidade: string;
  uf: string;
  sistema: null;
  dataAtualizadoPreco: null;
  redeId: null;
  postoRede: null;
  enumOpcaoPreco: null;
  grupos: any[];
  enumPrice: string;
  saldoMinimo: number;
  fechamentoAutomatico: boolean;
  observacao: null;
  precoWebPosto: string;
  status: string;
  id: string;
  dataCriacao: string;
  dataAlteracao: string;
}

interface InfoPosto {
  postoId: string;
  infoPostoId: string;
  ordemApp: string;
  infoApp: InfoApp;
  status: string;
  id: string;
  dataCriacao: string;
  dataAlteracao: null;
}

interface InfoApp {
  informacao: string;
  enumOrdem: string;
  infoPostos: any[];
  status: string;
  id: string;
  dataCriacao: string;
  dataAlteracao: null;
}

interface PrecosCombustivei {
  precoBomba: number;
  descontoPosto: number;
  descontoTotal: number;
  subsidioClubGas: number;
  precoClubGas: number;
  codigoProduto: number;
  ordemApp: string;
  origem: string;
  postoId: string;
  combustivelId: string;
  combustivel: Combustivel;
  status: string;
  id: string;
  dataCriacao: string;
  dataAlteracao: string;
}

interface Combustivel {
  titulo: string;
  corCombustivel: string;
  codigoAnp: number;
  tipoCombustivel: null | string;
  statusOrdem: string;
  precos: any[];
  precoSubsidios: null;
  status: string;
  id: string;
  dataCriacao: string;
  dataAlteracao: null | string;
}

export interface IHistoricoAbastecimento {
  totalEconomizado: string;
  pago: string;
  litros: string;
  mes: string;
  historicosAbastecimentos: HistoricosAbastecimento[];
}

interface HistoricosAbastecimento {
  bandeira: string;
  nomePosto: string;
  totalPrecoBomba: string;
  totalPrecoClubGas: string;
  horasAbastecimento: string;
  dataAbastecimento: string;
  placa: string;
  nomeCombustivel: string;
  qtdLitrosAbastecido: string;
  fotoBandeira: null | string;
}

interface Pagination {
  totalElements: number;
  pageSize: number;
  pageNumber: number;
  totalPages: number;
}

export interface ILoginUser {
  accessToken?: string;
  nome: string;
  email: string;
  usuarioId: string;
  associadoId: string;
  enumNivel: number;
  fotoUrl: string;
  errors: string;
  isValid: boolean;
}

export interface IHistoricoPagamento {
  id: string;
  associadoId: string;
  dataVencimento: string;
  mesReferencia: string;
  statusPagamento: number;
}

export interface IPlanoAssociado {
  id: string;
  nomePlano: string;
  dataVigente: string;
  valor: number;
  status: string;
  errors: any[];
  isValid: boolean;
}

export interface IUserById {
  celular: string;
  nomeCompelto: null;
  dataNacimento: string;
  foto: string;
}
