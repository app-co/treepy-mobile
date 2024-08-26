/* eslint-disable react/jsx-no-bind */
import React, { useCallback } from 'react';
import { Alert, ScrollView } from 'react-native';

import { Actionsheet, Box, Center, HStack, VStack } from 'native-base';

import { Button } from '@/components/forms/Button';
import { Input } from '@/components/forms/Input';
import { Selection } from '@/components/forms/Selection';
import { _subtitle, hightPercent } from '@/styles/sizes';
import { color } from '@/styles/theme';
import { _toNumber, _toPtBRNumber } from '@/utils/unidades';

import * as S from './styles';
import { Table } from './table';
import { buildGlobalTransport, optionsTransport } from './utils';

export type TTypeTransport =
  | 'Selecione um veículo'
  | 'Táxi'
  | 'Metrô'
  | 'Trem urbano'
  | 'Ônibus municipal'
  | 'Ônibus de viagem'
  | 'Balsa de passageiros'
  | 'Balsa de veículos'
  | 'Balsa de veículos e passageiros';

type TItemProps = {
  item: IVeiculoCProps[];
  value: number;
};

export interface IVeiculoCProps {
  veiculo: string;
  Quilometragem: number;
  id: number;
  co2: number;
}

interface I {
  goBack: () => void;
  setItemC: (item: TItemProps) => void;
  getItem: IVeiculoCProps[];
  next: () => void;
}

export function PublicCar({ goBack, setItemC, next, getItem }: I) {
  const handleNext = React.useCallback(async () => { }, []);
  const [saveItem, setSaveItem] = React.useState<IVeiculoCProps[]>(getItem);
  const [byStep, setByStep] = React.useState(1);
  const [openBuildModal, setOpenBuildModal] = React.useState<boolean>(false);
  const [km, setKm] = React.useState('');
  const [car, setCar] = React.useState('');

  function handleCancel() {
    setOpenBuildModal(false);
    setCar('');
    setKm('');
    setByStep(1);
  }

  const handleAddItem = React.useCallback(() => {
    if (!car || !km) {
      Alert.alert('Atenção', 'Campos não podem ficar vazios.');
      return;
    }
    const build = buildGlobalTransport(car, km);

    const item = [...saveItem, build];
    const value = item.reduce((ac, i) => ac + i.co2, 0);
    const data = {
      item,
      value: Number((value / 1000).toFixed(2)),
    };

    handleCancel();
    setSaveItem(item);
    setItemC(data);
  }, [car, km, saveItem, setItemC]);

  const removeItem = useCallback(
    (id: number) => {
      const index = saveItem.findIndex((h, i) => h.id === id);
      const arry = [...saveItem];

      if (index !== -1) {
        arry.splice(index, 1);
      }

      setSaveItem(arry);

      const value = arry.reduce((ac, i) => ac + i.co2, 0);
      const data = {
        item: arry,
        value: Number((value / 1000).toFixed(2)),
      };
      setItemC(data);
    },
    [saveItem, setItemC],
  );

  const item = saveItem.map(h => {
    return {
      veiculo: h.veiculo,
      Quilometragem: h.Quilometragem,
      id: h.id,
      co2: h.co2,
    };
  });

  function cancel() {
    setKm('');
    setCar('');
    setOpenBuildModal(false);
  }

  return (
    <S.Container>
      <Actionsheet
        onClose={() => setOpenBuildModal(false)}
        isOpen={openBuildModal}
      >
        <Box p={10} w="full" h={hightPercent('70')} bg={color.green[100]}>
          <ScrollView>
            <Center w="100%">
              <S.text style={{ fontSize: _subtitle, fontFamily: 'regular' }}>
                Selecione seu transporte coletivo
              </S.text>

              <VStack space={8} w="full" mt={6}>
                <Selection
                  itemSelected={h => setCar(h)}
                  placeholder="Selecione seu transporte"
                  itens={optionsTransport}
                />

                <Box>
                  <S.text>Digite o km mensal</S.text>

                  <Input
                    label="km"
                    placeholder="Quilometragem mensal"
                    keyboardType="numeric"
                    onChangeText={setKm}
                    value={_toPtBRNumber(_toNumber(km))}
                  />
                </Box>

                <HStack mt={5} space={4}>
                  <Box flex={1}>
                    <Button
                      title="Cancelar"
                      styleType="border"
                      onPress={cancel}
                    />
                  </Box>

                  <Box flex={1}>
                    <Button title="Salvar" onPress={handleAddItem} />
                  </Box>
                </HStack>
              </VStack>
            </Center>
          </ScrollView>
        </Box>
      </Actionsheet>

      <Center mb={4}>
        <S.title style={{ fontFamily: 'trin' }}>Utilização de </S.title>
        <S.title style={{ marginTop: -8 }}>Transporte Coletivo</S.title>
      </Center>

      <Box my={4}>
        <S.text>
          Insira a quilometragem <S.text>MENSAL</S.text> percorrida com seu
          transporte coletivo utilizado no dia a dia. É possível inserir mais de
          um tipo de transporte.
        </S.text>
      </Box>

      <Button
        onPress={() => setOpenBuildModal(true)}
        title="Adicionar transporte"
        styleType="border"
      />

      <Table item={item} del={h => removeItem(h)} />

      <HStack space={8} mt={4}>
        <Box flex={1}>
          <Button onPress={goBack} title="Voltar" styleType="border" />
        </Box>
        <Box flex={1}>
          <Button onPress={next} title="Próximo" styleType="light" />
        </Box>
      </HStack>
    </S.Container>
  );
}
