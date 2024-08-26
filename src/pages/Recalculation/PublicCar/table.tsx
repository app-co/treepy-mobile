import { TouchableOpacity } from 'react-native';

import { Feather } from '@expo/vector-icons';

import { Box, HStack, Text } from 'native-base';

import { color } from '@/styles/theme';
import { _toPtBRNumber } from '@/utils/unidades';

interface props {
  item: {
    veiculo: string;
    Quilometragem: number;
    id: number;
    co2: number;
  }[];
  del: (index: number) => void;
}

export function Table({ item = [], del }: props) {
  return (
    <Box bg={color.green[100]} mt={8} rounded={8} p={4}>
      <HStack alignItems="center" justifyContent="space-between">
        <Text color={color.gray[200]} fontFamily="regular">
          Veículo
        </Text>
        <Text color={color.gray[200]} fontFamily="regular">
          Quilometragem
        </Text>
        <Text color={color.gray[200]} fontFamily="regular">
          Excluir
        </Text>
      </HStack>

      {item.map(h => (
        <HStack
          key={h.id}
          alignItems="center"
          justifyContent="space-between"
          mt={4}
        >
          <Text fontFamily="bold" w="120px" color={color.gray[100]}>
            {h.veiculo}
          </Text>
          <Text fontFamily="bold" color={color.gray[100]}>
            {_toPtBRNumber(h.Quilometragem)}
          </Text>

          <TouchableOpacity onPress={() => del(h.id)}>
            <Feather name="trash-2" size={25} color={color.orange[200]} />
          </TouchableOpacity>
        </HStack>
      ))}
    </Box>
  );
}
