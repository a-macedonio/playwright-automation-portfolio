import { test, expect } from '@playwright/test';
import { signUpUser } from '../../../utils/api/authApi';

test('PUT /articles/:slug should update an existing article', async ({ request }) => {
    //Act 1: Creating a new article
    const uniqueId = crypto.randomUUID().replace(/-/g, '');
    const username = `testuser_${uniqueId}`;
    const email = `testuser_${uniqueId}@mail.com`;
    const password = 'Password123!';
    const user = await signUpUser(email, password, username);

    const article = {
        title: `Original Article ${uniqueId}`,
        description: 'This an original new article',
        body: 'This is the original article content',
        tagList: ['api', 'post'],
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
    expect(createBody.article.author.username).toBe(user.username);

    const updatedArticle = {
        title: `Updated Article ${uniqueId}`,
        description: 'This article has been updated',
        body: 'This content has been updated',
        tagList: ['post']
    };

    

    const putResponse = await request.put(`articles/${slug}`, {
        headers: {
            Authorization: `Token ${user.token}`
        },
        data: {
            article: updatedArticle
        }
    });

    expect(putResponse.status()).toBe(200);
    const putBody = await putResponse.json();

    // Validate response contract
    expect(putBody).toHaveProperty('article');

    // Validate content
    expect(typeof putBody.article.slug).toBe('string');
    expect(putBody.article.slug.length).toBeGreaterThan(0);
    expect(putBody.article.slug).not.toBe(slug);

    expect(putBody.article).toMatchObject({
        title: updatedArticle.title,
        description: updatedArticle.description,
        body: updatedArticle.body,
        favorited: false,
        favoritesCount: 0,
    });

    expect(new Date(putBody.article.createdAt).toString()).not.toBe('Invalid Date');
    expect(new Date(putBody.article.updatedAt).toString()).not.toBe('Invalid Date');

    expect(putBody.article.tagList).toEqual(expect.arrayContaining(updatedArticle.tagList));
    expect(putBody.article.tagList).toHaveLength(updatedArticle.tagList.length);

    expect(putBody.article.author).toMatchObject({
        username,
        following: false,
    });

});

test('PUT /articles/:slug should update only provided fields', async ({ request }) => {
  // Create user and article
  const uniqueId = crypto.randomUUID().replace(/-/g, '');
  const username = `testuser_${uniqueId}`;
  const email = `testuser_${uniqueId}@mail.com`;
  const password = 'Password123!';

  const user = await signUpUser(email, password, username);

  const article = {
    title: `Partial Update Article ${uniqueId}`,
    description: 'Original description',
    body: 'Original body content',
    tagList: ['partial'],
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

  // Update only description
  const partialUpdate = {
    description: 'Updated description only',
  };

  const putResponse = await request.put(`articles/${slug}`, {
    headers: {
      Authorization: `Token ${user.token}`,
    },
    data: {
      article: partialUpdate,
    },
  });

  expect(putResponse.status()).toBe(200);

  const putBody = await putResponse.json();

  // Validate updated field
  expect(putBody.article.description).toBe(partialUpdate.description);

  // Validate unchanged fields
  expect(putBody.article.title).toBe(article.title);
  expect(putBody.article.body).toBe(article.body);

  expect(putBody.article.tagList).toEqual(expect.arrayContaining(article.tagList));
});