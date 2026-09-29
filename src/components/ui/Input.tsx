import type React from "react";
import { forwardRef, useState } from "react";
import {
	Controller,
	type FieldValues,
	type UseControllerProps,
} from "react-hook-form";
import Animated from "react-native-reanimated";
import {
	type ColorTokens,
	type TamaguiElement,
	Input as TamaInput,
	type InputProps as TamaInputProps,
	useTheme,
	XStack,
	YStack,
} from "tamagui";
import { scale, scaleH } from "../../../tamagui.config";
import { SPRING_CONFIG } from "../animations/config/animations.config";
import { useInputAnimation } from "../animations/hooks/useInputAnimations";
import { Box, Text } from "./Layout";

export type InputSize = "sm" | "md" | "lg";

export interface OmittedInputProps extends Omit<TamaInputProps, "size"> {}

export interface InputProps extends OmittedInputProps {
	size?: InputSize;
	label?: string;
	error?: string;
	helperText?: string;
	fullWidth?: boolean;
	leftElement?: React.ReactNode;
	rightElement?: React.ReactNode;
	containerProps?: React.ComponentProps<typeof YStack>;
	type?: "green" | "dark";
}

const BoxAnimation = Animated.createAnimatedComponent(Box);

export const Input = forwardRef<TamaguiElement, InputProps>(
	(
		{
			size = "md",
			label,
			error,
			helperText,
			fullWidth = false,
			leftElement,
			rightElement,
			containerProps,
			disabled,
			onFocus,
			onBlur,
			type = "green",
			...props
		},
		ref,
	) => {
		const theme = useTheme();
		const [isFocused, setIsFocused] = useState(false);
		const handleAnimation = useInputAnimation({
			springConfig: SPRING_CONFIG.press,
			hasError: !!error,
		});

		const sizeStyles = {
			sm: {
				paddingHorizontal: 12,
				fontSize: scale(4),
				height: scaleH(5),
				letterSpacing: 1,
			},
			md: {
				paddingHorizontal: 16,
				fontSize: scale(4.5),
				height: scaleH(6),
				letterSpacing: 1,
			},
			lg: {
				paddingHorizontal: 24,
				fontSize: scale(9),
				height: scaleH(10),
				letterSpacing: scale(4),
			},
		};

		const currentSize = sizeStyles[size];

		return (
			<YStack width={fullWidth ? "100%" : "auto"} gap={8} {...containerProps}>
				{label && (
					<Text
						color={theme["on-surface-variant"]}
						fontSize={currentSize.fontSize}
						fontWeight="500"
						fontFamily="$body"
					>
						{label}
					</Text>
				)}

				<BoxAnimation
					width="100%"
					height={currentSize.height}
					borderWidth={1}
					// backgroundColor={type === "green" ? "$focus1" : "$primary1"}
					justifyContent="space-between"
					borderRadius={5}
					// alignItems="center"
					overflow="hidden"
					opacity={disabled ? 0.6 : 1}
					style={handleAnimation.animatedStyle}
				>
					{leftElement && (
						<XStack
							paddingLeft={currentSize.paddingHorizontal}
							alignItems="center"
							justifyContent="center"
						>
							{leftElement}
						</XStack>
					)}

					<TamaInput
						ref={ref}
						flex={1}
						height="100%"
						borderWidth={0}
						backgroundColor="transparent"
						color={theme["inverse-surface"]}
						paddingHorizontal={leftElement ? 8 : currentSize.paddingHorizontal}
						paddingRight={rightElement ? 8 : currentSize.paddingHorizontal}
						fontSize={currentSize.fontSize}
						letterSpacing={currentSize.letterSpacing}
						fontWeight="400"
						fontFamily="$body"
						placeholderTextColor={
							theme["colorHover"]?.val as unknown as ColorTokens
						}
						disabled={disabled}
						onFocus={(e) => {
							setIsFocused(true);
							onFocus?.(e);
							handleAnimation.onFocus();
						}}
						onBlur={(e) => {
							setIsFocused(false);
							onBlur?.(e);
							handleAnimation.onBlur();
						}}
						focusStyle={{
							outlineWidth: 0,
							borderWidth: 0,
						}}
						{...props}
					/>

					{rightElement && (
						<XStack
							paddingRight={currentSize.paddingHorizontal}
							alignItems="center"
							justifyContent="center"
						>
							{rightElement}
						</XStack>
					)}
				</BoxAnimation>

				{(error || helperText) && (
					<Text
						top={-10}
						color={error ? theme.error : theme["on-surface-variant"]}
						fontFamily="$body"
						fontWeight={"500"}
					>
						{error || helperText}
					</Text>
				)}
			</YStack>
		);
	},
);

Input.displayName = "Input";

export interface ControlledInputProps<T extends FieldValues>
	extends InputProps {
	name: UseControllerProps<T>["name"];
	control: UseControllerProps<T>["control"];
	rules?: UseControllerProps<T>["rules"];
}

export function ControlledInput<T extends FieldValues>({
	name,
	control,
	rules,
	...inputProps
}: ControlledInputProps<T>) {
	return (
		<Controller
			name={name}
			control={control}
			rules={rules}
			render={({
				field: { onChange, onBlur, value, ref },
				fieldState: { error },
			}) => (
				<Input
					{...inputProps}
					ref={ref}
					onBlur={(e) => {
						onBlur();
						inputProps.onBlur?.(e);
					}}
					onChangeText={(text) => {
						onChange(text);
						inputProps.onChangeText?.(text);
					}}
					value={value}
					error={error?.message || inputProps.error}
				/>
			)}
		/>
	);
}
