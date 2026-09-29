import { router } from "expo-router";
import {
	ArrowDownLeft,
	ArrowLeft,
	ArrowUpRight,
	Calendar,
	CheckCircle2,
	Clock,
	Leaf,
	Receipt,
	Search,
	TrendingUp,
	Wind,
	XCircle,
} from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity } from "react-native";
import Animated, {
	Easing,
	FadeInDown,
	FadeInLeft,
	FadeInUp,
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme, XStack, YStack } from "tamagui";
import { scale } from "../../../tamagui.config";
import { Box, Container, Scroll, Text } from "../../components/ui/Layout";

// ─── Constantes ───────────────────────────────────────────────────────────────
const PRIMARY = "#C1FF00";

// ─── Tipos ────────────────────────────────────────────────────────────────────
type TipoTransacao = "compra" | "resgate" | "bonus";
type StatusTransacao = "concluido" | "pendente" | "cancelado";
type FiltroAtivo = "Todos" | "Compras" | "Resgates" | "Bônus";

interface Transacao {
	id: string;
	tipo: TipoTransacao;
	status: StatusTransacao;
	descricao: string;
	parceiro?: string;
	valor: string;
	valorBrl?: string;
	data: string;
	hora: string;
	co2?: string;
}

// ─── Dados mock ───────────────────────────────────────────────────────────────
const TRANSACOES: Transacao[] = [
	{
		id: "1",
		tipo: "compra",
		status: "concluido",
		descricao: "Compra de Créditos",
		parceiro: "GreenVolt Energy",
		valor: "+850 TC",
		valorBrl: "R$ 127,50",
		data: "Hoje",
		hora: "14:32",
		co2: "0.17t",
	},
	{
		id: "2",
		tipo: "resgate",
		status: "concluido",
		descricao: "Resgate em Parceiro",
		parceiro: "EcoMart Varejo",
		valor: "-320 TC",
		valorBrl: "R$ 48,00",
		data: "Hoje",
		hora: "11:15",
		co2: undefined,
	},
	{
		id: "3",
		tipo: "bonus",
		status: "concluido",
		descricao: "Bônus de Impacto",
		parceiro: undefined,
		valor: "+120 TC",
		valorBrl: undefined,
		data: "Ontem",
		hora: "09:00",
		co2: "0.03t",
	},
	{
		id: "4",
		tipo: "compra",
		status: "pendente",
		descricao: "Compra de Créditos",
		parceiro: "SolarTech Brasil",
		valor: "+500 TC",
		valorBrl: "R$ 75,00",
		data: "Ontem",
		hora: "08:44",
		co2: "0.10t",
	},
	{
		id: "5",
		tipo: "compra",
		status: "concluido",
		descricao: "Compra de Créditos",
		parceiro: "EcoBuild",
		valor: "+1.200 TC",
		valorBrl: "R$ 180,00",
		data: "24 Jul",
		hora: "16:05",
		co2: "0.24t",
	},
	{
		id: "6",
		tipo: "resgate",
		status: "cancelado",
		descricao: "Resgate em Parceiro",
		parceiro: "TransVerde",
		valor: "-200 TC",
		valorBrl: "R$ 30,00",
		data: "23 Jul",
		hora: "13:20",
		co2: undefined,
	},
	{
		id: "7",
		tipo: "bonus",
		status: "concluido",
		descricao: "Bônus de Indicação",
		parceiro: undefined,
		valor: "+250 TC",
		valorBrl: undefined,
		data: "22 Jul",
		hora: "10:00",
		co2: "0.05t",
	},
	{
		id: "8",
		tipo: "compra",
		status: "concluido",
		descricao: "Compra de Créditos",
		parceiro: "GreenVolt Energy",
		valor: "+600 TC",
		valorBrl: "R$ 90,00",
		data: "20 Jul",
		hora: "11:30",
		co2: "0.12t",
	},
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function corDoTipo(tipo: TipoTransacao) {
	if (tipo === "compra") return PRIMARY;
	if (tipo === "resgate") return "#FF6B6B";
	return "#FFD700";
}

function iconeDoTipo(tipo: TipoTransacao, color: string) {
	if (tipo === "compra") return <ArrowDownLeft size={20} color={color} />;
	if (tipo === "resgate") return <ArrowUpRight size={20} color={color} />;
	return <Leaf size={20} color={color} />;
}

function corDoStatus(status: StatusTransacao) {
	if (status === "concluido") return "#22c55e";
	if (status === "pendente") return "#FFD700";
	return "#FF6B6B";
}

function iconeDoStatus(status: StatusTransacao) {
	if (status === "concluido") return <CheckCircle2 size={12} color="#22c55e" />;
	if (status === "pendente") return <Clock size={12} color="#FFD700" />;
	return <XCircle size={12} color="#FF6B6B" />;
}

function labelDoStatus(status: StatusTransacao) {
	if (status === "concluido") return "Concluído";
	if (status === "pendente") return "Pendente";
	return "Cancelado";
}

// ─── Componente: Pill de Filtro ───────────────────────────────────────────────
interface FiltroPillProps {
	label: FiltroAtivo;
	ativo: boolean;
	onPress: () => void;
	index: number;
}

function FiltroPill({ label, ativo, onPress, index }: FiltroPillProps) {
	const scale = useSharedValue(1);

	const animStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }],
	}));

	return (
		<Animated.View
			// entering={FadeInRight.delay(100 + index * 60)
			//
			// 	.damping(14)}
			style={animStyle}
		>
			<TouchableOpacity
				onPressIn={() => {
					scale.value = withTiming(0.93, { duration: 80 });
				}}
				onPressOut={() => {
					scale.value = withTiming(1, { duration: 180 });
				}}
				onPress={onPress}
				activeOpacity={1}
			>
				<Box
					backgroundColor={ativo ? PRIMARY : "$backgroundHover"}
					borderRadius={20}
					borderWidth={1}
					borderColor={ativo ? PRIMARY : "$borderColor"}
					paddingHorizontal={16}
					paddingVertical={8}
				>
					<Text
						color={ativo ? "#000" : "#8f8f8f"}
						fontSize={12}
						fontWeight="700"
					>
						{label}
					</Text>
				</Box>
			</TouchableOpacity>
		</Animated.View>
	);
}

