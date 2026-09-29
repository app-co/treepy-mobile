/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */
import Alert from "@/components/modals/alertas/handler";
import { AppError } from "./AppError";

export function useError(err: any) {
	if (err instanceof AppError) {
		console.log({ err });
		return Alert.show({
			title: "Erro",
			description: err.message,
			tipo: "warning",
		});
	}
	Alert.show({
		title: "Erro",
		description: "Ocorreu um erro interno, tente novamente mais tarde.",
		tipo: "error",
	});
}
