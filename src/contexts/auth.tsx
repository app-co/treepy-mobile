/* eslint-disable react/jsx-no-constructed-context-values */
import React, { ReactNode, createContext, useContext, useState } from 'react';

import { useGetStorage, useSaveLocal } from '@/hooks/storage/mutation';
import { UserFetch } from '@/hooks/user/fetchs';
import { IUser } from '@/hooks/user/interface';
import { useLogin } from '@/hooks/user/mutation';
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
  const getToken = useGetStorage();
  const saveStorage = useSaveLocal();

  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [route, setRoute] = useState(3);

  // const updateUser = React.useCallback(async (input: IUser) => {
  //   await AsyncStorage.setItem('@megabem:user', JSON.stringify(input));

  //   setUser(input);
  // }, []);

  const loadUser = React.useCallback(async () => {
    setLoading(true);
    const token = await getToken.mutateAsync('treepy@token');
    if (token) {
      const data = await fetch.userByID();
      setUser(data.user);
    }
    setLoading(false);
  }, [getToken]);

  React.useEffect(() => {
    if (isLoading || getToken.isLoading || saveStorage.isLoading) {
      setLoading(true);
    }

    setLoading(false);
  }, [getToken.isLoading, isLoading, saveStorage.isLoading]);

  React.useEffect(() => {
    loadUser();
  }, []);

  // useEffect(() => {
  //   async function loadStorageData() {
  //     setLoading(true);
  //     const storageUser = await AsyncStorage.getItem('@megabem:user');
  //     const storageToken = await AsyncStorage.getItem('@megabem:token');

  //     if (storageUser && storageToken) {
  //       setUser(JSON.parse(storageUser));
  //       setLoading(false);
  //     } else {
  //       setLoading(false);
  //     }
  //   }

  //   loadStorageData();
  // }, []);

  const signIn = React.useCallback(async (input: TLogin) => {
    const auth = await loginMutation(input);

    await saveStorage.mutateAsync({ key: 'treepy@token', value: auth.token });
    api.defaults.headers.common.Authorization = `Bearer ${auth.token}`;
    loadUser();

    // OneSignal.User.addTag('user', auth.cpfCnpj);
  }, []);

  async function signOut() {
    setLoading(true);
    // OneSignal.User.removeTag('user');

    // OneSignal.User.removeTag('userId');

    await AsyncStorage.clear();
    setUser(null);
    console.log({ user });

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
