import React from 'react';
import { useForm } from 'react-hook-form';
import { ScrollView } from 'react-native';

import { Feather } from '@expo/vector-icons';

import { Actionsheet, Box, Center, HStack, VStack } from 'native-base';

import { LogoSvg } from '@/assets/svgs/logo';
import { MetaSvg } from '@/assets/svgs/meta';
import { Button } from '@/components/forms/Button';
import { FormInput } from '@/components/forms/FormInput';
import { Input } from '@/components/forms/Input';
import { RadioGrup } from '@/components/forms/RadioGrup';
import { Selection } from '@/components/forms/Selection';
import { useAuth } from '@/contexts/auth';
import { _title } from '@/styles/sizes';
import { color } from '@/styles/theme';

import * as S from './styles';

const grup = [
  {
    label: 'Total',
    value: '1',
  },
  {
    label: 'Parcial',
    value: '2',
  },
];

const formPayment = [
  {
    label: 'Cartão',
    value: '1',
  },
  {
    label: 'Pix',
    value: '2',
  },
  {
    label: 'Boleto',
    value: '3',
  },
];

interface I {
  open: boolean;
  closed: () => void;
}

export function Payment({ open, closed }: I) {
  const { user } = useAuth();
  const [selectionType, setSelectionType] = React.useState<string>('0');
  const [formaPagamento, setFormaPagamento] = React.useState<string>('0');

  const [buy, setBuy] = React.useState<boolean>(false);

  const {
    control,
    formState: { errors },
  } = useForm();

  return (
    <Actionsheet isOpen={open}>
      <S.Container>
        <Center>
          <LogoSvg size={200} />
        </Center>

        <ScrollView contentContainerStyle={{ paddingBottom: 200 }}>
          {!buy ? (
            <Box>
              <HStack space={4} alignItems="center" my={4}>
                <MetaSvg />
                <S.title style={{ fontFamily: 'trin', color: color.gray[100] }}>
                  Sua meta
                </S.title>
              </HStack>

              <VStack space={4}>
                <S.title style={{ fontSize: _title + 25 }}>24</S.title>
                <S.text>Seus TreepyCashes: 0</S.text>

                <RadioGrup
                  radios={grup}
                  selected={h => setSelectionType(h)}
                  alin="row"
                />

                {selectionType === '2' && (
                  <Input
                    placeholder="Digite a quantidade"
                    keyboardType="numeric"
                    label="TreepyCashes"
                  />
                )}

                <S.title>Valor a pagar: 0</S.title>

                <Button onPress={() => setBuy(true)} title="Comprar" />
                <Button onPress={closed} title="Cancelar" styleType="border" />
              </VStack>
            </Box>
          ) : (
            <Box>
              <HStack alignItems="center" space={4} mt={6}>
                <Feather name="dollar-sign" size={30} color={color.gray[100]} />
                <S.title style={{ fontFamily: 'trin', color: color.gray[100] }}>
                  Forma de pagamento
                </S.title>
              </HStack>

              <Center mt={8}>
                <RadioGrup
                  radios={formPayment}
                  selected={h => setFormaPagamento(h)}
                  alin="row"
                />
              </Center>

              {formaPagamento === '1' && (
                <Box style={{ gap: 15 }} mt={10}>
                  <FormInput
                    name="holder"
                    control={control}
                    label="Nome"
                    placeholder="Nome impresso no cartão"
                  />

                  <FormInput
                    name="holder"
                    control={control}
                    label="Número"
                    placeholder="Número do cartão"
                  />

                  <HStack space={6}>
                    <Box flex={1}>
                      <FormInput
                        name="holder"
                        control={control}
                        label="Validade"
                        placeholder="Mês/ano"
                      />
                    </Box>

                    <Box flex={1}>
                      <FormInput
                        name="holder"
                        control={control}
                        label="CVV"
                        placeholder="CVV"
                      />
                    </Box>
                  </HStack>

                  <Selection itemSelected={h => console.log(h)} itens={[]} />

                  <Box mt={8} style={{ gap: 10 }}>
                    <Button
                      onPress={() => setBuy(true)}
                      title="Finalizar compra"
                    />
                    <Button
                      onPress={() => {
                        closed();
                        setBuy(false);
                      }}
                      title="Cancelar"
                      styleType="border"
                    />
                  </Box>
                </Box>
              )}
              {formaPagamento === '2' && (
                <Box>
                  <S.title>pix</S.title>
                </Box>
              )}
              {formaPagamento === '3' && (
                <Box>
                  <S.title>boleto</S.title>
                </Box>
              )}
            </Box>
          )}
        </ScrollView>
      </S.Container>
    </Actionsheet>
  );
}
