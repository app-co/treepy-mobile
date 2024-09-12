/* eslint-disable prettier/prettier */
/* eslint-disable consistent-return */
/* eslint-disable react/jsx-no-bind */
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Image, ScrollView } from 'react-native';

import * as Link from 'expo-linking';

import {
  Actionsheet,
  Box,
  Center,
  HStack,
  useToast,
  VStack,
} from 'native-base';

import { LogoSvg } from '@/assets/svgs/logo';
import { MetaSvg } from '@/assets/svgs/meta';
import { Button } from '@/components/forms/Button';
import { FormInput } from '@/components/forms/FormInput';
import { Input } from '@/components/forms/Input';
import { RadioGrup } from '@/components/forms/RadioGrup';
import { Selection } from '@/components/forms/Selection';
import { useAuth } from '@/contexts/auth';
import { useCard } from '@/hooks/payments/mutation';
import { AppError } from '@/services/AppError';
import { _title } from '@/styles/sizes';
import { color } from '@/styles/theme';
import { _toCurrency, _toNumber, convertTeeToCurrency } from '@/utils/unidades';
import { zodResolver } from '@hookform/resolvers/zod';

import { installments } from './installments';
import { PaymentMethodAsaas } from './payment-methods';
import { schemaCardToken, TCardToken } from './schemas';
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
  tree: number;
}

interface IImage {
  pix: { img: string; text: string };
  boleto: { img: string; pdf: string };
}

const paymentMethod = new PaymentMethodAsaas();

