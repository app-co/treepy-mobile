import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { type AxiosError } from "axios";
import { AppError } from "./AppError";

const app = process.env.EXPO_PUBLIC_APP || "tst";

const baseUrl: { [key: string]: string | undefined } = {
    tst: "http://192.168.1.100:3333",
    prd: process.env.EXPO_PUBLIC_API,
};

const baseURL = baseUrl[app] || baseUrl.tst;
console.log(baseURL);

const api = axios.create({
    baseURL: baseURL,
    timeout: 20000,
});

api.interceptors.request.use(async (config) => {
    const response = await AsyncStorage.getItem("vibe:session");
    const { state } = JSON.parse(response || "{}");

    if (state.token) {
        config.headers.Authorization = `Bearer ${state.token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        console.log("error service api =>", error);

        const responseError = (error.response?.data as any)?.error;
        if (responseError) {
            throw new AppError(responseError);
        }

        return Promise.reject(error);
    },
);

export { api };
export default api;
