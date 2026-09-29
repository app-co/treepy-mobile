import { router } from "expo-router";
import { ArrowLeft, BadgeCheck, Search } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import Animated, {
	Easing,
	FadeInDown,
	FadeInLeft,
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withRepeat,
	withSequence,
	withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme, XStack, YStack } from "tamagui";
import { scale } from "../../../tamagui.config";
import {
	Box,
	Container,
	Scroll,
	Text,
	Touch,
} from "../../components/ui/Layout";

// ─── Constantes ──────────────────────────────────────────────────────────────
const PRIMARY = "#C1FF00";

// ─── Tipos ────────────────────────────────────────────────────────────────────
type Categoria =
	| "Todos"
	| "Varejo"
	| "Serviços"
	| "Energia"
	| "Transporte"
	| "Construção";

interface Parceiro {
	id: string;
	nome: string;
	descricao: string;
	categoria: Categoria;
	verificado: boolean;
	ganhoAcumulado: string;
	disponivel: string;
	iconColor: string;
	sigla: string;
}

// ─── Dados mock ───────────────────────────────────────────────────────────────
const PARCEIROS: Parceiro[] = [
	{
		id: "1",
		nome: "GreenVolt Energy",
		descricao:
			"Líder em soluções de energia solar residencial e carregamento inteligente para veículos...",
		categoria: "Energia",
		verificado: true,
		ganhoAcumulado: "TC$ 1.250,00",
		disponivel: "TC$ 45.000,00",
		iconColor: "#2a7a2a",
		sigla: "GV",
	},
	{
		id: "2",
		nome: "EcoMart Varejo",
		descricao:
			"Rede de supermercados com foco em produtos sustentáveis e embalagens biodegradáveis...",
		categoria: "Varejo",
		verificado: true,
		ganhoAcumulado: "TC$ 830,00",
		disponivel: "TC$ 28.500,00",
		iconColor: "#1a4a8a",
		sigla: "EM",
	},
	{
		id: "3",
		nome: "BioServe Tech",
		descricao:
			"Empresa de serviços de TI com infraestrutura 100% alimentada por energia renovável...",
		categoria: "Serviços",
		verificado: false,
		ganhoAcumulado: "TC$ 410,00",
		disponivel: "TC$ 12.000,00",
		iconColor: "#6a2a8a",
		sigla: "BS",
	},
	{
		id: "4",
		nome: "VerdeMov Transporte",
		descricao:
			"Frota de veículos elétricos para transporte urbano e logística de última milha...",
		categoria: "Transporte",
		verificado: true,
		ganhoAcumulado: "TC$ 2.100,00",
		disponivel: "TC$ 60.000,00",
		iconColor: "#8a4a1a",
		sigla: "VM",
	},
	{
		id: "5",
		nome: "ConstruGreen",
		descricao:
			"Construtora especializada em edificações verdes com certificação LEED e materiais...",
		categoria: "Construção",
		verificado: true,
		ganhoAcumulado: "TC$ 3.750,00",
		disponivel: "TC$ 90.000,00",
		iconColor: "#1a6a6a",
		sigla: "CG",
	},
];

const CATEGORIAS: Categoria[] = [
	"Todos",
	"Varejo",
	"Serviços",
	"Energia",
	"Transporte",
	"Construção",
];

// ─── Hook: barra de progresso animada ────────────────────────────────────────
function useProgressBar(targetPct: number, delay = 600) {
	const width = useSharedValue(0);

	useEffect(() => {
		width.value = withDelay(
			delay,
			withTiming(targetPct, {
				duration: 1400,
				easing: Easing.out(Easing.quad),
			}),
		);
	}, [width, targetPct, delay]);

	return useAnimatedStyle(() => ({ width: `${width.value}%` as any }));
}

// ─── Hook: contador animado ───────────────────────────────────────────────────
function useCountUp(target: number, delay = 400) {
	const val = useSharedValue(0);

	useEffect(() => {
		val.value = withDelay(
			delay,
			withTiming(target, { duration: 1200, easing: Easing.out(Easing.quad) }),
		);
	}, [val, target, delay]);

	return val;
}

