import { test, expect, request } from '@playwright/test';


test('POST /users should create a new user successfully', async ({ request }) => {

    const uniqueId = Date.now();
    const username = `testuser_${uniqueId}`;
    const email = `testuser_${uniqueId}@mail.com`;
    const password = 'Password123!';

    const response = await request.post('users', {

        data: {
            user: {
                username: username,
                email: email,
                password: password,
            }
        }
    });

    console.log('Request submited to:', response.url());


    expect(response.status()).toBe(201);
    const body = await response.json();

    expect(body.user).toBeDefined();
    expect(body.user.email).toBe(email);
    expect(body.user.username).toBe(username);
    expect(body.user.token).toBeTruthy();
    expect(body.user.bio).toBeNull();
    expect(body.user.image).toBeNull();

});

test('POST /users should reject request with missing email', async ({ request }) => {
    const uniqueId = Date.now();
    const username = `testuser_${uniqueId}`;
    const password = 'Password123!';

    const response = await request.post('users', {
        data: {
            user: {
                username: username,
                password: password
            }
        }
    });

    const body = await response.json();
    expect(response.status()).toBe(422);
    expect(body.errors).toBeDefined();
    expect(body.errors.email).toContain("can't be blank");

});
