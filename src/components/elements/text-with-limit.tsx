/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/require-default-props */
/* eslint-disable react/function-component-definition */
import React, { useState } from 'react';
import { StyleSheet, Text, TextProps, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 350,
  },
  text: {
    flex: 1,
    fontSize: 14,
    letterSpacing: 0.56,
  },
});

interface I extends TextProps {
  text: string;
  characterLimit: number;
  showMore?: boolean;
}

export function TextWithLimit({ text, characterLimit, showMore, ...rest }: I) {
  const [showAll, setShowAll] = useState(false);

  const displayText = showAll ? text : text.slice(0, characterLimit);

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  return (
    <View style={styles.container}>
      <Text onPress={toggleShowAll} {...rest}>
        {displayText}
        {text.length > characterLimit && showMore && (
          <Text style={{ marginLeft: 8 }}>{showAll ? '' : ' ...'}</Text>
        )}
        {text.length > characterLimit && !showMore && ' ...'}
      </Text>
    </View>
  );
}
