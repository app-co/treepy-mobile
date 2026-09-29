export type TType = "success" | "error" | "warning";
export type T = {
	title?: string;
	description: string;
	tipo: TType;
} | null;

export type GlobalRef = {
	show: (obj: T) => void;
	hide: () => void;
};
