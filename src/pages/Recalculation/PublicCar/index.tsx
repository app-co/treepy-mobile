import React, { useCallback } from 'react';

import { Actionsheet, Box, Center, HStack } from 'native-base';

import { Button } from '@/components/forms/Button';

import * as S from './styles';
import { Table } from './table';
import { buildGlobalTransport } from './utils';

export type TTypeTransport =
  | 'Selecione um veículo'
  | 'Táxi'
  | 'Metrô'
  | 'Trem urbano'
  | 'Ônibus municipal'
  | 'Ônibus de viagem'
  | 'Balsa de passageiros'
  | 'Balsa de veículos'
  | 'Balsa de veículos e passageiros';

type TItemProps = {
  item: IVeiculoCProps[];
  value: number;
};

export interface IVeiculoCProps {
  veiculo: string;
  Quilometragem: number;
  id: number;
  co2: number;
}

interface I {
  goBack: () => void;
  setItemC: (item: TItemProps) => void;
  getItem: IVeiculoCProps[];
}

export function PublicCar({ goBack, setItemC, getItem }: I) {
  const handleNext = React.useCallback(async () => { }, []);
  const [saveItem, setSaveItem] = React.useState<IVeiculoCProps[]>(getItem);
  const [byStep, setByStep] = React.useState(1);
  const [openBuildModal, setOpenBuildModal] = React.useState<boolean>(false);
  const [km, setKm] = React.useState('');
  const [car, setCar] = React.useState({ field: '', value: '' });

  function handleCancel() {
    setOpenBuildModal(false);
    setCar({ field: '', value: '' });
    setKm('');
    setByStep(1);
  }

  const handleAddItem = React.useCallback(() => {
    const build = buildGlobalTransport(car.field as TTypeTransport, km);

    const item = [...saveItem, build];
    const value = item.reduce((ac, i) => ac + i.co2, 0);
    const data = {
      item,
      value: Number((value / 1000).toFixed(2)),
    };

    handleCancel();
    setSaveItem(item);
    setItemC(data);
  }, [car.field, km, saveItem, setItemC]);

  const removeItem = useCallback(
    (id: number) => {
      const index = saveItem.findIndex((h, i) => i === id);
      const arry = [...saveItem];

      if (index !== -1) {
        arry.splice(index, 1);
      }

      setSaveItem(arry);

      const value = arry.reduce((ac, i) => ac + i.co2, 0);
      const data = {
        item: arry,
        value: Number((value / 1000).toFixed(2)),
      };
      setItemC(data);
    },
    [saveItem, setItemC],
  );

  return (
    <S.Container>
      <Actionsheet isOpen={openBuildModal}>
        <Box>
          <S.title>Selecione seu tranporte coletivo</S.title>
        </Box>
      </Actionsheet>
      <Center mb={4}>
        <S.title style={{ fontFamily: 'trin' }}>Utilização de </S.title>
        <S.title style={{ marginTop: -8 }}>Transporte Coletivo.</S.title>
      </Center>

      <Box my={4}>
        <S.text>
          Insira a quilometragem{' '}
          <S.text style={{ fontFamily: 'bold' }}>MENSAL</S.text> percorrida com
          seu transporte coletivo utilizado no dia a dia. É possível inserir
          mais de um tipo de transporte.
        </S.text>
      </Box>

      <Button
        onPress={() => setOpenBuildModal(true)}
        title="Adicionar transporte"
        styleType="border"
      />

      <Table item={saveItem} del={h => removeItem(h)} />

      <HStack space={8} mt={4}>
        <Box flex={1}>
          <Button onPress={goBack} title="Voltar" styleType="border" />
        </Box>
        <Box flex={1}>
          <Button onPress={handleNext} title="Proxio" styleType="light" />
        </Box>
      </HStack>
    </S.Container>
  );
}
