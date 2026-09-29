import {
	AlertCircle,
	Bus,
	Car,
	ChevronDown,
	Flame,
	Leaf,
	LineChart,
	Trash2,
	Utensils,
	X,
	Zap,
} from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
	Dimensions,
	FlatList,
	KeyboardAvoidingView,
	Modal,
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	TextInput,
	TouchableOpacity,
} from "react-native";
import Animated, {
	Easing,
	FadeIn,
	FadeInDown,
	FadeInLeft,
	FadeInUp,
	SlideInRight,
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMutate } from "../../hooks/mutations";
import { useAuth } from "../../context/AuthContext";
import { router } from "expo-router";
import { XStack, YStack } from "tamagui";
import { scale, scaleH } from "../../../tamagui.config";
import { Box, Container, Text } from "../../components/ui/Layout";
import { food, veiculosC, veiculosP } from "../../constant/listas";

// ─── Constantes ──────────────────────────────────────────────────────────────
const PRIMARY = "#C1FF00";
const { width: SW } = Dimensions.get("window");

// Meta em treepycashes para compensar (1 TC = 1 tCO₂)
const TC_PER_TCO2 = 1.3991;

// ─── Tipos ────────────────────────────────────────────────────────────────────
type Passo = 0 | 1 | 2 | 3 | 4;

interface Veiculo {
	id: string;
	tipo: string;
	km: string;
	co2: number;
}

interface DadosCalc {
	eletricidade: { tipo: "kWh/mês" | "R$/mês"; valor: string };
	gas: { tipo: "m³/mês" | "R$/mês" | "Botijões/mês"; valor: string };
	veiculos: Veiculo[];
	coletivo: Veiculo[];
	dieta: number;
}

// ─── Configuração das abas ────────────────────────────────────────────────────
const ABAS = [
	{ id: 0, label: "ELETRICIDADE", abbr: "ELETR." },
	{ id: 1, label: "GÁS", abbr: "GÁS" },
	{ id: 2, label: "VEÍCULOS", abbr: "VEÍC." },
	{ id: 3, label: "COLETIVO", abbr: "COLET." },
	{ id: 4, label: "DIETA", abbr: "DIETA" },
] as const;

// ─── Calcular emissão total ───────────────────────────────────────────────────
function calcularTotal(dados: DadosCalc): {
	total: number;
	porCategoria: number[];
} {
	const { eletricidade, gas, veiculos, coletivo, dieta } = dados;

	// Eletricidade
	const elVal = parseFloat(eletricidade.valor.replace(",", ".")) || 0;
	let elCO2 = 0;
	if (eletricidade.tipo === "kWh/mês") {
		elCO2 = (elVal * 149.4) / 166 / 1000;
	} else if (eletricidade.tipo === "R$/mês") {
		elCO2 = (elVal * 173.4678) / 142.28 / 1000;
	}

	// Gás
	const gasVal = parseFloat(gas.valor.replace(",", ".")) || 0;
	let gasCO2 = 0;
	if (gas.tipo === "m³/mês") {
		gasCO2 = (gasVal * 622.3625) / 25.09 / 1000;
	} else if (gas.tipo === "R$/mês") {
		gasCO2 = (gasVal * 262.4256) / 136.68 / 1000;
	} else if (gas.tipo === "Botijões/mês") {
		gasCO2 = (gasVal * 4.407) / 0.125 / 1000;
	}

	// Veículos
	const vCO2 = veiculos.reduce((acc, v) => acc + (v.co2 || 0), 0);

	// Coletivo
	const cCO2 = coletivo.reduce((acc, c) => acc + (c.co2 || 0), 0);

	// Dieta
	const dCO2 = dieta || 0;

	const total = elCO2 + gasCO2 + vCO2 + cCO2 + dCO2;
	return {
		total,
		porCategoria: [elCO2, gasCO2, vCO2, cCO2, dCO2],
	};
}

// ─── Componente: Barra de distribuição ───────────────────────────────────────
interface DistBarProps {
	valores: number[];
	total: number;
}
function DistBar({ valores, total }: DistBarProps) {
	const cores = [PRIMARY, "#60a5fa", "#f59e0b", "#a78bfa", "#f472b6"];
	return (
		<XStack
			gap={4}
			height={6}
			borderRadius={4}
			overflow="hidden"
			marginBottom={8}
		>
			{valores.map((v, i) => {
				const pct = total > 0 ? (v / total) * 100 : 0;
				const barW = useSharedValue(0);
				useEffect(() => {
					barW.value = withDelay(
						i * 100,
						withTiming(pct, { duration: 600, easing: Easing.out(Easing.quad) }),
					);
				}, [pct]);
				const barStyle = useAnimatedStyle(() => ({
					width: `${barW.value}%` as any,
					backgroundColor: cores[i],
					height: 6,
					borderRadius: 3,
				}));
				if (pct <= 0) return null;
				return <Animated.View key={i} style={barStyle} />;
			})}
		</XStack>
	);
}

