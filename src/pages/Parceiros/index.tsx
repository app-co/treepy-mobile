import React from 'react';
import { ScrollView } from 'react-native';

import { Center, VStack } from 'native-base';

import { AlertSvg } from '@/assets/svgs/alert';
import { ImgParceiro } from '@/components/imgs/pareceios';

import * as S from './styles';

export function Parceiros() {
  return (
    <S.Container>
      <ImgParceiro>
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          <Center>
            <AlertSvg />
          </Center>

          <VStack space={8} p={4}>
            <S.title>
              A área “Parceiros” da Treepy, está em construção e, em breve, será
              possível consumir produtos e serviços de empresas engajadas em
              promover a preservação ambiental e a sustentabilidade.
            </S.title>

            <S.title>
              Oferecemos à você a oportunidade de acumular mais TreepyCashes ao
              consumir esses produtos e serviços. Quanto mais você consome, mais
              você refloresta.
            </S.title>

            <S.title>
              Estamos trabalhando junto aos nossos parceiros, e, em breve, você
              poderá verificar as oportunidades dessa opção de reflorestamento.
            </S.title>

            <S.title>
              Obrigado por fazer parte dessa jornada verde com a Treepy.
            </S.title>
          </VStack>
        </ScrollView>
      </ImgParceiro>
    </S.Container>
  );
}
