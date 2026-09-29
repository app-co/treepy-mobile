export type IUser = {
	user: {
		nome: string;
		email: string;
	};
	token: string;
};

export interface IMetricaUsuario {
	compensacao: {
		co2Anual: number;
		treepy: number;
		meta: number;
		isValid: boolean;
		porcentagemAtingida: string;
		metaAtingida: number;
	};
	floresta: {
		codigo: string;
		reepycash: number;
		nome: string;
		lat: number;
		long: number;
		status: number;
	}[];
	treepycashesAtivos: {
		id: number;
		qnt: number;
		isValid: boolean;
		florestaId: number;
		userId: string;
		created_at: string;
		updated_at: string;
		floresta: {
			id: number;
			nome: string;
			qnt_arvores: number;
			treepycash_disponivel: number;
			projeto: number;
			codigo: string;
			lat: string;
			long: string;
			status: number;
			projetoAtivo: boolean;
			dataInicio: Date;
			dataFim: Date;
			created_at: Date;
			updated_at: Date;
		};
	}[];
	treepycashesInativos: {
		id: number;
		qnt: number;
		isValid: boolean;
		florestaId: number;
		userId: string;
		created_at: string;
		updated_at: string;
		floresta: {
			id: number;
			nome: string;
			qnt_arvores: number;
			treepycash_disponivel: number;
			projeto: number;
			codigo: string;
			lat: string;
			long: string;
			status: number;
			projetoAtivo: boolean;
			dataInicio: Date;
			dataFim: Date;
			created_at: Date;
			updated_at: Date;
		};
	}[];
	transactions: [
		{
			id: number;
			metodo: string;
			status: number;
			orderId: string;
			valo_compra: number;
			userId: string;
			created_at: Date;
			tree: string;
		},
	];
}
