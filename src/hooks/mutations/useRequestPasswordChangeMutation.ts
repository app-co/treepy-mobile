import { useMutation } from 'react-query';

import api from '@/services/api';

async function postRequestPasswordChange(email: string) {
	return await api.post(`Usuario/solicitar-reset-senha/${email}`);
}

export function useRequestPasswordChangeMutation() {
	return useMutation(postRequestPasswordChange);
}
