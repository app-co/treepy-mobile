import styled from 'styled-components/native';

import { _title, hightPercent } from '@/styles/sizes';
import { color } from '@/styles/theme';

export const Container = styled.View`
  flex: 1;
`;

export const title = styled.Text`
  color: ${color.gray[100]};
  font-family: trin;
  font-size: ${_title + 10}px;
`;
export const content = styled.View`
  margin-top: ${hightPercent('12')}px;
  padding: 10px;
  gap: 15px;
  flex: 1;
`;
