import { _toNumber } from '@/utils/unidades';
import { veiculosP } from '@/utils/veiculosPessoal';

export const typeVeiculos = [
  {
    value: '1',
    label: 'Carro',
  },
  {
    value: '2',
    label: 'Moto',
  },
  {
    value: '3',
    label: 'Bicicleta',
  },
  {
    value: '4',
    label: 'Bicicleta elétrica',
  },
  {
    value: '5',
    label: 'Patinete elétrico',
  },
];

export const typeGas = [
  {
    value: '1',
    label: 'Gasolina',
  },
  {
    value: '3',
    label: 'Etanol',
  },
  {
    value: '2',
    label: 'Diesel',
  },
  {
    value: '4',
    label: 'GNV',
  },
  {
    value: '5',
    label: 'Elétrico',
  },
  {
    value: '6',
    label: 'Híbrido',
  },
];

export const typePotencia = [
  {
    label: '1.0 à 1.5',
    value: '1',
  },
  {
    label: '1.6 à 2.0',
    value: '2',
  },
  {
    label: 'Maior que 2.0',
    value: '3',
  },
];

export const powerMoto = [
  {
    label: 'Até 125cc',
    value: '1',
  },
  {
    label: '126cc à 250cc',
    value: '2',
  },
  {
    label: 'Maior que 250cc',
    value: '3',
  },
];

export const typeModel = [
  {
    label: 'Renault Zoe',
    value: '1',
  },
  {
    label: 'Cerry Arrizo 5e',
    value: '2',
  },
  {
    label: 'JAC iEV40',
    value: '3',
  },
  {
    label: 'Nissan Leaf',
    value: '4',
  },
  {
    label: 'BMW i3',
    value: '5',
  },
  {
    label: 'Chevrolet Bolt',
    value: '6',
  },
  {
    label: 'Jaguar I-Pace',
    value: '7',
  },
  {
    label: 'Outro',
    value: '8',
  },
];

export const typeHibridoGas = [
  {
    value: '1',
    label: 'Gasolina',
  },
  {
    value: '2',
    label: 'Diesel',
  },
  {
    value: '3',
    label: 'Etanol',
  },
];

type TTransport =
  | 'Carro'
  | 'Moto'
  | 'Bicicleta'
  | 'Bicicléta elétrica'
  | 'Patinete elétrico'
  | '0';

type T = {
  car: TTransport;
  gas: string;
  gasHibrido: string;
  power: string;
  modelo: string;
  km: string;
};
export function buildPersonalTransport({
  car,
  modelo,
  power,
  gas,
  gasHibrido,
  km,
}: T) {
  const carBuild = veiculosP.filter(h => h.Meio_de_transporte === car);
  const buildCar = carBuild;

  const carSelct =
    buildCar.find(h => {
      if (
        h.Combustível_Tipo.includes(gas) &&
        h.Combustível.includes(gasHibrido) &&
        h.Modelo.includes(modelo) &&
        h.Potência_do_motor.includes(power)
      ) {
        return h;
      }
      return null;
    }) ?? ([] as any);

  const k = String(_toNumber(km));
  const kmField = k.length <= 2 ? _toNumber(km) : _toNumber(km) / 100;

  const co2 = (Number(kmField) * carSelct!.co2) / 1000 ?? 0;

  const kmf = Number(_toNumber(km));

  return {
    ...carSelct,
    Quilometragem: kmf,
    co2: Number((co2 * 12).toFixed(2)),
  };
}

export function buildCatPerson() {
  const selection = {
    '1': {
      '1': {
        option: typePotencia,
        compo: '',
      },
      '2': '',
    },
  };
}