// ─── Componente: Painel de impacto ────────────────────────────────────────────
interface ImpactoPainelProps {
	total: number;
	porCategoria: number[];
}
function ImpactoPainel({ total, porCategoria }: ImpactoPainelProps) {
	const tc = total * TC_PER_TCO2;
	const comp = total;

	return (
		<Animated.View entering={FadeInDown.delay(100).damping(14)}>
			<Box
				backgroundColor="$backgroundHover"
				borderRadius={20}
				borderWidth={1}
				borderColor="$borderColor"
				padding={18}
				marginBottom={16}
			>
				{/* Impacto anual */}
				<XStack
					justifyContent="space-between"
					alignItems="center"
					marginBottom={4}
				>
					<Text
						color="#8f8f8f"
						fontSize={10}
						fontWeight="700"
						fontFamily="$label"
						letterSpacing={1.2}
					>
						IMPACTO ANUAL
					</Text>
					<LineChart size={16} color="#8f8f8f" />
				</XStack>

				<XStack alignItems="baseline" gap={6} marginBottom={2}>
					<Text
						color="$color"
						fontSize={scale(9)}
						fontWeight="900"
						fontFamily="$heading"
						letterSpacing={-1}
					>
						{total.toFixed(4).replace(".", ",")}
					</Text>
					<Text color="#8f8f8f" fontSize={13} fontWeight="500">
						(tCO₂)
					</Text>
				</XStack>
				<Text color="#8f8f8f" fontSize={11} marginBottom={16}>
					Estimativa de emissão anual projetada
				</Text>

				{/* Meta em Treepycashes */}
				<Box
					backgroundColor="#0d2e0d"
					borderRadius={12}
					padding={14}
					borderWidth={1}
					borderColor="#1a4a1a"
					marginBottom={16}
				>
					<Text
						color="#8f9f8f"
						fontSize={10}
						fontWeight="700"
						fontFamily="$label"
						letterSpacing={1}
						marginBottom={4}
					>
						META ATUAL
					</Text>
					<Text
						color={PRIMARY}
						fontSize={scale(5.5)}
						fontWeight="900"
						fontFamily="$heading"
					>
						{tc.toFixed(4).replace(".", ",")} TREEPYCASHES
					</Text>

					<XStack justifyContent="space-between" marginTop={12}>
						<YStack>
							<Text
								color="#8f9f8f"
								fontSize={9}
								fontWeight="700"
								fontFamily="$label"
								letterSpacing={0.8}
								marginBottom={2}
							>
								TREEPYCASHES
							</Text>
							<Text
								color="$color"
								fontSize={14}
								fontWeight="700"
								fontFamily="$label"
							>
								{tc.toFixed(4).replace(".", ",")}
							</Text>
						</YStack>

						<YStack alignItems="flex-end">
							<Text
								color="#8f9f8f"
								fontSize={9}
								fontWeight="700"
								fontFamily="$label"
								letterSpacing={0.8}
								marginBottom={2}
							>
								COMPENSAÇÃO
							</Text>
							<XStack alignItems="center" gap={4}>
								<Leaf size={12} color={PRIMARY} />
								<Text
									color="$color"
									fontSize={14}
									fontWeight="700"
									fontFamily="$label"
								>
									{comp.toFixed(4).replace(".", ",")} (tCO₂)
								</Text>
							</XStack>
						</YStack>
					</XStack>
				</Box>

				{/* Distribuição por categoria */}
				<Text
					color="#8f8f8f"
					fontSize={9}
					fontWeight="700"
					fontFamily="$label"
					letterSpacing={1.2}
					marginBottom={10}
				>
					DISTRIBUIÇÃO POR CATEGORIA
				</Text>

				<DistBar valores={porCategoria} total={total} />

				<XStack justifyContent="space-between">
					{["ELETR.", "GÁS", "VEÍC.", "COLET.", "DIETA"].map((label, i) => {
						const cores = [PRIMARY, "#60a5fa", "#f59e0b", "#a78bfa", "#f472b6"];
						const pct =
							total > 0 ? ((porCategoria[i] / total) * 100).toFixed(0) : "0";
						return (
							<YStack key={label} alignItems="center" gap={2}>
								<Box
									width={8}
									height={8}
									borderRadius={4}
									backgroundColor={cores[i]}
								/>
								<Text color="#8f8f8f" fontSize={9} fontFamily="$label">
									{label}
								</Text>
								<Text color="#8f8f8f" fontSize={9} fontFamily="$label">
									{pct}%
								</Text>
							</YStack>
						);
					})}
				</XStack>

				{/* Neutralizar */}
				<TouchableOpacity style={styles.neutralizarBtn} activeOpacity={0.8}>
					<Text
						color={PRIMARY}
						fontSize={13}
						fontWeight="800"
						fontFamily="$label"
						letterSpacing={0.5}
					>
						NEUTRALIZAR AGORA
					</Text>
				</TouchableOpacity>
			</Box>
		</Animated.View>
	);
}

