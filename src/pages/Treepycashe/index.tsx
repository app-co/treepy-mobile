import React from 'react';

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { Box, HStack } from 'native-base';

import { Folha } from '@/assets/svgs/folha';
import { ImgTreepycashe } from '@/components/imgs/tyeepycash';
import { color } from '@/styles/theme';

import * as S from './styles';

export function Treepycashe() {
  return (
    <S.Container>
      <ImgTreepycashe>
        <Box>
          <S.header>
            <HStack alignItems="center" space={2}>
              <Ionicons
                name="calendar-outline"
                color={color.gray[200]}
                size={25}
              />
              <S.titleHeader>Data</S.titleHeader>
            </HStack>
            <HStack alignItems="center" space={2}>
              <Folha sizes={30} />
              <S.titleHeader>TreepyCashes</S.titleHeader>
            </HStack>
            <HStack alignItems="center" space={2}>
              <MaterialCommunityIcons
                name="progress-clock"
                color={color.gray[200]}
                size={25}
              />
              <S.titleHeader>Status</S.titleHeader>
            </HStack>
          </S.header>

          <S.content>
            <S.title>2020</S.title>
            <S.title style={{ fontFamily: 'bold' }}>2020</S.title>
            <S.title>pago</S.title>
          </S.content>
        </Box>
      </ImgTreepycashe>
    </S.Container>
  );
}
