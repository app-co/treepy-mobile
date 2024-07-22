import React from 'react';

import {
  EvilIcons,
  Foundation,
  MaterialCommunityIcons,
} from '@expo/vector-icons';

import { Box, HStack } from 'native-base';

import { Folha } from '@/assets/svgs/folha';
import { JangleSvg } from '@/assets/svgs/jangle';
import { ImgFloresta } from '@/components/imgs/Img-floresta';
import { Line } from '@/components/Line';
import { _title } from '@/styles/sizes';
import { color } from '@/styles/theme';

import * as S from './styles';

export function Florestas() {
  return (
    <S.Container>
      <ImgFloresta>
        <HStack alignItems="center" space={4}>
          <JangleSvg />
          <S.title style={{ fontSize: _title + 10 }}>Florestas</S.title>
        </HStack>

        <S.content>
          <Box style={{ gap: 10 }}>
            <HStack alignItems="center" space={3}>
              <JangleSvg size={35} />
              <S.sub>Floresta</S.sub>
            </HStack>
            <S.title style={{ fontFamily: 'bold' }}>NOME</S.title>
            <Line />
          </Box>

          <Box style={{ gap: 10 }}>
            <HStack alignItems="center" space={3}>
              <Foundation
                name="clipboard-notes"
                color={color.gray[100]}
                size={35}
              />
              <S.sub>Descricão</S.sub>
            </HStack>
            <S.sub>descricao</S.sub>
            <Line />
          </Box>

          <Box style={{ gap: 10 }}>
            <HStack alignItems="center" space={3}>
              <Folha />
              <S.sub>TreepyCashes</S.sub>
            </HStack>
            <S.title>999</S.title>

            <Line />
          </Box>

          <Box style={{ gap: 10 }}>
            <HStack alignItems="center" space={3}>
              <MaterialCommunityIcons
                name="progress-clock"
                color={color.gray[100]}
                size={35}
              />
              <S.sub>Status</S.sub>
            </HStack>
            <HStack alignItems="center" space={3}>
              <EvilIcons name="gear" size={35} color={color.gray[100]} />
              <S.title>220</S.title>
            </HStack>
          </Box>
        </S.content>
      </ImgFloresta>
    </S.Container>
  );
}
