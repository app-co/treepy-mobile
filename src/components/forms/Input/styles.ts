import { TextInput } from 'react-native';

import { css } from 'styled-components';
import styled from 'styled-components/native';

import { _subtitle, _text, hightPercent } from '@/styles/sizes';
import { color } from '@/styles/theme';

interface I {
  filed: boolean;
  focus: boolean;
  error: boolean;
}

export type TCondition = 'filed' | 'focus' | 'error';

export const Container = styled.View<I>`
  border-radius: 5px;
  width: 100%;
  height: ${hightPercent('6')}px;

  background-color: #0c271bbe;

  ${(h: I) =>
    h.filed &&
    css`
      border-color: ${color.greenLigh[200]};
      border-width: 1px;
    `}
  ${(h: I) =>
    h.focus &&
    css`
      border-color: ${color.greenLigh[200]};
      border-width: 1px;
    `};

  ${(h: I) =>
    h.error &&
    css`
      border-color: ${color.orange[100]};
      border-width: 1px;
    `};
`;

export const title = styled.Text`
  color: ${color.gray[200]};
  font-family: 'regular';
  font-size: ${_text}px;
  margin-left: 20px;
`;

export const input = styled(TextInput) <{ isFilled: boolean }>`
  flex: 1;
  padding: 0 0 0 20px;
  color: ${color.gray[100]};
  font-family: 'regular';
  font-size: ${_subtitle}px;
`;

export const boxIcon = styled.TouchableOpacity`
  width: 40px;
  height: 100%;

  align-items: center;
  justify-content: center;
`;
