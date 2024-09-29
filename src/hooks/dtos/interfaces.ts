export interface ICalculadora {
  id: string;
  eletricidade: number;
  gas: number;
  transporte_individual: number;
  transporte_coletivo: number;
  alimentacao: number;
  residuos: number;
  total: number;
  fk_user_id: string;
  created_at: string;
  updated_at: string;
}

export interface IHistory {
  id: string;
  title: string;
  subtitle: string;
  fk_user_id: string;
  created_at: string;
  updated_at: string;
}

interface pagamentos {
  status: 'pago' | 'pendente' | 'recusado';
  updated_at: Date;
  value: number;
  type: string | null;
}

export interface IJangle {
  id: string;
  codigo: string;
  name: string;
  lat: string;
  log: string;
  tree: number;
}

export interface IUserMetricas {
  meta: number;
  qnt_trepycaches: number;
  history: IHistory[];
  calculadora: ICalculadora;
  pagamentos: {
    aprovados: pagamentos[];
    pendentes: pagamentos[];
    recusados: pagamentos[];
  };
  floresta: IJangle[];
}
