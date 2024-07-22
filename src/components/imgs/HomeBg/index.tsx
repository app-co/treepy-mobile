import React, { ReactNode } from 'react';

import { HStack, Image } from 'native-base';

import bg from '@/assets/home.png';
import { ChartSvg } from '@/assets/svgs/chart';

import * as S from './styles';

interface I {
  children: ReactNode;
}

export function ImgHome({ children }: I) {
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
          <ChartSvg />
          <S.title>Dashboard</S.title>
        </HStack>
        {children}
      </S.content>
    </S.Container>
  );
}
