import { useAuth } from "@/context/AuthContext";
import type { IMetricaUsuario } from "@/dtos/interfaces";
import { MetricasAPI } from "@/services/endpoints";
import { vocabulario } from "@/utils/vocabulario";
import { router } from "expo-router";
import {
	Bell,
	HandCoins,
	Handshake,
	Leaf,
	ShoppingCart,
	SlidersHorizontal,
	TrendingUp,
	Wind,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Animated, {
	Easing,
	FadeInDown,
	FadeInLeft,
	FadeInUp,
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
import { Box, Container, Scroll, Text } from "../../components/ui/Layout";

// ─── Constantes de cor ───────────────────────────────────────────────────────
const PRIMARY = "#C1FF00";

// ─── Hook: pulsar um elemento ────────────────────────────────────────────────
function usePulse() {
	const opacity = useSharedValue(1);

	useEffect(() => {
		opacity.value = withRepeat(
			withSequence(
				withTiming(0.4, { duration: 900, easing: Easing.inOut(Easing.ease) }),
				withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) }),
			),
			-1,
			true,
		);
	}, [opacity]);

	return useAnimatedStyle(() => ({ opacity: opacity.value }));
}

// ─── Hook: barra de progresso animada ───────────────────────────────────────
function useProgressBar(targetPercentage: number, delay = 600) {
	const width = useSharedValue(0);

	useEffect(() => {
		width.value = withDelay(
			delay,
			withTiming(targetPercentage, {
				duration: 1400,
				easing: Easing.out(Easing.quad),
			}),
		);
	}, [width, targetPercentage, delay]);

	return useAnimatedStyle(() => ({ width: `${width.value}%` }));
}

// ─── Componente: Ação rápida ─────────────────────────────────────────────────
interface QuickActionProps {
	icon: React.ReactNode;
	label: string;
	index: number;
	onPress?: () => void;
}

function QuickAction({ icon, label, index, onPress }: QuickActionProps) {
	const scaleVal = useSharedValue(1);

	const animStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scaleVal.value }],
	}));

	return (
		<Animated.View
			entering={FadeInUp.delay(300 + index * 120).damping(4)}
			style={{ flex: 1, alignItems: "center" }}
		>
			<Animated.View style={[animStyle, { width: "100%" }]}>
				<TouchableOpacity
					onPressIn={() => {
						scaleVal.value = withTiming(0.92, { duration: 100 });
					}}
					onPressOut={() => {
						scaleVal.value = withTiming(1, { duration: 200 });
					}}
					onPress={onPress}
					activeOpacity={1}
					style={styles.quickActionTouchable}
				>
					<Box
						backgroundColor="$backgroundHover"
						borderRadius={16}
						borderWidth={1}
						borderColor="$borderColor"
						alignItems="center"
						justifyContent="center"
						padding={20}
						width="100%"
						aspectRatio={1}
					>
						{icon}
					</Box>
				</TouchableOpacity>
			</Animated.View>
			<Text
				color="$color"
				fontSize={12}
				textAlign="center"
				marginTop={8}
				fontWeight="500"
			>
				{label}
			</Text>
		</Animated.View>
	);
}

// ─── Componente: Card de impacto ambiental ───────────────────────────────────
interface ImpactCardProps {
	icon: React.ReactNode;
	label: string;
	value: string;
	accent?: string;
	index: number;
}

function ImpactCard({
	icon,
	label,
	value,
	accent = PRIMARY,
	index,
}: ImpactCardProps) {
	return (
		<Animated.View
			entering={FadeInDown.delay(600 + index * 150).damping(14)}
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
				<Box marginBottom={8}>{icon}</Box>
				<Text color="#8f8f8f" letterSpacing={0.8} marginBottom={4} t="a5">
					{label}
				</Text>
				<Text color={accent} fontSize={28} fontWeight="900" fontFamily="$label">
					{value}
				</Text>
			</Box>
		</Animated.View>
	);
}

// ─── Componente: Stat mensal com barra animada ────────────────────────────────
interface MonthlyStatProps {
	label: string;
	value: string;
	pct: number;
	index: number;
	maxWidth: number;
}

