import { Center } from 'native-base';

import { Loading } from '@/components/Loading';
import { useAuth } from '@/contexts/auth';

import { AppRouter } from './app';
import { AppDrawer } from './auth';

export function Routes() {
  const { user, loading } = useAuth();

  console.log(loading);

  if (loading) {
    return (
      <Center w="full" flex={1}>
        <Loading />
      </Center>
    );
  }

  return user ? <AppDrawer /> : <AppRouter />;
}
