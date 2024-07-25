import { ActivityIndicator } from 'react-native';

import { Center } from 'native-base';

import { useAuth } from '@/contexts/auth';
import { color } from '@/styles/theme';

import { AppRouter } from './app';
import { AppDrawer } from './auth';

export function Routes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Center>
        <ActivityIndicator color={color.green[100]} size={45} />
      </Center>
    );
  }

  return user ? <AppDrawer /> : <AppRouter />;
}
