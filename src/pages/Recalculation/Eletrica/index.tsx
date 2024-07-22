import React from 'react';

import { Box, Center, HStack } from 'native-base';

import { Button } from '@/components/forms/Button';
import { Input } from '@/components/forms/Input';
import { Selection } from '@/components/forms/Selection';
import { _toNumber } from '@/utils/unidades';

import * as S from './styles';

type T = { type: string; value: number; co2: number };

const options = [
  { label: 'R$/mês', value: '1' },
  { label: 'kWh/mês', value: '2' },
];

const formated: { [key: string]: string } = {
  '1': 'R$/mês',
  '2': 'kWh/mês',
};

interface I {
  onChange: (ev: T) => void;
  getItem: T;
}

function calc(value: string, opt: string) {
  let a = 0;
  const valueFild = _toNumber(value);

  const calc = value.length <= 2 ? valueFild : valueFild / 100;

  if (opt === '2') {
    a = (calc * 149.4) / 166;
  }

  if (opt === '1') {
    a = (calc * 173.4678) / 142.28;
  }

  const co2 = Number((a / 1000).toFixed(2));

  const dt = {
    co2,
    value: valueFild,
    type: opt,
  };

  return dt;
}

export function Eletrica({ getItem, onChange }: I) {
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
        <S.title style={{ marginTop: -10 }}>Eletricidade</S.title>
      </Center>

      <S.text>Primeirom selecione a sua unidade de medida.</S.text>
      <Box style={{ gap: 15 }} mt={6}>
        <Selection
          placeholder={selecOption ? enu : 'Unidade de medida'}
          itemSelected={h => setSelectOption(h)}
          itens={options}
        />

        <S.text>
          Insira seu consumo MENSAL ou o valor pago de energia elétrica. As
          informações constam na sua conta de energia elétrica.
        </S.text>

        <Input
          label={selecOption ? formated[selecOption] : 'Unidade de medida'}
          onChangeText={setValue}
          value={value}
          placeholder="Digite aqui o valor."
          keyboardType="numeric"
        />

        <HStack m={8}>
          <Box flex={1} />
          <Box flex={1}>
            <Button onPress={handleChange} title="Proxio" styleType="light" />
          </Box>
        </HStack>
      </Box>
    </S.Container>
  );
}
