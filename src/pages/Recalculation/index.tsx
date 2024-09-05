/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useReducer } from 'react';
import { ScrollView } from 'react-native';

import { Box } from 'native-base';

import { ImgCalculadora } from '@/components/imgs/img-calculadora';
import { useAuth } from '@/contexts/auth';
import { useStepByStep } from '@/contexts/step-by-step';
import { useMetricas } from '@/hooks/user/querys';
import { api } from '@/services/api';
import { useNavigation } from '@react-navigation/native';

import { CircleStep } from './CircleStep';
import { Eletrica } from './Eletrica';
import { Food } from './Food';
import { Gas } from './Gas';
import { PersonalCar } from './PersonalCar';
import { PublicCar } from './PublicCar';
import * as S from './styles';
import { Total } from './Total';

interface IProps {
  progres: (value: number) => void;
  children: React.ReactNode;
}

export interface IVeiculoProps {
  Combustível: string;
  Combustível_Tipo: string;
  Meio_de_transporte: string;
  Modelo: string;
  Potência_do_motor: string;
  Quilometragem: number;
  co2: number;
  id: number;
}

interface IState {
  title: string;
  progres: number;
  eletric: { type: string; value: number; co2: number };
  gas: { type: string; value: number; co2: number };
  personalTransport: { item: IVeiculoProps[]; value: number };
  globalTransport: { item: any[]; value: number };
  food: { item: string; co2: number; id: number };
  total: number;
}

type IAction =
  | { step: 0; payload?: { type: string; value: number; co2: number } }
  | { step: 1; payload?: { type: string; value: number; co2: number } }
  | { step: 2; payload: { item: IVeiculoProps[]; value: number } }
  | { step: 3; payload: { item: any[]; value: number } }
  | { step: 4; payload: { item: string; co2: number; id: number } }
  | { step: 5; payload: number }
  | { step: 6 };

const initialValue = {
  title: 'Eletricidade',
  progres: 1,
  step: 0,
  eletric: { type: '1', value: 0, co2: 0 },
  gas: { type: '1', value: 0, co2: 0 },
  personalTransport: { item: [], value: 0 },
  globalTransport: { item: [], value: 0 },
  food: { item: 'nenhum', co2: 0, id: 0 },
  total: 0,
};

export function Recalculation() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { refetch } = useMetricas();

  function reducer(state: IState, action: IAction) {
    switch (action.step) {
      case 0:
        return {
          ...state,
          progres: 0,
          title: 'Eletricidade',
          eletric: action.payload ? action.payload : state.eletric,
        };

      case 1:
        return {
          ...state,
          progres: 1,
          title: 'Gás',
          gas: action.payload ? action.payload : state.gas,
        };

      case 2:
        return {
          ...state,
          progres: 2,
          title: 'Transporte Individual',
          personalTransport: action.payload
            ? action.payload
            : state.personalTransport,
        };
      case 3:
        return {
          ...state,
          progres: 3,
          title: 'Transporte Coletivo',
          globalTransport: action.payload
            ? action.payload
            : state.globalTransport,
        };
      case 4: {
        const ali = action.payload?.co2 ? action.payload.co2 : state.food.co2;
        const total =
          state.eletric.co2 +
          state.gas.co2 +
          state.personalTransport.value +
          state.globalTransport.value +
          ali;

        return {
          ...state,
          progres: 4,
          title: 'Alimentação',
          food: action.payload ? action.payload : state.food,
          total,
        };
      }

      case 5: {
        const total =
          state.eletric.co2 +
          state.gas.co2 +
          state.personalTransport.value +
          state.globalTransport.value +
          state.food.co2;

        return state;
      }

      case 6:
        navigation.goBack();
        return initialValue;

      default:
        break;
    }
    return state;
  }

  const [state, dispatch] = useReducer(reducer, initialValue);

  const conponets = [
    <Eletrica
      getItem={state.eletric}
      onChange={h => {
        dispatch({ step: 0, payload: h });
        changeStep(currentStep + 1);
      }}
    />,
    <Gas
      goBack={() => changeStep(currentStep - 1)}
      getItem={state.gas}
      onChange={h => {
        dispatch({ step: 1, payload: h });
        changeStep(currentStep + 1);
      }}
    />,
    <PersonalCar
      getItem={state.personalTransport.item}
      goBack={() => changeStep(currentStep - 1)}
      next={() => changeStep(currentStep + 1)}
      setItem={h => {
        dispatch({ step: 2, payload: h });
      }}
    />,
    <PublicCar
      goBack={() => changeStep(currentStep - 1)}
      getItem={state.globalTransport.item}
      setItemC={h => {
        dispatch({ step: 3, payload: h });
      }}
      next={() => changeStep(currentStep + 1)}
    />,
    <Food
      getItem={state.food}
      setItem={h => {
        dispatch({ step: 4, payload: h });
      }}
      goBack={() => changeStep(currentStep - 1)}
      next={() => changeStep(currentStep + 1)}
    />,
    <Total
      clear={() => {
        dispatch({ step: 6 });
        changeStep(0);
      }}
      item={state}
    />,
  ];

  const { changeStep, currentComponent, currentStep, lastStep } = useStepByStep(
    {
      step: conponets,
    },
  );

  const handleSaveCalc = React.useCallback(async () => {
    const calculadora = {
      eletricidade: {
        item: 'Eletricidade',
        co2: state.eletric.co2,
        porcent: 0,
      },
      gas: {
        item: 'Gás',
        co2: state.gas.co2,
        porcent: 0,
      },
      transporte_individual: {
        item: 'Transporte Individual',
        co2: state.personalTransport.value,
        porcent: 0,
      },
      transporte_coletivo: {
        item: 'Transporte Coletivo',
        co2: state.globalTransport.value,
        porcent: 0,
      },
      residuos: {
        item: 'residuos',
        co2: 0,
        porcent: 0,
      },
      alimentacao: {
        item: 'Alimentação',
        co2: 10,
        porcent: 10,
      },
      total: {
        item: 'Total',
        co2: state.total,
        porcent: 0,
      },
    };

    const dt = {
      ...calculadora,
      fk_user_id: user!.id,
    };

    api.post('/calc-create', dt);
    await refetch();

    await api.post('/history', {
      fk_user_id: user!.id,
      title: 'Calculadora',
      subtitle: 'Meta anual de TreepyCash recalculada',
    });
  }, [state, user]);

  React.useEffect(() => {
    if (currentStep === 5) {
      handleSaveCalc();
    }
  }, [currentStep]);

  return (
    <S.Container>
      <ImgCalculadora title="">
        <Box mt="-15px" overflow="hidden">
          <CircleStep step={currentStep + 1} />
        </Box>

        <S.conteten>
          <ScrollView contentContainerStyle={{ paddingBottom: 300 }}>
            {currentComponent}
          </ScrollView>
        </S.conteten>
      </ImgCalculadora>
    </S.Container>
  );
}
