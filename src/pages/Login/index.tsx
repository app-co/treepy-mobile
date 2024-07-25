import React from 'react';
import { useForm } from 'react-hook-form';
import { TouchableOpacity } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { Box, Center, Image, useToast, VStack } from 'native-base';

import bg from '@/assets/Login Mobile.png';
import { LogoSvg } from '@/assets/svgs/logo';
import { Button } from '@/components/forms/Button';
import { FormInput } from '@/components/forms/FormInput';
import { Line } from '@/components/Line';
import { useAuth } from '@/contexts/auth';
import { schemaLogin } from '@/hooks/user/schemas';
import { TLogin } from '@/hooks/user/types';
import { AppError } from '@/services/AppError';
import { _title, hightPercent } from '@/styles/sizes';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';

import * as S from './styles';

export function Login() {
  const { signIn } = useAuth();
  const navigation = useNavigation();
  const toast = useToast();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TLogin>({
    resolver: zodResolver(schemaLogin),
  });

  async function login(objeto: TLogin) {
    try {
      await signIn(objeto);
    } catch (error) {
      if (error instanceof AppError)
        toast.show({
          description: error.message,
          placement: 'top',
          bg: 'red.600',
        });
    }
  }

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

      <LinearGradient
        style={{
          position: 'absolute',
          flex: 1,
          width: '100%',
          height: '100%',
        }}
        colors={['rgba(222, 222, 222, 0)', '#000']}
        start={{ y: 1, x: 0.9 }}
        end={{ y: 1, x: 0 }}
      >
        <Center mt={hightPercent('10')}>
          <LogoSvg />
        </Center>

        <VStack space={8} p={4}>
          <Center mt={hightPercent('3')}>
            <S.title style={{ fontSize: _title + 10 }}>
              Acesse sua conta
            </S.title>
          </Center>
          <FormInput
            name="email"
            control={control}
            error={errors.email}
            placeholder="Digite seu email"
            label="E-mail"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <FormInput
            name="password"
            control={control}
            error={errors.password}
            placeholder="Digite aqui sua senha"
            label="Senha"
          />

          <TouchableOpacity>
            <S.sub>Esqueci minha senha</S.sub>
          </TouchableOpacity>

          <Line />

          <Box style={{ gap: 15 }}>
            <Button title="ACESSAR" onPress={handleSubmit(login)} />
            <Button styleType="border" title="Não tenho conta" />
          </Box>
        </VStack>
      </LinearGradient>
    </S.Container>
  );
}
