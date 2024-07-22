import styled from 'styled-components/native';

import { _subtitle, _text, _title } from '@/styles/sizes';
import { color } from '@/styles/theme';

export const Container = styled.View`
  flex: 1;
`;

export const title = styled.Text`
  color: ${color.gray[100]};
  font-size: ${_title}px;
  font-family: 'light';
`;

export const sub = styled.Text`
  color: ${color.gray[100]};
  font-size: ${_subtitle}px;
  font-family: 'regular';
`;

export const text = styled.Text`
  color: ${color.gray[100]};
  font-size: ${_text}px;
  font-family: 'light';
`;

export const content = styled.View`
  padding: 10px;
  gap: 15px;
`;

export const box = styled.View`
  background-color: rgba(4, 43, 23, 0.75);
  padding: 10px;
`;
