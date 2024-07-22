import styled from 'styled-components/native';

import { _subtitle } from '@/styles/sizes';
import { color } from '@/styles/theme';

export const Container = styled.View`
  flex: 1;
`;

export const title = styled.Text`
  color: ${color.gray[100]};
  font-size: ${_subtitle}px;
  font-family: light;
`;