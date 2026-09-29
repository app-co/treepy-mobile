import { Button } from "@/components/ui/Button";
import { ControlledInput } from "@/components/ui/Input";
import { Container, Scroll, Text, Touch } from "@/components/ui/Layout";
import { type ISignUpData, useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import {
	ArrowLeft,
	ArrowRight,
	Eye,
	EyeOff,
	Lock,
	Mail,
	User,
} from "lucide-react-native";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTheme, XStack, YStack } from "tamagui";
import { scaleH } from "../../tamagui.config";

interface IRegisterFormData extends ISignUpData {
	confirmar_senha: string;
}

export default function RegisterScreen() {
	const theme = useTheme();
	const { signUp, loading } = useAuth();

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const { control, handleSubmit, watch } = useForm<IRegisterFormData>({
		defaultValues: {
			nome: "",
			email: "",
			senha: "",
			confirmar_senha: "",
		},
	});

	const senhaAtual = watch("senha");

	const onSubmit = async (data: IRegisterFormData) => {
		await signUp({
			nome: data.nome,
			email: data.email,
			senha: data.senha,
		});
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
					paddingBottom: scaleH(25),
				}}
			>
				{/* Header */}
				<XStack alignItems="center" gap={16} mt={10} mb={16}>
					<Touch
						onPress={() => router.back()}
						p={8}
						borderRadius={10}
						backgroundColor="$backgroundHover"
					>
						<ArrowLeft color={theme.color?.val || "#fff"} size={22} />
					</Touch>
					<YStack flex={1}>
						<Text fontSize={22} fontWeight="900" fontFamily="$heading">
							Criar conta
						</Text>
						<Text color="$gray" fontSize={13}>
							Junte-se a nós e comece a gerenciar o futuro.
						</Text>
					</YStack>
				</XStack>

				{/* Register Form */}
				<YStack
					backgroundColor="$backgroundHover"
					borderRadius={20}
					p={20}
					gap={16}
					borderWidth={1}
					borderColor="$borderColor"
				>
					<ControlledInput
						name="nome"
						control={control}
						label="NOME COMPLETO"
						placeholder="Seu nome"
						size="md"
						autoCapitalize="words"
						rules={{
							required: "O nome completo é obrigatório",
						}}
						leftElement={
							<User color={theme.gray?.val || "#8f8f8f"} size={20} />
						}
					/>

					<ControlledInput
						name="email"
						control={control}
						label="E-MAIL"
						placeholder="seu@email.com"
						size="md"
						autoCapitalize="none"
						keyboardType="email-address"
						rules={{
							required: "O e-mail é obrigatório",
							pattern: {
								value: /\S+@\S+\.\S+/,
								message: "Digite um e-mail válido",
							},
						}}
						leftElement={
							<Mail color={theme.gray?.val || "#8f8f8f"} size={20} />
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
							required: "A senha é obrigatória",
							minLength: {
								value: 6,
								message: "A senha deve ter no mínimo 6 caracteres",
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

					<ControlledInput
						name="confirmar_senha"
						control={control}
						label="CONFIRMAR SENHA"
						placeholder="••••••••"
						size="md"
						secureTextEntry={!showConfirmPassword}
						rules={{
							required: "Confirme sua senha",
							validate: (val) => {
								if (senhaAtual !== val) {
									return "As senhas não coincidem";
								}
								return true;
							},
						}}
						leftElement={
							<Lock color={theme.gray?.val || "#8f8f8f"} size={20} />
						}
						rightElement={
							<Touch
								onPress={() => setShowConfirmPassword(!showConfirmPassword)}
								p={4}
							>
								{showConfirmPassword ? (
									<EyeOff color={theme.gray?.val || "#8f8f8f"} size={20} />
								) : (
									<Eye color={theme.gray?.val || "#8f8f8f"} size={20} />
								)}
							</Touch>
						}
					/>

					<Button
						size="lg"
						loading={loading}
						disabled={loading}
						onPress={handleSubmit(onSubmit)}
						iconRight={
							<ArrowRight color={theme.black?.val || "#000"} size={20} />
						}
					>
						Cadastrar
					</Button>
				</YStack>

				{/* Footer */}
				<YStack alignItems="center" marginTop="auto" gap={16} pt={16}>
					<XStack gap={8} alignItems="center">
						<Text color="$gray" fontSize={14}>
							Já tem uma conta?
						</Text>
						<Touch onPress={() => router.back()}>
							<Text color="$primary" fontWeight="bold" fontSize={14}>
								Fazer login
							</Text>
						</Touch>
					</XStack>

					<Text
						color="$gray"
						fontSize={11}
						textAlign="center"
						fontFamily="$label"
					>
						Ao se cadastrar, você concorda com nossos Termos de Uso e Política
						de Privacidade.
					</Text>
				</YStack>
			</Scroll>
		</Container>
	);
}
