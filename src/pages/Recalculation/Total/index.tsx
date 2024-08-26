import React from 'react';

import { Box, Center, VStack } from 'native-base';

import { Button } from '@/components/forms/Button';
import { Payment } from '@/components/template/Payment';
import { color } from '@/styles/theme';
import { calculatorCo2ToTree } from '@/utils/unidades';

import * as S from './styles';
import { Table } from './table';

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
interface IItem {
  title: string;
  progres: number;
  eletric: { type: string; value: number; co2: number };
  gas: { type: string; value: number; co2: number };
  personalTransport: { item: IVeiculoProps[]; value: number };
  globalTransport: { item: any[]; value: number };
  food: { item: string; co2: number; id: number };
  total: number;
}

type T = {
  clear: () => void;
  item: IItem;
};

export function Total({ item, clear }: T) {
  const [openShet, setOpenShet] = React.useState<boolean>(false);

  return (
    <S.Container>
      <Payment
        tree={calculatorCo2ToTree(item.total)}
        open={openShet}
        closed={() => setOpenShet(false)}
      />
      <Center>
        <S.title>
          Resumo anual de suas emissões de gases de efeito estufa
        </S.title>
      </Center>

      <VStack space={6}>
        <Box bg={color.green[100]} p={2} borderRadius={8} mt={8}>
          <Table item={item} />
        </Box>

        <Center style={{ gap: 10 }} rounded={8} bg={color.orange[100]} p={2}>
          <Center>
            <S.title style={{ fontFamily: 'black', color: color.green[300] }}>
              TreepyCashes
            </S.title>

            <S.title style={{ fontFamily: 'black', color: color.green[100] }}>
              {calculatorCo2ToTree(item.total)}
            </S.title>
          </Center>

          <S.text style={{ fontFamily: 'regular', color: color.green[300] }}>
            Compre à vista ou parcele seus{' '}
            <S.text style={{ fontFamily: 'black', color: color.green[300] }}>
              TreepyCashes
            </S.text>{' '}
            ou{' '}
            <S.text style={{ fontFamily: 'black', color: color.green[100] }}>
              comece agora
            </S.text>{' '}
            a compensação com apenas um TreepyCash
            <S.text style={{ color: color.green[100], fontFamily: 'black' }}>
              {' '}
              (cada TreepyCash equivale à uma árvore plantada)
            </S.text>
            .
          </S.text>

          <Button onPress={() => setOpenShet(true)} title="Comprar" />
          <Button onPress={clear} title="Voltar" styleType="border" />
        </Center>
      </VStack>
    </S.Container>
  );
}
