/* eslint-disable react/jsx-no-constructed-context-values */
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { OneSignal } from 'react-native-onesignal';

import { useToast } from 'native-base';

import { UseFatch } from '@/hooks/fetchs';
import { TLogin } from '@/hooks/fetchs/schemas';
import { IUser } from '@/hooks/fetchs/types';
import * as mutation from '@/hooks/mutations';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
// import { OneSignal } from 'react-native-onesignal';

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextData {
  user: IUser | null;
  loading: boolean;
  updateUser: (input: IUser) => void;
  isShowChangeAccount: boolean;
  setIsShowChangeAccount: (value: boolean) => void;
  route: number;
  setRoute: (value: number) => void;
  info: InfoInterface | null;
  setInfo: (value: InfoInterface | null) => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);
const fetch = new UseFatch();

export function AuthProvider({ children }: AuthProviderProps) {
  const { reset } = useNavigation();
  const { isLoading, mutateAsync: login, data: response } = mutation.login();

  const toast = useToast();

  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [route, setRoute] = useState(3);

  const updateUser = React.useCallback(async (input: IUser) => {
    await AsyncStorage.setItem('@megabem:user', JSON.stringify(input));

    setUser(input);
  }, []);

  useEffect(() => {
    async function loadStorageData() {
      setLoading(true);
      const storageUser = await AsyncStorage.getItem('@megabem:user');
      const storageToken = await AsyncStorage.getItem('@megabem:token');

      if (storageUser && storageToken) {
        setUser(JSON.parse(storageUser));
        setLoading(false);
      } else {
        setLoading(false);
      }
    }

    loadStorageData();
  }, []);

  const signIn = React.useCallback(async (input: TLogin) => {
    const auth = (await fetch.signIn(input)) as IUser;
    console.log(auth.cpfCnpj);
    OneSignal.User.addTag('user', auth.cpfCnpj);

    setUser(auth);
    await AsyncStorage.setItem(
      '@megabem:token',
      JSON.stringify(auth.accessToken),
    );
    await AsyncStorage.setItem('@megabem:user', JSON.stringify(auth));
  }, []);

  function signOut() {
    setLoading(true);
    OneSignal.User.removeTag('user');

    // OneSignal.User.removeTag('userId');
    const localAuth = AsyncStorage.getItem('megabem@local-auth').then(h =>
      h ? JSON.parse(h) : null,
    );
    AsyncStorage.clear().then(() => {
      setUser(null);
    });

    localAuth.then(async h => {
      await AsyncStorage.setItem('megabem@local-auth', JSON.stringify(h));
    });
    setLoading(false);
  }

  return (
    <AuthContext.Provider
      value={{
        updateUser,
        signIn,
        signed: !!user,
        route,
        setRoute,
        user,
        setUser,
        loading,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => { };

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
