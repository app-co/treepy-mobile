import { useAuth } from "@/context/AuthContext";
import type { IMetricaUsuario } from "@/dtos/interfaces";
import { MetricasAPI, PrecificacaoAPI, TransactionAPI } from "@/services/endpoints";
import { router } from "expo-router";
import {
	AlertCircle,
	ArrowLeft,
	CheckCircle2,
	ChevronDown,
	ChevronUp,
	CreditCard,
	Leaf,
	QrCode,
	ShoppingCart,
	Target,
	TrendingUp,
	Zap,
} from "lucide-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	TextInput,
	TouchableOpacity,
} from "react-native";
import Animated, {
	Easing,
	FadeIn,
	FadeInDown,
	FadeInUp,
	FadeOut,
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withSequence,
	withSpring,
	withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme, XStack, YStack } from "tamagui";
import { scale } from "../../../../tamagui.config";
import { Box, Container, Text } from "../../../components/ui/Layout";

// ─── Constantes ──────────────────────────────────────────────────────────────
const PRIMARY = "#C1FF00";
const CARD_COLOR = "#1c6fff";

// ─── Tipos ───────────────────────────────────────────────────────────────────
type MetodoPagamento = "pix" | "cartao";

interface FormCartao {
	holderName: string;
	cardNumber: string;
	expiryMonth: string;
	expiryYear: string;
	cvv: string;
	cpfCnpj: string;
	postalCode: string;
	addressNumber: string;
	phone: string;
}

interface PixResponse {
	encodedImage?: string;
	payload?: string;
	expirationDate?: string;
}

// ─── Utilitários de formatação ────────────────────────────────────────────────
function formatarCartao(v: string) {
	return v
		.replace(/\D/g, "")
		.slice(0, 16)
		.replace(/(.{4})/g, "$1 ")
		.trim();
}

function formatarCPF(v: string) {
	const digits = v.replace(/\D/g, "").slice(0, 11);
	return digits
		.replace(/(\d{3})(\d)/, "$1.$2")
		.replace(/(\d{3})(\d)/, "$1.$2")
		.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function formatarCEP(v: string) {
	return v.replace(/\D/g, "").slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2");
}

function formatarTelefone(v: string) {
	const digits = v.replace(/\D/g, "").slice(0, 11);
	if (digits.length <= 10)
		return digits.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
	return digits.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
}

function formatarValor(v: number) {
	return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// ─── Hook: animação de entrada dos steps ─────────────────────────────────────
function useStepAnimation() {
	const y = useSharedValue(40);
	const opacity = useSharedValue(0);

	const play = useCallback(() => {
		y.value = withSpring(0, { damping: 14, stiffness: 120 });
		opacity.value = withTiming(1, { duration: 350 });
	}, [opacity, y]);

	const style = useAnimatedStyle(() => ({
		transform: [{ translateY: y.value }],
		opacity: opacity.value,
	}));

	return { style, play };
}

// ─── Componente: Barra de progresso da meta ──────────────────────────────────
function ProgressoMeta({
	meta,
	atingida,
	porcentagem,
}: {
	meta: number;
	atingida: number;
	porcentagem: string;
}) {
	const width = useSharedValue(0);
	const pct = Math.min(Math.max(parseFloat(porcentagem) || 0, 0), 100);

	useEffect(() => {
		width.value = withDelay(
			300,
			withTiming(pct, { duration: 1200, easing: Easing.out(Easing.quad) }),
		);
	}, [width, pct]);

	const barStyle = useAnimatedStyle(() => ({
		width: `${width.value}%`,
		height: 6,
		backgroundColor: PRIMARY,
		borderRadius: 3,
	}));

	return (
		<YStack gap={8}>
			<XStack justifyContent="space-between" alignItems="center">
				<Text color="#8f8f8f" fontSize={12} fontWeight="500">
					Progresso da meta
				</Text>
				<Text color={PRIMARY} fontSize={12} fontWeight="700" fontFamily="$label">
					{porcentagem}%
				</Text>
			</XStack>
			<Box
				backgroundColor="$backgroundPress"
				borderRadius={3}
				height={6}
				overflow="hidden"
			>
				<Animated.View style={barStyle} />
			</Box>
			<XStack justifyContent="space-between">
				<Text color="#8f8f8f" fontSize={11}>
					Compensado: <Text color="$color" fontWeight="700">{atingida} kg CO₂</Text>
				</Text>
				<Text color="#8f8f8f" fontSize={11}>
					Meta: <Text color="$color" fontWeight="700">{meta} kg CO₂</Text>
				</Text>
			</XStack>
		</YStack>
	);
}

// ─── Componente: Seletor de quantidade ───────────────────────────────────────
interface SeletorQuantidadeProps {
	quantidade: number;
	onMenos: () => void;
	onMais: () => void;
	precoUnitario: number;
}

function SeletorQuantidade({
	quantidade,
	onMenos,
	onMais,
	precoUnitario,
}: SeletorQuantidadeProps) {
	const scaleVal = useSharedValue(1);

	function pulsar() {
		scaleVal.value = withSequence(
			withTiming(1.08, { duration: 80 }),
			withSpring(1, { damping: 8 }),
		);
	}

	const animStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scaleVal.value }],
	}));

	return (
		<YStack gap={12}>
			<Text color="#8f8f8f" fontSize={11} fontWeight="700" letterSpacing={1.2} fontFamily="$label">
				QUANTIDADE DE TREEPYCASHES
			</Text>
			<XStack alignItems="center" justifyContent="space-between">
				<TouchableOpacity
					onPress={() => {
						onMenos();
						pulsar();
					}}
					style={styles.btnQtd}
					activeOpacity={0.8}
				>
					<ChevronDown size={22} color={PRIMARY} />
				</TouchableOpacity>

				<Animated.View style={[animStyle, styles.qtdContainer]}>
					<Text color={PRIMARY} fontSize={42} fontWeight="900" fontFamily="$heading" letterSpacing={-2}>
						{quantidade}
					</Text>
					<Text color="#8f8f8f" fontSize={12} fontFamily="$label">
						treepycashes
					</Text>
				</Animated.View>

				<TouchableOpacity
					onPress={() => {
						onMais();
						pulsar();
					}}
					style={styles.btnQtd}
					activeOpacity={0.8}
				>
					<ChevronUp size={22} color={PRIMARY} />
				</TouchableOpacity>
			</XStack>

			<Box
				backgroundColor="$backgroundPress"
				borderRadius={12}
				padding={12}
			>
				<XStack justifyContent="space-between" alignItems="center">
					<Text color="#8f8f8f" fontSize={13}>
						Valor unitário
					</Text>
					<Text color="$color" fontWeight="700" fontSize={13} fontFamily="$label">
						{formatarValor(precoUnitario)}
					</Text>
				</XStack>
				<XStack justifyContent="space-between" alignItems="center" marginTop={8}>
					<Text color="#8f8f8f" fontSize={13}>
						Total
					</Text>
					<Text color={PRIMARY} fontWeight="900" fontSize={20} fontFamily="$heading">
						{formatarValor(quantidade * precoUnitario)}
					</Text>
				</XStack>
			</Box>
		</YStack>
	);
}

