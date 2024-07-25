import React from 'react';
import { ActivityIndicator } from 'react-native';

import { color } from '@/styles/theme';

import * as S from './styles';

export function Loading() {
  return (
    <S.Container>
      <ActivityIndicator size={50} color={color.green[100]} />
      <S.title>Carregando...</S.title>
    </S.Container>
  );
}
