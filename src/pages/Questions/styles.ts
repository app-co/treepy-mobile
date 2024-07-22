import styled from 'styled-components/native';

import { _subtitle, _title } from '@/styles/sizes';
import { color } from '@/styles/theme';

export const Container = styled.View`
  flex: 1;
`;

export const title = styled.Text`
  font-family: 'light';
  font-size: ${_title + 8}px;
  color: ${color.gray[100]};
`;

export const sub = styled.Text`
  font-family: bold;
  font-size: ${_subtitle}px;
  color: ${color.greenLigh[100]};
`;
