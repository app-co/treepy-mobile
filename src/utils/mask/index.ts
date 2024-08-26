/* eslint-disable class-methods-use-this */
export class Mask {
  public cellPhone(value: string) {
    const e = value.replace(/\D/g, '');
    e.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');

    return e;
  }

  public date(value: string) {
    const e = null;

    if (value) {
      // e = value.replace(/\D/g, '');
      value.replace(/(\d{2})(\d{2})/, '$1/$2');
    }

    return e;
  }

  formatCPFOrCNPJ(text: string): string {
    const numericValue = text.replace(/\D/g, '');

    if (numericValue.length <= 11) {
      return numericValue.replace(
        /(\d{3})(\d{3})(\d{3})(\d{2})/,
        '$1.$2.$3-$4',
      );
    }
    if (numericValue.length === 14) {
      return numericValue.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        '$1.$2.$3/$4-$5',
      );
    }
    return numericValue;
  }

  cardNumber(text: string): string {
    let value = '';

    if (text) {
      value = text.replace(/\D/g, '');
      // Formata o número do cartão de crédito com espaços a cada 4 dígitos
      value = value.replace(/(.{4})/g, '$1 ').trim();
    }

    return value;
  }
}