// ─── Componente: Card de Resumo ───────────────────────────────────────────────
interface ResumoCardProps {
	icon: React.ReactNode;
	label: string;
	value: string;
	accent: string;
	index: number;
}

function ResumoCard({ icon, label, value, accent, index }: ResumoCardProps) {
	return (
		<Animated.View
			entering={FadeInUp.delay(200 + index * 420).damping(14)}
			style={{ flex: 1 }}
		>
			<Box
				backgroundColor="$backgroundHover"
				borderRadius={16}
				borderWidth={1}
				borderColor="$borderColor"
				padding={14}
				flex={1}
			>
				<Box marginBottom={8}>{icon}</Box>
				<Text
					color="#8f8f8f"
					fontSize={10}
					fontWeight="600"
					letterSpacing={0.6}
					marginBottom={4}
				>
					{label}
				</Text>
				<Text color={accent} fontSize={20} fontWeight="900" fontFamily="$label">
					{value}
				</Text>
			</Box>
		</Animated.View>
	);
}

// ─── Componente: Item de Transação ────────────────────────────────────────────
interface TransacaoItemProps {
	transacao: Transacao;
	index: number;
}

function TransacaoItem({ transacao, index }: TransacaoItemProps) {
	const scaleVal = useSharedValue(1);
	const cor = corDoTipo(transacao.tipo);

	const animStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scaleVal.value }],
	}));

	const isPositivo = transacao.valor.startsWith("+");

	return (
		<Animated.View
			entering={FadeInDown.delay(350 + index * 80).damping(16)}
			style={animStyle}
		>
			<TouchableOpacity
				onPressIn={() => {
					scaleVal.value = withTiming(0.97, { duration: 80 });
				}}
				onPressOut={() => {
					scaleVal.value = withTiming(1, { duration: 180 });
				}}
				activeOpacity={1}
			>
				<Box
					backgroundColor="$backgroundHover"
					borderRadius={16}
					borderWidth={1}
					borderColor="$borderColor"
					padding={16}
					marginBottom={10}
				>
					<XStack alignItems="center" gap={14}>
						{/* Ícone */}
						<Box
							width={46}
							height={46}
							borderRadius={14}
							backgroundColor="$backgroundPress"
							borderWidth={1}
							borderColor={cor + "33"}
							alignItems="center"
							justifyContent="center"
						>
							{iconeDoTipo(transacao.tipo, cor)}
						</Box>

						{/* Informações centrais */}
						<YStack flex={1} gap={3}>
							<Text color="$color" fontSize={14} fontWeight="700">
								{transacao.descricao}
							</Text>
							{transacao.parceiro && (
								<Text color="#8f8f8f" fontSize={12} fontWeight="500">
									{transacao.parceiro}
								</Text>
							)}

							<XStack alignItems="center" gap={6} marginTop={4}>
								{iconeDoStatus(transacao.status)}
								<Text
									color={corDoStatus(transacao.status)}
									fontSize={11}
									fontWeight="600"
								>
									{labelDoStatus(transacao.status)}
								</Text>
								<Text color="#8f8f8f" fontSize={11}>
									·
								</Text>
								<Text color="#8f8f8f" fontSize={11}>
									{transacao.data} às {transacao.hora}
								</Text>
							</XStack>
						</YStack>

						{/* Valores à direita */}
						<YStack alignItems="flex-end" gap={3}>
							<Text
								color={isPositivo ? PRIMARY : "#FF6B6B"}
								fontSize={16}
								fontWeight="900"
								fontFamily="$label"
							>
								{transacao.valor}
							</Text>
							{transacao.valorBrl && (
								<Text color="#8f8f8f" fontSize={11} fontWeight="500">
									{transacao.valorBrl}
								</Text>
							)}
							{transacao.co2 && (
								<XStack alignItems="center" gap={3}>
									<Wind size={10} color="#22c55e" />
									<Text color="#22c55e" fontSize={10} fontWeight="600">
										{transacao.co2} CO₂
									</Text>
								</XStack>
							)}
						</YStack>
					</XStack>
				</Box>
			</TouchableOpacity>
		</Animated.View>
	);
}

