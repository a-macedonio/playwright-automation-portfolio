import { test, expect } from '@playwright/test';

test('GET /articles returns articles list', async ({ request }) => {
    const response = await request.get('articles');
    console.log('Enviando petición a:', response.url());

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('articles');
    expect(Array.isArray(body.articles)).toBeTruthy();
    expect(body).toHaveProperty('articlesCount');
});