import api from '@/lib/api';

interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  email: string;
}

export const registerUser = async (data: RegisterRequest) => {
  const response = await api.post<AuthResponse>('/auth/register', data);
  return response.data;
};

export const loginUser = async (data: LoginRequest) => {
  const response = await api.post<AuthResponse>('/auth/login', data);
  return response.data;
};