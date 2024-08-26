import { _toCurrency } from '@/utils/unidades';

export function installments(
  amount: number,
): { label: string; value: string }[] {
  const array = Array.from({ length: 12 }, (h, i) => i);

  const parce = array.map((h, i) => {
    let value = amount;

    if (i <= 3) {
      value = amount;
    }

    if (i > 3 && i <= 9) {
      value += amount * 0.02;
    }

    if (i > 9) {
      value += amount * 0.04;
    }

    return {
      value: String(i + 1),
      label: `${i + 1} x ${_toCurrency(value / (i + 1))}`,
    };
  });

  return parce;
}
