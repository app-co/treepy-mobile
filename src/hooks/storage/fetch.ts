/* eslint-disable class-methods-use-this */
import Storage from '@react-native-async-storage/async-storage';

import { TSaveLocalStorage } from './types';

export class StorageFetch {
  async save({ value, key }: TSaveLocalStorage) {
    const itens = JSON.stringify(value);

    await Storage.setItem(key, itens);
  }

  async get(key: string) {
    const token = await Storage.getItem(key);

    const value = token ? JSON.parse(token) : null;

    return value;
  }

  async deleteItem(key: string) {
    await Storage.removeItem(key);
  }

  async deleteAll() {
    await Storage.clear();
  }
}
