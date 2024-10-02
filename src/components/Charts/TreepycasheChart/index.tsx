import React from 'react';
import { BarChart } from 'react-native-gifted-charts';

import { format } from 'date-fns';
import { Center, HStack } from 'native-base';

import { Folha } from '@/assets/svgs/folha';
import { Button } from '@/components/forms/Button';
import { Payment } from '@/components/template/Payment';
import { useUserMetricas } from '@/hooks/querys';
import { _width, hightPercent } from '@/styles/sizes';
import { color } from '@/styles/theme';

import * as S from './styles';

const abbreviatedMonths: string[] = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
];

export function TreepycasheChart() {
  const { data: mt, isLoading } = useUserMetricas();

  const [isOpen, setIsOpen] = React.useState(false);
  const pagamentos = mt?.pagamentos?.aprovados ?? []

  const char =
    pagamentos.map(h => {
      const mes = format(new Date(h.updated_at), 'M');
      const month = abbreviatedMonths.find((h, i) => i + 1 === Number(mes));
      return {
        value: h.value,
        color: color.greenLigh[100],
        stackIndex: 0,
        label: month,
      };
    }) ?? [];

  const data = abbreviatedMonths.map(h => {
    const value = char.find(p => p.label === h);
    const dt = {
      value: value?.value ?? 0,
      label: h,
      frontColor: value?.color ?? color.gray[100],
    };

    return dt;
  });

  const tree = data.find(h => h.value > 0);

  return (
    <S.Container>
      <Payment
        tree={mt?.meta ?? 0}
        open={isOpen}
        closed={() => setIsOpen(false)}
      />
      <HStack mb={4} space={2}>
        <Folha />
        <S.title>Seus TreepyCashes</S.title>

        <S.title>Ano vigente</S.title>
      </HStack>

      {tree ? (
        <BarChart
          width={_width - 120}
          height={hightPercent('14')}
          dashGap={0.2}
          yAxisTextStyle={{
            color: color.greenLigh[100],
            fontFamaly: 'bold',
            fontSize: 12,
          }}
          xAxisLabelTextStyle={{
            color: color.gray[100],
            fontSize: 14,
            fontFamaly: 'bold',
          }}
          rotateLabel
          noOfSections={1}
          data={data}
          barWidth={20}
        />
      ) : (
        <Center style={{ gap: 20 }}>
          <S.title>Você não possui TreepyCashes</S.title>
          <Button
            onPress={() => setIsOpen(true)}
            title="Comprar TreepyCaches"
          />
        </Center>
      )}
    </S.Container>
  );
}
