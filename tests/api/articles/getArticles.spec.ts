import { test, expect } from '@playwright/test';
import { signUpUser } from '../../../utils/api/authApi';

test('GET /articles should return articles list', async ({ request }) => {
    const response = await request.get('articles');
    console.log('Request submited to:', response.url());

    expect(response.status()).toBe(200);

    const body = await response.json();

    // Validate response contract
    expect(body).toHaveProperty('articles');
    expect(body).toHaveProperty('articlesCount');

    // Validate types
    expect(Array.isArray(body.articles)).toBe(true);
    expect(typeof body.articlesCount).toBe('number');
});

test('POST /articles should persist article and retrieve it by slug', async ({ request }) => {
    const uniqueId = crypto.randomUUID().replace(/-/g, '');
    const username = `testuser_${uniqueId}`;
    const email = `testuser_${uniqueId}@mail.com`;
    const password = 'Password123!';
    const user = await signUpUser(email, password, username);

    const article = {
        title: `Persisted Article ${uniqueId}`,
        description: 'This article should be retrievable by slug',
        body: 'This is the persisted article content',
        tagList: ['api', 'persistence'],
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
    expect(createBody.article.slug).toEqual(expect.any(String));

    expect(createBody).toHaveProperty('article');

    //Retrieving article by slug
    const getResponse = await request.get(`articles/${slug}`, {
        headers: {
            Authorization: `Token ${user.token}`,
        },
    });

    expect(getResponse.status()).toBe(200);

    const getBody = await getResponse.json();

    // Validate response contract
    expect(getBody).toHaveProperty('article');

    // Validate content
    expect(createBody.article.slug.length).toBeGreaterThan(0);
    expect(getBody.article).toMatchObject({
        slug,
        title: article.title,
        description: article.description,
        body: article.body,
        favorited: false,
        favoritesCount: 0,
    });

    expect(new Date(getBody.article.createdAt).toString()).not.toBe('Invalid Date');
    expect(new Date(getBody.article.updatedAt).toString()).not.toBe('Invalid Date');

    expect(getBody.article.tagList).toEqual(expect.arrayContaining(article.tagList));
    expect(getBody.article.tagList).toHaveLength(article.tagList.length);

    expect(getBody.article.author).toMatchObject({
        username,
        following: false,
    });


});

test('GET /articles/:slug should retrieve a public existing article without authentication', async ({ request }) => {

    const slug = 'how-to-learn-javascript-efficiently';

    const getResponse = await request.get(`articles/${slug}`);
    expect(getResponse.status()).toBe(200);

    const getBody = await getResponse.json();

    // Validate response contract
    expect(getBody).toHaveProperty('article');
    expect(getBody.article).toHaveProperty('title');
    expect(getBody.article).toHaveProperty('author');

});