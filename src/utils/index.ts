import * as argon2 from 'argon2';

export async function generateArgonHash(data: string): Promise<string> {
  return await argon2.hash(data);
}

export async function verifyArgonHash(hash: string, row: string): Promise<boolean> {
  return await argon2.verify(hash, row);
}
