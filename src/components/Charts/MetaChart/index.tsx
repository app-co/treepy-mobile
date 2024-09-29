/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { PieChart } from 'react-native-gifted-charts';

import { Box, HStack } from 'native-base';

import { Loading } from '@/components/Loading';
import { useUserMetricas } from '@/hooks/querys';
import { _title } from '@/styles/sizes';
import { color } from '@/styles/theme';

import * as S from './styles';

// const data = [
//   {
//     value: 9,
//     color: '#009FFF',
//     gradientCenterColor: '#006DFF',
//     focused: true,
//   },
//   { value: 10 - 9, color: '#93FCF8', gradientCenterColor: '#3BE9DE' },
// ];
export function MetaChart() {
  // const { data: metrica, isLoading } = useMetricas();
  const { data: metrica, isLoading } = useUserMetricas();

  const treepycache = metrica?.qnt_trepycaches ?? 0;
  const meta = metrica?.meta ?? 0;

  const value = 0 / 1 === 'NaN' || 'Infinity' ? 0 : treepycache / meta;

  const porcent = value.toLocaleString('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const data = [
    {
      value: 1,
      color: color.greenLigh[200],
      focused: true,
      gradientCenterColor: '#167b3a',
    },
    {
      value: meta - treepycache < 0 ? 0 : meta - treepycache,
      color: color.gray[300],
      gradientCenterColor: '#717171',
    },
  ];

  if (isLoading) {
    <Loading />;
  }

  return (
    <S.Container>
      <HStack alignItems="center" justifyContent="space-between">
        <Box>
          <HStack mb={4} alignItems="center" justifyContent="center" space={4}>
            {/* <MetaSvg size={30} /> */}
            <S.title style={{ fontFamily: 'light' }}>Sua Meta</S.title>
          </HStack>
          <S.title style={{ fontFamily: 'black', fontSize: _title + 8 }}>
            {0}
          </S.title>
          <S.sub>TreepyCashes</S.sub>
          <S.text>por ano</S.text>
        </Box>

        <PieChart
          data={data}
          donut
          showGradient
          sectionAutoFocus
          radius={90}
          innerRadius={60}
          innerCircleColor="#232B5D"
          centerLabelComponent={() => {
            return (
              <Box style={{ justifyContent: 'center', alignItems: 'center' }}>
                <S.title
                  style={{
                    fontSize: _title + 5,
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                >
                  {porcent}
                </S.title>
              </Box>
            );
          }}
        />
      </HStack>
    </S.Container>
  );
}
