import api from "@/lib/api";
import { UserProfile, UserUpdateRequest } from "@/types/user";

export const getUserProfile = async (): Promise<UserProfile> => {
  const response = await api.get<UserProfile>("/v1/users/me");
  return response.data;
};

export const updateUserProfile = async (data: UserUpdateRequest): Promise<UserProfile> => {
  const response = await api.put<UserProfile>("/v1/users/me", data);
  return response.data;
};

export const uploadUserAvatar = async (file: File): Promise<UserProfile> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<UserProfile>("/v1/users/me/avatar", formData, {
    headers: {
      "Content-Type": undefined, 
    },
  });
  
  return response.data;
};