// ─── Tela Principal ───────────────────────────────────────────────────────────
export default function HistoricoScreen() {
	const theme = useTheme();
	const insets = useSafeAreaInsets();
	const [filtroAtivo, setFiltroAtivo] = useState<FiltroAtivo>("Todos");
	const [busca, setBusca] = useState("");
	const [buscaVisivel, setBuscaVisivel] = useState(false);
	const inputRef = useRef<TextInput>(null);

	const buscaHeight = useSharedValue(0);
	const buscaOpacity = useSharedValue(0);

	useEffect(() => {
		if (buscaVisivel) {
			buscaHeight.value = withTiming(48, {
				duration: 280,
				easing: Easing.out(Easing.quad),
			});
			buscaOpacity.value = withTiming(1, { duration: 200 });
			setTimeout(() => inputRef.current?.focus(), 200);
		} else {
			buscaHeight.value = withTiming(0, {
				duration: 220,
				easing: Easing.in(Easing.quad),
			});
			buscaOpacity.value = withTiming(0, { duration: 180 });
			setBusca("");
		}
	}, [buscaVisivel]);

	const buscaAnimStyle = useAnimatedStyle(() => ({
		height: buscaHeight.value,
		opacity: buscaOpacity.value,
		overflow: "hidden",
	}));

	// Filtragem
	const transacoesFiltradas = TRANSACOES.filter((t) => {
		const matchFiltro =
			filtroAtivo === "Todos" ||
			(filtroAtivo === "Compras" && t.tipo === "compra") ||
			(filtroAtivo === "Resgates" && t.tipo === "resgate") ||
			(filtroAtivo === "Bônus" && t.tipo === "bonus");

		const termoBusca = busca.toLowerCase();
		const matchBusca =
			termoBusca === "" ||
			t.descricao.toLowerCase().includes(termoBusca) ||
			(t.parceiro?.toLowerCase().includes(termoBusca) ?? false);

		return matchFiltro && matchBusca;
	});

	// Agrupa por data
	const grupos = transacoesFiltradas.reduce<Record<string, Transacao[]>>(
		(acc, t) => {
			if (!acc[t.data]) acc[t.data] = [];
			acc[t.data].push(t);
			return acc;
		},
		{},
	);

	const FILTROS: FiltroAtivo[] = ["Todos", "Compras", "Resgates", "Bônus"];

	return (
		<Container backgroundColor="$background">
			<Scroll
				contentContainerStyle={{
					paddingTop: 8,
					paddingBottom: insets.bottom + 24,
					paddingHorizontal: 20,
				}}
			>
				{/* ── Header ───────────────────────────────────────────────── */}
				<Animated.View
				// entering={FadeInDown.delay(0).damping(16)}
				>
					<XStack
						justifyContent="space-between"
						alignItems="center"
						marginBottom={24}
					>
						<TouchableOpacity
							onPress={() => router.back()}
							style={styles.backBtn}
						>
							<ArrowLeft size={22} color={theme.color?.val || "#fff"} />
						</TouchableOpacity>

						<Text
							color="$color"
							fontSize={18}
							fontWeight="800"
							fontFamily="$heading"
						>
							Histórico
						</Text>

						<TouchableOpacity
							style={styles.headerIconBtn}
							onPress={() => setBuscaVisivel((v) => !v)}
						>
							<Search
								size={20}
								color={buscaVisivel ? PRIMARY : theme.color?.val || "#fff"}
							/>
						</TouchableOpacity>
					</XStack>
				</Animated.View>

				{/* ── Barra de busca ────────────────────────────────────────── */}
				<Animated.View
					style={[buscaAnimStyle, { marginBottom: buscaVisivel ? 16 : 0 }]}
				>
					<Box
						backgroundColor="$backgroundHover"
						borderRadius={14}
						borderWidth={1}
						borderColor={PRIMARY + "66"}
						flexDirection="row"
						alignItems="center"
						paddingHorizontal={14}
						gap={10}
					>
						<Search size={16} color="#8f8f8f" />
						<TextInput
							ref={inputRef}
							style={[
								styles.searchInput,
								{ color: theme.color?.val || "#fff" },
							]}
							placeholder="Buscar transações..."
							placeholderTextColor="#555"
							value={busca}
							onChangeText={setBusca}
						/>
					</Box>
				</Animated.View>

				{/* ── Título ────────────────────────────────────────────────── */}
				<Animated.View
					entering={FadeInLeft.delay(100).damping(14)}
					style={{ marginBottom: 20 }}
				>
					<XStack alignItems="center" gap={8} marginBottom={4}>
						<Receipt size={16} color={PRIMARY} />
						<Text
							color="#8f8f8f"
							fontSize={10}
							fontWeight="700"
							fontFamily="$label"
							letterSpacing={1.2}
						>
							TRANSAÇÕES
						</Text>
					</XStack>
					<Text
						color="$color"
						fontSize={scale(6.5)}
						fontWeight="900"
						fontFamily="$heading"
					>
						Histórico de{"\n"}Treepycashes
					</Text>
					<Text color="#8f8f8f" fontSize={13} marginTop={6}>
						Acompanhe todos os seus investimentos{"\n"}ambientais e a aquisição
						de ativos verdes na{"\n"}rede Treepy.
					</Text>
				</Animated.View>

				{/* ── Cards de Resumo ─────────────────────────────────────────
				<XStack gap={10} marginBottom={24}>
					<ResumoCard
						icon={<TrendingUp size={22} color={PRIMARY} />}
						label="Total Investido"
						value="R$ 4.2k"
						accent={PRIMARY}
						index={0}
					/>
					<ResumoCard
						icon={<Leaf size={22} color="#22c55e" />}
						label="Impacto CO₂"
						value="1.2t"
						accent="#22c55e"
						index={1}
					/>
					<ResumoCard
						icon={<ShoppingCart size={22} color="#FFD700" />}
						label="Transações"
						value={`${TRANSACOES.length}`}
						accent="#FFD700"
						index={2}
					/>
				</XStack> */}

				{/* ── Saldo atual destacado ─────────────────────────────────── */}
				<Animated.View
					entering={FadeInUp.delay(300).damping(14)}
					style={{ marginBottom: 20 }}
				>
					<Box
						backgroundColor="$backgroundHover"
						borderRadius={20}
						borderWidth={1}
						borderColor="$borderColor"
						padding={20}
					>
						<XStack justifyContent="space-between" alignItems="center">
							<YStack gap={4}>
								<Text
									color="#8f8f8f"
									fontSize={10}
									fontWeight="700"
									fontFamily="$label"
									letterSpacing={1.2}
								>
									Saldo Atual
								</Text>
								<XStack alignItems="baseline" gap={4}>
									<Text
										color="#8f8f8f"
										fontSize={14}
										fontWeight="600"
										fontFamily="$label"
									>
										TC$
									</Text>
									<Text
										color="$color"
										fontSize={scale(8)}
										fontWeight="900"
										fontFamily="$heading"
										letterSpacing={-1}
									>
										12.450
									</Text>
								</XStack>
							</YStack>

							<YStack alignItems="flex-end" gap={8}>
								<Box
									backgroundColor={PRIMARY + "22"}
									borderRadius={10}
									paddingHorizontal={10}
									paddingVertical={5}
								>
									<XStack alignItems="center" gap={4}>
										<TrendingUp size={12} color={PRIMARY} />
										<Text color={PRIMARY} fontSize={12} fontWeight="700">
											+4.2% mês
										</Text>
									</XStack>
								</Box>
								<Box
									backgroundColor="$backgroundPress"
									borderRadius={8}
									paddingHorizontal={8}
									paddingVertical={4}
								>
									<Text color="#8f8f8f" fontSize={11} fontWeight="500">
										75% da meta de reflorestamento{"\n"}atingida
									</Text>
								</Box>
							</YStack>
						</XStack>

						{/* Barra de progresso */}
						<Box
							backgroundColor="$backgroundPress"
							borderRadius={4}
							height={4}
							marginTop={16}
							overflow="hidden"
						>
							<ProgressBarAnimated targetPct={0.1} delay={600} />
						</Box>
					</Box>
				</Animated.View>

				{/* ── Filtros ───────────────────────────────────────────────── */}
				<Animated.View
					entering={FadeInLeft.delay(200).damping(14)}
					style={{ marginBottom: 20 }}
				>
					<XStack gap={8} flexWrap="wrap">
						{FILTROS.map((f, i) => (
							<FiltroPill
								key={f}
								label={f}
								ativo={filtroAtivo === f}
								onPress={() => setFiltroAtivo(f)}
								index={i}
							/>
						))}
					</XStack>
				</Animated.View>

				{/* ── Lista agrupada ────────────────────────────────────────── */}
				{Object.entries(grupos).length === 0 ? (
					<Animated.View entering={FadeInDown.delay(400).damping(14)}>
						<Box
							backgroundColor="$backgroundHover"
							borderRadius={20}
							borderWidth={1}
							borderColor="$borderColor"
							padding={32}
							alignItems="center"
							gap={12}
						>
							<Receipt size={40} color="#555" />
							<Text
								color="#8f8f8f"
								fontSize={14}
								fontWeight="600"
								textAlign="center"
							>
								Nenhuma transação encontrada
							</Text>
							<Text color="#555" fontSize={12} textAlign="center">
								Tente ajustar os filtros ou a busca.
							</Text>
						</Box>
					</Animated.View>
				) : (
					Object.entries(grupos).map(([data, items]) => (
						<YStack key={data} marginBottom={8}>
							{/* Separador de data */}
							<Animated.View entering={FadeInLeft.delay(330).damping(14)}>
								<XStack alignItems="center" gap={8} marginBottom={10}>
									<Calendar size={13} color="#555" />
									<Text
										color="#555"
										fontSize={11}
										fontWeight="700"
										letterSpacing={0.8}
									>
										{data.toUpperCase()}
									</Text>
									<Box
										flex={1}
										height={1}
										backgroundColor="$borderColor"
										marginLeft={4}
									/>
								</XStack>
							</Animated.View>

							{items.map((t, i) => (
								<TransacaoItem key={t.id} transacao={t} index={i} />
							))}
						</YStack>
					))
				)}

				{/* ── Dúvidas ───────────────────────────────────────────────── */}
				<Animated.View
					entering={FadeInDown.delay(900).damping(14)}
					style={{ marginTop: 8 }}
				>
					<Box
						backgroundColor="$backgroundHover"
						borderRadius={16}
						borderWidth={1}
						borderColor="$borderColor"
						padding={16}
					>
						<XStack alignItems="center" gap={12}>
							<Box
								width={36}
								height={36}
								borderRadius={10}
								backgroundColor="$backgroundPress"
								alignItems="center"
								justifyContent="center"
							>
								<Text fontSize={18}>?</Text>
							</Box>
							<YStack flex={1} gap={2}>
								<Text color="$color" fontSize={13} fontWeight="700">
									Dúvidas sobre taxas?
								</Text>
								<TouchableOpacity>
									<Text color={PRIMARY} fontSize={12} fontWeight="600">
										Ver central de ajuda
									</Text>
								</TouchableOpacity>
							</YStack>
						</XStack>
					</Box>
				</Animated.View>
			</Scroll>
		</Container>
	);
}

// ─── Componente interno: barra de progresso animada ──────────────────────────
function ProgressBarAnimated({
	targetPct,
	delay = 0,
	totalWidth = 300,
}: {
	targetPct: number;
	delay?: number;
	totalWidth?: number;
}) {
	const width = useSharedValue(0);

	useEffect(() => {
		width.value = withDelay(
			delay,
			withTiming(targetPct * totalWidth, {
				duration: 1400,
				easing: Easing.out(Easing.quad),
			}),
		);
	}, []);

	const style = useAnimatedStyle(() => ({
		width: width.value,
		height: 4,
		backgroundColor: PRIMARY,
		borderRadius: 4,
	}));

	return <Animated.View style={style} />;
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
	backBtn: {
		padding: 4,
	},
	headerIconBtn: {
		padding: 4,
	},
	searchInput: {
		flex: 1,
		height: 46,
		fontSize: 14,
		fontWeight: "500",
	},
});
