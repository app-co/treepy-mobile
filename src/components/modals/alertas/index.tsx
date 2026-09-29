/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */

import Button from "@/components/ui/Button";
import { CircleAlert } from "lucide-react-native";
import React, { useImperativeHandle, useLayoutEffect, useRef } from "react";
import { useTheme, XStack, YStack } from "tamagui";
import { scale } from "../../../../tamagui.config";
import { Box } from "../../ui/Layout";
import handler from "./handler";
import * as S from "./styles";
import type { GlobalRef, T } from "./types";

export function AlerProvider() {
	const colors = useTheme();
	const [item, setItem] = React.useState<T>({
		title: "",
		description: "",
		tipo: "success",
	});

	const ref = useRef<GlobalRef | null>(null);

	useLayoutEffect(() => {
		handler.setRef(ref);
	}, []);

	useImperativeHandle(ref, () => ({
		show: (h) => setItem(h),
		hide: () => setItem({ title: "", description: "", tipo: "success" }),
	}));

	return (
		<S.container visible={!!item?.title} type={item?.tipo}>
			<YStack>
				<XStack alignItems="center" gap={15} mb={10}>
					<CircleAlert size={scale(8)} color={colors["backgroundFocus"].val} />
					<S.text t="a2" tipo={item?.tipo} fontWeight={"700"}>
						{item?.title}
					</S.text>
				</XStack>
				<S.text fontWeight={600} tipo={item?.tipo} t={"a4"}>
					{item?.description}
				</S.text>
			</YStack>

			<Box mt={20} width={"100%"} px={20}>
				<Button
					variant="danger"
					onPress={() => {
						handler.hide();
					}}
				>
					OK
				</Button>
			</Box>
		</S.container>
	);
}
