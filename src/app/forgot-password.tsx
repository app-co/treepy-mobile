import { Button } from "@/components/ui/Button";
import { ControlledInput } from "@/components/ui/Input";
import { Container, Scroll, Text, Touch } from "@/components/ui/Layout";
import { router } from "expo-router";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react-native";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTheme, XStack, YStack } from "tamagui";
import { scaleH } from "../../tamagui.config";
import { UserAPI } from "@/services/endpoints";
import Alert from "@/components/modals/alertas/handler";
import { AppError } from "@/services/AppError";

interface IForgotPassFormData {
	email: string;
}

export default function ForgotPasswordScreen() {
	const theme = useTheme();
	const [loading, setLoading] = useState(false);

	const { control, handleSubmit } = useForm<IForgotPassFormData>({
		defaultValues: {
			email: "",
		},
	});

	const onSubmit = async (data: IForgotPassFormData) => {
		setLoading(true);
		try {
			await UserAPI.forgotPass({ email: data.email });
			Alert.show({
				title: "E-mail enviado",
				description: "Verifique sua caixa de entrada para redefinir a senha.",
				tipo: "success",
			});
			router.back();
		} catch (error) {
			if (error instanceof AppError) {
				Alert.show({
					title: "Erro",
					description: error.message,
					tipo: "error",
				});
			}
		} finally {
			setLoading(false);
		}
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
							Recuperar senha
						</Text>
						<Text color="$gray" fontSize={13}>
							Enviaremos um link para o seu e-mail.
						</Text>
					</YStack>
				</XStack>

				{/* Form */}
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
						label="E-MAIL CADASTRADO"
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

					<Button
						size="lg"
						loading={loading}
						disabled={loading}
						onPress={handleSubmit(onSubmit)}
						iconRight={
							<ArrowRight color={theme.black?.val || "#000"} size={20} />
						}
					>
						Enviar e-mail
					</Button>
				</YStack>
			</Scroll>
		</Container>
	);
}
