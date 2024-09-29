import React from 'react';
import { ScrollView } from 'react-native';

import { HStack } from 'native-base';

import { AlertSvg } from '@/assets/svgs/alert';
import { MetaChart } from '@/components/Charts/MetaChart';
import { Button } from '@/components/forms/Button';
import { ImgCalculadora } from '@/components/imgs/img-calculadora';
import { Loading } from '@/components/Loading';
import { Payment } from '@/components/template/Payment';
import { useUserMetricas } from '@/hooks/querys';
import { _title } from '@/styles/sizes';
import { _toPtBRNumber } from '@/utils/unidades';
import { useNavigation } from '@react-navigation/native';

import * as S from './styles';

export function Calculadora() {
  const navigation = useNavigation();
  const [openShet, setOpenShet] = React.useState(false);

  const { data, isLoading } = useUserMetricas();

  const calc = data?.calculadora;

  if (isLoading) return <Loading />;

  console.log(calc);

  return (
    <S.Container>
      <Payment tree={3} open={openShet} closed={() => setOpenShet(false)} />
      <ImgCalculadora>
        <ScrollView contentContainerStyle={{ gap: 25 }}>
          <S.content>
            <HStack alignItems="center" justifyContent="space-between" mb={2}>
              <S.text>Fonte</S.text>
              <S.text>Emissões (tCO₂)</S.text>
            </HStack>
            <HStack alignItems="center" justifyContent="space-between" mb={2}>
              <S.sub>Eletricidade</S.sub>
              <S.sub>{_toPtBRNumber(calc?.eletricidade ?? 0)}</S.sub>
            </HStack>
            <HStack alignItems="center" justifyContent="space-between" mb={2}>
              <S.sub>Gás</S.sub>
              <S.sub>{_toPtBRNumber(calc?.gas ?? 0)}</S.sub>
            </HStack>
            <HStack alignItems="center" justifyContent="space-between" mb={2}>
              <S.sub>Transporte Individual</S.sub>
              <S.sub>{_toPtBRNumber(calc?.transporte_individual ?? 0)}</S.sub>
            </HStack>
            <HStack alignItems="center" justifyContent="space-between" mb={2}>
              <S.sub>Transporte Coletivo</S.sub>
              <S.sub>{_toPtBRNumber(calc?.transporte_coletivo ?? 0)}</S.sub>
            </HStack>
            <HStack alignItems="center" justifyContent="space-between" mb={2}>
              <S.sub>Alimentação</S.sub>
              <S.sub>{_toPtBRNumber(calc?.alimentacao ?? 0)}</S.sub>
            </HStack>
            <HStack alignItems="center" justifyContent="space-between" mb={2}>
              <S.sub style={{ fontSize: _title }}>Total</S.sub>
              <S.sub>{_toPtBRNumber(calc?.total ?? 0)}</S.sub>
            </HStack>
          </S.content>

          <Button
            onPress={() => navigation.navigate('recalculation')}
            title="Recalcular"
            styleType="border"
          />

          <S.content>
            <MetaChart />
          </S.content>

          <Button onPress={() => setOpenShet(true)} title="Comprar mais" />

          <S.content>
            <HStack alignItems="center" space={4}>
              <AlertSvg />
              <S.title>Atenção</S.title>
            </HStack>

            <S.sub>
              O cálculo da sua meta de TreepyCashes de reflorestamento é anual,
              devendo ser refeito a cada ano e sempre que houver alteração nos
              hábitos de consumo.
            </S.sub>
          </S.content>
        </ScrollView>
      </ImgCalculadora>
    </S.Container>
  );
}
