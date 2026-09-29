import type { IUser } from "@/dtos/interfaces";
import { UserAPI } from "@/services/endpoints";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import Alert from "../components/modals/alertas/handler";
import { AppError } from "../services/AppError";

interface ISession {
	user: IUser["user"];
	token: string;
	isAuth: boolean;
}

export interface ISignUpData {
	nome: string;
	email: string;
	senha: string;
}

export interface IUserStore {
	user: IUser["user"] | null;
	token: string | null;
	isAuth: boolean;
	loading: boolean;
	signIn: (email: string, senha: string) => Promise<void>;
	signUp: (data: ISignUpData) => Promise<void>;
	setSession: (session: ISession) => void;
	setUser: (user: IUser["user"]) => void;
	logout: () => void;
	updateTokens: (item: { token: string; refreshToken: string }) => void;
}

export const useAuth = create<IUserStore>()(
	persist(
		(set) => ({
			user: null,
			token: null,
			isAuth: false,
			loading: false,
			signIn: async (email: string, senha: string) => {
				set({ loading: true });
				try {
					const { data } = await UserAPI.login({ email, senha });

					const { user, token }: IUser = data;

					set({
						user: user,
						token: token,
						isAuth: true,
					});

					router.replace("/(private)" as any);
				} catch (error) {
					if (error instanceof AppError) {
						Alert.show({
							title: "Erro ao fazer login",
							description: error.message,
							tipo: "error",
						});
					}
				} finally {
					set({ loading: false });
				}
			},
			signUp: async ({ nome, email, senha }) => {
				set({ loading: true });
				try {
					const { data } = await UserAPI.register({
						nome,
						email,
						senha,
					});

					const { user, token }: IUser = data;

					set({
						user: user,
						token: token,
						isAuth: true,
					});

					router.replace("/(private)" as any);
				} catch (error) {
					if (error instanceof AppError) {
						Alert.show({
							title: "Erro ao cadastrar",
							description: error.message,
							tipo: "error",
						});
					}
				} finally {
					set({ loading: false });
				}
			},
			logout: () => set({ user: null, token: null, isAuth: false }),
			setSession: (h) => set({ ...h }),
			updateTokens: (h) => set({ ...h }),
			setUser: (user) => set({ user }),
		}),
		{
			name: "vibe:session",
			storage: createJSONStorage(() => AsyncStorage),
		},
	),
);
