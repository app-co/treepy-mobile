/* eslint-disable import/no-extraneous-dependencies */
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';
import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClientProvider } from 'react-query';

import { Asset } from 'expo-asset';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

import * as font from '@expo-google-fonts/roboto';

import { NativeBaseProvider } from 'native-base';

import bgCadastro from '@/assets/Cadastro Mobile.png';
import bgDuvidas from '@/assets/duvida.png';
import bgFloresta from '@/assets/floresta.png';
import bgHome from '@/assets/home.png';
import bgLogin from '@/assets/Login Mobile.png';
import { ToastModal } from '@/components/modals/toast';
import { reactotron } from '@/config';
import { Routes } from '@/routes';
import { NavigationContainer } from '@react-navigation/native';

import { ConnectionErrorModal } from './src/components/modals/connectionErrorModal';
import { UnauthorizedModal } from './src/components/modals/unauthorizedModal';
import { AuthProvider } from './src/contexts/auth';
import { queryClient } from './src/lib';

if (__DEV__) {
  reactotron.connect();
}
export default function App() {
  const [fontsLoaded] = useFonts({
    trin: font.Roboto_100Thin,
    light: font.Roboto_300Light,
    regular: font.Roboto_400Regular,
    italic: font.Roboto_400Regular_Italic,
    semi_bold: font.Roboto_500Medium,
    bold: font.Roboto_700Bold,
    black: font.Roboto_900Black,
  });

  const config = {
    screens: {
      home: {
        screens: {
          Historico: 'Historico',
        },
      },
    },
  };

  const [isReady, setIsReady] = useState(false);

  const loadResources = async () => {
    const images = [bgHome, bgDuvidas, bgFloresta, bgCadastro, bgLogin];

    const cacheImages = images.map(image => {
      return Asset.fromModule(image).downloadAsync();
    });

    await Promise.all(cacheImages);
  };

  useEffect(() => {
    const prepare = async () => {
      try {
        await loadResources();
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
        ('');
        await SplashScreen.hideAsync();
      }
    };

    prepare();
  }, []);

  const linking = {
    prefixes: ['mega-bem://', ' com.megabem.org://'],
    config,
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer linking={linking}>
        <AuthProvider>
          <StatusBar
            hidden
            translucent
            // backgroundColor={color.focus.regular}
            style="light"
          />
          <NativeBaseProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <Routes />
            </GestureHandlerRootView>
          </NativeBaseProvider>
          <UnauthorizedModal />
          <ToastModal />
          <ConnectionErrorModal />
        </AuthProvider>
      </NavigationContainer>
    </QueryClientProvider>
  );
}
