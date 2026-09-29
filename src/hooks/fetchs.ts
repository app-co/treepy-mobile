import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import api from "../services/api";

interface IParams {
	method?: "GET" | "POST" | "PUT" | "DELETE" | "SVLOCAL" | "GTLOCAL" | "AXIOS";
	url: string;
	item?: any;
}

export async function useFetch({ item, url, method = "GET" }: IParams) {
	switch (method) {
		case "GET": {
			const { data } = await api.get(url, {
				params: item,
			});
			return data;
		}
		case "POST": {
			const { data } = await api.post(url, item);
			return data;
		}
		case "PUT": {
			const { data } = await api.put(url, item);
			return data;
		}
		case "DELETE": {
			const { data } = await api.delete(url, {
				params: item,
			});
			return data;
		}

		case "SVLOCAL": {
			const obj = JSON.stringify(item);
			await AsyncStorage.setItem(url, obj);
			return null;
		}

		case "GTLOCAL": {
			const data = await AsyncStorage.getItem(url);
			if (data) {
				return JSON.parse(data);
			}
			return null;
		}

		case "AXIOS": {
			const { data } = await axios.get(url, { params: item });
			return data;
		}

		default:
			break;
	}
}
