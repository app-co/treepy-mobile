/* eslint-disable react/require-default-props */
import { Text } from 'react-native';

import { Box, Select } from 'native-base';

import { _text, hightPercent } from '@/styles/sizes';
import { color } from '@/styles/theme';

export type TSelectionItem = { value: string; label: string };

interface I {
  itens: TSelectionItem[];
  itemSelected: (value: string) => void;
  label?: string;
  placeholder?: string;
}

export function Selection({ itens, placeholder, label, itemSelected }: I) {
  return (
    <Box>
      {label && (
        <Text
          style={{
            position: 'absolute',
            top: -8,
            left: '30%',
            alignSelf: 'center',
            backgroundColor: '#fff',
            paddingHorizontal: 5,
            zIndex: 10,
            fontSize: _text,
          }}
        >
          {label}
        </Text>
      )}
      <Select
        placeholder={placeholder}
        placeholderTextColor={color.green[300]}
        onValueChange={h => itemSelected(h)}
        justifyContent="center"
        alignItems="center"
        bg={color.greenLigh[100]}
        _text={{
          color: color.green[400],
          textAlign: 'center',
          marginLeft: '100px',
          fontSize: _text,
        }}
        textAlign="center"
        fontSize={_text}
        defaultValue="Selecione um item"
        rounded="15px"
        h={`${hightPercent('6')}px`}
      >
        {itens.map(h => (
          <Select.Item
            _text={{
              textAlign: 'center',
              alignItems: 'center',
              fontSize: _text,
            }}
            alignItems="center"
            justifyContent="center"
            key={h.value}
            label={h.label}
            value={h.value}
          />
        ))}
      </Select>
    </Box>
  );
}
