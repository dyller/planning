export interface UserModel {
  userId?: string;
  userName: string;
  name: string;
  password: string;
  lastLogin: Date;
  email: string;
  isAdmin: boolean;
}
