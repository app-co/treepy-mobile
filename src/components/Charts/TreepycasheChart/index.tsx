import React from 'react';
import { BarChart } from 'react-native-gifted-charts';

import { HStack } from 'native-base';

import { Folha } from '@/assets/svgs/folha';
import { _width, hightPercent } from '@/styles/sizes';
import { color } from '@/styles/theme';

import * as S from './styles';

const abbreviatedMonths: string[] = [
  'Jan',
  'Feb',
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

const data = abbreviatedMonths.map(h => {
  const dt = {
    stacks: [
      { value: 10, color: color.gray[100] },
      { value: 3, color: color.gray[300] },
    ],
    label: h,
  };

  return dt;
});

export function TreepycasheChart() {
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
        stackData={data}
        barWidth={20}
      />
    </S.Container>
  );
}
