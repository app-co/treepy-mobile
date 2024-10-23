/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Alert, ScrollView, Text } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

import { Box, HStack, VStack } from 'native-base';

import { useAuth } from '@/contexts/auth';
import { color } from '@/styles/theme';
import {
  DrawerContentComponentProps,
  DrawerItemList,
} from '@react-navigation/drawer';

import { Button } from '../forms/Button';
import { Avatar, Container, Header, TitleName } from './styles';

type Props = DrawerContentComponentProps;

export function DrawerContent({ ...props }: Props) {


  const { user, signOut } = useAuth();

  const handleDeleteAcconut = React.useCallback(async (id: string) => {
    console.log(id)


  }, [])

  const deleteAcconut = React.useCallback(async () => {
    Alert.alert('Atenção', 'Você tem certeza que deseja deletar sua conta?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Deletar',
        onPress: () => handleDeleteAcconut(user!.id),
      },
    ])
  }, [])



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

        <VStack mt='6' w="200px" space={10}>
          <Box flex={.5}>
            <Button onPress={deleteAcconut} style={{ backgroundColor: color.orange[400] }} title='Excluir minha conta' styleType='dark' />
          </Box>

          <Box flex={.5}>
            <Button onPress={() => signOut()} title='SAIR' />
          </Box>


        </VStack>

      </ScrollView>
    </Container>
  );
}
