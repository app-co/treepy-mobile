/* eslint-disable prettier/prettier */
import { TouchableOpacity } from 'react-native';

import styled, { css } from 'styled-components/native';

import { _subtitle, hightPercent } from '@/styles/sizes';
import { color } from '@/styles/theme';

interface IStyle {
  styleType: 'light' | 'dark' | 'border' | 'medium';
}
export const Container = styled(TouchableOpacity) <IStyle>`
  width: 100%;
  height: ${hightPercent('5.4')}px;

  ${h =>
    h.styleType === 'light' &&
    css<IStyle>`
      background-color: ${color.greenLigh[200]};
    `}

  ${h =>
    h.styleType === 'dark' &&
    css<IStyle>`
      background-color: ${color.green[300]};
    `}

    ${h =>
    h.styleType === 'medium' &&
    css<IStyle>`
      background-color: ${color.green[200]};
    `}


    ${h =>
    h.styleType === 'border' &&
    css<IStyle>`
      border-width: 1.5px;
      border-color: ${color.gray[100]};
    `}


  align-items: center;
  justify-content: center;
  border-radius: 20px;

`;

export const title = styled.Text<IStyle>`
  font-size: ${_subtitle}px;
  font-family: 'regular';

  ${h =>
    h.styleType === 'light' &&
    css`
      color: ${color.green[300]};
    `}

  ${h =>
    h.styleType === 'dark' &&
    css`
      color: ${color.gray[300]};
    `}
  ${h =>
    h.styleType === 'medium' &&
    css`
      color: ${color.gray[100]};
    `}

    ${h =>
    h.styleType === 'border' &&
    css`
      color: ${color.gray[100]};
    `}
`;
