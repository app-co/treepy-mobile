import { Calculadora } from '@/pages/Calculadora';
import { Recalculation } from '@/pages/Recalculation';
import * as Nv from '@react-navigation/native-stack';

const S = Nv.createNativeStackNavigator();

export function StakRouter() {
  return (
    <S.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <S.Screen name="calculadora" component={Calculadora} />
      <S.Screen name="recalculation" component={Recalculation} />
    </S.Navigator>
  );
}
