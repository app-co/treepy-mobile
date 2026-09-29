import { createAnimations } from "@tamagui/animations-react-native";
import { Dimensions, PixelRatio } from "react-native";
import { createFont, createTamagui, createTokens } from "tamagui";

const dm = Dimensions.get("window");
const widthDp = PixelRatio.getPixelSizeForLayoutSize(dm.width);
const hDp = PixelRatio.getPixelSizeForLayoutSize(dm.height);
const px = PixelRatio.get() * 100;

export function scale(size: number) {
	return Number(((widthDp / px) * size).toFixed(3));
}
export function scaleH(size: number) {
	return (hDp / px) * size;
}

// 1. Defina os componentes da config ANTES de chamar o createTamagui

const headlineFont = createFont({
	family: "PlusJakartaSans",
	size: { 1: 12, 2: 14, 3: 16, 4: 20, 5: 24, 6: 32, true: 24 },
	lineHeight: { 1: 17, 2: 22, 3: 25, 4: 30, 5: 35, 6: 45, true: 35 },
	weight: {
		400: "400",
		700: "700",
	},
	letterSpacing: { 4: 0, 7: -0.5 },
	face: {
		400: { normal: "PlusJakartaSans-Regular" },
		700: { normal: "PlusJakartaSans-Bold" },
	},
});

const bodyFont = createFont({
	family: "PlusJakartaSans",
	size: { 1: 12, 2: 14, 3: 16, 4: 20, true: 14 },
	lineHeight: { 1: 17, 2: 22, 3: 25, 4: 30, true: 22 },
	weight: {
		400: "400",
		700: "700",
	},
	letterSpacing: { 4: 0, 7: -0.5 },
	face: {
		400: { normal: "PlusJakartaSans-Regular" },
		700: { normal: "PlusJakartaSans-Bold" },
	},
});

const labelFont = createFont({
	family: "JetBrainsMono",
	size: { 1: 10, 2: 12, 3: 14, 4: 16, true: 12 },
	lineHeight: { 1: 14, 2: 17, 3: 20, 4: 24, true: 17 },
	weight: {
		400: "400",
		700: "700",
	},
	letterSpacing: { 4: 0, 7: -0.5 },
	face: {
		400: { normal: "JetBrainsMono-Regular" },
		700: { normal: "JetBrainsMono-Bold" },
	},
});

const tokens = createTokens({
	size: { sm: 8, md: 12, lg: scale(15), true: 12 },
	space: { sm: 4, md: 8, lg: 12, true: 8 },
	radius: { none: 0, sm: 3, md: 6, lg: 10, true: 6 },
	color: {
		primary: "#C1FF00",
		secondary: "#1E2328",
		tertiary: "#FFFFFF",
		neutral: "#111418",
		white: "#fff",
		black: "#000",
		gray: "#8f8f8f",
		error: "#ef4444",
		// fallbacks
		color: "#FFFFFF",
		true: "#1E2328",
	},
	zIndex: { 0: 0, true: 0 },
});

const animations = createAnimations({
	bouncy: { damping: 10, mass: 0.9, stiffness: 100 },
	lazy: { damping: 18, stiffness: 50 },
	quick: { damping: 20, mass: 1.2, stiffness: 250 },
});

// 2. Agora sim, crie a config única
export const config = createTamagui({
	animations,
	fonts: {
		heading: headlineFont,
		body: bodyFont,
		label: labelFont,
	},
	tokens,
	themes: {
		light: {
			background: "#FFFFFF",
			backgroundHover: "#f0f0f0",
			backgroundPress: "#e0e0e0",
			backgroundFocus: "#d0d0d0",
			color: "#111418",
			colorHover: "#111418",
			colorPress: "#111418",
			colorFocus: "#111418",
			borderColor: "#1E2328",
			borderColorHover: "#1E2328",
			borderColorPress: "#1E2328",
			borderColorFocus: "#C1FF00",
			secundary: "#C1FF00",
			primary: "#f39128ff",
			error: "#ef4444",
		},
		dark: {
			background: "#111418",
			backgroundHover: "#1E2328",
			backgroundPress: "#2a3037",
			backgroundFocus: "#1E2328",
			color: "#FFFFFF",
			colorHover: "#bebebeff",
			colorPress: "#FFFFFF",
			colorFocus: "#dfff80ff",
			borderColor: "#6b737bff",
			borderColorHover: "#C1FF00",
			secundary: "#C1FF00",
			borderColorPress: "#C1FF00",
			borderColorFocus: "#C1FF00",
			primary: "#f39128ff",
			error: "#ef4444",
		},
	},
	media: {
		sm: { maxWidth: 860 },
		gtSm: { minWidth: 861 },
		short: { maxHeight: 820 },
		hoverNone: { hover: "none" },
		pointerCoarse: { pointer: "coarse" },
	},
	shorthands: {
		px: "paddingHorizontal",
		py: "paddingVertical",
		pt: "paddingTop",
		pb: "paddingBottom",
		pl: "paddingLeft",
		pr: "paddingRight",
		my: "marginVertical",
		mx: "marginHorizontal",
		mt: "marginTop",
		mb: "marginBottom",
		ml: "marginLeft",
		mr: "marginRight",
		br: "borderRadius",
		bg: "backgroundColor",
		p: "padding",
	} as const,
	settings: {
		disableSSR: true,
		allowedStyleValues: "somewhat-strict-web",
	},
});

// 3. Export default ÚNICO no final
export default config;

type OurConfig = typeof config;
declare module "tamagui" {
	interface TamaguiCustomConfig extends OurConfig {}
}