// ─── Componente: Campo do formulário de cartão ────────────────────────────────
interface CampoCartaoProps {
	label: string;
	value: string;
	onChange: (v: string) => void;
	placeholder?: string;
	keyboardType?: "default" | "numeric" | "phone-pad";
	maxLength?: number;
	secureTextEntry?: boolean;
	formatFn?: (v: string) => string;
}

function CampoCartao({
	label,
	value,
	onChange,
	placeholder,
	keyboardType = "default",
	maxLength,
	secureTextEntry,
	formatFn,
}: CampoCartaoProps) {
	const [focused, setFocused] = useState(false);
	const borderFocused = useSharedValue(0);

	const handleFocus = () => {
		setFocused(true);
		borderFocused.value = withTiming(1, { duration: 200 });
	};
	const handleBlur = () => {
		setFocused(false);
		borderFocused.value = withTiming(0, { duration: 200 });
	};

	return (
		<YStack gap={6}>
			<Text color="#8f8f8f" fontSize={12} fontWeight="600">
				{label}
			</Text>
			<Box
				borderWidth={1}
				borderColor={focused ? PRIMARY : "$borderColor"}
				borderRadius={10}
				height={50}
				paddingHorizontal={14}
				justifyContent="center"
				backgroundColor="$backgroundHover"
			>
				<TextInput
					value={value}
					onChangeText={(t) => onChange(formatFn ? formatFn(t) : t)}
					placeholder={placeholder}
					placeholderTextColor="#6b737b"
					keyboardType={keyboardType}
					maxLength={maxLength}
					secureTextEntry={secureTextEntry}
					onFocus={handleFocus}
					onBlur={handleBlur}
					style={styles.textInput}
				/>
			</Box>
		</YStack>
	);
}

// ─── Componente: Resumo da meta ───────────────────────────────────────────────
interface ResumoMetaProps {
	metrics: IMetricaUsuario | null;
	quantidadeAtual: number;
	loading: boolean;
}

