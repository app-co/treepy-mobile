import { Redirect } from "expo-router";

export default function IndexScreen() {
	// const { isAuth } = useAuth();
	const isAuth = false;

	if (isAuth) {
		return <Redirect href={"/(private)" as any} />;
	}

	return <Redirect href="/login" />;
}
