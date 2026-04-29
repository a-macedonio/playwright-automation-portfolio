import { request as playwrightRequest, expect } from '@playwright/test';

type User = {
    email: string;
    token: string;
    username: string;
    bio: string | null;
    image: string | null;
};

export async function signUpUser(
    email: string,
    password: string,
    username: string
): Promise<User> {
    const apiRequest = await playwrightRequest.newContext({
        baseURL: 'https://api.realworld.show/api/',
    });

    const response = await apiRequest.post('users', {
        data: {
            user: {
                email,
                password,
                username,
            },
        },
    });

    const body = await response.json();

    expect(response.status()).toBe(201);

    await apiRequest.dispose();

    return body.user;
}