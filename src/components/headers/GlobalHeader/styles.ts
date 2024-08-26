import styled from 'styled-components/native';

import { _subtitle } from '@/styles/sizes';
import { color } from '@/styles/theme';

export const Container = styled.View`
  position: absolute;
  padding: 30px 0px;

  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  width: 100%;
`;

export const title = styled.Text`
  font-family: 'bold';
  font-size: ${_subtitle}px;
  color: ${color.greenLigh[100]};
  text-align: start;
  flex: 1;
`;
