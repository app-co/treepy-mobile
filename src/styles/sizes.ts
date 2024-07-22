/* eslint-disable no-underscore-dangle */
import { Dimensions, PixelRatio } from 'react-native';

export const _height = Dimensions.get('screen').height;
export const _width = Dimensions.get('screen').width;

export const _title = PixelRatio.roundToNearestPixel(
  (_height * parseFloat('2.9')) / 100,
);
export const _subtitle = PixelRatio.roundToNearestPixel(
  (_height * parseFloat('2.2')) / 100,
);
export const _text = PixelRatio.roundToNearestPixel(
  (_height * parseFloat('1.8')) / 100,
);

export const _canva = (_height * _width) / 100 ** 2;

export function widtPercent(value: string) {
  return PixelRatio.roundToNearestPixel((_width * parseFloat(value)) / 100);
}

export function hightPercent(value: string) {
  return PixelRatio.roundToNearestPixel((_height * parseFloat(value)) / 100);
}

export function canvaPercent(value: string) {
  return PixelRatio.roundToNearestPixel((_height * parseFloat(value)) / 100);
}

export function titlePercent() {
  return PixelRatio.roundToNearestPixel((_height * parseFloat('3.4')) / 100);
}

export function subtitlePercent() {
  return PixelRatio.roundToNearestPixel((_height * parseFloat('3')) / 100);
}

export function textPercent(value: string) {
  return PixelRatio.roundToNearestPixel((_height * parseFloat('1')) / 100);
}
