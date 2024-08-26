/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-props-no-spreading */
import { DrawerContent } from '@/components/DrawerComponent';
import { GlobalHeader } from '@/components/headers/GlobalHeader';
import { Florestas } from '@/pages/Florestas';
import { Home } from '@/pages/Home';
import { Parceiros } from '@/pages/Parceiros';
import { Questions } from '@/pages/Questions';
import { Treepycashe } from '@/pages/Treepycashe';
import { color } from '@/styles/theme';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { StakRouter } from './stack';

const { Screen, Navigator } = createDrawerNavigator();

export function AppDrawer() {
  return (
    <Navigator
      drawerContent={DrawerContent}
      screenOptions={{
        header: props => <GlobalHeader {...props} />,
        drawerActiveTintColor: color.greenLigh[100],
        drawerInactiveTintColor: color.gray[100],
      }}
    >
      <Screen name="Home" component={Home} />
      <Screen name="Calculadora" component={StakRouter} />
      <Screen
        options={{
          title: 'TreepyCashes',
        }}
        name="Treepycashe"
        component={Treepycashe}
      />
      <Screen name="Florestas" component={Florestas} />
      <Screen name="Parceiros" component={Parceiros} />
      <Screen
        options={{
          title: 'Perguntas',
        }}
        name="Questions"
        component={Questions}
      />
    </Navigator>
  );
}
