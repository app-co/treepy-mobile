import styled from 'styled-components/native';

import { _subtitle, _title, hightPercent } from '@/styles/sizes';
import { color } from '@/styles/theme';

export const Container = styled.View`
  width: 100%;
  height: ${hightPercent('90')}px;
  padding: 20px;
  background-color: ${color.green[100]};
`;

export const title = styled.Text`
  font-size: ${_title + 5}px;
  color: ${color.greenLigh[100]};
  font-family: 'bold';
`;

export const text = styled.Text`
  font-size: ${_subtitle}px;
  color: ${color.gray[100]};
  font-family: 'regular';
`;
