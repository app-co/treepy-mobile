import logo from "@/assets/logo.png";
import Alert from "@/components/modals/alertas/handler";
import { Button } from "@/components/ui/Button";
import { ControlledInput } from "@/components/ui/Input";
import {
	Box,
	Container,
	Img,
	Scroll,
	Text,
	Touch,
} from "@/components/ui/Layout";
import { useAuth } from "@/context/AuthContext";
import { useLocalAuthStore } from "@/context/use-local-auth";
import { router } from "expo-router";
import {
	ArrowRight,
	Check,
	Eye,
	EyeOff,
	Lock,
	User,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTheme, View, XStack, YStack } from "tamagui";
import { scale } from "../../tamagui.config";

interface ILoginFormData {
	email: string;
	senha: string;
}

export default function LoginScreen() {
	const theme = useTheme();
	const { signIn, loading } = useAuth();
	const { credentials, setCredentials } = useLocalAuthStore();

	const [showPassword, setShowPassword] = useState(false);
	const [lembrar, setLembrar] = useState(false);

	const { control, handleSubmit, setValue } = useForm<ILoginFormData>({
		defaultValues: {
			email: "",
			senha: "",
		},
	});

	useEffect(() => {
		if (credentials) {
			setValue("email", credentials.apelido);
			setValue("senha", credentials.senha);
			setLembrar(true);
		}
	}, [credentials, setValue]);

	const onSubmit = async (data: ILoginFormData) => {
		if (lembrar) {
			setCredentials({ apelido: data.email, senha: data.senha });
		} else {
			setCredentials(null);
		}

		await signIn(data.email, data.senha);
	};

	return (
		<Container
			bg={"$background"}
			px={20}
			pt={10}
			pb={8}
			justifyContent="space-between"
		>
			<Scroll
				contentContainerStyle={{
					flexGrow: 1,
				}}
			>
				{/* Header / Logo */}
				<YStack alignItems="center" mt={40} marginBottom={10}>
					<View
						borderRadius={20}
						justifyContent="center"
						alignItems="center"
						marginBottom={10}
						shadowColor="$secundary"
						shadowOffset={{ width: 0, height: 0 }}
						shadowOpacity={0.15}
						shadowRadius={20}
					>
						<Img
							source={logo}
							width={scale(61)}
							height={scale(25)}
							borderRadius={20}
							justifyContent="center"
							alignItems="center"
							marginBottom={10}
							shadowColor="$primary"
							shadowOffset={{ width: 0, height: 0 }}
							shadowOpacity={0.15}
							shadowRadius={20}
						/>
					</View>
					<Text color="$secundary" t="a3" mt={10}>
						Gerenciando o futuro do planeta.
					</Text>
				</YStack>

				{/* Login Form */}
				<YStack
					backgroundColor="$backgroundHover"
					borderRadius={20}
					p={20}
					gap={20}
					borderWidth={1}
					borderColor="$borderColor"
				>
					<ControlledInput
						name="email"
						control={control}
						label="E-MAIL OU USUÁRIO"
						placeholder="seu@email.com"
						size="md"
						autoCapitalize="none"
						keyboardType="email-address"
						rules={{
							required: "Digite seu e-mail",
						}}
						leftElement={
							<User color={theme.gray?.val || "#8f8f8f"} size={20} />
						}
					/>

					<ControlledInput
						name="senha"
						control={control}
						label="SENHA"
						placeholder="••••••••"
						size="md"
						secureTextEntry={!showPassword}
						rules={{
							required: "Digite sua senha",
							minLength: {
								value: 4,
								message: "A senha deve ter no mínimo 4 caracteres",
							},
						}}
						leftElement={
							<Lock color={theme.gray?.val || "#8f8f8f"} size={20} />
						}
						rightElement={
							<Touch onPress={() => setShowPassword(!showPassword)} p={4}>
								{showPassword ? (
									<EyeOff color={theme.gray?.val || "#8f8f8f"} size={20} />
								) : (
									<Eye color={theme.gray?.val || "#8f8f8f"} size={20} />
								)}
							</Touch>
						}
					/>

					<XStack justifyContent="space-between" alignItems="center" mt={-4}>
						<Touch
							onPress={() => setLembrar(!lembrar)}
							flexDirection="row"
							alignItems="center"
							gap={8}
						>
							<Box
								width={20}
								height={20}
								borderRadius={5}
								borderWidth={1}
								borderColor={lembrar ? "$primary" : "$borderColor"}
								backgroundColor={lembrar ? "$primary" : "transparent"}
								justifyContent="center"
								alignItems="center"
							>
								{lembrar && (
									<Check size={14} color={theme.black?.val || "#000"} />
								)}
							</Box>
							<Text color="$gray" fontSize={13}>
								Lembrar de mim
							</Text>
						</Touch>

						<Touch
							onPress={() => {
								router.push("/forgot-password");
							}}
						>
							<Text color="$gray" fontSize={13} fontWeight="600">
								Esqueci a senha?
							</Text>
						</Touch>
					</XStack>

					<Button
						size="lg"
						loading={loading}
						disabled={loading}
						onPress={handleSubmit(onSubmit)}
						iconRight={
							<ArrowRight color={theme.black?.val || "#000"} size={20} />
						}
					>
						Entrar
					</Button>
				</YStack>

				{/* Footer */}
				<YStack alignItems="center" marginTop="auto" gap={24} pt={10}>
					<XStack gap={10}>
						<Text color="$gray" fontSize={14}>
							Não tem uma conta?
						</Text>
						<Touch onPress={() => router.push("/register")}>
							<Text color="$primary" fontWeight="bold" fontSize={14}>
								Criar conta agora
							</Text>
						</Touch>
					</XStack>

					<XStack gap={24}>
						<Text
							color="$gray"
							fontSize={12}
							fontFamily="$label"
							fontWeight="700"
						>
							Termos
						</Text>
						<Text
							color="$gray"
							fontSize={12}
							fontFamily="$label"
							fontWeight="700"
						>
							Privacidade
						</Text>
						<Text
							color="$gray"
							fontSize={12}
							fontFamily="$label"
							fontWeight="700"
						>
							Ajuda
						</Text>
					</XStack>
				</YStack>
			</Scroll>
		</Container>
	);
}
