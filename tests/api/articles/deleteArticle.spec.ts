import { test, expect } from '@playwright/test';
import { signUpUser } from '../../../utils/api/authApi';

test('DELETE /articles/:slug should delete an existing article', async ({ request }) => {
    // Create user and article
    const uniqueId = crypto.randomUUID().replace(/-/g, '');
    const username = `testuser_${uniqueId}`;
    const email = `testuser_${uniqueId}@mail.com`;
    const password = 'Password123!';

    const user = await signUpUser(email, password, username);

    const article = {
        title: `Delete Article ${uniqueId}`,
        description: 'Article to be deleted',
        body: 'This article will be deleted',
        tagList: ['delete'],
    };

    const createResponse = await request.post('articles', {
        headers: {
            Authorization: `Token ${user.token}`,
        },
        data: { article },
    });

    expect(createResponse.status()).toBe(201);

    const createBody = await createResponse.json();
    const slug = createBody.article.slug;

    // Delete article
    const deleteResponse = await request.delete(`articles/${slug}`, {
        headers: {
            Authorization: `Token ${user.token}`,
        },
    });

    expect(deleteResponse.status()).toBe(204);

    // Assert: article no longer exists
    const getResponse = await request.get(`articles/${slug}`, {
        headers: {
            Authorization: `Token ${user.token}`,
        },
    });

    expect(getResponse.status()).toBe(404);
    const getBody = await getResponse.json();
    expect(getBody.errors).toBeDefined();
    expect(getBody.errors.article).toContain("not found");
});