import React, { useCallback, useState } from 'react';

import { Actionsheet, Box, Center, HStack } from 'native-base';

import { Button } from '@/components/forms/Button';
import { Input } from '@/components/forms/Input';
import { Selection } from '@/components/forms/Selection';
import { hightPercent } from '@/styles/sizes';
import { color } from '@/styles/theme';
import { _toNumber, _toPtBRNumber } from '@/utils/unidades';

import * as S from './styles';
import { Table } from './table';
import {
  buildPersonalTransport,
  powerMoto,
  typeGas,
  typeHibridoGas,
  typeModel,
  typePotencia,
  typeVeiculos,
} from './utils';

export interface IVeiculoProps {
  Combustível: string;
  Combustível_Tipo: string;
  Meio_de_transporte: string;
  Modelo: string;
  Potência_do_motor: string;
  Quilometragem: number;
  co2: number;
  id: number;
}

interface IITem {
  item: IVeiculoProps[];
  value: number;
}

type TTransport =
  | 'Carro'
  | 'Moto'
  | 'Bicicleta'
  | 'Bicicléta elétrica'
  | 'Patinete elétrico'
  | '0';

interface I {
  goBack: () => void;
  setItem: (item: IITem) => void;
  getItem: IVeiculoProps[];
}

export function PersonalCar({ goBack, setItem, getItem }: I) {
  const handleNext = React.useCallback(async () => { }, []);

  const [saveItem, setSaveItem] = React.useState<IVeiculoProps[]>(getItem);

  const [byStep, setByStep] = React.useState(1);
  const [car, setCar] = useState('0');
  const [gas, setGas] = useState('0');
  const [power, setPower] = useState('0');
  const [model, setModel] = useState('0');
  const [typeHiGas, setTypeHiGas] = useState('0');
  const [km, setKm] = React.useState('');
  const [openBuildModal, setOpenBuildModal] = React.useState<boolean>(false);

  const handleCancel = React.useCallback(async () => {
    setCar('');
    setGas('');
    setPower('');
    setModel('');
    setTypeHiGas('');
    setByStep(1);
    setOpenBuildModal(false);
  }, []);

  const handleAddItem = React.useCallback(() => {
    const build = buildPersonalTransport({
      car,
      modelo: model,
      power,
      gas,
      gasHibrido: typeHiGas,
      km,
    });

    setOpenBuildModal(false);
    handleCancel();
    const item = [...saveItem, build];

    const value = item.reduce((ac, i) => ac + i.co2, 0);

    const data = {
      item,
      value: Number((value / 1000).toFixed(2)),
    };

    setSaveItem(item);
    setItem(data);
  }, [car, gas, handleCancel, km, model, power, saveItem, setItem, typeHiGas]);

  const removeItem = useCallback(
    (id: number) => {
      const index = saveItem.findIndex((h, i) => i === id);
      const arry = [...saveItem];
      if (index !== -1) {
        arry.splice(index, 1);
      }
      const item = arry;
      const value = item.reduce((ac, i) => ac + i.co2, 0);
      const data = {
        item,
        value: Number((value / 1000).toFixed(2)),
      };
      setSaveItem(arry);
      setItem(data);
    },
    [saveItem, setItem],
  );

  console.log(car);

  return (
    <S.Container>
      <Actionsheet
        onClose={() => setOpenBuildModal(false)}
        isOpen={openBuildModal}
        hideDragIndicator
      >
        <Box w="full" p={10} h={hightPercent('50')} bg={color.green[200]}>
          <Center w="100%">
            <S.text>Selecione seu tranporte individual</S.text>

            <Box mt={4} w="full">
              {byStep === 1 && (
                <Box>
                  <S.text>Primeiro, selecione o tipo de veículo.</S.text>
                  <Selection
                    itens={typeVeiculos}
                    itemSelected={h => setCar(h)}
                  />
                </Box>
              )}

              {byStep === 2 && car === '1' && (
                <Box>
                  <S.text>Agora, selecione o tipo de combustível.</S.text>
                  <Selection itemSelected={h => setGas(h)} itens={typeGas} />
                </Box>
              )}

              {byStep === 2 && car === '2' && (
                <Box>
                  <S.text>Agora, selecione o tipo de combustível.</S.text>
                  <Selection
                    itemSelected={setGas}
                    itens={typeGas.slice(0, 2)}
                  />
                </Box>
              )}

              {byStep === 3 && Number(car) <= 2 && Number(gas) <= 4 && (
                <Box>
                  <S.text>Selecione a potência do motor.</S.text>
                  <Selection
                    itemSelected={setPower}
                    itens={car === '1' ? typePotencia : powerMoto}
                  />
                </Box>
              )}

              {byStep === 3 && Number(gas) === 5 && (
                <Box>
                  <S.text>Selecione o modelo do veículo.</S.text>
                  <Selection itemSelected={setModel} itens={typeModel} />
                </Box>
              )}

              {byStep === 3 && Number(gas) === 6 && (
                <Box>
                  <S.text>Selecione o tipo de combutível do veículo.</S.text>
                  <Selection
                    itemSelected={setTypeHiGas}
                    itens={typeHibridoGas}
                  />
                </Box>
              )}

              {byStep === 4 && (
                <Box>
                  <S.text>Digite o km mensal</S.text>
                  <Box>
                    <Input
                      label="KM"
                      onChangeText={setKm}
                      placeholder="digite aqui o valor"
                      value={_toPtBRNumber(_toNumber(km))}
                    />
                  </Box>
                </Box>
              )}

              {byStep === 2 && Number(car) >= 3 && (
                <Box>
                  <S.text>Digite o Km mensal</S.text>
                  <Box>
                    <Input
                      label="KM"
                      onChangeText={setKm}
                      value={_toPtBRNumber(_toNumber(km))}
                      placeholder="digite aqui o valor"
                    />
                  </Box>
                </Box>
              )}
            </Box>

            <HStack space={8} mt={12}>
              <Box flex={1}>
                <Button
                  onPress={handleCancel}
                  title="Cancelar"
                  styleType="border"
                />
              </Box>
              <Box flex={1}>
                <Button
                  onPress={() => setByStep(byStep + 1)}
                  title="Proxio"
                  styleType="light"
                />
              </Box>
            </HStack>
          </Center>
        </Box>
      </Actionsheet>
      <Center mb={4}>
        <S.title style={{ fontFamily: 'trin' }}>Utilização de </S.title>
        <S.title style={{ marginTop: -8 }}>Transporte Individual.</S.title>
      </Center>

      <Box my={4}>
        <S.text>
          Insira a quilometragem{' '}
          <S.text style={{ fontFamily: 'bold' }}>MENSAL</S.text> percorrida com
          seu transporte individual utilizado no dia a dia. É possível inserir
          mais de um tipo de transporte.
        </S.text>
      </Box>

      <Button
        onPress={() => setOpenBuildModal(true)}
        title="Adicionar transporte"
        styleType="border"
      />

      <Table />

      <HStack space={8} mt={4}>
        <Box flex={1}>
          <Button onPress={goBack} title="Voltar" styleType="border" />
        </Box>
        <Box flex={1}>
          <Button onPress={handleNext} title="Proxio" styleType="light" />
        </Box>
      </HStack>
    </S.Container>
  );
}
