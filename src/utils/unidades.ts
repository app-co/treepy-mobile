/* eslint-disable no-underscore-dangle */
export function convertTeeToCurrency(arvore: number) {
  let valor = 0;

  valor = arvore * 39.5;

  const currency = valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return currency;
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

export function calculatorTreeToMoney(arvore: number): string {
  let valor = 0;

  valor = arvore * 39.5;

  const currency = valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return currency;
}

export function calculatorCo2ToTree(co2: number): number {
  let valor = 0;

  valor = (co2 * 5) / 0.9606;

  const [u, c] = String(valor).split('.').map(Number);
  const result = c > 5 ? u + 1 : u;

  return result;
}

export function _currencyToNumber(e: string): number {
  const value = e.replace(/\D/g, '');
  const nu = value.length <= 2 ? Number(value) : Number(value) / 100;

  return nu;
}
