import { test, expect } from '@playwright/test';
import { signUpUser } from '../../../utils/api/authApi';
import { ArticlePayload } from '../../../types/article.ts';

test('POST /articles should create a new article for an authenticated user', async ({ request }) => {
    const uniqueId = crypto.randomUUID().slice(0, 8);
    const username = `user_${uniqueId}`;
    const email = `user_${uniqueId}@test.com`;

    const user = await signUpUser({username,email});

    const article: ArticlePayload = {
        title: `Generic Title ${uniqueId}`,
        description: "This is a test article",
        body: "This is test content",
        tagList: ["music", "lyrics"]
    }

    const response = await request.post('articles', {
        headers: {
            Authorization: `Token ${user.token}`,
        },
        data: { article }
    });

    expect(response.status()).toBe(201);

    const body = await response.json();

    // Validate response contract
    expect(body).toHaveProperty('article');
    expect(body.article.slug).toBeTruthy();

    expect(body.article).toMatchObject({
        title: article.title,
        description: article.description,
        body: article.body,
        favorited: false,
        favoritesCount: 0,
    });

    expect(body.article.author).toMatchObject({
        username,
        following: false,
    });

    // Validate content
    expect(body.article.tagList).toEqual(expect.arrayContaining(article.tagList));
    expect(new Date(body.article.createdAt).toString()).not.toBe('Invalid Date');
    expect(new Date(body.article.updatedAt).toString()).not.toBe('Invalid Date');

    // Validate types
    expect(typeof body.article.slug).toBe('string');

});

test('POST /articles should not create article without authentication', async ({ request }) => {
    const article: ArticlePayload = {
        title: 'Unauthorized Article',
        description: 'This request should fail',
        body: 'Unauthorized users should not create articles',
        tagList: ['negative'],
    };

    const response = await request.post('articles', {
        data: { article },
    });

    expect(response.status()).toBe(401);
    const body = await response.json();

    expect(body.errors).toBeDefined();
    expect(body.errors.token).toContain('is missing');
});

test('POST /articles should not create article with missing required fields', async ({ request }) => {

    const user = await signUpUser();

    const invalidArticle = {
        title: '',
        description: '',
        body: '',
    };

    const response = await request.post('articles', {
        headers: {
            Authorization: `Token ${user.token}`,
        },
        data: {
            article: invalidArticle,
        },
    });

    expect(response.status()).toBe(422);

    const body = await response.json();

    expect(body.errors).toBeDefined();
    expect(body.errors.title).toContain("can't be blank");
    expect(body.errors.description).toContain("can't be blank");
    expect(body.errors.body).toContain("can't be blank");
});
