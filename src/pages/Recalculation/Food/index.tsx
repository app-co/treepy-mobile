import React from 'react';

import { Box, Center, HStack } from 'native-base';

import { Button } from '@/components/forms/Button';
import { RadioGrup } from '@/components/forms/RadioGrup';
import { color } from '@/styles/theme';
import { food } from '@/utils/food';

import * as S from './styles';

const foods = food.map(h => {
  return { label: h.fod, value: String(h.id) };
});

interface IFood {
  fod: string;
  id: number;
  co2: number;
}

type T = {
  item: string;
  co2: number;
  id: number;
};

interface I {
  setItem: (h: T) => void;
  getItem: T;
  goBack: () => void;
  next: () => void;
}

export function Food({ setItem, goBack, next, getItem }: I) {
  // const [itemFood, setItemFood] = React.useState(getItem)
  function changeItem(item: string) {
    const itemSelecion = food.find(h => h.id === Number(item));
    setItem({
      item: itemSelecion!.fod,
      co2: Number((itemSelecion!.co2 / 1000).toFixed(2)),
      id: itemSelecion!.id,
    });
  }

  return (
    <S.Container>
      <Center my={2}>
        <S.title style={{ fontFamily: 'trin' }}>
          Escolha o consumo que melhor define a sua dieta no dia a dia
        </S.title>
      </Center>

      <Box w="full" flex={1} bg={color.green[100]} p={3} rounded={8}>
        <RadioGrup radios={foods} selected={h => changeItem(h)} alin="column" />

        <HStack space={8} mt={8}>
          <Box flex={1}>
            <Button onPress={goBack} title="Voltar" styleType="border" />
          </Box>
          <Box flex={1}>
            <Button onPress={next} title="Próximo" styleType="light" />
          </Box>
        </HStack>
      </Box>
    </S.Container>
  );
}
