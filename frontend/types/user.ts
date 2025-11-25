export interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  avatarUrl?: string | null;
}

export interface UserUpdateRequest {
  fullName: string;
  email: string;
  avatarUrl: string;
}