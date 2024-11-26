/* eslint-disable no-console */
import bcrypt from 'bcrypt';

// Encrypts inputted password and returns the hashed password
export async function hashPassword(password: string) {
  try {
    const hashRounds = 10;

    const hashedPassword = await bcrypt.hash(password, hashRounds);

    return hashedPassword;
  } catch (error) {
    console.log(`Password Error ${error}`);
  }
}

// Verifies if provided password matches with hashed password
// returns true or false
export async function verifyPassword(passwordInput: string, hashedPassword: string) {
  try {
    const isVerified = await bcrypt.compare(passwordInput, hashedPassword);

    return isVerified;
  } catch (error) {
    console.log(`Password Error ${error}`);
  }
}
