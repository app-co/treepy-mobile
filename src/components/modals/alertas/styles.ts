import { styled, View } from "tamagui";
import { Text } from "../../ui/Layout";

export const container = styled(View, {
	position: "absolute",
	top: "30%",
	width: "80%",
	borderRadius: 10,
	justifyContent: "center",
	alignItems: "center",
	zIndex: 9999,
	alignSelf: "center",
	minHeight: 200,
	maxHeight: 300,
	borderRightWidth: 6,
	borderBottomWidth: 1,
	padding: 20,

	variants: {
		type: {
			success: {
				backgroundColor: "$backgroundHover",
				borderColor: "$secundary",
			},
			error: {
				backgroundColor: "$backgroundHover",
				borderColor: "$error",
			},
			warning: {
				backgroundColor: "$backgroundHover",
				borderColor: "$primary",
			},
		},
		visible: {
			true: { display: "flex" },
			false: { display: "none", zIndex: 0 },
		},
	} as const,
});

export const text = styled(Text, {
	variants: {
		tipo: {
			success: { color: "$secundary" },
			error: { color: "$error" },
			warning: { color: "$primary" },
		},
	} as const,
	fontWeight: "900",
});