export function Payment({ open, tree, closed }: I) {
  const { user } = useAuth();
  const { payCard, cardToken } = useCard()
  const [qntTree, setQntTree] = React.useState(tree)

  const [load, setLoad] = React.useState<boolean>(false);
  const [selectionType, setSelectionType] = React.useState<string>('0');
  const [formaPagamento, setFormaPagamento] = React.useState<string>('0');
  const [pix, setPix] = React.useState<{ qrcode: string }>();
  const [image, setImage] = React.useState<IImage>({
    pix: { img: '', text: '' },
    boleto: { img: '', pdf: '' },
  });

  const toast = useToast();

  const [saveCardToken, setSaveCardToken] = React.useState<{
    item: Omit<TCardToken, 'cardToken'>;
    modal: boolean;
  }>({ item: {} as Omit<TCardToken, 'cardToken'>, modal: false });

  const [buy, setBuy] = React.useState<boolean>(false);

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm<TCardToken>({
    resolver: zodResolver(
      schemaCardToken.omit({
        userId: true,
        permission: true
      }),
    ),
    defaultValues: {
      installmentCount: 1,
    },
  });

  const currencAmout = convertTeeToCurrency(qntTree);
  const valueAmount = _toNumber(currencAmout);
  const valueInstalment = watch('installmentCount');

  const findValue = installments(valueAmount / 100).find(h => h.value === String(valueInstalment))
  const amountValue = _toNumber(findValue!.label.replace(`${findValue?.value} x`, '')) / 100

  const valueTotal =
    amountValue * Number(findValue!.value)

  async function paymentAsaasCard(data: TCardToken) {

    const [month, year] = data.expiry.replace(/(\d{2})(\d{2})/, '$1-$2').split('-').map(String)

    const dt = {
      holderName: data.holderName,
      userId: user!.id,
      card_number: data.card_number,
      expiryMonth: month,
      expiryYear: year,
      ccv: data.ccv,
      permission: false,
    };
    try {
      const token = await cardToken.mutateAsync(dt);
      const dtCart = {
        amount: _toNumber(String(valueTotal)),
        installmentCount: Number(data.installmentCount),
        installmentValue: _toNumber(String(amountValue * 100)),
        userId: user!.id,
        cardToken: token.creditCardToken,
      }

      if (!user!.cardToken) {
        // setSaveCardToken({ item: { ...dt, permission: true }, modal: true });

        await payCard.mutateAsync(dtCart)

      }

      // await paymentMethod.card({
      //   amount: installments.value,
      //   installmentCount: installments.installment,
      //   installmentValue: installments.installmentValue,
      //   userId: user!.id,
      //   cardToken: user!.cardToken.token,
      // });
    } catch (error) {
      if (error instanceof AppError) {
        return toast.show({
          title: 'error',
          description: error.message,
          placement: 'top',
          bg: 'red.600',
        });
      }

      toast.show({
        title: 'Error',
        description:
          'Estamos com instabilidades na rede, tente novamente mais tarte',
        placement: 'top',
        bg: 'red.600',
      });
    }
  }

  async function paymePixAsaas() {
    try {
      setLoad(true);

      const pay = await paymentMethod.pix({ value: Number(valueAmount) });

      setPix({ qrcode: pay.image });
      setLoad(false);
    } catch (error) {
      setLoad(false);
      if (error instanceof AppError) {
        return toast.show({
          title: 'error',
          description: error.message,
          placement: 'top',
          bg: 'red.600',
        });
      }

      toast.show({
        title: 'Error',
        description:
          'Estamos com instabilidades na rede, tente novamente mais tarte',
        placement: 'top',
        bg: 'red.600',
      });
    }
  }

  async function paymentBoleto() {
    setLoad(true);
    try {
      const pix = await paymentMethod.boleto({
        value: valueAmount,
      });

      setImage({
        ...image,
        boleto: {
          img: pix.barCode,
          pdf: pix.invoiceUrl,
        },
      });
      setLoad(false);
    } catch (error) {

      if (error instanceof AppError) {
        return toast.show({
          title: 'error',
          description: error.message,
          placement: 'top',
          bg: 'red.600',
        });
      }

      toast.show({
        title: 'Error',
        description:
          'Estamos com instabilidades na rede, tente novamente mais tarte',
        placement: 'top',
        bg: 'red.600',
      });
    }
  }

  const amount = convertTeeToCurrency(qntTree);
  const parcelas = installments(valueAmount / 100);

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
                <S.text>Seus TreepyCashes: { }</S.text>
                <S.title style={{ fontSize: _title + 25 }}>{qntTree}</S.title>

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
                    onChangeText={qnt => setQntTree(Number(qnt))}

                  />
                )}

                <S.title>Valor a pagar: {amount}</S.title>

                <Button onPress={() => setBuy(true)} title="Comprar" />
                <Button onPress={closed} title="Cancelar" styleType="border" />
              </VStack>
            </Box>
          ) : (
            <Box>
              <HStack alignItems="center" space={4} mt={6}>
                <S.title>R$</S.title>
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
                    control={control}
                    name="holderName"
                    error={errors.holderName}
                    label="Nome"
                    placeholder="Nome impresso no cartão"
                  />

                  <FormInput
                    control={control}
                    name="card_number"
                    error={errors.card_number}
                    label="Número"
                    placeholder="Número do cartão"
                    keyboardType="numeric"
                    mask="card"
                    maxLength={19}
                  />

                  <HStack space={6}>
                    <Box flex={1}>
                      <FormInput
                        control={control}
                        name="expiry"
                        error={errors.expiry}
                        label="Validade"
                        placeholder="Mês/ano"
                        mask="date"
                        keyboardType="numeric"
                      />
                    </Box>

                    <Box flex={1}>
                      <FormInput
                        name="ccv"
                        control={control}
                        label="CVV"
                        placeholder="Cod. segurança"
                        keyboardType="numeric"
                        maxLength={3}
                      />
                    </Box>
                  </HStack>

                  <Controller
                    control={control}
                    name="installmentCount"
                    render={({ field: { onChange, value } }) => (
                      <Selection
                        placeholder="Parcelas"
                        itemSelected={h => setValue('installmentCount', Number(h))}
                        itens={parcelas}
                      />
                    )}
                  />

                  <S.text>Você irá pagar: {_toCurrency(valueTotal)}</S.text>

                  <Box mt={8} style={{ gap: 10 }}>
                    <Button
                      onPress={handleSubmit(paymentAsaasCard)}
                      title="Finalizar compra"
                      load={payCard.isLoading || cardToken.isLoading}
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
                <Center mt={6} justifyContent="space-between" h="300px">
                  <Image
                    source={{
                      uri: `data:image/jpeg;base64,${pix?.qrcode}`,
                    }}
                    resizeMode="contain"
                    style={{ width: 150, height: 150 }}
                  />

                  <Button onPress={paymePixAsaas} title="Gerar Qrcode" />

                  {pix?.qrcode && (
                    <Button title="Pix copia e coloa" styleType="border" />
                  )}
                </Center>
              )}
              {formaPagamento === '3' && (
                <Box mt={6} h="140px" justifyContent="space-between">
                  <Button onPress={paymentBoleto} title="Gerar boleto" />

                  {image.boleto.pdf && (
                    <Button
                      styleType="border"
                      title="Baixar boleto"
                      onPress={() => {
                        Link.openURL(image.boleto.pdf);
                      }}
                    />
                  )}
                </Box>
              )}
            </Box>
          )}
        </ScrollView>
      </S.Container>
    </Actionsheet>
  );
}