function ResumoMeta({ metrics, quantidadeAtual, loading }: ResumoMetaProps) {
	const meta = metrics?.compensacao?.meta ?? 0;
	const co2Anual = metrics?.compensacao?.co2Anual ?? 0;
	const atingida = metrics?.compensacao?.metaAtingida ?? 0;
	const treepyAtivos = metrics?.compensacao?.treepy ?? 0;
	const porcentagem = metrics?.compensacao?.porcentagemAtingida ?? "0";

	// Cada treepycash compensa ~10kg CO₂ (aproximação)
	const CO2_POR_TREEPYCASH = co2Anual > 0 && meta > 0 ? meta / Math.max(treepyAtivos, 1) : 10;
	const co2Extra = quantidadeAtual * CO2_POR_TREEPYCASH;
	const novaPct = meta > 0 ? Math.min(((atingida + co2Extra) / meta) * 100, 100) : 0;
	const faltam = Math.max(meta - atingida, 0);
	const treepyCashesNecessarios = faltam > 0 ? Math.ceil(faltam / CO2_POR_TREEPYCASH) : 0;

	if (loading) {
		return (
			<Box
				backgroundColor="$backgroundHover"
				borderRadius={20}
				borderWidth={1}
				borderColor="$borderColor"
				padding={20}
				alignItems="center"
				justifyContent="center"
				height={160}
			>
				<ActivityIndicator color={PRIMARY} />
				<Text color="#8f8f8f" fontSize={13} marginTop={10}>
					Carregando dados da meta...
				</Text>
			</Box>
		);
	}

	if (!metrics) {
		return (
			<Box
				backgroundColor="$backgroundHover"
				borderRadius={20}
				borderWidth={1}
				borderColor="$borderColor"
				padding={20}
				alignItems="center"
				gap={8}
			>
				<AlertCircle size={28} color="#8f8f8f" />
				<Text color="#8f8f8f" fontSize={14} textAlign="center">
					Calcule sua pegada de carbono para ver o resumo da meta.
				</Text>
			</Box>
		);
	}

	return (
		<Animated.View entering={FadeInDown.delay(100).damping(14)}>
			<Box
				backgroundColor="$backgroundHover"
				borderRadius={20}
				borderWidth={1}
				borderColor="$borderColor"
				padding={20}
			>
				{/* Cabeçalho */}
				<XStack alignItems="center" gap={10} marginBottom={16}>
					<Box
						backgroundColor="$backgroundPress"
						borderRadius={10}
						width={38}
						height={38}
						alignItems="center"
						justifyContent="center"
					>
						<Target size={20} color={PRIMARY} />
					</Box>
					<YStack>
						<Text color="$color" fontSize={15} fontWeight="700">
							Resumo da Meta
						</Text>
						<Text color="#8f8f8f" fontSize={12}>
							Compensação de CO₂ anual
						</Text>
					</YStack>
				</XStack>

				{/* Progresso atual */}
				<ProgressoMeta
					meta={meta}
					atingida={atingida}
					porcentagem={porcentagem}
				/>

				{/* Divisor */}
				<Box
					height={1}
					backgroundColor="$borderColor"
					marginVertical={16}
					opacity={0.5}
				/>

				{/* Treepycashes para suprir a meta */}
				<YStack gap={10}>
					<XStack alignItems="center" gap={8}>
						<Leaf size={16} color={PRIMARY} />
						<Text color="#8f8f8f" fontSize={12} fontWeight="600">
							Para atingir 100% da meta
						</Text>
					</XStack>

					<Box
						backgroundColor="$backgroundPress"
						borderRadius={12}
						padding={14}
					>
						{treepyCashesNecessarios > 0 ? (
							<XStack justifyContent="space-between" alignItems="center">
								<YStack>
									<Text color="#8f8f8f" fontSize={12}>
										Treepycashes necessários
									</Text>
									<Text color={PRIMARY} fontSize={26} fontWeight="900" fontFamily="$heading">
										{treepyCashesNecessarios}
									</Text>
								</YStack>
								<YStack alignItems="flex-end">
									<Text color="#8f8f8f" fontSize={12}>
										CO₂ faltando
									</Text>
									<Text color="$color" fontSize={16} fontWeight="700">
										~{faltam.toFixed(0)} kg
									</Text>
								</YStack>
							</XStack>
						) : (
							<XStack alignItems="center" gap={8}>
								<CheckCircle2 size={20} color={PRIMARY} />
								<Text color={PRIMARY} fontSize={14} fontWeight="700">
									Meta 100% atingida! 🎉
								</Text>
							</XStack>
						)}
					</Box>

					{/* Preview com a quantidade selecionada */}
					{quantidadeAtual > 0 && (
						<Animated.View entering={FadeIn.duration(300)}>
							<Box
								backgroundColor="$backgroundPress"
								borderRadius={12}
								padding={12}
								borderWidth={1}
								borderColor={PRIMARY}
								opacity={0.9}
							>
								<XStack alignItems="center" gap={6} marginBottom={6}>
									<TrendingUp size={14} color={PRIMARY} />
									<Text color={PRIMARY} fontSize={11} fontWeight="700" fontFamily="$label">
										SIMULAÇÃO DA COMPRA
									</Text>
								</XStack>
								<XStack justifyContent="space-between">
									<Text color="#8f8f8f" fontSize={12}>
										+{co2Extra.toFixed(0)} kg CO₂ compensado
									</Text>
									<Text color={PRIMARY} fontSize={12} fontWeight="700">
										{novaPct.toFixed(1)}% da meta
									</Text>
								</XStack>
							</Box>
						</Animated.View>
					)}
				</YStack>
			</Box>
		</Animated.View>
	);
}

