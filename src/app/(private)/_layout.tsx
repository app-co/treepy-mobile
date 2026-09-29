import { Stack } from "expo-router";

export default function RootPrivate() {
	return <Stack screenOptions={{ headerShown: false }} />;
}
