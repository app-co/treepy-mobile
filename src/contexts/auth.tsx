/* eslint-disable react/jsx-no-constructed-context-values */
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { useSaveLocal } from '@/hooks/storage/mutation';
import { useGetStorage } from '@/hooks/storage/querys';
import { UserFetch } from '@/hooks/user/fetchs';
import { IUser } from '@/hooks/user/interface';
import { useLogin } from '@/hooks/user/mutation';
import { useUserById } from '@/hooks/user/querys';
import { TLogin } from '@/hooks/user/types';
import { api } from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { OneSignal } from 'react-native-onesignal';

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextData {
  user: IUser | null;
  loading: boolean;
  signIn: (value: TLogin) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);
const fetch = new UserFetch();

export function AuthProvider({ children }: AuthProviderProps) {
  const { isLoading, mutateAsync: loginMutation } = useLogin();
  const getToken = useGetStorage('treepy@token');
  const { data, refetch } = useUserById();
  const saveStorage = useSaveLocal();

  const [user, setUser] = useState<IUser | null>(data?.user);
  const [loading, setLoading] = useState(false);

  const updateUser = React.useCallback(async (input: IUser) => {
    await AsyncStorage.setItem('treepy:user', JSON.stringify(input));

    setUser(input);
  }, []);

  useEffect(() => {
    async function loadStorageData() {
      setLoading(true);
      const storageToken = getToken.data;
      if (storageToken) {
        await refetch();
        setUser(data?.user ?? null);
        setLoading(false);
      } else {
        setLoading(false);
      }
    }

    loadStorageData();
  }, [getToken?.data, data?.user]);

  const signIn = React.useCallback(
    async (input: TLogin) => {
      const auth = await loginMutation(input);

      await saveStorage.mutateAsync({ key: 'treepy@token', value: auth.token });
      api.defaults.headers.common.Authorization = `Bearer ${auth.token}`;

      // OneSignal.User.addTag('user', auth.cpfCnpj);
    },
    [loginMutation, saveStorage],
  );

  async function signOut() {
    setLoading(true);
    // OneSignal.User.removeTag('user');

    // OneSignal.User.removeTag('userId');

    await AsyncStorage.clear();
    setUser(null);

    setLoading(false);
  }

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        user,
        loading,
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
