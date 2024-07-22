import React from 'react';
import { TouchableOpacity } from 'react-native';

import { Entypo } from '@expo/vector-icons';

import { HStack } from 'native-base';

import { LogoSvg } from '@/assets/svgs/logo';
import { color } from '@/styles/theme';
import { DrawerActions, useNavigation } from '@react-navigation/native';

import * as S from './styles';

export function GlobalHeader(props: any) {
  const navigation = useNavigation();
  return (
    <S.Container>
      <LogoSvg width={100} height={60} />

      <HStack alignItems="center" space={4}>
        <S.title>GlobalHeader</S.title>
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <Entypo name="menu" color={color.gray[100]} size={45} />
        </TouchableOpacity>
      </HStack>
    </S.Container>
  );
}
