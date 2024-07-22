import styled from 'styled-components/native';

import { _subtitle, _text, _title } from '@/styles/sizes';
import { color } from '@/styles/theme';

export const Container = styled.View`
  flex: 1;
`;

export const title = styled.Text`
  color: ${color.gray[100]};
  font-family: trin;
  font-size: ${_title + 10}px;
`;

export const text = styled.Text`
  color: ${color.gray[200]};
  font-size: ${_text}px;
  font-family: trin;
`;

export const content = styled.View`
  background-color: rgba(6, 29, 14, 0.8);
  padding: 10px;
  border-radius: 5px;
`;

export const sub = styled.Text`
  font-family: regular;
  font-size: ${_subtitle}px;
  color: ${color.gray[100]};
`;
