import { MoldalProvider } from "@/components/modals";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { TamaguiProvider, Theme, View } from "tamagui";
import config from "../../tamagui.config";

interface IProps {
	children: React.ReactNode;
}

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5, // 5 minutes
			gcTime: 1000 * 60 * 30, // 30 minutes
		},
	},
});

export function Providers({ children }: IProps) {
	return (
		<TamaguiProvider config={config} defaultTheme="dark">
			<Theme name="dark">
				<QueryClientProvider client={queryClient}>
					<GestureHandlerRootView style={{ flex: 1 }}>
						<View backgroundColor={"$secundary"} flex={1}>
							<MoldalProvider />
							<SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>
						</View>
					</GestureHandlerRootView>
				</QueryClientProvider>
			</Theme>
		</TamaguiProvider>
	);
}
