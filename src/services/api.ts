/* eslint-disable no-param-reassign */
/* eslint-disable default-case */
import axios from 'axios';

import ConnectionErrorModalHandler from '../components/modals/connectionErrorModal/handler';
import InternalServerErrorModalHandler from '../components/modals/internalServerErrorModal/handler';
import NotAllowedModalHandler from '../components/modals/notAllowedModal/handler';
import UnauthorizedModalHandler from '../components/modals/unauthorizedModal/handler';
import { AppError } from './AppError';

const url: { [key: string]: string } = {
  prd: 'https://treepy-server.appcom.dev',
  tst: 'http://192.168.0.107:3333',
};

const api = axios.create({
  baseURL: url.prd,
});

function handleConnectionError() {
  ConnectionErrorModalHandler.showModal();
}

function handleServerError(error: any) {
  switch (error.response.status) {
    // case 400:
    //   UnauthorizedModalHandler.showModal();
    //   break;
    case 401:
      UnauthorizedModalHandler.showModal();
      break;
    case 403:
      NotAllowedModalHandler.showModal();
      break;
    case 500:
    case 503:
      InternalServerErrorModalHandler.showModal();
  }
}

// api.interceptors.request.use(
//   async config => {
//     const token = await AsyncStorage.getItem('treepy@token');

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   error => {
//     return Promise.reject(error);
//   },
// );

api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    const repnseApi = error?.response?.data?.error;
    console.log({ repnseApi });

    if (repnseApi) {
      return Promise.reject(new AppError(repnseApi));
    }
    return Promise.reject(error);
  },
);
export { api };