// ─── Componente: Seletor estilizado ──────────────────────────────────────────
interface SeletorProps {
	label: string;
	valor: string;
	opcoes: string[];
	onChange: (v: string) => void;
	acento?: boolean;
}
function Seletor({ label, valor, opcoes, onChange, acento }: SeletorProps) {
	const [aberto, setAberto] = useState(false);

	return (
		<YStack gap={6} marginBottom={14}>
			<Text
				color={acento ? PRIMARY : "#8f8f8f"}
				fontSize={10}
				fontWeight="700"
				fontFamily="$label"
				letterSpacing={1}
			>
				{label}
			</Text>
			<TouchableOpacity
				onPress={() => setAberto(!aberto)}
				style={[styles.seletor, { borderColor: aberto ? PRIMARY : "#3a4047" }]}
				activeOpacity={0.8}
			>
				<Text color={valor ? "$color" : "#8f8f8f"} fontSize={14} flex={1}>
					{valor || "Selecione..."}
				</Text>
				<ChevronDown size={16} color="#8f8f8f" />
			</TouchableOpacity>

			{aberto && (
				<Animated.View
					entering={FadeInDown.duration(180)}
					style={styles.seletorDropdown}
				>
					<FlatList
						data={opcoes}
						keyExtractor={(h) => h}
						contentContainerStyle={{
							paddingTop: scaleH(5),
							paddingBottom: scaleH(10),
						}}
						renderItem={({ item: h }) => (
							<TouchableOpacity
								onPress={() => {
									onChange(h);
									setAberto(false);
								}}
								style={[
									styles.seletorOpcao,
									{ backgroundColor: valor === h ? "#1a2e1a" : "transparent" },
								]}
							>
								<Text
									color={valor === h ? PRIMARY : "$color"}
									fontSize={13}
									fontWeight={valor === h ? "700" : "400"}
								>
									{h}
								</Text>
							</TouchableOpacity>
						)}
					/>
					{/* {opcoes.map((op) => (
					))} */}
				</Animated.View>
			)}
		</YStack>
	);
}

// ─── Componente: Input estilizado ─────────────────────────────────────────────
interface InputNumProps {
	label: string;
	valor: string;
	placeholder?: string;
	onChange: (v: string) => void;
	acento?: boolean;
}
function InputNum({
	label,
	valor,
	placeholder = "0,000",
	onChange,
	acento,
}: InputNumProps) {
	return (
		<YStack gap={6} marginBottom={14}>
			<Text
				color={acento ? PRIMARY : "#8f8f8f"}
				fontSize={10}
				fontWeight="700"
				fontFamily="$label"
				letterSpacing={1}
			>
				{label}
			</Text>
			<Box
				borderWidth={1}
				borderColor="#3a4047"
				borderRadius={10}
				paddingHorizontal={16}
				paddingVertical={14}
				backgroundColor="$backgroundHover"
			>
				<TextInput
					value={valor}
					onChangeText={onChange}
					placeholder={placeholder}
					placeholderTextColor="#3a4047"
					keyboardType="decimal-pad"
					style={styles.textInput}
				/>
			</Box>
		</YStack>
	);
}

// ─── Componente: Item de veículo/transporte adicionado ────────────────────────
interface ItemAdicionadoProps {
	item: Veiculo;
	unidade: string;
	onRemove: () => void;
}
function ItemAdicionado({ item, unidade, onRemove }: ItemAdicionadoProps) {
	return (
		<Animated.View entering={FadeInLeft.damping(14)}>
			<XStack
				backgroundColor="$backgroundHover"
				borderRadius={10}
				borderWidth={1}
				borderColor="#3a4047"
				paddingHorizontal={14}
				paddingVertical={12}
				alignItems="center"
				justifyContent="space-between"
				marginBottom={8}
			>
				<YStack flex={1}>
					<Text color="$color" fontSize={13} fontWeight="700">
						{item.tipo}
					</Text>
					<Text color="#8f8f8f" fontSize={11}>
						{item.km} {unidade}
					</Text>
				</YStack>
				<TouchableOpacity onPress={onRemove} style={{ padding: 4 }}>
					<Trash2 size={16} color="#ef4444" />
				</TouchableOpacity>
			</XStack>
		</Animated.View>
	);
}

