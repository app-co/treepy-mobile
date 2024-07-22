import { Line, Rect, Svg } from 'react-native-svg';

export function PredioSvg() {
  return (
    <Svg width="47" height="68" viewBox="0 0 87 128" fill="none">
      <Line
        x1="0.0351562"
        y1="126"
        x2="86.3699"
        y2="126"
        stroke="white"
        stroke-width="8"
      />
      <Rect
        x="10"
        y="2"
        width="67"
        height="124"
        stroke="white"
        stroke-width="8"
      />
      <Line x1="28" y1="127" x2="28" y2="102" stroke="white" stroke-width="8" />
      <Line x1="25" y1="100" x2="63" y2="100" stroke="white" stroke-width="8" />
      <Line x1="60" y1="102" x2="60" y2="127" stroke="white" stroke-width="8" />
      <Line x1="25" y1="82" x2="63" y2="82" stroke="white" stroke-width="8" />
      <Line x1="25" y1="62" x2="63" y2="62" stroke="white" stroke-width="8" />
      <Line x1="25" y1="42" x2="63" y2="42" stroke="white" stroke-width="8" />
      <Line x1="25" y1="22" x2="63" y2="22" stroke="white" stroke-width="8" />
    </Svg>
  );
}
