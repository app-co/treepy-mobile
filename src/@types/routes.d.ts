import { TDetailPostos } from '@/hooks/fetchs/schemas';

type TCadastro = {
  type: 'search' | 'extra_cash' | 'businnes';
  session?: boolean;
};

type TGenerateCard = TDetailPostos & {
  placa: string;
};

export declare global {
  namespace ReactNavigation {
    interface RootParamList {
      cadastro: undefined;
      login: undefined;
      recalculation: undefined;
    }
  }
}
