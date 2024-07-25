/* eslint-disable react/require-default-props */
import { Radio } from 'native-base';

import { color } from '@/styles/theme';

export type TRadios = { label: string; value: string };
interface I {
  radios: TRadios[];
  alin?: 'row' | 'column';
  name?: string;
  selected: (value: string) => void;
}
export function RadioGrup({
  radios,
  selected,
  name = 'my group',
  alin = 'column',
}: I) {
  return (
    <Radio.Group
      onChange={h => selected(h)}
      name={name}
      defaultValue="0"
      direction={alin}
      space={2}
    >
      {radios.map(h => (
        <Radio
          key={h.value}
          _text={{
            color: color.gray[100],
            fontFamily: 'regular',
            fontSize: 18,
          }}
          size="sm"
          _checked={{
            borderColor: color.orange[100],
            _icon: { color: color.orange[100] },
          }}
          colorScheme="primary"
          value={h.value}
        >
          {h.label}
        </Radio>
      ))}
    </Radio.Group>
  );
}
