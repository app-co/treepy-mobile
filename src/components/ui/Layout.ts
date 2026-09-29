import { Image } from "expo-image";
import { FlatList, ScrollView, TouchableOpacity } from "react-native";
import { styled, Text as T, View } from "tamagui";
import { scale } from "../../../tamagui.config";

export const Box = styled(View, {});

export const VStack = styled(View, {
	flexDirection: "column",
});

export const HStack = styled(View, {
	flexDirection: "row",
	alignItems: "center",
});

export const Center = styled(View, {
	justifyContent: "center",
	alignItems: "center",
});

export const Container = styled(View, {
	flex: 1,
});

export const Text = styled(T, {
	color: "$colorFocus",
	fontFamily: "$body",
	variants: {
		t: {
			a1: {
				fontSize: scale(7),
				fontWeight: "900", // black
			},
			a2: {
				fontSize: scale(6),
				fontWeight: "700",
			},
			a3: {
				fontSize: scale(5),
				fontWeight: "500", // regular
			},
			a4: {
				fontSize: scale(4),
				fontWeight: "300", // regular
			},
			a5: {
				fontSize: scale(3),
				fontWeight: "100", // regular
			},
		},
	} as const,
	defaultVariants: {
		t: "a4",
	},
});

export const Img = styled(Image, {
	cachePolicy: "memory",
});

export const Touch = styled(TouchableOpacity, {
	alignItems: "center",
	justifyContent: "center",
});

export const Flat = styled(FlatList, {
	showsVerticalScrollIndicator: false,
	showsHorizontalScrollIndicator: false,
});

export const Scroll = styled(ScrollView, {
	showsVerticalScrollIndicator: false,
	showsHorizontalScrollIndicator: false,
});
