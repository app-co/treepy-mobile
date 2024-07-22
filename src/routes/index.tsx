import { AppRouter } from './app';
import { AppDrawer } from './auth';

export function Routes() {
  const user = true;

  return user ? <AppDrawer /> : <AppRouter />;
}
