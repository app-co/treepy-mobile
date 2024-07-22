import styled from 'styled-components/native';

import { _subtitle, _text, _title } from '@/styles/sizes';
import { color } from '@/styles/theme';

export const Container = styled.View`
  flex: 1;
`;

export const title = styled.Text`
  font-size: ${_title}px;
  color: ${color.gray[100]};
  font-family: 'trin';
`;

export const sub = styled.Text`
  font-size: ${_subtitle}px;
  color: ${color.greenLigh[100]};
  font-family: 'bold';
`;

export const tex = styled.Text`
  font-size: ${_text} px;
`;
