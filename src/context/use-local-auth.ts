import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type TCredentials = {
	apelido: string;
	senha: string;
};

type TDevice = {
	isEnrolled: boolean;
	isSupported: boolean;
};

export interface I {
	credentials: TCredentials | null;
	setCredentials: (credentials: TCredentials | null) => void;
	permission: boolean;
	setPermission: (permission: boolean) => void;
	device: TDevice;
	setDevice: (device: TDevice) => void;
}

export const useLocalAuthStore = create<I>()(
	persist(
		(set) => ({
			credentials: null,
			setCredentials: (credentials: TCredentials | null) =>
				set({ credentials }),
			permission: false,
			setPermission: (permission: boolean) => set({ permission }),
			device: {
				isEnrolled: false,
				isSupported: false,
			},
			setDevice: (device: TDevice) => set({ device }),
		}),
		{
			name: "local-auth-storage",
			storage: createJSONStorage(() => AsyncStorage),
		},
	),
);
