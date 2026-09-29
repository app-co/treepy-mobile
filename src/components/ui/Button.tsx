import type React from "react";
import { ActivityIndicator, type GestureResponderEvent } from "react-native";
import Animated from "react-native-reanimated";
import { useTheme } from "tamagui";
import { scale, scaleH } from "../../../tamagui.config";
import { usePressAnimation } from "../animations/hooks/usePressAnimations";
import { Box, Text, Touch } from "./Layout";

export type ButtonVariant =
	| "primary"
	| "secondary"
	| "outline"
	| "ghost"
	| "danger"
	| "success";
export type ButtonSize = "sm" | "smx1" | "md" | "lg";

export interface ButtonProps {
	variant?: ButtonVariant;
	size?: ButtonSize;
	disabled?: boolean;
	fullWidth?: boolean;
	onPress?: (event: GestureResponderEvent) => void;
	children: React.ReactNode;
	borderRadius?: number;
	loading?: boolean;
	icon?: React.ReactNode;
	iconRight?: React.ReactNode;
}

export const Button = ({
	variant = "primary",
	size = "md",
	disabled = false,
	fullWidth = false,
	onPress,
	children,
	borderRadius,
	loading,
	icon,
	iconRight,
}: ButtonProps) => {
	const theme = useTheme();
	const handleAnimated = usePressAnimation({ scaleActive: 0.95 });

	const sizeStyles = {
		sm: {
			paddingHorizontal: 12,
			paddingVertical: 8,
			fontSize: scale(4),
			height: scaleH(5),
			lineHeight: scaleH(3),
		},
		smx1: {
			paddingHorizontal: 4,
			paddingVertical: 2,
			fontSize: scale(3.5),
			height: scaleH(3.5),
			lineHeight: scaleH(2),
		},
		md: {
			paddingHorizontal: 16,
			paddingVertical: 12,
			fontSize: scale(5),
			height: scaleH(6),
			lineHeight: scaleH(3),
		},
		lg: {
			paddingHorizontal: 24,
			paddingVertical: 3,
			fontSize: scale(5.5),
			height: scaleH(7),
			lineHeight: scaleH(4),
		},
	};

	const variantStyles: Record<
		ButtonVariant,
		{ backgroundColor: any; color: any; borderWidth: number; borderColor?: any }
	> = {
		primary: {
			backgroundColor: disabled ? "#ccc" : theme.primary,
			color: theme.black || "#000",
			borderWidth: 0,
		},
		secondary: {
			backgroundColor: disabled ? "#eee" : theme.secundary || "#2a3037",
			color: disabled ? "#999" : theme.background || "#fff",
			borderWidth: 0,
		},
		outline: {
			backgroundColor: "transparent",
			color: disabled ? "#999" : theme.primary,
			borderWidth: 1,
			borderColor: disabled ? "#ddd" : theme.primary,
		},
		ghost: {
			backgroundColor: "transparent",
			color: disabled ? "#e6e6e6" : theme.color || "#fff",
			borderWidth: 0,
		},
		danger: {
			backgroundColor: disabled ? "#ddd" : "#ef4444",
			color: "#fff",
			borderWidth: 0,
		},
		success: {
			backgroundColor: disabled ? "#ddd" : "#22c55e",
			color: "#fff",
			borderWidth: 0,
		},
	};

	const currentSize = sizeStyles[size];
	const currentVariant = variantStyles[variant];

	return (
		<Animated.View style={[handleAnimated.animatedStyle]}>
			<Box
				width={fullWidth ? "100%" : "auto"}
				height={currentSize.height}
				paddingHorizontal={currentSize.paddingHorizontal}
				paddingVertical={currentSize.paddingVertical}
				borderRadius={borderRadius ?? 10}
				backgroundColor={currentVariant.backgroundColor}
				borderWidth={currentVariant.borderWidth}
				borderColor={currentVariant.borderColor}
				flexDirection="row"
				justifyContent="center"
				alignItems="center"
				gap={8}
			>
				<Touch
					disabled={disabled || loading}
					flex={1}
					backgroundColor={"transparent"}
					onPress={onPress}
					opacity={disabled || loading ? 0.6 : 1}
					onPressIn={handleAnimated.onPressIn}
					onPressOut={handleAnimated.onPressOut}
					flexDirection="row"
					justifyContent="center"
					alignItems="center"
					padding={0}
					margin={0}
				>
					{loading ? (
						<ActivityIndicator color={currentVariant.color} />
					) : (
						<>
							{icon}
							<Text
								color={currentVariant.color}
								fontSize={currentSize.fontSize}
								fontWeight="$700"
								textAlign="center"
								fontFamily={"$body"}
								lineHeight={currentSize.lineHeight}
								marginHorizontal={icon || iconRight ? 8 : 0}
							>
								{children}
							</Text>
							{iconRight}
						</>
					)}
				</Touch>
			</Box>
		</Animated.View>
	);
};

export default Button;
