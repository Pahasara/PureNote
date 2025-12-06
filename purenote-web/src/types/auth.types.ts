export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginDto {
  identifier: string; // Can be email or username
  password: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
}

export interface User {
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
}