function MonthlyStat({ label, value, pct, index, maxWidth }: MonthlyStatProps) {
	const barWidth = useSharedValue(0);

	useEffect(() => {
		barWidth.value = withDelay(
			900 + index * 150,
			withTiming((pct / 100) * maxWidth, {
				duration: 1000,
				easing: Easing.out(Easing.quad),
			}),
		);
	}, [barWidth, pct, index, maxWidth]);

	const barStyle = useAnimatedStyle(() => ({
		width: barWidth.value,
		height: 3,
		backgroundColor: PRIMARY,
		borderRadius: 2,
	}));

	return (
		<YStack gap={6}>
			<XStack justifyContent="space-between">
				<Text color="#8f8f8f" fontSize={12} fontWeight="500">
					{label}
				</Text>
				<Text color="$color" fontSize={12} fontWeight="700">
					{value}
				</Text>
			</XStack>
			<Box
				backgroundColor="$backgroundPress"
				borderRadius={2}
				height={3}
				overflow="hidden"
			>
				<Animated.View style={barStyle} />
			</Box>
		</YStack>
	);
}

// ─── Tela principal ──────────────────────────────────────────────────────────
export default function HomeScreen() {
	const theme = useTheme();
	const insets = useSafeAreaInsets();
	const { user } = useAuth();

	const firstName = user?.nome?.split(" ")[0] ?? "Usuário";

	const [metrics, setMetrics] = useState<IMetricaUsuario | null>(null);

	useEffect(() => {
		async function fetchMetrics() {
			try {
				const { data } = await MetricasAPI.getUserMetrics();
				setMetrics(data);
			} catch (error) {
				console.log("Erro ao buscar métricas", error);
			}
		}
		fetchMetrics();
	}, []);

	// Cálculo da porcentagem da barra de progresso
	const metaAtingida = metrics?.compensacao?.metaAtingida ?? 0;
	const co2Anual =
		metrics?.compensacao?.co2Anual && metrics.compensacao.co2Anual > 0
			? metrics.compensacao.co2Anual
			: 1;
	const progressPercentage = metrics
		? Math.min(Math.max((metaAtingida / co2Anual) * 100, 0), 100)
		: 0;

	// Barra de progresso do saldo
	const progressStyle = useProgressBar(progressPercentage, 100);
	const pulseStyle = usePulse();

	// Badge de notificação pulsante
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

	return (
		<Container backgroundColor="$background">
			<Scroll
				contentContainerStyle={{
					paddingTop: 8,
					paddingBottom: insets.bottom + 24,
					paddingHorizontal: 20,
				}}
			>
				{/* ── Header ──────────────────────────────────────────── */}
				<Animated.View entering={FadeInDown.delay(0).damping(16)}>
					<XStack
						justifyContent="space-between"
						alignItems="center"
						marginBottom={24}
					>
						{/* Logo */}
						<XStack alignItems="center" gap={8}>
							<Box
								backgroundColor={PRIMARY}
								borderRadius={10}
								width={32}
								height={32}
								alignItems="center"
								justifyContent="center"
							>
								<Leaf size={18} color="#000" />
							</Box>
							<Text
								color={PRIMARY}
								fontSize={22}
								fontWeight="900"
								fontFamily="$heading"
								letterSpacing={-0.5}
							>
								Treepy
							</Text>
						</XStack>

						{/* Ícones do header */}
						<XStack alignItems="center" gap={16}>
							<TouchableOpacity style={styles.iconBtn}>
								<Animated.View style={badgeStyle}>
									<Box position="relative">
										<Bell size={22} color={theme.color?.val || "#fff"} />
										<Box
											position="absolute"
											top={-2}
											right={-2}
											width={8}
											height={8}
											borderRadius={4}
											backgroundColor={PRIMARY}
										/>
									</Box>
								</Animated.View>
							</TouchableOpacity>

							<TouchableOpacity>
								<Box
									width={38}
									height={38}
									borderRadius={19}
									backgroundColor="$backgroundHover"
									borderWidth={2}
									borderColor={PRIMARY}
									alignItems="center"
									justifyContent="center"
								>
									<Text fontSize={18}>🌿</Text>
								</Box>
							</TouchableOpacity>
						</XStack>
					</XStack>
				</Animated.View>

				{/* ── Saudação ─────────────────────────────────────────── */}
				<Animated.View
					entering={FadeInLeft.delay(100).damping(14)}
					style={{ marginBottom: 20 }}
				>
					<Text
						color="$color"
						fontSize={scale(6.5)}
						fontWeight="900"
						fontFamily="$heading"
					>
						Olá, {firstName}!
					</Text>
					<Text color="#8f8f8f" fontSize={14} marginTop={2}>
						Sua pegada de carbono está diminuindo.
					</Text>
				</Animated.View>

				{/* ── Card de Saldo ─────────────────────────────────────── */}
				<Animated.View
					entering={FadeInUp.delay(200).damping(14)}
					style={{ marginBottom: 28 }}
				>
					<Box
						backgroundColor="$backgroundHover"
						borderRadius={20}
						borderWidth={1}
						borderColor="$borderColor"
						padding={20}
					>
						{/* Topo */}
						<XStack
							justifyContent="space-between"
							alignItems="flex-start"
							marginBottom={8}
						>
							<Box
								backgroundColor="$backgroundPress"
								borderRadius={10}
								width={40}
								height={40}
								alignItems="center"
								justifyContent="center"
							>
								<HandCoins size={20} color={PRIMARY} />
							</Box>
						</XStack>

						{/* Valor principal */}
						<XStack alignItems="baseline" gap={4} marginBottom={16}>
							<Text
								color="#8f8f8f"
								fontSize={14}
								fontWeight="600"
								fontFamily="$label"
							>
								Meta
							</Text>
							<Text
								color="$color"
								fontSize={scale(9)}
								fontWeight="900"
								fontFamily="$heading"
								letterSpacing={-1}
							>
								{metrics?.compensacao.meta ?? 0} {vocabulario.co2}
							</Text>
						</XStack>

						{/* Barra de progresso */}
						<Box
							backgroundColor="$backgroundPress"
							borderRadius={4}
							height={4}
							marginBottom={16}
							overflow="hidden"
						>
							<Animated.View
								style={[
									{
										height: 4,
										backgroundColor: PRIMARY,
										borderRadius: 4,
									},
									progressStyle,
								]}
							/>
						</Box>

						{/* Rodapé */}
						<XStack justifyContent="space-between" alignItems="center">
							<XStack alignItems="center" gap={6}>
								<Animated.View style={pulseStyle}>
									<TrendingUp size={14} color={PRIMARY} />
								</Animated.View>
								<Text color={PRIMARY} t="a4" fontWeight="600">
									{metrics?.compensacao.porcentagemAtingida ?? "0"}% este mês
								</Text>
							</XStack>

							<TouchableOpacity
								style={[styles.redeemBtn, { backgroundColor: PRIMARY }]}
								activeOpacity={0.8}
								onPress={() =>
									router.navigate("/(private)/stacks/comprar-treepycashes")
								}
							>
								<Text color="#000" fontSize={13} fontWeight="700">
									Resgatar
								</Text>
							</TouchableOpacity>
						</XStack>
					</Box>
				</Animated.View>

				{/* ── Ações Rápidas ─────────────────────────────────────── */}
				<Animated.View
					entering={FadeInLeft.delay(250).damping(14)}
					style={{ marginBottom: 12 }}
				>
					<Text
						color="#8f8f8f"
						fontSize={10}
						fontWeight="700"
						fontFamily="$label"
						letterSpacing={1.2}
					>
						AÇÕES RÁPIDAS
					</Text>
				</Animated.View>

				<XStack gap={12} marginBottom={28}>
					<QuickAction
						icon={<ShoppingCart size={26} color={theme.color?.val || "#fff"} />}
						label="Comprar"
						index={0}
						onPress={() =>
							router.push("/(private)/stacks/comprar-treepycashes" as any)
						}
					/>
					<QuickAction
						icon={
							<SlidersHorizontal size={26} color={theme.color?.val || "#fff"} />
						}
						label="Calcular"
						index={1}
						onPress={() => router.push("/(private)/calculadora" as any)}
					/>
					<QuickAction
						icon={<Handshake size={26} color={theme.color?.val || "#fff"} />}
						label="Parceiros"
						index={2}
						onPress={() => router.push("/(private)/parceiros" as any)}
					/>
				</XStack>

				{/* ── Impacto Ambiental ─────────────────────────────────── */}
				<Animated.View
					entering={FadeInLeft.delay(400).damping(14)}
					style={{ marginBottom: 12 }}
				>
					<XStack justifyContent="space-between" alignItems="center">
						<Text
							color="#8f8f8f"
							fontSize={10}
							fontWeight="700"
							fontFamily="$label"
							letterSpacing={1.2}
						>
							IMPACTO AMBIENTAL
						</Text>
					</XStack>
				</Animated.View>

				<XStack gap={12} marginBottom={28}>
					<ImpactCard
						icon={<Leaf size={26} color={PRIMARY} />}
						label="Trepycashes Ativos"
						value={
							metrics?.compensacao.treepy ?? metrics?.compensacao.treepy ?? "42"
						}
						accent={PRIMARY}
						index={0}
					/>
					<ImpactCard
						icon={<Wind size={26} color="#FFD700" />}
						label={`${vocabulario.co2} Reduzido`}
						value={`${metrics?.compensacao.metaAtingida ?? 0} ${vocabulario.co2}`}
						accent="#FFD700"
						index={1}
					/>
				</XStack>

				{/* ── Suas Florestas ──────────────────────────────────────── */}
				<Animated.View
					entering={FadeInDown.delay(750).damping(14)}
					style={{ marginBottom: 8 }}
				>
					<XStack
						justifyContent="space-between"
						alignItems="center"
						marginBottom={12}
					>
						<Text
							color="#8f8f8f"
							fontSize={10}
							fontWeight="700"
							fontFamily="$label"
							letterSpacing={1.2}
						>
							SUAS FLORESTAS ({metrics?.floresta?.length || 0})
						</Text>
						<TouchableOpacity
							onPress={() => router.push("/(private)/florestas" as any)}
						>
							<Text color={PRIMARY} fontSize={13} fontWeight="600">
								Ver todas
							</Text>
						</TouchableOpacity>
					</XStack>

					<YStack gap={12}>
						{metrics?.floresta?.map((floresta, index) => (
							<Box
								key={floresta.codigo + index.toString()}
								backgroundColor="$backgroundHover"
								borderRadius={16}
								borderWidth={1}
								borderColor="$borderColor"
								padding={16}
							>
								<XStack justifyContent="space-between" alignItems="center">
									<XStack alignItems="center" gap={12}>
										<Box
											backgroundColor="$backgroundPress"
											borderRadius={8}
											width={40}
											height={40}
											alignItems="center"
											justifyContent="center"
										>
											<Leaf size={20} color={PRIMARY} />
										</Box>
										<YStack>
											<Text color="$color" fontSize={16} fontWeight="700">
												{floresta.nome}
											</Text>
											<Text color="#8f8f8f" fontSize={12}>
												Código: {floresta.codigo}
											</Text>
										</YStack>
									</XStack>
									<YStack alignItems="flex-end">
										<Text color={PRIMARY} fontSize={16} fontWeight="800">
											{floresta.reepycash}
										</Text>
										<Text color="#8f8f8f" fontSize={10} fontFamily="$label">
											treepycashes
										</Text>
									</YStack>
								</XStack>
							</Box>
						))}

						{(!metrics?.floresta || metrics.floresta.length === 0) && (
							<Box
								backgroundColor="$backgroundHover"
								borderRadius={16}
								borderWidth={1}
								borderColor="$borderColor"
								padding={20}
								alignItems="center"
							>
								<Text color="#8f8f8f" fontSize={14}>
									Você ainda não participa de nenhuma floresta.
								</Text>
							</Box>
						)}
					</YStack>
				</Animated.View>
			</Scroll>
		</Container>
	);
}

// ─── Estilos ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
	iconBtn: {
		padding: 4,
	},
	redeemBtn: {
		paddingHorizontal: 18,
		paddingVertical: 8,
		borderRadius: 10,
	},
	quickActionTouchable: {
		width: "100%",
		alignItems: "center",
	},
});
