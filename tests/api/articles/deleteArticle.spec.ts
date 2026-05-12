import { test, expect } from '@playwright/test';
import { signUpUser } from '../../../utils/api/authApi';
import { ArticlePayload } from '../../../types/article';

test('DELETE /articles/:slug should delete an existing article', async ({ request }) => {
    // Create user and article
    const uniqueId = crypto.randomUUID().slice(0, 8);
    const username = `user_${uniqueId}`;
    const email = `${username}@test.com`;

    const user = await signUpUser({ email, username });

    const article: ArticlePayload = {
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

    // confirm article exists before deletion
    const getResponseBeforeDelete = await request.get(`articles/${slug}`, {
        headers: {
            Authorization: `Token ${user.token}`,
        },
    });

    expect(getResponseBeforeDelete.status()).toBe(200);

    const getBodyBeforeDelete = await getResponseBeforeDelete.json();
    
    expect(getBodyBeforeDelete.article.title).toBe(article.title);
    expect(getBodyBeforeDelete.article.description).toBe(article.description);
    expect(getBodyBeforeDelete.article.body).toBe(article.body);

    // Delete article
    const deleteResponse = await request.delete(`articles/${slug}`, {
        headers: {
            Authorization: `Token ${user.token}`,
        },
    });

    expect(deleteResponse.status()).toBe(204);

    // Assert: article no longer exists
    const getResponseAfterDelete = await request.get(`articles/${slug}`, {
        headers: {
            Authorization: `Token ${user.token}`,
        },
    });

    expect(getResponseAfterDelete.status()).toBe(404);

    const getBodyAfterDelete = await getResponseAfterDelete.json();

    expect(getBodyAfterDelete.errors).toBeDefined();
    expect(getBodyAfterDelete.errors.article).toContain("not found");
});