// ─── Modal: Adicionar Veículo / Transporte ────────────────────────────────────
interface ModalAdicionarProps {
	visivel: boolean;
	titulo: string;
	tipoLabel: string;
	opcoesTipo: string[];
	kmLabel: string;
	onSalvar: (tipo: string, km: string) => void;
	onFechar: () => void;
}
function ModalAdicionar({
	visivel,
	titulo,
	tipoLabel,
	opcoesTipo,
	kmLabel,
	onSalvar,
	onFechar,
}: ModalAdicionarProps) {
	const [tipo, setTipo] = useState("");
	const [km, setKm] = useState("");

	const handleSalvar = () => {
		if (!tipo || !km) return;
		onSalvar(tipo, km);
		setTipo("");
		setKm("");
	};

	return (
		<Modal
			visible={visivel}
			transparent
			animationType="fade"
			onRequestClose={onFechar}
		>
			<Pressable style={styles.modalOverlay} onPress={onFechar}>
				<Pressable onPress={(e) => e.stopPropagation()}>
					<Animated.View
						entering={FadeInUp.damping(16)}
						style={styles.modalBox}
					>
						{/* Header */}
						<XStack
							justifyContent="space-between"
							alignItems="center"
							marginBottom={20}
						>
							<Text
								color="$color"
								fontSize={scale(5)}
								fontWeight="900"
								fontFamily="$heading"
							>
								{titulo}
							</Text>
							<TouchableOpacity onPress={onFechar}>
								<X size={20} color="#8f8f8f" />
							</TouchableOpacity>
						</XStack>

						<Seletor
							label={tipoLabel}
							valor={tipo}
							opcoes={opcoesTipo}
							onChange={setTipo}
							acento
						/>

						<InputNum
							label={kmLabel}
							valor={km}
							placeholder="0"
							onChange={setKm}
							acento
						/>

						<TouchableOpacity
							style={[
								styles.addBtn,
								{ backgroundColor: tipo && km ? PRIMARY : "#2a3037" },
							]}
							onPress={handleSalvar}
							activeOpacity={0.85}
						>
							<Text
								color={tipo && km ? "#000" : "#8f8f8f"}
								fontSize={13}
								fontWeight="800"
								fontFamily="$label"
								letterSpacing={0.8}
							>
								{titulo.toUpperCase()}
							</Text>
						</TouchableOpacity>
					</Animated.View>
				</Pressable>
			</Pressable>
		</Modal>
	);
}

// ─── Passo: Eletricidade ──────────────────────────────────────────────────────
interface PassoEletricidadeProps {
	dados: DadosCalc["eletricidade"];
	onChange: (d: DadosCalc["eletricidade"]) => void;
}
function PassoEletricidade({ dados, onChange }: PassoEletricidadeProps) {
	return (
		<Animated.View entering={SlideInRight.damping(14)} key="el">
			{/* Header do passo */}
			<Box
				backgroundColor="$backgroundHover"
				borderRadius={16}
				borderWidth={1}
				borderColor="$borderColor"
				padding={16}
				marginBottom={16}
			>
				<XStack alignItems="center" gap={12} marginBottom={10}>
					<Box
						backgroundColor="#1a2a1a"
						borderRadius={10}
						width={40}
						height={40}
						alignItems="center"
						justifyContent="center"
					>
						<Zap size={20} color={PRIMARY} />
					</Box>
					<YStack flex={1}>
						<Text
							color="$color"
							fontSize={scale(4.5)}
							fontWeight="900"
							fontFamily="$heading"
						>
							FATOR DE EMISSÃO: ELETRICIDADE
						</Text>
						<Text color="#8f8f8f" fontSize={12} marginTop={2}>
							Insira seu consumo mensal ou o valor pago de energia elétrica.
						</Text>
					</YStack>
				</XStack>
			</Box>

			<Seletor
				label="TIPO DE CONSUMO"
				valor={dados.tipo}
				opcoes={["kWh/mês", "R$/mês"]}
				onChange={(v) => onChange({ ...dados, tipo: v as any })}
			/>

			<InputNum
				label={`CONSUMO MENSAL (${dados.tipo})`}
				valor={dados.valor}
				onChange={(v) => onChange({ ...dados, valor: v })}
				acento
			/>
		</Animated.View>
	);
}

// ─── Passo: Gás ───────────────────────────────────────────────────────────────
interface PassoGasProps {
	dados: DadosCalc["gas"];
	onChange: (d: DadosCalc["gas"]) => void;
}
function PassoGas({ dados, onChange }: PassoGasProps) {
	return (
		<Animated.View entering={SlideInRight.damping(14)} key="gas">
			<Box
				backgroundColor="$backgroundHover"
				borderRadius={16}
				borderWidth={1}
				borderColor="$borderColor"
				padding={16}
				marginBottom={16}
			>
				<XStack alignItems="center" gap={12} marginBottom={10}>
					<Box
						backgroundColor="#2a1a0a"
						borderRadius={10}
						width={40}
						height={40}
						alignItems="center"
						justifyContent="center"
					>
						<Flame size={20} color="#f59e0b" />
					</Box>
					<YStack flex={1}>
						<Text
							color="$color"
							fontSize={scale(4.5)}
							fontWeight="900"
							fontFamily="$heading"
						>
							FATOR DE EMISSÃO: GÁS
						</Text>
						<Text color="#8f8f8f" fontSize={12} marginTop={2}>
							Insira seu consumo mensal ou o valor pago de gás.
						</Text>
					</YStack>
				</XStack>
			</Box>

			<Seletor
				label="TIPO DE CONSUMO"
				valor={dados.tipo}
				opcoes={["m³/mês", "R$/mês", "Botijões/mês"]}
				onChange={(v) => onChange({ ...dados, tipo: v as any })}
			/>

			<InputNum
				label={`CONSUMO MENSAL (${dados.tipo})`}
				valor={dados.valor}
				onChange={(v) => onChange({ ...dados, valor: v })}
				acento
			/>
		</Animated.View>
	);
}

