import { Cadastro } from '@/pages/cadastro';
import { Login } from '@/pages/Login';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const { Navigator, Screen } = createNativeStackNavigator();

export function AppRouter() {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Screen name="login" component={Login} />
      <Screen name="cadastro" component={Cadastro} />
    </Navigator>
  );
}
