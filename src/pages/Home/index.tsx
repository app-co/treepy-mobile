/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { FlatList } from 'react-native';

import { format } from 'date-fns';
import { Box, HStack } from 'native-base';

import { OperationSvg } from '@/assets/svgs/operation';
import { MetaChart } from '@/components/Charts/MetaChart';
import { TreepycasheChart } from '@/components/Charts/TreepycasheChart';
import { ImgHome } from '@/components/imgs/HomeBg';
import { Loading } from '@/components/Loading';
import { useAuth } from '@/contexts/auth';
import { useUserMetricas } from '@/hooks/querys';
import { _text, hightPercent } from '@/styles/sizes';

import * as S from './styles';

interface IHistoryResponse {
  id: string;
  title: string;
  subtitle: string;
  created_at: Date;
  date: { day: string; hour: string };
}

export function Home() {
  const { user } = useAuth();

  const { data, isLoading } = useUserMetricas();
  const history = data?.history ?? [];

  // const history = React.useMemo(() => {
  //   const rs = user?.History || [];

  //   let respose: IHistoryResponse[] = [];

  //   if (rs.length > 0) {
  //     respose = rs
  //       .map(h => {
  //         const day = format(new Date(h.created_at), 'dd/MM/yy');
  //         const hour = format(new Date(h.created_at), 'HH:mm');

  //         const date = { day, hour };

  //         return {
  //           ...h,
  //           date,
  //         };
  //       })
  //       .sort((a, b) => {
  //         const dateA = new Date(a.created_at).getTime;
  //         const dateB = new Date(b.created_at).getTime;
  //         if (dateA > dateB) {
  //           return 1;
  //         }
  //         return -1;
  //       });
  //   }

  //   return respose;
  // }, [user]);

  if (isLoading) return <Loading />;

  return (
    <S.Container>
      <ImgHome>
        <FlatList
          data={history}
          keyExtractor={h => h.id}
          contentContainerStyle={{
            paddingBottom: 100,
          }}
          ListHeaderComponent={
            <S.content>
              <S.box>
                <MetaChart />
              </S.box>

              <S.box>
                <TreepycasheChart />
              </S.box>

              <S.box style={{ height: hightPercent('10') }}>
                <HStack mb={4} alignItems="center" space={3}>
                  <OperationSvg />
                  <S.sub style={{ fontFamily: 'light' }}>
                    Operações recentes
                  </S.sub>
                </HStack>
              </S.box>
            </S.content>
          }
          renderItem={({ item: h }) => (
            <S.boxF>
              <HStack alignItems="center" justifyContent="space-between">
                <S.sub
                  style={{ fontFamily: 'bold', width: 100, fontSize: _text }}
                >
                  {h.title}
                </S.sub>
                <S.text style={{ width: 140, fontSize: _text - 3 }}>
                  {h.subtitle}
                </S.text>
                <Box>
                  <S.text>{format(h.updated_at, 'dd/MM/yy')}</S.text>
                  <S.text>{format(h.updated_at, 'HH:mm')}</S.text>
                </Box>
              </HStack>
            </S.boxF>
          )}
        />
      </ImgHome>
    </S.Container>
  );
}