// ─── Passo: Veículos ──────────────────────────────────────────────────────────
interface PassoVeiculosProps {
	dados: Veiculo[];
	onChange: (d: Veiculo[]) => void;
}
function PassoVeiculos({ dados, onChange }: PassoVeiculosProps) {
	const [modalVisivel, setModalVisivel] = useState(false);

	const adicionar = (tipo: string, km: string) => {
		const match = veiculosP.find((v) => {
			let desc = v.Meio_de_transporte;
			if (v.Combustível_Tipo !== "0") desc += ` - ${v.Combustível_Tipo}`;
			if (v.Potência_do_motor !== "0") desc += ` (${v.Potência_do_motor})`;
			if (v.Modelo !== "0") desc += ` (${v.Modelo})`;
			return desc === tipo;
		});
		const co2Factor = match ? match.co2 : 0;
		const calculatedCo2 = (Number(km) * co2Factor) / 1000 / 1000;
		const co2 = calculatedCo2 * 12;
		onChange([...dados, { id: Date.now().toString(), tipo, km, co2 }]);
		setModalVisivel(false);
	};

	const opcoes = veiculosP.map((v) => {
		let desc = v.Meio_de_transporte;
		if (v.Combustível_Tipo !== "0") desc += ` - ${v.Combustível_Tipo}`;
		if (v.Potência_do_motor !== "0") desc += ` (${v.Potência_do_motor})`;
		if (v.Modelo !== "0") desc += ` (${v.Modelo})`;
		return desc;
	});

	return (
		<Animated.View entering={SlideInRight.damping(14)} key="veic">
			<Box
				backgroundColor="$backgroundHover"
				borderRadius={16}
				borderWidth={1}
				borderColor="$borderColor"
				padding={16}
				marginBottom={16}
			>
				<XStack alignItems="center" gap={12} marginBottom={10}>
					<Box
						backgroundColor="#1a2a1a"
						borderRadius={10}
						width={40}
						height={40}
						alignItems="center"
						justifyContent="center"
					>
						<Car size={20} color={PRIMARY} />
					</Box>
					<YStack flex={1}>
						<Text
							color="$color"
							fontSize={scale(4.5)}
							fontWeight="900"
							fontFamily="$heading"
						>
							FATOR DE EMISSÃO: VEÍCULOS
						</Text>
						<Text color="#8f8f8f" fontSize={12} marginTop={2}>
							Insira as informações mensais sobre o seu transporte individual do
							dia a dia.
						</Text>
					</YStack>
				</XStack>
			</Box>

			{/* Lista de veículos adicionados */}
			{dados.map((v) => (
				<ItemAdicionado
					key={v.id}
					item={v}
					unidade="km/mês"
					onRemove={() => onChange(dados.filter((x) => x.id !== v.id))}
				/>
			))}

			{/* Botão adicionar */}
			<TouchableOpacity
				style={styles.addOutlineBtn}
				onPress={() => setModalVisivel(true)}
				activeOpacity={0.8}
			>
				<Text
					color={PRIMARY}
					fontSize={13}
					fontWeight="800"
					fontFamily="$label"
					letterSpacing={0.5}
				>
					+ ADICIONAR VEÍCULO
				</Text>
			</TouchableOpacity>

			{/* Aviso */}
			<XStack
				borderLeftWidth={3}
				borderLeftColor={PRIMARY}
				paddingLeft={12}
				paddingVertical={10}
				marginTop={14}
				backgroundColor="#1a1f18"
				borderRadius={8}
			>
				<AlertCircle
					size={14}
					color="#8f8f8f"
					style={{ marginTop: 1, marginRight: 8 }}
				/>
				<Text color="#8f8f8f" fontSize={12} flex={1} lineHeight={18}>
					Este cálculo utiliza os fatores de emissão atualizados para os
					diferentes meios de transporte.
				</Text>
			</XStack>

			<ModalAdicionar
				visivel={modalVisivel}
				titulo="Adicionar Veículo"
				tipoLabel="Meio de Transporte"
				opcoesTipo={opcoes}
				kmLabel="Quilometragem mensal (km)"
				onSalvar={adicionar}
				onFechar={() => setModalVisivel(false)}
			/>
		</Animated.View>
	);
}

