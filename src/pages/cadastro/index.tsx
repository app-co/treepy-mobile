import React from 'react';
import { useForm } from 'react-hook-form';
import { ScrollView } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { Box, Center, Checkbox, Image, VStack } from 'native-base';

import bg from '@/assets/Login Mobile.png';
import { LogoSvg } from '@/assets/svgs/logo';
import { Button } from '@/components/forms/Button';
import { FormInput } from '@/components/forms/FormInput';
import { Line } from '@/components/Line';
import { useRegisterUer } from '@/hooks/user/mutation';
import { schemaRegisterUser } from '@/hooks/user/schemas';
import { TRegisteruser } from '@/hooks/user/types';
import { _title, hightPercent } from '@/styles/sizes';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';

import * as S from './styles';

export function Cadastro() {
  const navigation = useNavigation();
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<TRegisteruser>({
    resolver: zodResolver(schemaRegisterUser),
  });

  const { mutateAsync, isLoading } = useRegisterUer();

  console.log(errors);

  const submit = React.useCallback(async (obj: TRegisteruser) => {
    try {
      // await mutateAsync(obj);
    } catch (error) { }
  }, []);

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
        <Center mt={hightPercent('5')}>
          <LogoSvg />
        </Center>

        <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
          <VStack space={8} p={4}>
            <Center>
              <S.title style={{ fontSize: _title + 10 }}>Cadastro</S.title>
            </Center>
            <FormInput
              name="full_name"
              control={control}
              error={errors.full_name}
              placeholder="Digite seu nome completo"
              label="Nome"
            />
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

            <FormInput
              name="replace_password"
              control={control}
              error={errors.email}
              placeholder="Confirme aqui sua senha"
              label="Confirma senha"
            />

            <Checkbox value="termos">
              <S.tex>Li e aceito os termos de uso</S.tex>
            </Checkbox>

            <Line />

            <Box style={{ gap: 15 }}>
              <Button load={isLoading} onPress={handleSubmit(submit)} />
              <Button
                onPress={() => navigation.goBack()}
                styleType="border"
                title="Voltar"
              />
            </Box>
          </VStack>
        </ScrollView>
      </LinearGradient>
    </S.Container>
  );
}
