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
  error?: string;
  mask?: 'date' | 'cpf' | 'cell-phone' | 'placa';
  typeInput?: 'placa' | 'padrao';
};

const msk = new Mask();
export function FormInput({
  name,
  control,
  mask,
  typeInput = 'padrao',
  error,
  ...rest
}: T) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => {
        const mascars: { [key: string]: string } = {
          date: (e: string) =>
            e ? e.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3') : '',
          cpf: (e: string) => (e ? msk.formatCPFOrCNPJ(e) : ''),
          'cell-phone': (e: string) =>
            e ? e.replace(/(\d{5})(\d{4})/, '$1-$2') : '',
          placa: (e: string) => (e ? msk.placa(e) : ''),
        };

        const m = mask ? mascars[mask] : value;

        return (
          <>
            <Input
              error={error ? error.message : ''}
              value={mask ? m(value) : value}
              onChangeText={onChange}
              {...rest}
            />
          </>
        );
      }}
    />
  );
}
