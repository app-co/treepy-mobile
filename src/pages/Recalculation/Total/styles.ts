import styled from 'styled-components/native';

import { _subtitle, _title } from '@/styles/sizes';
import { color } from '@/styles/theme';

export const Container = styled.View``;
export const title = styled.Text`
  font-family: trin;
  font-size: ${_title - 1}px;
  color: ${color.gray[100]};
`;
export const text = styled.Text`
  font-family: light;
  font-size: ${_subtitle + 2}px;
  color: ${color.gray[100]};
`;
