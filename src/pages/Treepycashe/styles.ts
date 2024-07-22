import styled from 'styled-components/native';

import { _subtitle } from '@/styles/sizes';
import { color } from '@/styles/theme';

export const Container = styled.View`
  flex: 1;
`;

export const title = styled.Text`
  color: ${color.gray[100]};
  font-family: light;
  font-size: ${_subtitle}px;
`;

export const titleHeader = styled.Text`
  color: ${color.gray[100]};
  font-family: trin;
  font-size: ${_subtitle}px;
`;

export const content = styled.View`
  background-color: rgba(12, 39, 27, 0.772);
  padding: 10px;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  margin: 10px 0;
`;

export const header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
