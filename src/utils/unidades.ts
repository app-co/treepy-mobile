/* eslint-disable no-underscore-dangle */
export function convertTeeToCurrency(tree: number): string {
  // const value =
}

export function _toNumber(e: string): number {
  const value = e.replace(/\D/g, '');

  return Number(value);
}

export function _toCurrency(e: number): string {
  return e.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function _toPtBRNumber(e: number): string {
  let value = String(e);

  if (value) {
    value = value.replace(/\D/g, '');
    value = value.replace(/(\d)(\d{2})$/, '$1,$2');

    value = value.replace(/(?=(\d{3})+(\D))\B/g, '.');
  }

  return value;
}
