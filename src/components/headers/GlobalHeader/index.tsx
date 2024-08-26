import React from 'react';
import { TouchableOpacity } from 'react-native';

import { Entypo } from '@expo/vector-icons';

import { Box } from 'native-base';

import { LogoSvg } from '@/assets/svgs/logo';
import { useAuth } from '@/contexts/auth';
import { color } from '@/styles/theme';
import { DrawerActions, useNavigation } from '@react-navigation/native';

import * as S from './styles';

export function GlobalHeader(props: any) {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [nome, sobrenome] = user!.full_name.split(' ').map(String);

  return (
    <S.Container>
      <Box ml={-30} flex={1}>
        <LogoSvg size={150} />
      </Box>

      <S.title>{`${String(nome).toUpperCase()} ${String(
        sobrenome,
      ).toUpperCase()}`}</S.title>
      <TouchableOpacity
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      >
        <Entypo name="menu" color={color.gray[100]} size={45} />
      </TouchableOpacity>
    </S.Container>
  );
}