// ─── Componente: Filtro de categoria ─────────────────────────────────────────
interface FilterChipProps {
	label: string;
	active: boolean;
	onPress: () => void;
	index: number;
}

function FilterChip({ label, active, onPress, index }: FilterChipProps) {
	const scaleVal = useSharedValue(1);

	const animStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scaleVal.value }],
	}));

	return (
		<Animated.View
			entering={FadeInLeft.delay(300 + index * 80).damping(14)}
			style={animStyle}
		>
			<TouchableOpacity
				onPressIn={() => {
					scaleVal.value = withTiming(0.92, { duration: 100 });
				}}
				onPressOut={() => {
					scaleVal.value = withTiming(1, { duration: 180 });
				}}
				onPress={onPress}
				activeOpacity={1}
				style={[
					styles.filterChip,
					{
						backgroundColor: active ? PRIMARY : "#1E2328",
						borderColor: active ? PRIMARY : "#3a4047",
					},
				]}
			>
				<Text
					color={active ? "#000" : "#8f8f8f"}
					fontSize={13}
					fontWeight={active ? "700" : "500"}
				>
					{label}
				</Text>
			</TouchableOpacity>
		</Animated.View>
	);
}

// ─── Componente: Card de parceiro ─────────────────────────────────────────────
interface ParceiroCardProps {
	parceiro: Parceiro;
	index: number;
}

function ParceiroCard({ parceiro, index }: ParceiroCardProps) {
	const scaleVal = useSharedValue(1);

	const cardStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scaleVal.value }],
	}));

	return (
		<Animated.View
			entering={FadeInDown.delay(500 + index * 130).damping(14)}
			style={[cardStyle, { marginBottom: 16 }]}
		>
			<Box
				backgroundColor="$backgroundHover"
				borderRadius={20}
				borderWidth={1}
				borderColor="$borderColor"
				padding={20}
			>
				{/* Topo: logo + badge verificado */}
				<XStack
					justifyContent="space-between"
					alignItems="flex-start"
					marginBottom={16}
				>
					<Box
						width={64}
						height={64}
						borderRadius={14}
						backgroundColor={parceiro.iconColor}
						alignItems="center"
						justifyContent="center"
					>
						<Text
							color="#fff"
							fontSize={20}
							fontWeight="900"
							fontFamily="$label"
						>
							{parceiro.sigla}
						</Text>
					</Box>

					{parceiro.verificado && (
						<Animated.View
							entering={FadeInLeft.delay(600 + index * 130).springify()}
						>
							<XStack
								backgroundColor="transparent"
								borderWidth={1}
								borderColor={PRIMARY}
								borderRadius={20}
								paddingHorizontal={10}
								paddingVertical={4}
								alignItems="center"
								gap={4}
							>
								<BadgeCheck size={12} color={PRIMARY} />
								<Text color={PRIMARY} fontSize={11} fontWeight="700">
									Verificado
								</Text>
							</XStack>
						</Animated.View>
					)}
				</XStack>

				{/* Nome e descrição */}
				<Text
					color="$color"
					fontSize={scale(5)}
					fontWeight="900"
					fontFamily="$heading"
					marginBottom={6}
				>
					{parceiro.nome}
				</Text>
				<Text color="#8f8f8f" fontSize={13} lineHeight={20} marginBottom={16}>
					{parceiro.descricao}
				</Text>

				{/* Separador */}
				<Box height={1} backgroundColor="$borderColor" marginBottom={14} />

				{/* Métricas financeiras */}
				<YStack gap={8} marginBottom={16}>
					<XStack justifyContent="space-between" alignItems="center">
						<Text
							color="#8f8f8f"
							fontSize={11}
							fontWeight="700"
							fontFamily="$label"
							letterSpacing={0.5}
						>
							Ganho Acumulado
						</Text>
						<Text
							color={PRIMARY}
							fontSize={14}
							fontWeight="700"
							fontFamily="$label"
						>
							{parceiro.ganhoAcumulado}
						</Text>
					</XStack>

					<XStack justifyContent="space-between" alignItems="center">
						<Text
							color="#8f8f8f"
							fontSize={11}
							fontWeight="700"
							fontFamily="$label"
							letterSpacing={0.5}
						>
							Disponível
						</Text>
						<Text
							color="$color"
							fontSize={14}
							fontWeight="700"
							fontFamily="$label"
						>
							{parceiro.disponivel}
						</Text>
					</XStack>
				</YStack>

				{/* Botão Ver Detalhes */}
				<TouchableOpacity
					style={styles.detailsBtn}
					onPressIn={() => {
						scaleVal.value = withTiming(0.97, { duration: 100 });
					}}
					onPressOut={() => {
						scaleVal.value = withTiming(1, { duration: 200 });
					}}
					onPress={() =>
						router.push({
							pathname: "/(private)/detalhesParceiros" as any,
							params: { id: parceiro.id },
						})
					}
					activeOpacity={1}
				>
					<Text
						color="$color"
						fontSize={14}
						fontWeight="700"
						fontFamily="$label"
					>
						Ver Detalhes
					</Text>
				</TouchableOpacity>
			</Box>
		</Animated.View>
	);
}

