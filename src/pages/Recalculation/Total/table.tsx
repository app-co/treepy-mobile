import { Box, HStack, Text } from 'native-base';

import { _subtitle } from '@/styles/sizes';
import { color } from '@/styles/theme';

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
  item: IItem;
};

export function Table({ item }: T) {
  return (
    <Box style={{ gap: 3 }}>
      <HStack alignItems="center" justifyContent="space-between">
        <Text color={color.gray[200]}>Fonte</Text>
        <Text color={color.gray[200]}>Emissões (t CO₂e)</Text>
      </HStack>

      <HStack alignItems="center" justifyContent="space-between">
        <Text
          fontSize={_subtitle + 3}
          fontFamily="regular"
          color={color.gray[100]}
        >
          Eletricidade
        </Text>
        <Text
          fontSize={_subtitle + 3}
          fontFamily="regular"
          color={color.gray[100]}
          mr={4}
        >
          {item?.eletric.co2.toLocaleString('pt-BR')}
        </Text>
      </HStack>

      <Box w="full" h="1px" bg={color.gray[300]} />

      <HStack alignItems="center" justifyContent="space-between">
        <Text
          fontSize={_subtitle + 3}
          fontFamily="regular"
          color={color.gray[100]}
        >
          Gás
        </Text>
        <Text
          fontSize={_subtitle + 3}
          fontFamily="regular"
          color={color.gray[100]}
          mr={4}
        >
          {item?.gas.co2.toLocaleString('pt-BR')}
        </Text>
      </HStack>

      <Box w="full" h="1px" bg={color.gray[300]} />

      <HStack alignItems="center" justifyContent="space-between">
        <Text
          fontSize={_subtitle + 3}
          fontFamily="regular"
          color={color.gray[100]}
        >
          Transporte Individual
        </Text>
        <Text
          fontSize={_subtitle + 3}
          fontFamily="regular"
          color={color.gray[100]}
          mr={4}
        >
          {item?.personalTransport.value.toLocaleString('pt-BR')}
        </Text>
      </HStack>

      <Box w="full" h="1px" bg={color.gray[300]} />

      <HStack alignItems="center" justifyContent="space-between">
        <Text
          fontSize={_subtitle + 3}
          fontFamily="regular"
          color={color.gray[100]}
        >
          Transporte Coletivo
        </Text>
        <Text
          fontSize={_subtitle + 3}
          fontFamily="regular"
          color={color.gray[100]}
          mr={4}
        >
          {item?.globalTransport.value.toLocaleString('pt-BR')}
        </Text>
      </HStack>

      <Box w="full" h="1px" bg={color.gray[300]} />

      <HStack alignItems="center" justifyContent="space-between">
        <Text
          fontSize={_subtitle + 3}
          fontFamily="regular"
          color={color.gray[100]}
        >
          Alimentação
        </Text>
        <Text
          fontSize={_subtitle + 3}
          fontFamily="regular"
          color={color.gray[100]}
          mr={4}
        >
          {item?.food.co2.toLocaleString('pt-BR')}
        </Text>
      </HStack>

      <Box w="full" h="1px" bg={color.gray[300]} />

      <HStack alignItems="center" justifyContent="space-between">
        <Text
          fontFamily="bold"
          fontSize={_subtitle + 5}
          color={color.gray[100]}
        >
          Total
        </Text>
        <Text
          fontSize={_subtitle + 5}
          fontFamily="regular"
          color={color.gray[100]}
          mr={4}
        >
          {item?.total.toLocaleString('pt-BR')}
        </Text>
      </HStack>
    </Box>
  );
}
