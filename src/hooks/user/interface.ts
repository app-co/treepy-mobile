/* eslint-disable prettier/prettier */
export interface Shipping {
  locality: string;
  street: string;
  number: string;
  complement: string;
  city: string;
  region: string;
  country: string;
  postal_code: string;
  region_code: string;
  home_number: string;
  state: string;
}

export interface IEnd {
  locality: string;
  postal_code: string;
  city: string;
  fk_user_id: string;
  id: string;
  home_number: string;
  state: string;
  street: string;
  region_code: string;
  complement: string;
}

export interface IProfile {
  avatar: string;
  fk_user_id: string;
  id: string;
}

type Treepycash = {
  cachesId: string;
  created_at: string;
  fk_user_id: string;
  id: string;
  meta: number;
  treepycash: number;
  updated_at: string;
};

interface ICardToken {
  id: string;
  token: string;
  number: string;
  brand: string;
  userId: string;
  created_at: Date | string;
  updated_at: Date | string;
}

type T = {
  item: string;
  co2: number;
  porcent: number;
};

export interface ICalculadora {
  id?: string;
  eletricidade: T;
  gas: T;
  transporte_individual: T;
  transporte_coletivo: T;
  alimentacao: T;
  residuos: T;
  total: T;
  fk_user_id?: string;
}

export interface IJangle {
  id: string;
  name: string;
  codigo: string;
  description: string;
  lat: string;
  log: string;
  tree: number;
  country: 'BR';
  status:
  | 'Incio_plantacao'
  | 'Plantacao_realizada'
  | 'Manutencao_inicial'
  | 'Manutencao_crescimento'
  | 'Manutencao_preservacao'
  | 'Planta_finalizada';

  // prestador
  provider_name: string;
  cpf: string;
  crea: string;
  work_name: string;
  IE_IM: string;
  postal_code: string;
  home_number: string;
  complement: string;
  city: string;
  region: string;
  email: string;
  cell_phone: string;
  phone: string;

  // proprietário
  matricula: string;
  expedition_date: string;
  proprerty_name: string;
  beneficiary_planting_name: string;
  total_area: string;
  planting_area: string;

  // projeto
  project_name: string;
  response_name: string;
  aprovation_ambiental_name: string;
  authorization: string;
  plant: string;

  // custo
  quantity_tree: number;
  project_value: number;
  tree_media_value: number;

  observacoes?: string;

  created_at: Date | Date | string;
  updated_at: Date | Date | string;
}

export interface IUser {
  full_name: string;
  email: string;
  cpf: string;
  id: string;
  password: string;
  phone_area: string;
  phone_number: string;
  role: 'USER' | 'ADMIN';
  end: IEnd;
  janglesId: string;
  Jangles: IJangle[];
  Calculadora: ICalculadora;
  cardToken: ICardToken;
  cashe_cliente: Treepycash[];
  created_at: Date | string;
  updated_at: Date | string;
  profile: IProfile;
  History: {
    id: string;
    title: string;
    subtitle: string;
    created_at: Date;
    date: { day: string; hour: string };
  }[];
}

type TStatus =
  | 'PAID'
  | 'DECLINE'
  | 'WAITING'
  | 'PENDENTE'
  | 'AUTHORIZED'
  | 'IN_ANALISIS'
  | 'CANCELED'


export interface IMetricas {
  meta: number
  treepyCashe: number
  extrato: { tree: number; status: TStatus; data: Date | string }[]
  extratoPaid: { tree: number; status: TStatus; data: Date | string }[]
  porcentMeta: number
  jangle: {
    name: string
    descripton: string
    tree: number
    status: string
  }[]
}
