import React from 'react';
import { useForm } from 'react-hook-form';
import { Modal, TouchableOpacity } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { Box, Center, HStack, Image, useToast, VStack } from 'native-base';

import bg from '@/assets/Login Mobile.png';
import { LogoSvg } from '@/assets/svgs/logo';
import { Button } from '@/components/forms/Button';
import { FormInput } from '@/components/forms/FormInput';
import { Input } from '@/components/forms/Input';
import { Line } from '@/components/Line';
import { useAuth } from '@/contexts/auth';
import { schemaLogin } from '@/hooks/user/schemas';
import { TLogin } from '@/hooks/user/types';
import { api } from '@/services/api';
import { AppError } from '@/services/AppError';
import { _title, hightPercent } from '@/styles/sizes';
import { color } from '@/styles/theme';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';

import * as S from './styles';

export function Login() {
  const { signIn } = useAuth();
  const navigation = useNavigation();
  const toast = useToast();
  const [email, setEmail] = React.useState<string>('');
  const [load, setLoad] = React.useState<boolean>(false);
  const [modal, setModal] = React.useState<boolean>(false);
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

  const handleSendForgotEmail = React.useCallback(async () => {
    setLoad(true);
    await api
      .post('/mail/forgot-pass', { email })
      .then(h => {
        // setModal(false)
        toast.show({
          title: 'Sucesso!',
          description:
            'Verifique sua caixa de entrada para recuperar sua senha',
          placement: 'top',
          bg: 'green.600',
        });

        setLoad(false);
        setModal(false);
        setEmail('');
      })
      .catch(h => {
        const isError = h instanceof AppError;

        if (isError) {
          toast.show({
            title: 'Erro ao enviar seu email',
            description: h.message,
          });
        }
        setTimeout(() => {
          setLoad(false);
        }, 1000);
      });
  }, [email, toast]);

  return (
    <S.Container>
      <Modal visible={modal} transparent animationType="fade">
        <Center
          style={{ gap: 10 }}
          w="370px"
          borderRadius={8}
          alignSelf="center"
          bg={color.orange[100]}
          mt={hightPercent('30')}
          p={6}
        >
          <S.title>Recuperação de senha</S.title>

          <Input
            label="E-mail"
            onChangeText={setEmail}
            placeholder="Digite seu email"
          />

          <HStack mt={6} space={4}>
            <Box flex={1}>
              <Button
                styleType="border"
                title="Cancelar"
                onPress={() => setModal(false)}
              />
            </Box>
            <Box flex={1}>
              <Button
                load={load}
                title="Enviar"
                onPress={handleSendForgotEmail}
              />
            </Box>
          </HStack>
        </Center>
      </Modal>
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
        <Center mt={hightPercent('6')}>
          <LogoSvg size={230} />
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

          <TouchableOpacity onPress={() => setModal(true)}>
            <S.sub>Esqueci minha senha</S.sub>
          </TouchableOpacity>

          <Line />

          <Box style={{ gap: 15 }}>
            <Button title="ACESSAR" onPress={handleSubmit(login)} />
            <Button
              onPress={() => navigation.navigate('cadastro')}
              styleType="border"
              title="Não tenho conta"
            />
          </Box>
        </VStack>
      </LinearGradient>
    </S.Container>
  );
}
