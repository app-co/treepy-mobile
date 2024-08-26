import React from 'react';
import { BarChart } from 'react-native-gifted-charts';

import { format, getYear } from 'date-fns';
import { HStack } from 'native-base';

import { Folha } from '@/assets/svgs/folha';
import { useMetricas } from '@/hooks/user/querys';
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
  const { data: metrica } = useMetricas();

  const char =
    metrica?.extratoPaid
      .filter(h => {
        const anoCorrente = getYear(new Date());
        return getYear(h.data) === anoCorrente;
      })
      .map(h => {
        const mes = format(new Date(h.data), 'M');
        const month = abbreviatedMonths.find((h, i) => i + 1 === Number(mes));
        return {
          value: h.tree,
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

  return (
    <S.Container>
      <HStack mb={4} space={2}>
        <Folha />
        <S.title>Seus TreepyCashes</S.title>
      </HStack>
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
    </S.Container>
  );
}
