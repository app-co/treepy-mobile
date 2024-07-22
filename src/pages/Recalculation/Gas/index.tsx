import React from 'react';

import { Box, Center, HStack } from 'native-base';

import { Button } from '@/components/forms/Button';
import { Input } from '@/components/forms/Input';
import { Selection } from '@/components/forms/Selection';
import { _toNumber } from '@/utils/unidades';

import * as S from './styles';

type T = { type: string; value: number; co2: number };

interface I {
  onChange: (item: T) => void;
  getItem: T;
  goBack: () => void;
}

const options = [
  { label: 'R$/mês', value: '1' },
  { label: 'm³/mês', value: '2' },
  { label: 'Botijões/mês', value: '3' },
];

const formated: { [key: string]: string } = {
  '1': 'R$/mês',
  '2': 'm³/mês',
  '3': 'Botijões/mês',
};

function calc(value: string, opt: string) {
  let a = 0;
  const valueFild = _toNumber(value);

  const calc = value.length <= 2 ? valueFild : valueFild / 100;

  if (opt === '1') {
    a = (calc * 262.4256) / 136.68;
  }

  if (opt === '2') {
    a = (calc * 622.3625) / 25.09;
  }

  if (opt === '3') {
    a = (calc * 4.407) / 0.125;
  }

  const co2 = Number((a / 1000).toFixed(2));

  const dt = {
    co2,
    value: valueFild,
    type: opt,
  };

  return dt;
}

export function Gas({ getItem, goBack, onChange }: I) {
  const [value, setValue] = React.useState(String(getItem.value));
  const [selecOption, setSelectOption] = React.useState(getItem.type);

  const handleChange = React.useCallback(() => {
    const filds = calc(value, selecOption);

    onChange(filds);
  }, [value, selecOption, onChange]);

  const enu = formated[selecOption];

  return (
    <S.Container>
      <Center>
        <S.title style={{ fontFamily: 'trin' }}>Consumo de</S.title>
        <S.title style={{ marginTop: -10 }}>Gás</S.title>
      </Center>

      <S.text>Primeirom selecione a sua unidade de medida.</S.text>
      <Box style={{ gap: 15 }} mt={6}>
        <Selection
          placeholder={selecOption ? enu : 'Unidade de medida'}
          itemSelected={h => setSelectOption(h)}
          itens={options}
        />

        <S.text>
          Insira seu consumo MENSAL ou o valor pago de gás. As informações
          constam na sua conta de gás. Mas se preferir pode inserir a quantidade
          de botijões de gás que consome em sua casa.
        </S.text>

        <Input
          label={selecOption ? enu : 'Unidade de medida'}
          onChangeText={setValue}
          value={value}
          keyboardType="numeric"
          placeholder="Digite aqui o valor."
        />

        <HStack space={8} mt={4}>
          <Box flex={1}>
            <Button onPress={goBack} title="Voltar" styleType="border" />
          </Box>
          <Box flex={1}>
            <Button onPress={handleChange} title="Proxio" styleType="light" />
          </Box>
        </HStack>
      </Box>
    </S.Container>
  );
}
