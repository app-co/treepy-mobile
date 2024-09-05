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
  next: () => void;
}

export function PersonalCar({ goBack, setItem, getItem, next }: I) {
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
    setCar('0');
    setGas('0');
    setPower('0');
    setModel('0');
    setTypeHiGas('0');
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

    const item = [...saveItem, build];

    const value = item.reduce((ac, i) => ac + i.co2, 0);

    const data = {
      item,
      value: Number((value / 1000).toFixed(2)),
    };

    setSaveItem(item);
    setItem(data);
    handleCancel();
    // setOpenBuildModal(false);
  }, [car, gas, km, model, power, saveItem, typeHiGas]);

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

  const item = saveItem.map(h => {
    return {
      veiculo: h.Meio_de_transporte,
      quilometragem: h.Quilometragem,
      id: h.id,
    };
  });

  return (
    <S.Container>
      <Actionsheet
        onClose={() => setOpenBuildModal(false)}
        isOpen={openBuildModal}
        hideDragIndicator
      >
        <Box w="full" p={10} h={hightPercent('50')} bg={color.green[100]}>
          <Center w="100%">
            <S.text>Selecione seu transporte individual</S.text>

            <Box mt={4} w="full">
              {byStep === 1 && (
                <Box>
                  <Selection
                    placeholder="Tipo de veículo"
                    itens={typeVeiculos}
                    itemSelected={h => setCar(h)}
                  />
                </Box>
              )}

              {byStep === 2 && car === '1' && (
                <Box>
                  <Selection
                    placeholder="Tipo de combustível"
                    itemSelected={h => setGas(h)}
                    itens={typeGas}
                  />
                </Box>
              )}

              {byStep === 2 && car === '2' && (
                <Box>
                  <Selection
                    itemSelected={setGas}
                    placeholder="Potência do motor"
                    itens={typeGas.slice(0, 2)}
                  />
                </Box>
              )}

              {byStep === 3 && Number(car) <= 2 && Number(gas) <= 4 && (
                <Box>
                  <Selection
                    itemSelected={setPower}
                    placeholder="Potência do motor"
                    itens={car === '1' ? typePotencia : powerMoto}
                  />
                </Box>
              )}

              {byStep === 3 && Number(gas) === 5 && (
                <Box>
                  <S.text>Selecione o modelo do veículo</S.text>
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
                      label="km"
                      keyboardType="numeric"
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
                      keyboardType="numeric"
                      label="KM"
                      onChangeText={setKm}
                      value={_toPtBRNumber(_toNumber(km))}
                      placeholder="digite aqui o valor"
                    />
                  </Box>
                </Box>
              )}
            </Box>

            {byStep === 1 && (
              <HStack mt={5} space={4}>
                <Box flex={1}>
                  <Button
                    title="Cancelar"
                    styleType="border"
                    onPress={() => setOpenBuildModal(false)}
                  />
                </Box>

                <Box flex={1}>
                  <Button
                    title="Próximo"
                    onPress={() => setByStep(byStep + 1)}
                  />
                </Box>
              </HStack>
            )}

            {byStep >= 2 && byStep <= 3 && car <= String(2) && (
              <HStack mt={5} space={4}>
                <Box flex={1}>
                  <Button
                    title="Cancelar"
                    styleType="border"
                    onPress={handleCancel}
                  />
                </Box>

                <Box flex={1}>
                  <Button
                    title="Próximo"
                    onPress={() => setByStep(byStep + 1)}
                  />
                </Box>
              </HStack>
            )}

            {byStep === 4 && car <= String(2) && (
              <HStack mt={5} space={4}>
                <Box flex={1}>
                  <Button
                    title="Cancelar"
                    styleType="border"
                    onPress={handleCancel}
                  />
                </Box>

                <Box flex={1}>
                  <Button title="Salvar" onPress={handleAddItem} />
                </Box>
              </HStack>
            )}

            {byStep >= 2 && byStep <= 3 && car > String(2) && (
              <HStack mt={5} space={4}>
                <Box flex={1}>
                  <Button
                    title="Cancelar"
                    styleType="border"
                    onPress={handleCancel}
                  />
                </Box>

                <Box flex={1}>
                  <Button title="Salvar" onPress={handleAddItem} />
                </Box>
              </HStack>
            )}
          </Center>
        </Box>
      </Actionsheet>

      <Center mb={4}>
        <S.title style={{ fontFamily: 'trin' }}>Utilização de </S.title>
        <S.title style={{ marginTop: -8 }}>Transporte Individual</S.title>
      </Center>

      <Box my={4}>
        <S.text>
          Insira a quilometragem <S.text>MENSAL</S.text> percorrida com seu
          transporte individual utilizado no dia a dia. É possível inserir mais
          de um tipo de transporte.
        </S.text>
      </Box>

      <Button
        onPress={() => setOpenBuildModal(true)}
        title="Adicionar transporte"
        styleType="border"
      />

      <Table item={item} excluir={h => removeItem(h)} />

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
