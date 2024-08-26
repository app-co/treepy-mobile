/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/require-default-props */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Control, Controller } from 'react-hook-form';

import { Mask } from '@/utils/mask';

import { Input, TypeInput } from '../Input';

type T = TypeInput & {
  name: string;
  control: Control<any>;
  error?: any;
  mask?: 'date' | 'cpf' | 'cell-phone' | 'card';
};

const msk = new Mask();
export function FormInput({ name, control, mask, error, ...rest }: T) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => {
        const mascars: { [key: string]: (h: string) => void } = {
          date: (e: string) => (e ? e.replace(/(\d{2})(\d{2})/, '$1/$2') : ''),
          cpf: (e: string) => (e ? msk.formatCPFOrCNPJ(e) : ''),
          'cell-phone': (e: string) =>
            e ? e.replace(/(\d{5})(\d{4})/, '$1-$2') : '',
          card: (e: string) => (e ? msk.cardNumber(e) : ''),
        };

        const m = mask ? mascars[mask] : value;

        return (
          <>
            <Input
              error={error ? error.message : ''}
              value={mask ? m(value ?? '') : value}
              onChangeText={onChange}
              {...rest}
            />
          </>
        );
      }}
    />
  );
}
