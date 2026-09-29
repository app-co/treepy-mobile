import type { IMetricaUsuario } from "@/dtos/interfaces";
import { MetricasAPI } from "@/services/endpoints";
import { router } from "expo-router";
import { AlertCircle, ArrowLeft, Leaf } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import Animated, {
	FadeInDown,
	FadeInLeft,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme, XStack, YStack } from "tamagui";
import { scale } from "../../../tamagui.config";
import {
	Box,
	Container,
	Flat,
	HStack,
	Scroll,
	Text,
} from "../../components/ui/Layout";

// ─── Constantes ───────────────────────────────────────────────────────────────
const PRIMARY = "#C1FF00";

// ─── Tipos ────────────────────────────────────────────────────────────────────
type FiltroAtivo = "Ativas" | "Inativas";

// ─── Componente: Pill de Filtro ───────────────────────────────────────────────
interface FiltroPillProps {
	label: FiltroAtivo;
	ativo: boolean;
	onPress: () => void;
}

function FiltroPill({ label, ativo, onPress }: FiltroPillProps) {
	const scaleVal = useSharedValue(1);

	const animStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scaleVal.value }],
	}));

	return (
		<Animated.View style={animStyle}>
			<TouchableOpacity
				onPressIn={() => {
					scaleVal.value = withTiming(0.93, { duration: 80 });
				}}
				onPressOut={() => {
					scaleVal.value = withTiming(1, { duration: 180 });
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

// ─── Componente: Item da Floresta ────────────────────────────────────────────
interface FlorestaItemProps {
	florestaData: any;
	index: number;
}

function FlorestaItem({ florestaData, index }: FlorestaItemProps) {
	const scaleVal = useSharedValue(1);
	const animStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scaleVal.value }],
	}));

	const floresta = florestaData.floresta;

	return (
		<Animated.View
			entering={FadeInDown.delay(100 + index * 80).damping(16)}
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
						<Box
							width={46}
							height={46}
							borderRadius={14}
							backgroundColor="$backgroundPress"
							borderWidth={1}
							borderColor={PRIMARY + "33"}
							alignItems="center"
							justifyContent="center"
						>
							<Leaf size={20} color={PRIMARY} />
						</Box>

						<YStack flex={1} gap={3}>
							<Text color="$color" t="a3">
								{floresta.nome}
							</Text>
							<Text color="#8f8f8f" t="a5">
								Código: {floresta.codigo}
							</Text>

							{/* <XStack alignItems="center" gap={6} marginTop={4}>
								<MapPin size={12} color="#8f8f8f" />
								<Text color="#8f8f8f" fontSize={11}>
									Lat: {floresta.lat || "-"} · Long: {floresta.long || "-"}
								</Text>
							</XStack> */}
							<HStack mt={20} gap={15}>
								<Text
									color={PRIMARY}
									fontSize={16}
									fontWeight="900"
									fontFamily="$label"
								>
									{florestaData.qnt.toFixed(4)}
								</Text>
								<Text color="#8f8f8f" fontSize={10} fontFamily="$label">
									treepycashes
								</Text>
							</HStack>
						</YStack>
					</XStack>
				</Box>
			</TouchableOpacity>
		</Animated.View>
	);
}

// ─── Tela Principal ───────────────────────────────────────────────────────────
export default function FlorestasScreen() {
	const theme = useTheme();
	const insets = useSafeAreaInsets();
	const [filtroAtivo, setFiltroAtivo] = useState<FiltroAtivo>("Ativas");
	const [metrics, setMetrics] = useState<IMetricaUsuario | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchMetrics() {
			try {
				const { data } = await MetricasAPI.getUserMetrics();
				setMetrics(data);
			} catch (error) {
				console.log("Erro ao buscar florestas", error);
			} finally {
				setLoading(false);
			}
		}
		fetchMetrics();
	}, []);

	const listaAtivas = metrics?.treepycashesAtivos || [];
	const listaInativas = metrics?.treepycashesInativos || [];

	const listaExibida = filtroAtivo === "Ativas" ? listaAtivas : listaInativas;

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
				<Animated.View>
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
							Suas Florestas
						</Text>

						<Box width={22} />
					</XStack>
				</Animated.View>

				{/* ── Título ────────────────────────────────────────────────── */}
				<Animated.View
					entering={FadeInLeft.delay(100).damping(14)}
					style={{ marginBottom: 20 }}
				>
					<XStack alignItems="center" gap={8} marginBottom={4}>
						<Leaf size={16} color={PRIMARY} />
						<Text
							color="#8f8f8f"
							fontSize={10}
							fontWeight="700"
							fontFamily="$label"
							letterSpacing={1.2}
						>
							FLORESTAS
						</Text>
					</XStack>
					<Text
						color="$color"
						fontSize={scale(6.5)}
						fontWeight="900"
						fontFamily="$heading"
					>
						Florestas{"\n"}Participantes
					</Text>
					<Text color="#8f8f8f" fontSize={13} marginTop={6}>
						Veja todas as florestas ativas e inativas onde{"\n"}você possui
						treepycashes.
					</Text>
				</Animated.View>

				{/* ── Filtros ───────────────────────────────────────────────── */}
				<Animated.View
					entering={FadeInLeft.delay(200).damping(14)}
					style={{ marginBottom: 20 }}
				>
					<XStack gap={12}>
						<FiltroPill
							label="Ativas"
							ativo={filtroAtivo === "Ativas"}
							onPress={() => setFiltroAtivo("Ativas")}
						/>
						<FiltroPill
							label="Inativas"
							ativo={filtroAtivo === "Inativas"}
							onPress={() => setFiltroAtivo("Inativas")}
						/>
					</XStack>
				</Animated.View>

				{/* ── Lista de Florestas ────────────────────────────────────── */}
				{loading ? (
					<Box padding={40} alignItems="center">
						<ActivityIndicator size="large" color={PRIMARY} />
					</Box>
				) : (
					<YStack gap={2}>
						<Flat
							data={listaExibida}
							keyExtractor={(h) => h.id}
							renderItem={({ item: h, index }) => (
								<FlorestaItem florestaData={h} index={index} />
							)}
							ListEmptyComponent={
								<Animated.View entering={FadeInDown.delay(300).damping(14)}>
									<Box
										backgroundColor="$backgroundHover"
										borderRadius={20}
										borderWidth={1}
										borderColor="$borderColor"
										padding={32}
										alignItems="center"
										gap={12}
									>
										<AlertCircle size={40} color="#555" />
										<Text
											color="#8f8f8f"
											fontSize={14}
											fontWeight="600"
											textAlign="center"
										>
											Nenhuma floresta encontrada
										</Text>
										<Text color="#555" fontSize={12} textAlign="center">
											Você não possui florestas {filtroAtivo.toLowerCase()}.
										</Text>
									</Box>
								</Animated.View>
							}
						/>
					</YStack>
				)}
			</Scroll>
		</Container>
	);
}

// ─── Estilos ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
	backBtn: {
		padding: 4,
	},
});
