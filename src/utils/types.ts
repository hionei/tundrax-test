export type JwtPayload = {
  userId: number;
  username: string;
  email: string;
  role: Role;
};

export enum Role {
  User = 'user',
  Admin = 'admin'
}
