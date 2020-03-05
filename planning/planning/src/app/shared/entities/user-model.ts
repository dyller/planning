export interface UserModel {
  userId?: number;
  userName: string;
  name: string;
  password: string;
  lastLogin: Date;
  email: string;
  isAdmin: boolean;
}
