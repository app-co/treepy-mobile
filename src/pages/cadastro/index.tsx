import React from 'react';
import { useForm } from 'react-hook-form';
import { ScrollView, TouchableOpacity } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import * as Link from 'expo-linking';

import { Box, Center, Checkbox, HStack, Image, VStack } from 'native-base';

import bg from '@/assets/Login Mobile.png';
import { LogoSvg } from '@/assets/svgs/logo';
import { Button } from '@/components/forms/Button';
import { FormInput } from '@/components/forms/FormInput';
import { Line } from '@/components/Line';
import Toast from '@/components/modals/toast/handler';
import { useRegisterUer } from '@/hooks/user/mutation';
import { schemaRegisterUser } from '@/hooks/user/schemas';
import { TRegisteruser } from '@/hooks/user/types';
import { AppError } from '@/services/AppError';
import { _title, hightPercent } from '@/styles/sizes';
import { color } from '@/styles/theme';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';

import * as S from './styles';

export function Cadastro() {
  const [termos, setTermos] = React.useState(false);

  const navigation = useNavigation();
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<TRegisteruser>({
    resolver: zodResolver(schemaRegisterUser),
  });

  const { mutateAsync, isLoading } = useRegisterUer();

  const submit = React.useCallback(
    async (obj: TRegisteruser) => {
      if (!termos) {
        Toast.show({
          title: 'Aviso',
          description: 'Você precisa aceitar os termos de uso para prosseguir.',
          tipo: 'warning',
        });
        return;
      }

      try {
        await mutateAsync(obj);
        Toast.show({
          title: 'Sucesso!',
          description: 'Conta criada com sucesso!',
          tipo: 'success',
        });
      } catch (error) {
        if (error instanceof AppError) {
          Toast.show({
            title: 'Error',
            description: error.message,
            tipo: 'warning',
          });
        }
      }
    },
    [termos],
  );

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
              secureTextEntry
            />

            <FormInput
              name="replace_password"
              control={control}
              error={errors.replace_password}
              placeholder="Confirme aqui sua senha"
              label="Confirma senha"
              secureTextEntry
            />

            <HStack alignItems="center" space={4}>
              <Checkbox
                value="termos"
                aria-label="Termos"
                onChange={h => setTermos(h)}
                _checked={{
                  bg: color.orange[100],
                  borderColor: color.orange[200],
                }}
              />

              <TouchableOpacity
                onPress={() => Link.openURL('https://www.treepy.com.br')}
              >
                <S.tex>Li e Aceito os termos de uso</S.tex>
              </TouchableOpacity>
            </HStack>

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
