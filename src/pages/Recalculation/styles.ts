import styled from 'styled-components/native';

import { _title, hightPercent } from '@/styles/sizes';

export const Container = styled.View`
  flex: 1;
`;

export const title = styled.Text`
  size: ${_title}px;
  color: #fff;
`;

export const conteten = styled.View`
  padding: 10px;
  top: -${hightPercent('18')}px;
`;
