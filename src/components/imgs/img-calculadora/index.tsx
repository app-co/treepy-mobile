/* eslint-disable react/require-default-props */
import React, { ReactNode } from 'react';

import { HStack, Image } from 'native-base';

import bg from '@/assets/duvida.png';
import { CalculadoraSvg } from '@/assets/svgs/calculadora';

import * as S from './styles';

interface I {
  children: ReactNode;
  title?: string;
}

export function ImgCalculadora({ title = 'Calculadora', children }: I) {
  return (
    <S.Container>
      <Image
        alt="bg"
        source={bg}
        resizeMode="cover"
        w="full"
        h="full"
        position="absolute"
        top={0}
        right={0}
      />
      <S.content>
        <HStack alignItems="center" space={4}>
          <CalculadoraSvg />
          <S.title>{title}</S.title>
        </HStack>
        {children}
      </S.content>
    </S.Container>
  );
}