// ─── Componente: Resultado PIX ────────────────────────────────────────────────
function ResultadoPix({ pixData, onVoltar }: { pixData: PixResponse; onVoltar: () => void }) {
	const [copiado, setCopiado] = useState(false);

	function copiarChave() {
		// Em produção usar Clipboard.setStringAsync(pixData.payload ?? "")
		setCopiado(true);
		setTimeout(() => setCopiado(false), 3000);
	}

	return (
		<Animated.View entering={FadeInUp.delay(100).damping(14)} style={{ gap: 16 }}>
			<Box
				backgroundColor="$backgroundHover"
				borderRadius={20}
				borderWidth={1}
				borderColor={PRIMARY}
				padding={24}
				alignItems="center"
				gap={16}
			>
				<Box
					width={64}
					height={64}
					borderRadius={32}
					backgroundColor="$backgroundPress"
					alignItems="center"
					justifyContent="center"
				>
					<QrCode size={32} color={PRIMARY} />
				</Box>

				<YStack alignItems="center" gap={4}>
					<Text color="$color" fontSize={18} fontWeight="900" fontFamily="$heading">
						PIX gerado com sucesso!
					</Text>
					<Text color="#8f8f8f" fontSize={13} textAlign="center">
						Escaneie o QR Code ou copie a chave para efetuar o pagamento.
					</Text>
				</YStack>

				{pixData.payload && (
					<Box
						backgroundColor="$backgroundPress"
						borderRadius={12}
						padding={14}
						width="100%"
					>
						<Text
							color="#8f8f8f"
							fontSize={11}
							numberOfLines={2}
							fontFamily="$label"
							textAlign="center"
						>
							{pixData.payload.slice(0, 80)}...
						</Text>
					</Box>
				)}

				<TouchableOpacity
					style={[styles.btnCopiar, { backgroundColor: copiado ? "#22c55e" : PRIMARY }]}
					onPress={copiarChave}
					activeOpacity={0.85}
				>
					<Text color="#000" fontWeight="700" fontSize={15}>
						{copiado ? "✓ Chave copiada!" : "Copiar chave PIX"}
					</Text>
				</TouchableOpacity>

				{pixData.expirationDate && (
					<Text color="#8f8f8f" fontSize={12} textAlign="center">
						Expira em: {new Date(pixData.expirationDate).toLocaleString("pt-BR")}
					</Text>
				)}
			</Box>

			<TouchableOpacity style={styles.btnVoltar} onPress={onVoltar} activeOpacity={0.8}>
				<Text color="$color" fontWeight="600" fontSize={15} textAlign="center">
					Fazer outra compra
				</Text>
			</TouchableOpacity>
		</Animated.View>
	);
}

