/* eslint-disable prettier/prettier */
import React from 'react';
import { FlatList } from 'react-native';

import { Box, Center, HStack } from 'native-base';

import { ArrobaSvg } from '@/assets/svgs/Arroba';
import { BallonSvg } from '@/assets/svgs/ballon';
import { PredioSvg } from '@/assets/svgs/predio';
import { TextWithLimit } from '@/components/elements/text-with-limit';
import { Input } from '@/components/forms/Input';
import { ImgDuvida } from '@/components/imgs/ImgDuvida';
import { Line } from '@/components/Line';
import { _text, _title, hightPercent } from '@/styles/sizes';
import { color } from '@/styles/theme';
import { _questions } from '@/utils/questions';

import * as S from './styles';

export function Questions() {
  const [search, setSearch] = React.useState<string>('');

  const filter = search
    ? _questions.filter(h =>
      h.pergunta.toLowerCase().includes(search.toLowerCase()),
    )
    : _questions;

  return (
    <S.Container>
      <ImgDuvida>

        <Box h={hightPercent('70')}>
          <Box mb={2} style={{ gap: 10 }} >
            <Input onChangeText={setSearch} placeholder="Digite aqui sua dúvida" label="Dúvidas" />
          </Box>
          <FlatList
            data={filter}
            keyExtractor={h => h.pergunta}
            contentContainerStyle={{
              paddingBottom: 100,
            }}
            renderItem={({ item: h }) => (
              <Box p={2} bg="rgba(12, 39, 27, 0.75)" style={{ gap: 8 }}>
                <S.sub>{h.pergunta}</S.sub>
                <TextWithLimit
                  text={h.resposta}
                  characterLimit={90}
                  showMore
                  style={{
                    fontFamily: 'trin',
                    fontSize: _text,
                    color: color.gray[100],
                    width: '100%',
                  }}
                />
                <Box mt={4}>
                  <Line />

                </Box>
              </Box>
            )}

            ListFooterComponent={
              <Box style={{ gap: 20 }} my={8}>
                <Center>
                  <BallonSvg />
                </Center>

                <HStack alignItems="center" space={4} >
                  <ArrobaSvg />
                  <S.sub style={{ fontSize: _text + 10 }}>contato@treepy.com.br</S.sub>
                </HStack>
                <Line />
                <HStack alignItems="center" space={4} >
                  <PredioSvg />
                  <Box>
                    <S.title style={{ fontSize: _title }}>Avenida Paulista 1842 -</S.title>
                    <S.title style={{ fontSize: _title }}>Complemento: Conj 178 -</S.title>
                    <S.title style={{ fontSize: _title }}>Bairro: Bela Vista -</S.title>
                    <S.title style={{ fontSize: _title }}>São Paulo / SP - </S.title>
                    <S.title style={{ fontSize: _title }}>CEP: 01310-945</S.title>

                  </Box>
                </HStack>
              </Box>
            }
          />
        </Box>

      </ImgDuvida>
    </S.Container>
  );
}