// ─── Passo: Transporte Coletivo ───────────────────────────────────────────────
interface PassoColetivoProps {
	dados: Veiculo[];
	onChange: (d: Veiculo[]) => void;
}
function PassoColetivo({ dados, onChange }: PassoColetivoProps) {
	const [modalVisivel, setModalVisivel] = useState(false);

	const adicionar = (tipo: string, km: string) => {
		const match = veiculosC.find((v) => v.veiculo === tipo);
		const co2Factor = match ? match.co2 : 0;
		const calculatedCo2 = (Number(km) * co2Factor) / 1000 / 1000;
		const co2 = calculatedCo2 * 12;
		onChange([...dados, { id: Date.now().toString(), tipo, km, co2 }]);
		setModalVisivel(false);
	};

	const opcoes = veiculosC.filter((v) => v.id !== 0).map((v) => v.veiculo);

	return (
		<Animated.View entering={SlideInRight.damping(14)} key="col">
			<Box
				backgroundColor="$backgroundHover"
				borderRadius={16}
				borderWidth={1}
				borderColor="$borderColor"
				padding={16}
				marginBottom={16}
			>
				<XStack alignItems="center" gap={12} marginBottom={10}>
					<Box
						backgroundColor="#1a1a2a"
						borderRadius={10}
						width={40}
						height={40}
						alignItems="center"
						justifyContent="center"
					>
						<Bus size={20} color={PRIMARY} />
					</Box>
					<YStack flex={1}>
						<Text
							color="$color"
							fontSize={scale(4.5)}
							fontWeight="900"
							fontFamily="$heading"
						>
							FATOR DE EMISSÃO: COLETIVO
						</Text>
						<Text color="#8f8f8f" fontSize={12} marginTop={2}>
							Insira as informações mensais sobre o seu transporte coletivo do
							dia a dia.
						</Text>
					</YStack>
				</XStack>
			</Box>

			{dados.map((v) => (
				<ItemAdicionado
					key={v.id}
					item={v}
					unidade="km/mês"
					onRemove={() => onChange(dados.filter((x) => x.id !== v.id))}
				/>
			))}

			<TouchableOpacity
				style={styles.addOutlineBtn}
				onPress={() => setModalVisivel(true)}
				activeOpacity={0.8}
			>
				<Text
					color={PRIMARY}
					fontSize={13}
					fontWeight="800"
					fontFamily="$label"
					letterSpacing={0.5}
				>
					+ ADICIONAR TRANSPORTE
				</Text>
			</TouchableOpacity>

			<XStack
				borderLeftWidth={3}
				borderLeftColor={PRIMARY}
				paddingLeft={12}
				paddingVertical={10}
				marginTop={14}
				backgroundColor="#1a1f18"
				borderRadius={8}
			>
				<AlertCircle
					size={14}
					color="#8f8f8f"
					style={{ marginTop: 1, marginRight: 8 }}
				/>
				<Text color="#8f8f8f" fontSize={12} flex={1} lineHeight={18}>
					Este cálculo utiliza os fatores de emissão atualizados para os
					diferentes meios de transporte coletivo.
				</Text>
			</XStack>

			<ModalAdicionar
				visivel={modalVisivel}
				titulo="Adicionar Transporte"
				tipoLabel="Meio de Transporte Coletivo"
				opcoesTipo={opcoes}
				kmLabel="Distância mensal (km)"
				onSalvar={adicionar}
				onFechar={() => setModalVisivel(false)}
			/>
		</Animated.View>
	);
}

// ─── Passo: Dieta ─────────────────────────────────────────────────────────────
interface PassoDietaProps {
	dados: number;
	onChange: (d: number) => void;
}
function PassoDieta({ dados, onChange }: PassoDietaProps) {
	return (
		<Animated.View entering={SlideInRight.damping(14)} key="dieta">
			<Box
				backgroundColor="$backgroundHover"
				borderRadius={16}
				borderWidth={1}
				borderColor="$borderColor"
				padding={16}
				marginBottom={16}
			>
				<XStack alignItems="center" gap={12} marginBottom={10}>
					<Box
						backgroundColor="#2a1a2a"
						borderRadius={10}
						width={40}
						height={40}
						alignItems="center"
						justifyContent="center"
					>
						<Utensils size={20} color="#f472b6" />
					</Box>
					<YStack flex={1}>
						<Text
							color="$color"
							fontSize={scale(4.5)}
							fontWeight="900"
							fontFamily="$heading"
						>
							FATOR DE EMISSÃO: DIETA
						</Text>
						<Text color="#8f8f8f" fontSize={12} marginTop={2}>
							Escolha o tipo de consumo que melhor define a sua dieta do dia a
							dia.
						</Text>
					</YStack>
				</XStack>
			</Box>

			<Seletor
				label="TIPO DE CONSUMO"
				valor={food.find((f) => f.co2 === dados)?.fod || ""}
				opcoes={food.map((f) => f.fod)}
				onChange={(v) => {
					const selected = food.find((f) => f.fod === v);
					if (selected) onChange(selected.co2);
				}}
			/>
		</Animated.View>
	);
}

