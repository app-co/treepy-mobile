import { useCallback } from "react";
import {
	interpolateColor,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	type WithSpringConfig,
} from "react-native-reanimated";
import { useTheme } from "tamagui";
import { SPRING_CONFIG } from "../config/animations.config";

interface I {
	springConfig?: WithSpringConfig;
	hasError?: boolean;
}

export function useInputAnimation({
	springConfig = SPRING_CONFIG.press,
	hasError = false,
}: I = {}) {
	const focus = useSharedValue(0);
	const theme = useTheme();

	const defaultBorderColor = theme.borderColor?.val || "#1E2328";
	const focusBorderColor =
		theme.borderColorFocus?.val || theme.secundary?.val || "#C1FF00";
	const errorBorderColor = theme.error?.val || "#ef4444";

	const onFocus = useCallback(() => {
		focus.value = withSpring(1, springConfig);
	}, [springConfig, focus]);

	const onBlur = useCallback(() => {
		focus.value = withSpring(0, springConfig);
	}, [springConfig, focus]);

	const animatedStyle = useAnimatedStyle(() => {
		const borderColor = hasError
			? errorBorderColor
			: interpolateColor(
					focus.value,
					[0, 1],
					[defaultBorderColor, focusBorderColor],
				);
		return {
			borderColor,
			transform: [{ scale: 1 + 0.02 * focus.value }],
			flexDirection: "row",
		};
	}, [hasError, defaultBorderColor, focusBorderColor, errorBorderColor]);

	return {
		onFocus,
		onBlur,
		animatedStyle,
	};
}
