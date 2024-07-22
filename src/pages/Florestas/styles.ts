import styled from 'styled-components/native';

import { _subtitle, _title } from '@/styles/sizes';
import { color } from '@/styles/theme';

export const Container = styled.View`
  flex: 1;
`;

export const title = styled.Text`
  color: ${color.gray[100]};
  font-size: ${_title}px;
  font-family: light;
`;

export const sub = styled.Text`
  color: ${color.gray[100]};
  font-size: ${_subtitle}px;
  font-family: trin;
`;

export const content = styled.View`
  background-color: rgba(6, 29, 14, 0.8);
  padding: 10px;
  border-radius: 5px;
  gap: 25px;
`;
