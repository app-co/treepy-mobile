import styled from 'styled-components/native';

import { _title, hightPercent, widtPercent } from '@/styles/sizes';
import { color } from '@/styles/theme';

export const Container = styled.View`
  /* position: absolute; */
  width: ${widtPercent('70')}px;
  height: ${widtPercent('70')}px;
  border-radius: 200px;
  top: -${hightPercent('20')}px;
  align-self: center;
  border-width: 3px;
  border-color: ${color.greenLigh[100]};
`;

export const boxCircle = styled.View`
  width: ${widtPercent('60')}px;
  height: ${widtPercent('60')}px;
  border-radius: 200px;
  align-self: center;
  border-color: ${color.greenLigh[100]};
  border-width: 3px;
  background-color: ${color.green[100]};
`;

export const title = styled.Text`
  position: absolute;
  color: ${color.gray[100]};
  font-size: ${_title + 15}px;
  font-family: Bold;
  top: ${hightPercent('19')}px;
  /* left: ${widtPercent('35')}; */
  align-self: center;
`;
