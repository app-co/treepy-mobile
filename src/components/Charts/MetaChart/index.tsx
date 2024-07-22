/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { PieChart } from 'react-native-gifted-charts';

import { Box, HStack } from 'native-base';

import { MetaSvg } from '@/assets/svgs/meta';
import { _title } from '@/styles/sizes';
import { color } from '@/styles/theme';

import * as S from './styles';

const data = [
  {
    value: 90,
    color: color.greenLigh[100],
    focused: true,
    gradientCenterColor: '#3BE9DE',
  },
  {
    value: 70,
    color: color.gray[300],
    gradientCenterColor: '#3BE9DE',
  },
];

export function MetaChart() {
  return (
    <S.Container>
      <HStack alignItems="center" justifyContent="space-between">
        <Box>
          <HStack mb={4} alignItems="center" justifyContent="center" space={4}>
            <MetaSvg />
            <S.title style={{ fontFamily: 'light' }}>Meta</S.title>
          </HStack>
          <S.title style={{ fontFamily: 'black', fontSize: _title + 8 }}>
            1000
          </S.title>
          <S.sub>TreepyCashes</S.sub>
          <S.text>por ano</S.text>
        </Box>

        <PieChart
          donut
          radius={70}
          innerRadius={67}
          data={data}
          innerCircleColor="rgb(4, 43, 23)"
          sectionAutoFocus
          centerLabelComponent={() => (
            <S.text style={{ fontFamily: 'light', fontSize: _title }}>
              50%
            </S.text>
          )}
        />
      </HStack>
    </S.Container>
  );
}
