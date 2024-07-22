import React from 'react';
import { TouchableOpacity } from 'react-native';
import { OSNotification } from 'react-native-onesignal';

import * as S from './styles';

interface I {
  title: string;
  onClosed: () => void;
  data: OSNotification;
}

export function Notification({ title, data, onClosed }: I) {
  console.log({ data: data.additionalData });

  return (
    <S.Container>
      <S.title>{title}</S.title>

      <TouchableOpacity onPress={onClosed}>
        <S.title>fechar</S.title>
      </TouchableOpacity>
    </S.Container>
  );
}
