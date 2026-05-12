import { request as playwrightRequest, expect } from '@playwright/test';

type User = {
  email: string;
  token: string;
  username: string;
  bio: string | null;
  image: string | null;
};

type SignUpOptions = {
  email?: string;
  password?: string;
  username?: string;
};

export async function signUpUser({
  email,
  password,
  username,
}: SignUpOptions = {}): Promise<User> {
  const uniqueId = crypto.randomUUID().slice(0, 8);

  const generatedUsername = username ?? `user_${uniqueId}`;
  const generatedEmail = email ?? `${generatedUsername}@test.com`;
  const generatedPassword = password ?? 'Password123!';

  const apiRequest = await playwrightRequest.newContext({
    baseURL: 'https://api.realworld.show/api/',
  });

  const response = await apiRequest.post('users', {
    data: {
      user: {
        email: generatedEmail,
        password: generatedPassword,
        username: generatedUsername,
      },
    },
  });

  const body = await response.json();

  expect(response.status()).toBe(201);
  expect(body.user.username).toBe(generatedUsername);
  expect(body.user.email).toBe(generatedEmail);
  expect(body.user.token).toBeTruthy();

  await apiRequest.dispose();

  return body.user;
}