/* eslint-disable react/jsx-no-bind */
import React, { ReactNode } from 'react';
import { TouchableOpacity } from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Ionicons } from '@expo/vector-icons';

import { Center, Circle } from 'native-base';

import { BusSvg } from '@/assets/svgs/bus';
import { EletricSvg } from '@/assets/svgs/eletric';
import { FireSvg } from '@/assets/svgs/fire';
import { FoodSvg } from '@/assets/svgs/food';
import { TotalSvg } from '@/assets/svgs/total';
import { color } from '@/styles/theme';

import * as S from './styles';

interface I {
  step: number;
}

export function CircleStep({ step = 0 }: I) {
  const animation = useSharedValue(0);

  const icoOne = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            animation.value,
            [0, 40],
            [-55, 0],
            Extrapolate.CLAMP,
          ),
        },
        {
          translateX: interpolate(
            animation.value,
            [0, 40],
            [105, 0],
            Extrapolate.CLAMP,
          ),
        },
        {
          scale: interpolate(
            animation.value,
            [0, 40],
            [0, 1],
            Extrapolate.CLAMP,
          ),
        },
      ],
    };
  });

  const icoTwo = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            animation.value,
            [0, 40],
            [-50, -90],
            Extrapolate.CLAMP,
          ),
        },
        {
          translateX: interpolate(
            animation.value,
            [0, 40],
            [0, -90],
            Extrapolate.CLAMP,
          ),
        },
        {
          scale: interpolate(
            animation.value,
            [0, 40],
            [1, 0],
            Extrapolate.CLAMP,
          ),
        },
      ],
    };
  });

  const icones: { [key: number]: ReactNode } = {
    1: <EletricSvg size={40} />,
    2: <FireSvg size={40} />,
    3: <Ionicons size={50} color={color.green[100]} name="car-sport" />,
    4: <BusSvg size={60} />,
    5: <FoodSvg size={40} />,
    6: <TotalSvg size={40} />,
  };

  function animated() {
    animation.value = 0;
    animation.value = withTiming(100, { duration: 1500 });
  }

  React.useEffect(() => {
    if (step > 0) {
      animated();
    }
  }, [animation, step]);

  return (
    <S.Container>
      <S.boxCircle />
      <S.title>{step}/6</S.title>

      <Animated.View style={icoOne}>
        <Center mt={-5}>
          <Circle
            bg="rgb(223, 241, 141)"
            rounded="50px"
            size="70px"
            borderWidth={3}
            borderColor="#fff"
          >
            <TouchableOpacity onPress={animated}>
              {icones[step === 0 ? 1 : step]}
            </TouchableOpacity>
          </Circle>
        </Center>
      </Animated.View>

      <Animated.View style={icoTwo}>
        <Center mt={-5}>
          <Circle
            bg="rgb(196, 222, 83)"
            rounded="50px"
            size="70px"
            borderWidth={3}
            borderColor="#fff"
          >
            <TouchableOpacity onPress={animated}>
              {icones[step - 1]}
            </TouchableOpacity>
          </Circle>
        </Center>
      </Animated.View>
    </S.Container>
  );
}
