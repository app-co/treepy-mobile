import { useCallback } from "react";
import {
	useAnimatedStyle,
	useSharedValue,
	type WithSpringConfig,
	withTiming,
} from "react-native-reanimated";
import { SPRING_CONFIG } from "../config/animations.config";

interface I {
	scaleActive?: number;
	springConfig?: WithSpringConfig;
}

export const usePressAnimation = ({
	scaleActive = 0.95,
	springConfig = SPRING_CONFIG.press,
}: I) => {
	const scale = useSharedValue(1);

	const onPressIn = useCallback(() => {
		scale.value = withTiming(scaleActive, springConfig);
	}, [scaleActive, springConfig, scale]);

	const onPressOut = useCallback(() => {
		scale.value = withTiming(1, springConfig);
	}, [springConfig, scale]);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }],
		width: "100%",
	}));

	return { onPressIn, onPressOut, animatedStyle };
};
