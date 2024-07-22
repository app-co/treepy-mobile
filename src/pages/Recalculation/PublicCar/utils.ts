import { _toNumber } from '@/utils/unidades';
import { veiculosC } from '@/utils/veiculosCol';

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

export const optionsTransport = [
  {
    field: 'Táxi',
    value: '1',
  },
  {
    field: 'Metrô',
    value: '2',
  },
  {
    field: 'Trem urbano',
    value: '3',
  },
  {
    field: 'Ônibus municipal',
    value: '4',
  },
  {
    field: 'Ônibus de viagem',
    value: '5',
  },
  {
    field: 'Balsa de passageiros',
    value: '6',
  },
  {
    field: 'Balsa de veículos',
    value: '7',
  },
  {
    field: 'Balsa de veículos e passageiros',
    value: '8',
  },
];

export function buildGlobalTransport(car: TTypeTransport, km: string) {
  const carBuild = veiculosC.filter(h => h.veiculo === car);
  const buildCar = carBuild;

  const build = buildCar[0];
  const k = String(_toNumber(km));
  const kmField = k.length <= 2 ? _toNumber(km) : _toNumber(km) / 100;

  const co2 = (kmField * build.co2) / 1000 ?? 0;
  const kmf = Number(_toNumber(km));

  return {
    ...build,
    Quilometragem: kmf,
    co2: Number((co2 * 12).toFixed(2)),
  };
}
