import Reactotron from 'reactotron-react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

export const reactotron = Reactotron.setAsyncStorageHandler(AsyncStorage)
	.configure({ name: 'TREEPY' })
	.useReactNative();
