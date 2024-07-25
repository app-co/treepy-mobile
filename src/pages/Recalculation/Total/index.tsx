import React from 'react';

import { Box, Center, VStack } from 'native-base';

import { Button } from '@/components/forms/Button';
import { Payment } from '@/components/template/Payment';
import { color } from '@/styles/theme';

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
      <Payment open={openShet} closed={() => setOpenShet(false)} />
      <Center>
        <S.title style={{ textAlign: 'center' }}>
          Resumo anual de suas emissões de gases de efeito estufa.
        </S.title>
      </Center>

      <VStack space={6}>
        <Box bg={color.green[100]} p={2} borderRadius={8} mt={8}>
          <Table item={item} />
        </Box>

        <Center style={{ gap: 10 }} rounded={8} bg={color.greenLigh[100]} p={2}>
          <S.title style={{ fontFamily: 'bold', color: color.orange[100] }}>
            TreepyCashes
          </S.title>

          <S.text style={{ fontFamily: 'regular', color: color.green[300] }}>
            Compre agora à vista ou parcele os seus{' '}
            <S.text style={{ fontFamily: 'black', color: color.green[300] }}>
              TreepyCashes
            </S.text>{' '}
            ou{' '}
            <S.text style={{ fontFamily: 'black', color: color.orange[100] }}>
              comece agora
            </S.text>{' '}
            a compensação com apenas um TreepyCash (cada TreepyCash equivale à
            uma árvore plantada).
          </S.text>

          <Button onPress={() => setOpenShet(true)} title="Comprar" />
          <Button onPress={clear} title="Refazer" styleType="border" />
        </Center>
      </VStack>
    </S.Container>
  );
}
