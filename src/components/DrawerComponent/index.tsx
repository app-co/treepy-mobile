/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { ScrollView, Text } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

import { HStack, VStack } from 'native-base';

import { useAuth } from '@/contexts/auth';
import { color } from '@/styles/theme';
import {
  DrawerContentComponentProps,
  DrawerItemList,
} from '@react-navigation/drawer';

import { Avatar, Container, Header, LogOf, Title, TitleName } from './styles';

type Props = DrawerContentComponentProps;

export function DrawerContent({ ...props }: Props) {
  const { user } = useAuth();

  return (
    <Container>
      <Header>
        <HStack maxW={200}>
          <Avatar />
          <VStack ml={5}>
            <Text
              style={{
                color: color.gray[400],
                fontSize: RFValue(18),
              }}
            >
              Olá
            </Text>
            <TitleName>{user?.nome}</TitleName>
          </VStack>
        </HStack>
      </Header>

      <ScrollView>
        <DrawerItemList {...props} />

        <LogOf onPress={() => { }}>
          <Title style={{ color: color.gray[400] }}>SAIR</Title>
        </LogOf>
      </ScrollView>
    </Container>
  );
}
