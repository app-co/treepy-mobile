import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useFetch } from "./fetchs";

interface IParams {
	method?: "GET" | "POST" | "PUT" | "DELETE" | "GTLOCAL" | "SVLOCAL" | "AXIOS";
	url: string;
	item?: any;
	key: string;
}

export function useQuerys(params: IParams) {
	const fetchFn = () => useFetch(params);
	return useQuery({
		queryKey: [params.key, params.item, params.url],
		queryFn: fetchFn,
		staleTime: 1000 * 10, // 5 minutos
	});
}

export function usePaginated(par: IParams) {
	const fetchFn = ({ pageParam = 1 }: { pageParam?: number }) => {
		const params = {
			...par,
			item: {
				...par.item,
				page: pageParam,
				limit: par.item?.limit ?? 10,
			},
		};
		return useFetch(params);
	};

	return useInfiniteQuery({
		queryKey: [par.key, par.item],
		queryFn: fetchFn,
		initialPageParam: 1,
		getNextPageParam: (lastPage: any) => {
			const meta = lastPage?.meta;
			if (!meta) return undefined;
			return meta.page < meta.totalPages ? meta.page + 1 : undefined;
		},
	});
}
