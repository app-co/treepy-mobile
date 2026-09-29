import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

export const useMutate = (queryKeys: string[]) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			url,
			method,
			data,
		}: {
			url: string;
			method: string;
			data: any;
		}) => {
			const response = await api.request({
				url,
				method: method.toLowerCase() as any,
				data,
			});
			return response.data;
		},
		onSuccess: () => {
			queryKeys.forEach((key) => {
				queryClient.invalidateQueries({ queryKey: [key] });
			});
		},
		onError: (error) => {
			console.log(error);
		},
	});
};
