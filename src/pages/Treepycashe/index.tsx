import React from 'react';
import { FlatList } from 'react-native';

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { format } from 'date-fns';
import { Box, HStack } from 'native-base';

import { Folha } from '@/assets/svgs/folha';
import { Button } from '@/components/forms/Button';
import { ImgTreepycashe } from '@/components/imgs/tyeepycash';
import { Loading } from '@/components/Loading';
import { Payment } from '@/components/template/Payment';
import { useAuth } from '@/contexts/auth';
import { useMetricas } from '@/hooks/user/querys';
import { hightPercent } from '@/styles/sizes';
import { color } from '@/styles/theme';

import * as S from './styles';

const status = {
  PAID: 'Pago',
  DECLINE: 'Recudado',
  WAITING: 'Aguardando',
  PENDENTE: 'Pendente',
  AUTHORIZED: 'Autorizado',
  IN_ANALISIS: 'Em análize',
  CANCELED: 'Cancelado',
};

export function Treepycashe() {
  const { data, isLoading } = useMetricas();
  const { user } = useAuth();

  const [openShet, setOpenShet] = React.useState<boolean>(false);

  return (
    <S.Container>
      <Payment
        tree={data?.meta}
        open={openShet}
        closed={() => setOpenShet(false)}
      />

      <ImgTreepycashe>
        <Box>
          <S.header>
            <HStack alignItems="center" space={2}>
              <Ionicons
                name="calendar-outline"
                color={color.gray[200]}
                size={25}
              />
              <S.titleHeader>Data</S.titleHeader>
            </HStack>
            <HStack alignItems="center" space={2}>
              <Folha sizes={30} />
              <S.titleHeader>TreepyCashes</S.titleHeader>
            </HStack>
            <HStack alignItems="center" space={2}>
              <MaterialCommunityIcons
                name="progress-clock"
                color={color.gray[200]}
                size={25}
              />
              <S.titleHeader>Status</S.titleHeader>
            </HStack>
          </S.header>

          <FlatList
            style={{
              height: hightPercent('60'),
            }}
            contentContainerStyle={{
              paddingBottom: 100,
            }}
            data={data?.extrato}
            keyExtractor={h => String(h.data)}
            ListEmptyComponent={<Loading />}
            renderItem={({ item: h }) => (
              <S.content>
                <S.title>{format(new Date(h.data), 'dd/MM/yy')}</S.title>
                <S.title style={{ fontFamily: 'bold' }}>{h.tree}</S.title>
                <S.title>{h.status}</S.title>
              </S.content>
            )}
          />
        </Box>

        <Box>
          <Button
            onPress={() => setOpenShet(true)}
            title="Comprar mais TreepyCashes"
          />
        </Box>
      </ImgTreepycashe>
    </S.Container>
  );
}
