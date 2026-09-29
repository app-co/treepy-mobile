import { Spinner, YStack } from "tamagui";
import { scale } from "../../../tamagui.config";
import { Img, Text } from "./Layout";

export function Loading() {
	return (
		<YStack
			flex={1}
			justifyContent="center"
			alignItems="center"
			backgroundColor="$background"
			transition="quick"
			enterStyle={{
				opacity: 0,
				scale: 0.9,
			}}
			exitStyle={{
				opacity: 0,
				scale: 0.9,
			}}
		>
			<Img
				source={require("@/assets/logo.png")}
				width={scale(55)}
				height={scale(40)}
				cachePolicy={"memory-disk"}
				alignSelf="center"
				mb={30}
				opacity={0.3}
			/>
			<Spinner size="large" color="$secundary" />
			<Text t="a3" fontFamily={"$body"} textAlign="center">
				Carregando...
			</Text>
		</YStack>
	);
}
