import styled from 'styled-components/native';

import { color } from '@/styles/color';

export const Container = styled.View`
  height: 100px;
  background-color: ${color.focus.ligh};
  padding: 20px;
  position: absolute;
  z-index: 100;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const title = styled.Text`
  color: ${color.text_color.focus};
  margin-top: 20px;
`;