// ─── Componente: Contador animado (display) ───────────────────────────────────
function AnimatedCounter({ value }: { value: number }) {
	const [display, setDisplay] = useState(0);
	const shared = useCountUp(value, 500);

	useEffect(() => {
		const interval = setInterval(() => {
			const current = Math.round(shared.value);
			setDisplay(current);
			if (current >= value) clearInterval(interval);
		}, 16);
		return () => clearInterval(interval);
	}, [shared, value]);

	return (
		<Text
			color="$color"
			fontSize={scale(10)}
			fontWeight="900"
			fontFamily="$heading"
			letterSpacing={-1}
		>
			{display}
		</Text>
	);
}

// ─── Tela principal ───────────────────────────────────────────────────────────
export default function ParceirosScreen() {
	const theme = useTheme();
	const insets = useSafeAreaInsets();
	const [categoriaAtiva, setCategoriaAtiva] = useState<Categoria>("Todos");
	const [buscaVisivel, setBuscaVisivel] = useState(false);

	const progressStyle = useProgressBar(72, 700);

	// Badge sino
	const badgeScale = useSharedValue(1);
	useEffect(() => {
		badgeScale.value = withRepeat(
			withSequence(
				withTiming(1.25, { duration: 700 }),
				withTiming(1, { duration: 700 }),
			),
			-1,
			true,
		);
	}, [badgeScale]);
	const badgeStyle = useAnimatedStyle(() => ({
		transform: [{ scale: badgeScale.value }],
	}));

	const parceirosFiltrados =
		categoriaAtiva === "Todos"
			? PARCEIROS
			: PARCEIROS.filter((p) => p.categoria === categoriaAtiva);

	return (
		<Container backgroundColor="$background">
			<Scroll
				contentContainerStyle={{
					paddingTop: 8,
					paddingBottom: insets.bottom + 24,
					paddingHorizontal: 20,
				}}
			>
				{/* ── Header ─────────────────────────────────────────────── */}
				<Animated.View entering={FadeInDown.delay(0).damping(16)}>
					<XStack
						justifyContent="space-between"
						alignItems="center"
						marginBottom={24}
					>
						<Touch pt={8} onPress={() => router.back()}>
							<ArrowLeft size={22} color={theme.color?.val || "#fff"} />
						</Touch>
						{/* 
						<Text
							color="$color"
							fontSize={18}
							fontWeight="800"
							fontFamily="$heading"
						>
							Parceiros
						</Text> */}

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

				{/* ── Título ─────────────────────────────────────────────── */}
				<Animated.View
					entering={FadeInLeft.delay(80).damping(14)}
					style={{ marginBottom: 24 }}
				>
					<Text
						color="$color"
						// fontSize={scale(7.5)}
						// fontWeight="900"
						// fontFamily="$heading"
						letterSpacing={-0.5}
						marginBottom={6}
						t="a1"
					>
						Nossos Parceiros
					</Text>
					<Text color="#cfcfcfff" t="a4" lineHeight={22}>
						Empresas que impulsionam a sustentabilidade com o Treepy.
					</Text>
				</Animated.View>

				{/* ── Card: Contribuição total ────────────────────────────── */}
				{/* <Animated.View
					entering={FadeInUp.delay(180).damping(14)}
					style={{ marginBottom: 16 }}
				>
					<Box
						backgroundColor="$backgroundHover"
						borderRadius={20}
						borderWidth={1}
						borderColor="$borderColor"
						padding={20}
						overflow="hidden"
					>
						<Box position="absolute" right={-20} bottom={-20} opacity={0.06}>
							<Handshake size={140} color={PRIMARY} />
						</Box>

						<Text
							color="#8f8f8f"
							fontSize={10}
							fontWeight="700"
							fontFamily="$label"
							letterSpacing={1.4}
							marginBottom={6}
						>
							SUA CONTRIBUIÇÃO TOTAL
						</Text>

						<XStack alignItems="baseline" gap={3} marginBottom={12}>
							<Text
								color="#8f8f8f"
								fontSize={13}
								fontWeight="700"
								fontFamily="$label"
							>
								TC$
							</Text>
							<Text
								color="$color"
								fontSize={scale(9)}
								fontWeight="900"
								fontFamily="$heading"
								letterSpacing={-1}
							>
								12.450,00
							</Text>
						</XStack>

						<Text color="#8f8f8f" fontSize={13} lineHeight={20}>
							Você já economizou{" "}
							<Text color={PRIMARY} fontSize={13} fontWeight="700">
								85kg de CO2
							</Text>{" "}
							comprando em nossos parceiros.
						</Text>
					</Box>
				</Animated.View> */}

				{/* ── Card: Parceiros ativos ──────────────────────────────── */}
				<Animated.View
					// entering={FadeInUp.delay(260).damping(14)}
					style={{ marginBottom: 24 }}
				>
					<Box
						backgroundColor="$backgroundHover"
						borderRadius={20}
						borderWidth={1}
						borderColor="$borderColor"
						padding={20}
					>
						<Text
							color="#8f8f8f"
							fontSize={10}
							fontWeight="700"
							fontFamily="$label"
							letterSpacing={1.4}
							marginBottom={8}
						>
							PARCEIROS ATIVOS
						</Text>

						<AnimatedCounter value={248} />

						{/* Barra verde */}
						<Box
							backgroundColor="$backgroundPress"
							borderRadius={4}
							height={5}
							marginTop={16}
							overflow="hidden"
						>
							<Animated.View
								style={[
									{
										height: 5,
										backgroundColor: PRIMARY,
										borderRadius: 4,
									},
									progressStyle,
								]}
							/>
						</Box>
					</Box>
				</Animated.View>

				{/* ── Filtros horizontais ─────────────────────────────────── */}
				<Animated.View
					// entering={FadeInLeft.delay(320).damping(4)}
					style={{ marginBottom: 20 }}
				>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={{ gap: 10 }}
					>
						{CATEGORIAS.map((cat, i) => (
							<FilterChip
								key={cat}
								label={cat}
								active={categoriaAtiva === cat}
								onPress={() => setCategoriaAtiva(cat)}
								index={i}
							/>
						))}
					</ScrollView>
				</Animated.View>

				{/* ── Lista de parceiros ──────────────────────────────────── */}
				{parceirosFiltrados.length === 0 ? (
					<Animated.View
						entering={FadeInDown.delay(400)}
						style={{ alignItems: "center", paddingTop: 40 }}
					>
						<Text color="#8f8f8f" fontSize={14}>
							Nenhum parceiro nesta categoria.
						</Text>
					</Animated.View>
				) : (
					parceirosFiltrados.map((parceiro, i) => (
						<ParceiroCard key={parceiro.id} parceiro={parceiro} index={i} />
					))
				)}
			</Scroll>
		</Container>
	);
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
	iconBtn: {
		padding: 4,
	},
	filterChip: {
		paddingHorizontal: 18,
		paddingVertical: 9,
		borderRadius: 20,
		borderWidth: 1,
	},
	detailsBtn: {
		borderWidth: 1,
		borderColor: "#3a4047",
		borderRadius: 12,
		paddingVertical: 14,
		alignItems: "center",
		justifyContent: "center",
	},
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
