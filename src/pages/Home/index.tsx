/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { ScrollView } from 'react-native';

import { Box, HStack } from 'native-base';

import { OperationSvg } from '@/assets/svgs/operation';
import { MetaChart } from '@/components/Charts/MetaChart';
import { TreepycasheChart } from '@/components/Charts/TreepycasheChart';
import { ImgHome } from '@/components/imgs/HomeBg';
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

export function Home() {
  return (
    <S.Container>
      <ImgHome>
        <ScrollView>
          <S.content>
            <S.box>
              <MetaChart />
            </S.box>

            <S.box>
              <TreepycasheChart />
            </S.box>

            <S.box>
              <HStack mb={4} alignItems="center" space={3}>
                <OperationSvg />
                <S.sub style={{ fontFamily: 'light' }}>
                  Recentes operações
                </S.sub>
              </HStack>

              <HStack alignItems="center" justifyContent="space-between">
                <S.sub style={{ fontFamily: 'bold', width: 100 }}>
                  Abertura de conta
                </S.sub>
                <S.text>descricao</S.text>
                <Box>
                  <S.text>12/02/24</S.text>
                  <S.text>19:00</S.text>
                </Box>
              </HStack>
            </S.box>
          </S.content>
        </ScrollView>
      </ImgHome>
    </S.Container>
  );
}
