import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, BadgeCheck, TreePine } from "lucide-react-native";
import { useEffect } from "react";
import {
	Dimensions,
	StatusBar,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import Animated, {
	Easing,
	FadeIn,
	FadeInDown,
	FadeInLeft,
	FadeInUp,
	interpolate,
	useAnimatedScrollHandler,
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withRepeat,
	withSequence,
	withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme, XStack } from "tamagui";
import { scale } from "../../../tamagui.config";
import { Box, Container, Text } from "../../components/ui/Layout";

// ─── Constantes ──────────────────────────────────────────────────────────────
const PRIMARY = "#C1FF00";
const SCREEN_WIDTH = Dimensions.get("window").width;
const HERO_HEIGHT = 260;

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface ParceiroDetalhe {
	id: string;
	nome: string;
	subtitulo: string;
	descricao: string;
	verificado: boolean;
	iconColor: string;
	sigla: string;
	acento: string;
	co2Mitigado: string;
	arvoresPlantadas: string;
	totalAcumulado: string;
	disponivel: string;
	progressoPct: number;
	bgColors: string[];
}

// ─── Dados mock estendidos ────────────────────────────────────────────────────
const PARCEIROS_DETALHE: Record<string, ParceiroDetalhe> = {
	"1": {
		id: "1",
		nome: "GreenVolt Energy",
		subtitulo: "Sistemas Solares Residenciais",
		descricao:
			"Líder em soluções de energia solar residencial e comercial. A GreenVolt Energy integra tecnologia de ponta com sustentabilidade real, facilitando a transição para uma matriz energética limpa enquanto gera treepycashes para você.",
		verificado: true,
		iconColor: "#1a3a1a",
		sigla: "⚡",
		acento: "#C1FF00",
		co2Mitigado: "12.4",
		arvoresPlantadas: "1.452",
		totalAcumulado: "14.502,00",
		disponivel: "3.120,50",
		progressoPct: 68,
		bgColors: ["#1a3a20", "#0d1f0d"],
	},
	"2": {
		id: "2",
		nome: "EcoMart Varejo",
		subtitulo: "Varejo Sustentável",
		descricao:
			"Rede de supermercados pioneira no Brasil com foco em produtos sustentáveis e embalagens biodegradáveis. A EcoMart revoluciona o varejo com práticas que reduzem o impacto ambiental em toda a cadeia produtiva.",
		verificado: true,
		iconColor: "#1a2a4a",
		sigla: "🛒",
		acento: "#C1FF00",
		co2Mitigado: "8.1",
		arvoresPlantadas: "890",
		totalAcumulado: "8.300,00",
		disponivel: "1.840,00",
		progressoPct: 45,
		bgColors: ["#1a2a4a", "#0d1520"],
	},
	"3": {
		id: "3",
		nome: "BioServe Tech",
		subtitulo: "Tecnologia Verde",
		descricao:
			"Empresa de serviços de TI com infraestrutura 100% alimentada por energia renovável. A BioServe Tech prova que inovação tecnológica e responsabilidade ambiental podem coexistir em harmonia.",
		verificado: false,
		iconColor: "#2a1a4a",
		sigla: "💻",
		acento: "#a78bfa",
		co2Mitigado: "4.2",
		arvoresPlantadas: "320",
		totalAcumulado: "4.100,00",
		disponivel: "740,00",
		progressoPct: 30,
		bgColors: ["#2a1a4a", "#160d25"],
	},
	"4": {
		id: "4",
		nome: "VerdeMov Transporte",
		subtitulo: "Mobilidade Elétrica",
		descricao:
			"Frota de veículos elétricos para transporte urbano e logística de última milha. A VerdeMov lidera a revolução da mobilidade limpa nas cidades brasileiras.",
		verificado: true,
		iconColor: "#3a2a1a",
		sigla: "🚗",
		acento: "#f59e0b",
		co2Mitigado: "18.7",
		arvoresPlantadas: "2.100",
		totalAcumulado: "21.000,00",
		disponivel: "5.600,00",
		progressoPct: 80,
		bgColors: ["#3a2a1a", "#1e150d"],
	},
	"5": {
		id: "5",
		nome: "ConstruGreen",
		subtitulo: "Edificações Sustentáveis",
		descricao:
			"Construtora especializada em edificações verdes com certificação LEED e materiais de baixo impacto ambiental. Cada projeto ConstruGreen é projetado para ter emissões neutras de carbono.",
		verificado: true,
		iconColor: "#1a3a3a",
		sigla: "🏗️",
		acento: "#34d399",
		co2Mitigado: "32.5",
		arvoresPlantadas: "4.520",
		totalAcumulado: "37.500,00",
		disponivel: "9.200,00",
		progressoPct: 90,
		bgColors: ["#1a3a3a", "#0d1e1e"],
	},
};

// ─── Hook: barra de progresso animada ────────────────────────────────────────
function useProgressBar(pct: number, delay = 800) {
	const width = useSharedValue(0);

	useEffect(() => {
		width.value = withDelay(
			delay,
			withTiming(pct, { duration: 1400, easing: Easing.out(Easing.quad) }),
		);
	}, [width, pct, delay]);

	return useAnimatedStyle(() => ({ width: `${width.value}%` as any }));
}

// ─── Componente: Card de impacto ──────────────────────────────────────────────
interface ImpactCardProps {
	icon: React.ReactNode;
	label: string;
	value: string;
	unit?: string;
	acento: string;
	index: number;
}

function ImpactCard({
	icon,
	label,
	value,
	unit,
	acento,
	index,
}: ImpactCardProps) {
	return (
		<Animated.View
			entering={FadeInDown.delay(600 + index * 140).damping(14)}
			style={{ flex: 1 }}
		>
			<Box
				backgroundColor="$backgroundHover"
				borderRadius={16}
				borderWidth={1}
				borderColor="$borderColor"
				padding={16}
				flex={1}
			>
				<Box marginBottom={10}>{icon}</Box>
				<Text color="#8f8f8f" fontSize={12} fontWeight="600" marginBottom={4}>
					{label}
				</Text>
				<XStack alignItems="baseline" gap={4}>
					<Text
						color={acento}
						fontSize={scale(8)}
						fontWeight="900"
						fontFamily="$heading"
						letterSpacing={-0.5}
					>
						{value}
					</Text>
					{unit && (
						<Text color="#8f8f8f" fontSize={13} fontWeight="600">
							{unit}
						</Text>
					)}
				</XStack>
			</Box>
		</Animated.View>
	);
}

// ─── Componente: Hero background (grade simulando painel solar) ───────────────
function HeroBackground({ bgColors }: { bgColors: string[] }) {
	// Linhas decorativas simulando painéis solares
	const rows = Array.from({ length: 6 });
	const cols = Array.from({ length: 4 });

	return (
		<View
			style={[StyleSheet.absoluteFillObject, { backgroundColor: bgColors[1] }]}
		>
			{/* Grade de painéis */}
			<View style={styles.gridContainer}>
				{rows.map((_, ri) =>
					cols.map((_, ci) => (
						<View
							key={`${ri}-${ci}`}
							style={[
								styles.panelCell,
								{
									backgroundColor: `rgba(193,255,0,${0.02 + ri * 0.015})`,
									borderColor: `rgba(193,255,0,${0.06 + ri * 0.01})`,
								},
							]}
						/>
					)),
				)}
			</View>
			{/* Gradiente simulado com views sobrepostas */}
			<View
				style={[
					StyleSheet.absoluteFillObject,
					{
						backgroundColor: bgColors[0],
						opacity: 0.5,
					},
				]}
			/>
			{/* Brilho diagonal */}
			<View style={styles.heroGlow} />
		</View>
	);
}

// ─── Tela principal ───────────────────────────────────────────────────────────
export default function DetalhesParceirosScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const insets = useSafeAreaInsets();
	const theme = useTheme();
	const scrollY = useSharedValue(0);

	const parceiro = PARCEIROS_DETALHE[id ?? "1"] ?? PARCEIROS_DETALHE["1"];
	const progressStyle = useProgressBar(parceiro.progressoPct, 900);

	// Animação de entrada do hero
	const heroScale = useSharedValue(1.05);
	useEffect(() => {
		heroScale.value = withTiming(1, {
			duration: 800,
			easing: Easing.out(Easing.quad),
		});
	}, [heroScale]);
	const heroStyle = useAnimatedStyle(() => ({
		transform: [{ scale: heroScale.value }],
	}));

	// Scroll handler para parallax do hero
	const scrollHandler = useAnimatedScrollHandler((event) => {
		scrollY.value = event.contentOffset.y;
	});

	// Header transparente → opaco no scroll
	const headerBgStyle = useAnimatedStyle(() => ({
		backgroundColor: `rgba(17,20,24,${interpolate(
			scrollY.value,
			[0, HERO_HEIGHT - 80],
			[0, 1],
			"clamp",
		)})`,
	}));

	// Parallax do hero
	const heroParallaxStyle = useAnimatedStyle(() => ({
		transform: [
			{
				translateY: interpolate(
					scrollY.value,
					[0, HERO_HEIGHT],
					[0, HERO_HEIGHT * 0.35],
					"clamp",
				),
			},
		],
	}));

	// Badge verificado piscar
	const verifyOpacity = useSharedValue(1);
	useEffect(() => {
		verifyOpacity.value = withRepeat(
			withSequence(
				withTiming(0.6, { duration: 1200 }),
				withTiming(1, { duration: 1200 }),
			),
			-1,
			true,
		);
	}, [verifyOpacity]);
	const verifyStyle = useAnimatedStyle(() => ({
		opacity: verifyOpacity.value,
	}));

	return (
		<Container backgroundColor="$background">
			<StatusBar
				translucent
				backgroundColor="transparent"
				barStyle="light-content"
			/>

			{/* ── Header flutuante ─────────────────────────────────────── */}
			<Animated.View
				style={[
					styles.floatingHeader,
					headerBgStyle,
					{ paddingTop: insets.top },
				]}
			>
				<TouchableOpacity
					onPress={() => router.back()}
					style={styles.backBtn}
					activeOpacity={0.7}
				>
					<Box
						backgroundColor="rgba(0,0,0,0.45)"
						borderRadius={20}
						width={38}
						height={38}
						alignItems="center"
						justifyContent="center"
						borderWidth={1}
						borderColor="rgba(255,255,255,0.12)"
					>
						<ArrowLeft size={18} color="#fff" />
					</Box>
				</TouchableOpacity>
			</Animated.View>

			{/* ── Scroll principal ─────────────────────────────────────── */}
			<Animated.ScrollView
				onScroll={scrollHandler}
				scrollEventThrottle={16}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
			>
				{/* ── Hero ──────────────────────────────────────────────── */}
				<Animated.View
					style={[{ height: HERO_HEIGHT, overflow: "hidden" }, heroStyle]}
				>
					<Animated.View
						style={[StyleSheet.absoluteFillObject, heroParallaxStyle]}
					>
						<HeroBackground bgColors={parceiro.bgColors} />
					</Animated.View>

					{/* Mock da interface Treepy dentro do hero */}
					<Animated.View
						entering={FadeIn.delay(300).duration(600)}
						style={styles.mockOverlay}
					>
						<View style={styles.mockScreen}>
							{/* Barra de título do mock */}
							<View style={styles.mockBar}>
								<View style={styles.mockDot} />
								<View
									style={[styles.mockDot, { backgroundColor: "#C1FF00" }]}
								/>
								<View style={styles.mockDot} />
							</View>
							{/* Conteúdo mock */}
							<View style={styles.mockContent}>
								<View style={styles.mockLine} />
								<View
									style={[styles.mockLine, { width: "60%", marginTop: 4 }]}
								/>
								<View style={styles.mockRow}>
									<View style={styles.mockCard} />
									<View style={styles.mockCard} />
								</View>
								<View
									style={[styles.mockLine, { width: "80%", marginTop: 6 }]}
								/>
							</View>
						</View>
					</Animated.View>

					{/* Overlay gradiente bottom */}
					<View style={styles.heroBottomFade} />
				</Animated.View>

				{/* ── Info do parceiro ──────────────────────────────────── */}
				<Box backgroundColor="$background" paddingHorizontal={20}>
					{/* Nome, ícone e verificado */}
					<Animated.View
						entering={FadeInDown.delay(100).damping(14)}
						style={{ marginTop: -20, marginBottom: 24 }}
					>
						<XStack alignItems="flex-end" gap={14} marginBottom={10}>
							{/* Ícone */}
							<Box
								backgroundColor={parceiro.iconColor}
								borderRadius={18}
								width={64}
								height={64}
								alignItems="center"
								justifyContent="center"
								borderWidth={2}
								borderColor={parceiro.acento}
							>
								<Text fontSize={28}>{parceiro.sigla}</Text>
							</Box>

							{/* Badge verificado */}
							{parceiro.verificado && (
								<Animated.View style={verifyStyle}>
									<XStack
										borderWidth={1}
										borderColor={PRIMARY}
										borderRadius={20}
										paddingHorizontal={10}
										paddingVertical={5}
										alignItems="center"
										gap={4}
										marginBottom={6}
									>
										<BadgeCheck size={13} color={PRIMARY} />
										<Text
											color={PRIMARY}
											fontSize={11}
											fontWeight="700"
											fontFamily="$label"
										>
											VERIFIED
										</Text>
									</XStack>
								</Animated.View>
							)}
						</XStack>

						<Text
							color="$color"
							fontSize={scale(7)}
							fontWeight="900"
							fontFamily="$heading"
							letterSpacing={-0.5}
							marginBottom={4}
						>
							{parceiro.nome}
						</Text>
						<Text color="#8f8f8f" fontSize={14}>
							{parceiro.subtitulo}
						</Text>
					</Animated.View>

					{/* ── Sobre o Parceiro ────────────────────────────────── */}
					<Animated.View
						entering={FadeInLeft.delay(200).damping(14)}
						style={{ marginBottom: 28 }}
					>
						<Text
							color={PRIMARY}
							t="a3"
							fontWeight="700"
							fontFamily="$label"
							letterSpacing={1.4}
							marginBottom={10}
						>
							SOBRE O PARCEIRO
						</Text>
						<Text color="#cccccc" fontSize={14} lineHeight={24}>
							{parceiro.descricao}
						</Text>
					</Animated.View>

					{/* ── Impacto Ambiental ────────────────────────────────── */}
					<Animated.View
						entering={FadeInLeft.delay(300).damping(14)}
						style={{ marginBottom: 12 }}
					>
						<Text
							color={PRIMARY}
							t="a3"
							fontWeight="700"
							fontFamily="$label"
							letterSpacing={1.4}
						>
							IMPACTO AMBIENTAL
						</Text>
					</Animated.View>

					<XStack gap={12} marginBottom={28}>
						<ImpactCard
							icon={
								<Box
									backgroundColor="rgba(193,255,0,0.1)"
									borderRadius={8}
									width={36}
									height={24}
									alignItems="center"
									justifyContent="center"
								>
									<Text
										color={PRIMARY}
										fontSize={8}
										fontWeight="900"
										fontFamily="$label"
									>
										CO₂
									</Text>
								</Box>
							}
							label="CO2 Mitigado"
							value={parceiro.co2Mitigado}
							unit="tons"
							acento="#ffffff"
							index={0}
						/>
						<ImpactCard
							icon={<TreePine size={28} color={PRIMARY} />}
							label="Árvores Plantadas"
							value={parceiro.arvoresPlantadas}
							acento="#ffffff"
							index={1}
						/>
					</XStack>

					{/* ── Seus Treepycashes ────────────────────────────────── */}
					{/* <Animated.View entering={FadeInDown.delay(500).damping(14)}>
						<Box
							backgroundColor="$backgroundHover"
							borderRadius={20}
							borderWidth={1}
							borderColor="$borderColor"
							padding={20}
							overflow="hidden"
						>
							<View style={styles.cashGlow} />

							<Text
								color={PRIMARY}
								fontSize={10}
								fontWeight="700"
								fontFamily="$label"
								letterSpacing={1.4}
								marginBottom={14}
							>
								SEUS TREEPYCASHES
							</Text>

							<XStack justifyContent="space-between" marginBottom={6}>
								<Text color="#8f8f8f" fontSize={12} fontWeight="500">
									Total Acumulado
								</Text>
								<Text color="#8f8f8f" fontSize={12} fontWeight="500">
									Disponível
								</Text>
							</XStack>

							<XStack
								justifyContent="space-between"
								alignItems="baseline"
								marginBottom={20}
							>
								<XStack alignItems="baseline" gap={4}>
									<Text
										color="$color"
										fontSize={16}
										fontWeight="700"
										fontFamily="$label"
									>
										₮
									</Text>
									<Text
										color="$color"
										fontSize={scale(8.5)}
										fontWeight="900"
										fontFamily="$heading"
										letterSpacing={-1}
									>
										{parceiro.totalAcumulado}
									</Text>
								</XStack>

								<XStack alignItems="baseline" gap={3}>
									<Text
										color={PRIMARY}
										fontSize={13}
										fontWeight="700"
										fontFamily="$label"
									>
										₮
									</Text>
									<Text
										color={PRIMARY}
										fontSize={scale(5.5)}
										fontWeight="900"
										fontFamily="$heading"
										letterSpacing={-0.5}
									>
										{parceiro.disponivel}
									</Text>
								</XStack>
							</XStack>

							<Box
								backgroundColor="$backgroundPress"
								borderRadius={4}
								height={5}
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
					</Animated.View> */}

					{/* ── Botão resgatar ───────────────────────────────────── */}
					<Animated.View
						entering={FadeInUp.delay(700).damping(14)}
						style={{ marginTop: 20 }}
					>
						<TouchableOpacity
							style={[styles.redeemBtn, { backgroundColor: PRIMARY }]}
							activeOpacity={0.85}
						>
							<Text
								color="#000"
								fontSize={15}
								fontWeight="800"
								fontFamily="$label"
							>
								Resgatar Treepycashes
							</Text>
						</TouchableOpacity>
					</Animated.View>

					{/* ── Botão voltar (alternativo) ───────────────────────── */}
					{/* <Animated.View
						entering={FadeInUp.delay(800).damping(14)}
						style={{ marginTop: 12 }}
					>
						<TouchableOpacity
							style={styles.backBtnBottom}
							activeOpacity={0.8}
							onPress={() => router.back()}
						>
							<Text color="#8f8f8f" fontSize={14} fontWeight="600">
								Voltar
							</Text>
						</TouchableOpacity>
					</Animated.View> */}
				</Box>
			</Animated.ScrollView>
		</Container>
	);
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
	floatingHeader: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		zIndex: 10,
		paddingHorizontal: 16,
		paddingBottom: 10,
	},
	backBtn: {
		alignSelf: "flex-start",
		marginTop: 8,
	},
	gridContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	},
	panelCell: {
		width: SCREEN_WIDTH / 4,
		height: HERO_HEIGHT / 6,
		borderWidth: 0.5,
	},
	heroGlow: {
		position: "absolute",
		top: 40,
		left: -40,
		width: 200,
		height: 200,
		borderRadius: 100,
		backgroundColor: "rgba(193,255,0,0.07)",
	},
	heroBottomFade: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		height: 80,
		backgroundColor: "transparent",
		// Simula gradiente com view escurecida
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0,
	},
	mockOverlay: {
		position: "absolute",
		right: 20,
		top: 32,
		width: SCREEN_WIDTH * 0.52,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.5,
		shadowRadius: 20,
		elevation: 12,
	},
	mockScreen: {
		backgroundColor: "#111418",
		borderRadius: 10,
		overflow: "hidden",
		borderWidth: 1,
		borderColor: "rgba(255,255,255,0.1)",
	},
	mockBar: {
		flexDirection: "row",
		gap: 4,
		padding: 8,
		backgroundColor: "#1a1f25",
		borderBottomWidth: 1,
		borderBottomColor: "rgba(255,255,255,0.06)",
	},
	mockDot: {
		width: 6,
		height: 6,
		borderRadius: 3,
		backgroundColor: "rgba(255,255,255,0.2)",
	},
	mockContent: {
		padding: 10,
	},
	mockLine: {
		height: 6,
		borderRadius: 3,
		backgroundColor: "rgba(255,255,255,0.12)",
		width: "90%",
	},
	mockRow: {
		flexDirection: "row",
		gap: 6,
		marginTop: 8,
	},
	mockCard: {
		flex: 1,
		height: 36,
		borderRadius: 6,
		backgroundColor: "rgba(193,255,0,0.08)",
		borderWidth: 1,
		borderColor: "rgba(193,255,0,0.15)",
	},
	cashGlow: {
		position: "absolute",
		right: -30,
		top: -30,
		width: 120,
		height: 120,
		borderRadius: 60,
		backgroundColor: "rgba(193,255,0,0.05)",
	},
	redeemBtn: {
		paddingVertical: 16,
		borderRadius: 14,
		alignItems: "center",
		justifyContent: "center",
	},
	backBtnBottom: {
		paddingVertical: 14,
		borderRadius: 14,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 1,
		borderColor: "#2a3037",
	},
});
