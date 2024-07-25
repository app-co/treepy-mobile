/* eslint-disable react/require-default-props */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { TextInputProps } from 'react-native';

import { Entypo, Feather } from '@expo/vector-icons';

import { HStack } from 'native-base';

import { color } from '@/styles/theme';

import * as S from './styles';

export interface TypeInput extends TextInputProps {
  icon?: React.ComponentProps<typeof Feather>['name'];
  label: string;
  error?: any;
  presIco?: () => void;
}

export function Input({
  value,
  presIco,
  error,
  label,
  icon,
  ...rest
}: TypeInput) {
  const [isFocused, setIsFocused] = React.useState(false);
  const [isFiled, setIsFiled] = React.useState(false);

  const handleFocus = React.useCallback(async () => {
    setIsFocused(true);
  }, []);

  const handleBlur = React.useCallback(async () => {
    setIsFocused(false);
    setIsFiled(!!value);
  }, [value]);

  return (
    <S.Container focus={isFocused} filed={isFiled} error={error}>
      {label && <S.title>{label}</S.title>}

      <HStack alignItems="center" justifyContent="space-between">
        <S.input
          isFilled={isFiled}
          value={value}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholderTextColor={color.gray[200]}
          {...rest}
        />

        {icon && (
          <S.boxIcon onPress={presIco}>
            <Entypo
              name={icon}
              size={20}
              color={isFiled || isFocused ? color.green[200] : color.gray[200]}
            />
          </S.boxIcon>
        )}
      </HStack>
      {error && <S.title style={{ color: '#f04646' }}>{error}</S.title>}
    </S.Container>
  );
}
