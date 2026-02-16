// types/auth.ts
// TypeScript types for Neural Link Auth system

export type AuthMode = 'login' | 'signup';

export type AuthState = 'idle' | 'typing' | 'success' | 'error';

export type UserPath = 'modeller' | 'buyer';

export type SoftwareOption = 'Blender' | 'Maya' | 'Cinema4D' | 'Other';

export type InterestCategory = 
  | 'Gaming' 
  | 'Architecture' 
  | 'VR/AR' 
  | 'Film' 
  | 'Product Design';

export interface User {
  id: string;
  email: string;
  name: string;
  userPath: UserPath;
  profileComplete: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
}

export interface ModellerProfile {
  portfolioLink?: string;
  primarySoftware: SoftwareOption;
  customSoftware?: string;
}

export interface BuyerProfile {
  interests: InterestCategory[];
}

export interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string;
  name?: string;
  userPath?: UserPath;
  modellerProfile?: ModellerProfile;
  buyerProfile?: BuyerProfile;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  requiresTwoFactor?: boolean;
  error?: string;
}