// ─── Tela principal ───────────────────────────────────────────────────────────
export default function ComprarTreepycashesScreen() {
	const theme = useTheme();
	const insets = useSafeAreaInsets();
	const { user } = useAuth();
	const scrollRef = useRef<ScrollView>(null);

	// Estado global
	const [metodo, setMetodo] = useState<MetodoPagamento>("pix");
	const [quantidade, setQuantidade] = useState(1);
	const [metrics, setMetrics] = useState<IMetricaUsuario | null>(null);
	const [precoUnitario, setPrecoUnitario] = useState(0);
	const [loadingMetrics, setLoadingMetrics] = useState(true);
	const [loadingCompra, setLoadingCompra] = useState(false);
	const [pixResult, setPixResult] = useState<PixResponse | null>(null);
	const [compraConcluida, setCompraConcluida] = useState(false);

	// Formulário cartão
	const [cartao, setCartao] = useState<FormCartao>({
		holderName: "",
		cardNumber: "",
		expiryMonth: "",
		expiryYear: "",
		cvv: "",
		cpfCnpj: "",
		postalCode: "",
		addressNumber: "",
		phone: "",
	});

	// Animação do seletor de método
	const tabIndicator = useSharedValue(0);
	const tabStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: tabIndicator.value }],
	}));

	function selecionarMetodo(m: MetodoPagamento) {
		setMetodo(m);
		tabIndicator.value = withSpring(m === "pix" ? 0 : 1, {
			damping: 15,
			stiffness: 200,
		});
	}

	// Carregar dados
	useEffect(() => {
		async function carregar() {
			try {
				const [resMetrics, resPreco] = await Promise.all([
					MetricasAPI.getUserMetrics(),
					PrecificacaoAPI.get(),
				]);
				setMetrics(resMetrics.data);
				setPrecoUnitario(resPreco.data?.price ?? 10);
			} catch {
				// silent
			} finally {
				setLoadingMetrics(false);
			}
		}
		carregar();
	}, []);

	function alterarQuantidade(delta: number) {
		setQuantidade((q) => Math.max(1, Math.min(q + delta, 999)));
	}

	function atualizarCartao(campo: keyof FormCartao, valor: string) {
		setCartao((prev) => ({ ...prev, [campo]: valor }));
	}

	function validarCartao(): string | null {
		const card = cartao.cardNumber.replace(/\s/g, "");
		if (!cartao.holderName.trim()) return "Informe o nome do titular.";
		if (card.length !== 16) return "Número do cartão inválido.";
		if (!cartao.expiryMonth || !cartao.expiryYear) return "Informe a validade.";
		if (cartao.cvv.length < 3) return "CVV inválido.";
		if (cartao.cpfCnpj.replace(/\D/g, "").length < 11) return "CPF/CNPJ inválido.";
		if (cartao.postalCode.replace(/\D/g, "").length !== 8) return "CEP inválido.";
		if (!cartao.addressNumber.trim()) return "Informe o número do endereço.";
		if (cartao.phone.replace(/\D/g, "").length < 10) return "Telefone inválido.";
		return null;
	}

	async function confirmarCompra() {
		if (!user) return;

		if (metodo === "cartao") {
			const erro = validarCartao();
			if (erro) {
				Alert.alert("Dados incompletos", erro);
				return;
			}
		}

		setLoadingCompra(true);
		try {
			const valorTotal = quantidade * precoUnitario;

			if (metodo === "pix") {
				const { data } = await TransactionAPI.pix({
					value: valorTotal,
					userId: user.nome, // ajustar para user.id se disponível
				});
				setPixResult(data);
			} else {
				const card = cartao.cardNumber.replace(/\s/g, "");
				await TransactionAPI.card({
					value: valorTotal,
					cardNumber: card,
					cvv: cartao.cvv,
					expiryYear: cartao.expiryYear,
					expiryMonth: cartao.expiryMonth,
					userId: user.nome,
					holderName: cartao.holderName,
					installmentCount: 1,
					installmentValue: valorTotal,
					cpfCnpj: cartao.cpfCnpj.replace(/\D/g, ""),
					postalCode: cartao.postalCode.replace(/\D/g, ""),
					addressNumber: cartao.addressNumber,
					phone: cartao.phone.replace(/\D/g, ""),
				});
				setCompraConcluida(true);
			}
		} catch (err: any) {
			const msg =
				err?.response?.data?.message ?? "Erro ao processar pagamento. Tente novamente.";
			Alert.alert("Erro no pagamento", msg);
		} finally {
			setLoadingCompra(false);
		}
	}

	function reiniciar() {
		setPixResult(null);
		setCompraConcluida(false);
		setQuantidade(1);
		setCartao({
			holderName: "",
			cardNumber: "",
			expiryMonth: "",
			expiryYear: "",
			cvv: "",
			cpfCnpj: "",
			postalCode: "",
			addressNumber: "",
			phone: "",
		});
		scrollRef.current?.scrollTo({ y: 0, animated: true });
	}

	const valorTotal = quantidade * precoUnitario;

	// ── Sucesso cartão ────────────────────────────────────────────────────────
	if (compraConcluida) {
		return (
			<Container backgroundColor="$background">
				<Box
					flex={1}
					alignItems="center"
					justifyContent="center"
					paddingHorizontal={24}
					gap={20}
				>
					<Animated.View entering={FadeInUp.delay(0).damping(12)}>
						<Box
							width={80}
							height={80}
							borderRadius={40}
							backgroundColor="$backgroundHover"
							alignItems="center"
							justifyContent="center"
							borderWidth={2}
							borderColor={PRIMARY}
						>
							<CheckCircle2 size={44} color={PRIMARY} />
						</Box>
					</Animated.View>

					<Animated.View entering={FadeInDown.delay(200).damping(14)} style={{ alignItems: "center", gap: 8 }}>
						<Text color="$color" fontSize={24} fontWeight="900" fontFamily="$heading" textAlign="center">
							Compra realizada!
						</Text>
						<Text color="#8f8f8f" fontSize={14} textAlign="center">
							{quantidade} treepycash{quantidade > 1 ? "es" : ""} adquirido{quantidade > 1 ? "s" : ""} com sucesso.
						</Text>
						<Text color={PRIMARY} fontSize={18} fontWeight="700" fontFamily="$label">
							{formatarValor(valorTotal)}
						</Text>
					</Animated.View>

					<Animated.View entering={FadeInUp.delay(400).damping(14)} style={{ width: "100%", gap: 12 }}>
						<TouchableOpacity
							style={[styles.btnConfirmar, { backgroundColor: PRIMARY }]}
							onPress={reiniciar}
							activeOpacity={0.85}
						>
							<Text color="#000" fontWeight="700" fontSize={16}>
								Fazer nova compra
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.btnVoltar}
							onPress={() => router.back()}
							activeOpacity={0.8}
						>
							<Text color="$color" fontWeight="600" fontSize={15} textAlign="center">
								Voltar ao início
							</Text>
						</TouchableOpacity>
					</Animated.View>
				</Box>
			</Container>
		);
	}

	return (
		<Container backgroundColor="$background">
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === "ios" ? "padding" : undefined}
			>
				<ScrollView
					ref={scrollRef}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{
						paddingTop: insets.top + 8,
						paddingBottom: insets.bottom + 32,
						paddingHorizontal: 20,
						gap: 20,
					}}
				>
					{/* ── Header ──────────────────────────────────────────────── */}
					<Animated.View entering={FadeInDown.delay(0).damping(16)}>
						<XStack alignItems="center" gap={12} marginBottom={4}>
							<TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
								<ArrowLeft size={22} color={theme.color?.val || "#fff"} />
							</TouchableOpacity>
							<YStack>
								<Text color="$color" fontSize={scale(6)} fontWeight="900" fontFamily="$heading">
									Comprar Treepycashes
								</Text>
								<Text color="#8f8f8f" fontSize={13}>
									Compense sua pegada de carbono
								</Text>
							</YStack>
						</XStack>
					</Animated.View>

					{/* ── Resumo da meta ──────────────────────────────────────── */}
					<ResumoMeta
						metrics={metrics}
						quantidadeAtual={quantidade}
						loading={loadingMetrics}
					/>

					{/* ── Seletor de quantidade ───────────────────────────────── */}
					<Animated.View entering={FadeInDown.delay(150).damping(14)}>
						<Box
							backgroundColor="$backgroundHover"
							borderRadius={20}
							borderWidth={1}
							borderColor="$borderColor"
							padding={20}
						>
							<SeletorQuantidade
								quantidade={quantidade}
								onMenos={() => alterarQuantidade(-1)}
								onMais={() => alterarQuantidade(1)}
								precoUnitario={precoUnitario}
							/>
						</Box>
					</Animated.View>

					{/* ── Seletor de método ───────────────────────────────────── */}
					<Animated.View entering={FadeInDown.delay(200).damping(14)}>
						<Box
							backgroundColor="$backgroundHover"
							borderRadius={20}
							borderWidth={1}
							borderColor="$borderColor"
							padding={20}
							gap={16}
						>
							<Text color="#8f8f8f" fontSize={11} fontWeight="700" letterSpacing={1.2} fontFamily="$label">
								MÉTODO DE PAGAMENTO
							</Text>

							{/* Toggle PIX / Cartão */}
							<Box
								backgroundColor="$backgroundPress"
								borderRadius={14}
								padding={4}
								flexDirection="row"
								position="relative"
							>
								{/* Indicador animado */}
								<Animated.View
									style={[
										styles.tabIndicator,
										{ backgroundColor: PRIMARY },
										tabStyle,
									]}
								/>
								<TouchableOpacity
									style={styles.tabBtn}
									onPress={() => selecionarMetodo("pix")}
									activeOpacity={0.8}
								>
									<XStack alignItems="center" gap={6}>
										<QrCode size={18} color={metodo === "pix" ? "#000" : "#8f8f8f"} />
										<Text
											color={metodo === "pix" ? "#000" : "#8f8f8f"}
											fontWeight="700"
											fontSize={14}
										>
											PIX
										</Text>
									</XStack>
								</TouchableOpacity>
								<TouchableOpacity
									style={styles.tabBtn}
									onPress={() => selecionarMetodo("cartao")}
									activeOpacity={0.8}
								>
									<XStack alignItems="center" gap={6}>
										<CreditCard size={18} color={metodo === "cartao" ? "#000" : "#8f8f8f"} />
										<Text
											color={metodo === "cartao" ? "#000" : "#8f8f8f"}
											fontWeight="700"
											fontSize={14}
										>
											Cartão
										</Text>
									</XStack>
								</TouchableOpacity>
							</Box>

							{/* PIX: resultado ou apenas info */}
							{metodo === "pix" && !pixResult && (
								<Animated.View entering={FadeIn.duration(300)} style={{ gap: 12 }}>
									<Box
										backgroundColor="$backgroundPress"
										borderRadius={14}
										padding={16}
										gap={10}
									>
										<XStack alignItems="center" gap={8}>
											<Zap size={16} color={PRIMARY} />
											<Text color="$color" fontSize={14} fontWeight="700">
												Pagamento instantâneo
											</Text>
										</XStack>
										<Text color="#8f8f8f" fontSize={13} lineHeight={20}>
											Ao confirmar, será gerado um QR Code e uma chave PIX para o pagamento de{" "}
											<Text color={PRIMARY} fontWeight="700">
												{formatarValor(valorTotal)}
											</Text>
											.
										</Text>
										<XStack gap={8} alignItems="flex-start">
											<CheckCircle2 size={14} color="#22c55e" style={{ marginTop: 2 }} />
											<Text color="#8f8f8f" fontSize={12}>Processamento em segundos</Text>
										</XStack>
										<XStack gap={8} alignItems="flex-start">
											<CheckCircle2 size={14} color="#22c55e" style={{ marginTop: 2 }} />
											<Text color="#8f8f8f" fontSize={12}>Sem taxas adicionais</Text>
										</XStack>
										<XStack gap={8} alignItems="flex-start">
											<CheckCircle2 size={14} color="#22c55e" style={{ marginTop: 2 }} />
											<Text color="#8f8f8f" fontSize={12}>Disponível 24h por dia</Text>
										</XStack>
									</Box>
								</Animated.View>
							)}

							{/* PIX: resultado */}
							{metodo === "pix" && pixResult && (
								<ResultadoPix pixData={pixResult} onVoltar={reiniciar} />
							)}

							{/* Cartão: formulário */}
							{metodo === "cartao" && (
								<Animated.View entering={FadeIn.duration(300)} style={{ gap: 14 }}>
									{/* Preview visual do cartão */}
									<Box
										backgroundColor={CARD_COLOR}
										borderRadius={18}
										padding={20}
										height={160}
										justifyContent="space-between"
										overflow="hidden"
									>
										<XStack justifyContent="space-between" alignItems="center">
											<YStack>
												<Text color="rgba(255,255,255,0.7)" fontSize={11} fontFamily="$label">
													TREEPY
												</Text>
												<Text color="#fff" fontSize={16} fontWeight="900" fontFamily="$heading">
													Treepycash
												</Text>
											</YStack>
											<CreditCard size={28} color="rgba(255,255,255,0.8)" />
										</XStack>
										<YStack gap={4}>
											<Text color="rgba(255,255,255,0.7)" fontSize={12} fontFamily="$label" letterSpacing={2}>
												{cartao.cardNumber || "•••• •••• •••• ••••"}
											</Text>
											<XStack justifyContent="space-between" alignItems="center">
												<Text color="#fff" fontSize={13} fontWeight="600">
													{cartao.holderName || "NOME DO TITULAR"}
												</Text>
												<Text color="rgba(255,255,255,0.8)" fontSize={12} fontFamily="$label">
													{cartao.expiryMonth && cartao.expiryYear
														? `${cartao.expiryMonth}/${cartao.expiryYear}`
														: "MM/AA"}
												</Text>
											</XStack>
										</YStack>
									</Box>

									{/* Campos do cartão */}
									<CampoCartao
										label="Nome do titular"
										value={cartao.holderName}
										onChange={(v) => atualizarCartao("holderName", v.toUpperCase())}
										placeholder="Como está no cartão"
									/>
									<CampoCartao
										label="Número do cartão"
										value={cartao.cardNumber}
										onChange={(v) => atualizarCartao("cardNumber", formatarCartao(v))}
										placeholder="0000 0000 0000 0000"
										keyboardType="numeric"
										maxLength={19}
									/>
									<XStack gap={12}>
										<Box flex={1}>
											<CampoCartao
												label="Mês (MM)"
												value={cartao.expiryMonth}
												onChange={(v) => atualizarCartao("expiryMonth", v.replace(/\D/g, "").slice(0, 2))}
												placeholder="MM"
												keyboardType="numeric"
												maxLength={2}
											/>
										</Box>
										<Box flex={1}>
											<CampoCartao
												label="Ano (AA)"
												value={cartao.expiryYear}
												onChange={(v) => atualizarCartao("expiryYear", v.replace(/\D/g, "").slice(0, 2))}
												placeholder="AA"
												keyboardType="numeric"
												maxLength={2}
											/>
										</Box>
										<Box flex={1}>
											<CampoCartao
												label="CVV"
												value={cartao.cvv}
												onChange={(v) => atualizarCartao("cvv", v.replace(/\D/g, "").slice(0, 4))}
												placeholder="•••"
												keyboardType="numeric"
												maxLength={4}
												secureTextEntry
											/>
										</Box>
									</XStack>
									<CampoCartao
										label="CPF / CNPJ"
										value={cartao.cpfCnpj}
										onChange={(v) => atualizarCartao("cpfCnpj", formatarCPF(v))}
										placeholder="000.000.000-00"
										keyboardType="numeric"
										maxLength={14}
									/>
									<XStack gap={12}>
										<Box flex={2}>
											<CampoCartao
												label="CEP"
												value={cartao.postalCode}
												onChange={(v) => atualizarCartao("postalCode", formatarCEP(v))}
												placeholder="00000-000"
												keyboardType="numeric"
												maxLength={9}
											/>
										</Box>
										<Box flex={1}>
											<CampoCartao
												label="Número"
												value={cartao.addressNumber}
												onChange={(v) => atualizarCartao("addressNumber", v)}
												placeholder="123"
												keyboardType="numeric"
											/>
										</Box>
									</XStack>
									<CampoCartao
										label="Telefone"
										value={cartao.phone}
										onChange={(v) => atualizarCartao("phone", formatarTelefone(v))}
										placeholder="(00) 90000-0000"
										keyboardType="phone-pad"
										maxLength={15}
									/>
								</Animated.View>
							)}
						</Box>
					</Animated.View>

					{/* ── Resumo e botão de confirmar ────────────────────────── */}
					{!pixResult && (
						<Animated.View entering={FadeInUp.delay(300).damping(14)}>
							<Box
								backgroundColor="$backgroundHover"
								borderRadius={20}
								borderWidth={1}
								borderColor="$borderColor"
								padding={20}
								gap={16}
							>
								<Text color="#8f8f8f" fontSize={11} fontWeight="700" letterSpacing={1.2} fontFamily="$label">
									RESUMO DO PEDIDO
								</Text>

								<YStack gap={10}>
									<XStack justifyContent="space-between" alignItems="center">
										<XStack alignItems="center" gap={8}>
											<ShoppingCart size={16} color="#8f8f8f" />
											<Text color="#8f8f8f" fontSize={14}>
												{quantidade}x Treepycash
											</Text>
										</XStack>
										<Text color="$color" fontSize={14} fontWeight="600">
											{formatarValor(valorTotal)}
										</Text>
									</XStack>

									<XStack justifyContent="space-between" alignItems="center">
										<Text color="#8f8f8f" fontSize={14}>
											Método
										</Text>
										<Text color="$color" fontSize={14} fontWeight="600">
											{metodo === "pix" ? "PIX" : "Cartão de crédito"}
										</Text>
									</XStack>

									<Box height={1} backgroundColor="$borderColor" opacity={0.5} />

									<XStack justifyContent="space-between" alignItems="center">
										<Text color="$color" fontSize={16} fontWeight="800">
											Total
										</Text>
										<Text color={PRIMARY} fontSize={22} fontWeight="900" fontFamily="$heading">
											{formatarValor(valorTotal)}
										</Text>
									</XStack>
								</YStack>

								<TouchableOpacity
									style={[
										styles.btnConfirmar,
										{ backgroundColor: loadingCompra ? "#8f8f8f" : PRIMARY },
									]}
									onPress={confirmarCompra}
									disabled={loadingCompra}
									activeOpacity={0.85}
								>
									{loadingCompra ? (
										<ActivityIndicator color="#000" />
									) : (
										<XStack alignItems="center" gap={8}>
											{metodo === "pix" ? (
												<QrCode size={20} color="#000" />
											) : (
												<CreditCard size={20} color="#000" />
											)}
											<Text color="#000" fontWeight="900" fontSize={16} fontFamily="$heading">
												{metodo === "pix" ? "Gerar PIX" : "Confirmar pagamento"}
											</Text>
										</XStack>
									)}
								</TouchableOpacity>
							</Box>
						</Animated.View>
					)}
				</ScrollView>
			</KeyboardAvoidingView>
		</Container>
	);
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
	backBtn: {
		padding: 8,
		borderRadius: 10,
	},
	tabBtn: {
		flex: 1,
		height: 44,
		alignItems: "center",
		justifyContent: "center",
		zIndex: 1,
	},
	tabIndicator: {
		position: "absolute",
		left: 4,
		top: 4,
		width: "50%",
		height: 44,
		borderRadius: 10,
	},
	btnQtd: {
		width: 48,
		height: 48,
		borderRadius: 14,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "rgba(193,255,0,0.1)",
		borderWidth: 1,
		borderColor: "#C1FF00",
	},
	qtdContainer: {
		alignItems: "center",
		flex: 1,
	},
	textInput: {
		color: "#fff",
		fontSize: 15,
		fontFamily: "PlusJakartaSans-Regular",
		padding: 0,
		margin: 0,
	},
	btnConfirmar: {
		height: 56,
		borderRadius: 16,
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "row",
		gap: 8,
	},
	btnCopiar: {
		height: 52,
		borderRadius: 14,
		alignItems: "center",
		justifyContent: "center",
		width: "100%",
	},
	btnVoltar: {
		height: 50,
		borderRadius: 14,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 1,
		borderColor: "#6b737b",
	},
});
