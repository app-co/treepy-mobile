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
    label: 'Táxi',
    value: '1',
  },
  {
    label: 'Metrô',
    value: '2',
  },
  {
    label: 'Trem urbano',
    value: '3',
  },
  {
    label: 'Ônibus municipal',
    value: '4',
  },
  {
    label: 'Ônibus de viagem',
    value: '5',
  },
  {
    label: 'Balsa de passageiros',
    value: '6',
  },
  {
    label: 'Balsa de veículos',
    value: '7',
  },
  {
    label: 'Balsa de veículos e passageiros',
    value: '8',
  },
];

export function buildGlobalTransport(car: string, km: string) {
  const carSelected = optionsTransport.find(h => h.value === car);
  const carBuild = veiculosC.filter(h => h.veiculo === carSelected?.label);
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
