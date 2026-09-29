import api from './api';
import * as Types from '../dtos/endpoints.types';

export const CalculadoraAPI = {
  getByUserId: () => api.get('/calculadora/byUserId'),
  getAll: () => api.get('/calculadora'),
  register: (data: Types.CalculadoraRegisterParams) => api.post('/calculadora/register', data),
};

export const FlorestasAPI = {
  register: (data: Types.FlorestaRegisterParams) => api.post('/florestas/register', data),
  getByProjeto: (projeto: string | number) => api.get('/florestas/byProjeto', { params: { projeto } }),
  getAll: () => api.get('/florestas'),
  delete: (projeto: string | number) => api.delete('/florestas/delete', { params: { projeto } }),
};

export const HistoricoAPI = {
  register: (data: any) => api.post('/historico/register', data),
  getUserHistory: () => api.get('/historico-user'),
};

export const LeadEsgAPI = {
  register: (data: Types.LeadEsgParams) => api.post('/lead/esg', data),
};

export const MetricasAPI = {
  getUserMetrics: () => api.get('/metricas/user'),
  getAdminMetrics: () => api.get('/metricas/admin'),
  getDashUser: (ano: string) => api.get('/metricas/dash-user', { params: { ano } }),
};

export const PaymentAPI = {
  register: (data: any) => api.get('/payment/register', { data }),
  getAll: () => api.get('/listar'),
  delete: (id: string) => api.delete(`/deletar/${id}`),
  update: (id: string) => api.put(`/atualizar/${id}`),
};

export const PrecificacaoAPI = {
  get: () => api.get('/precificacao'),
  update: (data: Types.PrecificacaoParams) => api.put('/precificacao', data),
};

export const TransactionAPI = {
  card: (data: Types.TransactionCardParams) => api.post('/transaction-card', data),
  pix: (data: Types.TransactionPixParams) => api.post('/transaction-pix', data),
  boleto: (data: any) => api.post('/transaction-boleto', data),
  webhook: (data: any) => api.post('/webhook', data),
};

export const UploadAPI = {
  upload: (formData: FormData) => api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

export const UserAPI = {
  checkAccess: () => api.get('/'),
  register: (data: Types.UserRegisterParams) => api.post('/user', data),
  login: (data: Types.LoginParams) => api.post('/login', data),
  refreshToken: () => api.patch('/refresh-token'),
  forgotPass: (data: Types.ForgotPassParams) => api.post('/mail/forgot-pass', data),
  resetPass: (data: Types.ResetPassParams) => api.post('/reset-pass', data),
  resetCache: () => api.get('/reset-cashe'),
  getUser: () => api.get('/user'),
  getAllUsers: () => api.get('/allUsers'),
  addTreepycashe: (data: Types.AddTreepycasheParams) => api.post('/add-treepycashe', data),
  updateEndereco: (data: Types.UserEnderecoParams) => api.post('/user/endereco', data),
  updateUser: (data: Types.UpdateUserParams) => api.put('/user', data),
};
