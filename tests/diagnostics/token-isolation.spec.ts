import { test, expect } from '@playwright/test';
import { signUpUser } from '../../utils/api/authApi';

test.describe('@diagnostic Authentication consistency diagnostics', () => {
  test('parallel created users should receive unique tokens', async () => {
    const users = await Promise.all([
      signUpUser(),
      signUpUser(),
      signUpUser(),
      signUpUser(),
      signUpUser(),
    ]);

    const tokens = users.map(user => user.token);
    const uniqueTokens = new Set(tokens);

    console.log(users.map(user => ({
      username: user.username,
      email: user.email,
      token: user.token,
    })));

    expect(uniqueTokens.size).toBe(users.length);
  });

  test('parallel created users should resolve their own tokens', async ({ request }) => {
    const users = await Promise.all([
      signUpUser(),
      signUpUser(),
      signUpUser(),
      signUpUser(),
      signUpUser(),
    ]);

    for (const user of users) {
      const response = await request.get('user', {
        headers: {
          Authorization: `Token ${user.token}`,
        },
      });

      const body = await response.json();

      expect.soft(body.user.token).toBe(user.token);
      expect.soft(body.user.username).toBe(user.username);
      expect.soft(body.user.email).toBe(user.email);
    }
  });

  test('sequential created users should resolve their own tokens', async ({ request }) => {
    const users = [];

    for (let i = 0; i < 5; i++) {
      users.push(await signUpUser());
    }

    for (const user of users) {
      const response = await request.get('user', {
        headers: {
          Authorization: `Token ${user.token}`,
        },
      });

      const body = await response.json();

      expect.soft(body.user.username).toBe(user.username);
      expect.soft(body.user.email).toBe(user.email);
    }
  });
});