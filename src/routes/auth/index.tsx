/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-props-no-spreading */
import { DrawerContent } from '@/components/DrawerComponent';
import { GlobalHeader } from '@/components/headers/GlobalHeader';
import { Florestas } from '@/pages/Florestas';
import { Home } from '@/pages/Home';
import { Parceiros } from '@/pages/Parceiros';
import { Questions } from '@/pages/Questions';
import { Treepycashe } from '@/pages/Treepycashe';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { StakRouter } from './stack';

const { Screen, Navigator } = createDrawerNavigator();

export function AppDrawer() {
  return (
    <Navigator
      drawerContent={DrawerContent}
      screenOptions={{
        header: props => <GlobalHeader {...props} />,
      }}
    >
      <Screen name="Home" component={Home} />
      <Screen name="Questions" component={Questions} />
      <Screen name="Parceiros" component={Parceiros} />
      <Screen name="Calculadora" component={StakRouter} />
      <Screen name="Treepycashe" component={Treepycashe} />
      <Screen name="Florestas" component={Florestas} />
    </Navigator>
  );
}
