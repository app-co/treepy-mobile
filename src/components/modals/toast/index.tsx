/* eslint-disable react/jsx-no-bind */
import React, {
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import GlobalErrorModalHandler from './handler';
import * as S from './styles';
import { GlobalErrorModalRef, T } from './types';

export function ToastModal() {
  const [isOpen, setIsOpen] = useState(false);

  const [message, setMessage] = React.useState<T>();

  const animation = useSharedValue(0);
  const animationScale = useSharedValue(0);

  const animetedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            animation.value,
            [0, 0.3, 9.5, 10],
            [300, -340, -340, 300],
          ),
        },
      ],
      opacity: interpolate(animation.value, [0, 0.5, 9.5, 10], [0, 1, 1, 0]),
    };
  });

  const styleScale = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(animationScale.value, [0, 20], [1, 0]),
        },
      ],
    };
  });

  function animated() {
    animation.value = 0;

    animation.value = withTiming(10, { duration: 4000 });
  }

  React.useEffect(() => {
    animationScale.value = 20;
    if (message) {
      animated();
    }
  }, [message]);

  const ref = useRef<GlobalErrorModalRef>();

  function showModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function obj(item: T) {
    setIsOpen(true);
    setMessage(item);
  }

  useLayoutEffect(() => {
    GlobalErrorModalHandler.setRef(ref);
  }, []);

  useImperativeHandle(ref, () => ({
    show: showModal,
    hide: closeModal,
    item: h => obj(h),
  }));

  // if (!message) {
  //   return null;
  // }

  return (
    <S.container style={[animetedStyle]} type={message?.tipo ?? 'success'}>
      <S.title>{message?.title}</S.title>
      <S.text>{message?.description}</S.text>
    </S.container>
  );
}