// ─── Tela principal ───────────────────────────────────────────────────────────
export default function CalculadoraScreen() {
	const { user } = useAuth();
	const mutate = useMutate(["calculadora", "metricas"]);
	const [isResumoModalVisivel, setResumoModalVisivel] = useState(false);
	const [salvando, setSalvando] = useState(false);

	const salvarDados = async () => {
		if (total === 0) return;
		setSalvando(true);
		try {
			await mutate.mutateAsync({
				url: "/calculadora/register",
				method: "POST",
				data: {
					gas: porCategoria[1],
					eletricidade: porCategoria[0],
					transporte_individual: porCategoria[2],
					transporte_coletivo: porCategoria[3],
					alimentacao: porCategoria[4],
					residuos: porCategoria[4],
					userId: user?.id,
				},
			});
			setResumoModalVisivel(true);
		} catch (error) {
			console.log("Erro ao salvar", error);
		} finally {
			setSalvando(false);
		}
	};

	const insets = useSafeAreaInsets();
	const tabScrollRef = useRef<ScrollView>(null);
	const [passo, setPasso] = useState<Passo>(0);
	const [dados, setDados] = useState<DadosCalc>({
		eletricidade: { tipo: "kWh/mês", valor: "" },
		gas: { tipo: "m³/mês", valor: "" },
		veiculos: [],
		coletivo: [],
		dieta: 0,
	});

	const { total, porCategoria } = calcularTotal(dados);

	const irPara = (p: Passo) => {
		setPasso(p);
		tabScrollRef.current?.scrollTo({ x: p * 90, animated: true });
	};

	const proxima = () => {
		if (passo < 4) irPara((passo + 1) as Passo);
	};

	const limpar = () => {
		setDados({
			eletricidade: { tipo: "kWh/mês", valor: "" },
			gas: { tipo: "m³/mês", valor: "" },
			veiculos: [],
			coletivo: [],
			dieta: "",
		});
	};

	return (
		<Container backgroundColor="$background">
			{/* ── Abas de categoria ────────────────────────────────────── */}
			<Box
				backgroundColor="$backgroundHover"
				borderBottomWidth={1}
				borderBottomColor="$borderColor"
				paddingTop={insets.top + 8}
			>
				<ScrollView
					ref={tabScrollRef}
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={styles.tabsContainer}
				>
					{ABAS.map((aba) => {
						const ativa = passo === aba.id;
						return (
							<TouchableOpacity
								key={aba.id}
								onPress={() => irPara(aba.id as Passo)}
								style={styles.tabItem}
								activeOpacity={0.7}
							>
								<Text
									color={ativa ? PRIMARY : "#8f8f8f"}
									fontSize={11}
									fontWeight={ativa ? "800" : "500"}
									fontFamily="$label"
									letterSpacing={0.5}
								>
									{aba.label}
								</Text>
								{ativa && (
									<Animated.View
										entering={FadeIn.duration(200)}
										style={styles.tabIndicator}
									/>
								)}
							</TouchableOpacity>
						);
					})}
				</ScrollView>
			</Box>

			{/* ── Conteúdo scrollável ───────────────────────────────────── */}
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === "ios" ? "padding" : undefined}
			>
				<ScrollView
					showsVerticalScrollIndicator={false}
					keyboardShouldPersistTaps="handled"
					contentContainerStyle={{
						padding: 16,
						paddingBottom: insets.bottom + 24,
					}}
				>
					{/* ── Painel de impacto ─────────────────────────────── */}
					<ImpactoPainel total={total} porCategoria={porCategoria} />

					{/* ── Formulário do passo atual ─────────────────────── */}
					{passo === 0 && (
						<PassoEletricidade
							dados={dados.eletricidade}
							onChange={(d) => setDados({ ...dados, eletricidade: d })}
						/>
					)}
					{passo === 1 && (
						<PassoGas
							dados={dados.gas}
							onChange={(d) => setDados({ ...dados, gas: d })}
						/>
					)}
					{passo === 2 && (
						<PassoVeiculos
							dados={dados.veiculos}
							onChange={(d) => setDados({ ...dados, veiculos: d })}
						/>
					)}
					{passo === 3 && (
						<PassoColetivo
							dados={dados.coletivo}
							onChange={(d) => setDados({ ...dados, coletivo: d })}
						/>
					)}
					{passo === 4 && (
						<PassoDieta
							dados={dados.dieta}
							onChange={(d) => setDados({ ...dados, dieta: d })}
						/>
					)}

					{/* ── Botões de ação ─────────────────────────────────── */}
					<Animated.View
						entering={FadeInUp.delay(300).damping(14)}
						style={styles.botoesRow}
					>
						<TouchableOpacity
							style={styles.btnLimpar}
							onPress={limpar}
							activeOpacity={0.7}
						>
							<Text
								color="#8f8f8f"
								fontSize={12}
								fontWeight="800"
								fontFamily="$label"
								letterSpacing={0.5}
							>
								LIMPAR
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.btnProxima}
							onPress={proxima}
							activeOpacity={0.7}
							disabled={passo === 4}
						>
							<Text
								color={passo === 4 ? "#3a4047" : PRIMARY}
								fontSize={12}
								fontWeight="800"
								fontFamily="$label"
								letterSpacing={0.5}
							>
								PRÓXIMA
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={[styles.btnSalvar, { backgroundColor: PRIMARY, opacity: salvando ? 0.7 : 1 }]}
							activeOpacity={0.85}
							onPress={salvarDados}
							disabled={salvando}
						>
							<Text
								color="#000"
								fontSize={12}
								fontWeight="800"
								fontFamily="$label"
								letterSpacing={0.5}
							>
								{salvando ? "SALVANDO..." : "SALVAR"}
							</Text>
						</TouchableOpacity>
					</Animated.View>
				</ScrollView>
			</KeyboardAvoidingView>

			{/* Modal de Resumo */}
			<Modal
				visible={isResumoModalVisivel}
				transparent
				animationType="fade"
				onRequestClose={() => setResumoModalVisivel(false)}
			>
				<Pressable style={styles.modalOverlay} onPress={() => {}}>
					<Animated.View
						entering={FadeInUp.damping(16)}
						style={styles.modalBox}
					>
						<XStack justifyContent="space-between" alignItems="center" marginBottom={20}>
							<Text color="$color" fontSize={scale(5)} fontWeight="900" fontFamily="$heading">
								Resumo Salvo!
							</Text>
							<TouchableOpacity onPress={() => setResumoModalVisivel(false)}>
								<X size={20} color="#8f8f8f" />
							</TouchableOpacity>
						</XStack>
						
						<YStack gap={10} marginBottom={20}>
							<Text color="#8f8f8f" fontSize={14}>
								Seus dados de emissão foram salvos com sucesso.
							</Text>
							<Text color="$color" fontSize={16} fontWeight="bold">
								Total: {total.toFixed(4).replace(".", ",")} tCO₂
							</Text>
						</YStack>

						<TouchableOpacity
							style={[styles.addBtn, { backgroundColor: PRIMARY }]}
							onPress={() => {
								setResumoModalVisivel(false);
								router.replace("/(private)");
							}}
							activeOpacity={0.85}
						>
							<Text color="#000" fontSize={13} fontWeight="800" fontFamily="$label" letterSpacing={0.8}>
								VOLTAR PARA HOME
							</Text>
						</TouchableOpacity>
					</Animated.View>
				</Pressable>
			</Modal>
		</Container>
	);
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
	tabsContainer: {
		paddingHorizontal: 16,
		paddingBottom: 0,
		gap: 4,
	},
	tabItem: {
		paddingHorizontal: 14,
		paddingVertical: 12,
		alignItems: "center",
		position: "relative",
	},
	tabIndicator: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		height: 2,
		backgroundColor: "#C1FF00",
		borderRadius: 1,
	},
	seletor: {
		flexDirection: "row",
		alignItems: "center",
		borderWidth: 1,
		borderRadius: 10,
		paddingHorizontal: 14,
		paddingVertical: 14,
		backgroundColor: "#1E2328",
	},
	seletorDropdown: {
		backgroundColor: "#1E2328",
		borderRadius: 10,
		borderWidth: 1,
		borderColor: "#C1FF00",
		overflow: "hidden",
		marginTop: -3,
		height: scaleH(30),
	},
	seletorOpcao: {
		paddingHorizontal: 14,
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: "#2a3037",
	},
	textInput: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "400",
		padding: 0,
		margin: 0,
	},
	addOutlineBtn: {
		borderWidth: 1,
		borderColor: "#3a4047",
		borderRadius: 10,
		paddingVertical: 16,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 8,
	},
	addBtn: {
		borderRadius: 10,
		paddingVertical: 16,
		alignItems: "center",
		justifyContent: "center",
		marginTop: 8,
	},
	botoesRow: {
		flexDirection: "row",
		gap: 10,
		marginTop: 20,
	},
	btnLimpar: {
		flex: 1,
		borderWidth: 1,
		borderColor: "#3a4047",
		borderRadius: 10,
		paddingVertical: 15,
		alignItems: "center",
		justifyContent: "center",
	},
	btnProxima: {
		flex: 1.2,
		borderWidth: 1,
		borderColor: "#3a4047",
		borderRadius: 10,
		paddingVertical: 15,
		alignItems: "center",
		justifyContent: "center",
	},
	btnSalvar: {
		flex: 1.4,
		borderRadius: 10,
		paddingVertical: 15,
		alignItems: "center",
		justifyContent: "center",
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.7)",
		justifyContent: "center",
		alignItems: "center",
		padding: 24,
	},
	modalBox: {
		backgroundColor: "#111418",
		borderRadius: 20,
		padding: 24,
		width: SW - 48,
		borderWidth: 1,
		borderColor: "#2a3037",
	},
	neutralizarBtn: {
		marginTop: 16,
		paddingVertical: 14,
		borderTopWidth: 1,
		borderTopColor: "#2a3037",
		alignItems: "center",
	},
});
