import React from 'react';
import { FlatList } from 'react-native';

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
import { Loading } from '@/components/Loading';
import { useMetricas } from '@/hooks/user/querys';
import { _text } from '@/styles/sizes';
import { color } from '@/styles/theme';

import * as S from './styles';

const status: { [key: string]: string } = {
  Incio_plantacao: 'Início da plantação',
  Plantacao_realizada: 'Plantação realizada',
  Manutencao_inicial: 'Manutenção inicial',
  Manutencao_crescimento: 'Manutenção de crescimento',
  Manutencao_preservacao: 'Manutenção de preservação',
  Planta_finalizada: 'Plantação finalizada',
};

export function Florestas() {
  const { data, isLoading } = useMetricas();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <S.Container>
      <ImgFloresta>
        <FlatList
          data={data.jangle}
          keyExtractor={(h, i) => String(i)}
          renderItem={({ item: h }) => (
            <S.content>
              <Box style={{ gap: 10 }}>
                <HStack alignItems="center" space={3}>
                  <JangleSvg size={35} />
                  <S.sub>Floresta</S.sub>
                </HStack>
                <S.title style={{ fontFamily: 'bold' }}>{h.name}</S.title>
                <Line />
              </Box>

              <Box style={{ gap: 10 }}>
                <HStack alignItems="center" space={3}>
                  <Foundation
                    name="clipboard-notes"
                    color={color.gray[100]}
                    size={35}
                  />
                  <S.sub style={{ fontSize: _text }}>{h.descripton}</S.sub>
                </HStack>
                <Line />
              </Box>

              <Box style={{ gap: 10 }}>
                <HStack alignItems="center" space={3}>
                  <Folha />
                  <S.sub>TreepyCashes</S.sub>
                </HStack>
                <S.title>{h.tree ?? 0}</S.title>

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
                  <S.sub>{status[h.status]}</S.sub>
                </HStack>
              </Box>
            </S.content>
          )}
        />
      </ImgFloresta>
    </S.Container>
  );
}
