/* eslint-disable default-case */
import axios from 'axios';

import ConnectionErrorModalHandler from '../components/modals/connectionErrorModal/handler';
import InternalServerErrorModalHandler from '../components/modals/internalServerErrorModal/handler';
import NotAllowedModalHandler from '../components/modals/notAllowedModal/handler';
import UnauthorizedModalHandler from '../components/modals/unauthorizedModal/handler';
import { AppError } from './AppError';

const url: { [key: string]: string } = {
  prd: process.env.EXPO_URL_PRD,
  tst: process.env.EXPO_URL_TST,
};

const api = axios.create({
  baseURL: 'https://tst-clubgas-api.azurewebsites.net/api/v1',
  headers: {
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiSGlub3ZhIiwibmJmIjoxNzE2NTEyMTE2LCJleHAiOjE4NzQyNzg1MTYsImlhdCI6MTcxNjUxMjExNn0.F_XKnQfPUvqiFhx8HFCZRgDkKvbLSG_-rl5tfYPV3Rg`,
  },
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

api.interceptors.request.use(
  async config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    const repnseApi = error?.response?.data?.errors[0];
    if (!error.response) {
      handleConnectionError();
    } else {
      handleServerError(error);
    }

    if (repnseApi) {
      return Promise.reject(new AppError(repnseApi));
    }
    return Promise.reject(error);
  },
);
export { api };
