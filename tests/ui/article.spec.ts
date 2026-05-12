import { test } from '@playwright/test';
import { Navbar } from '../../components/Navbar';
import { EditorPage } from '../../pages/EditorPage';
import { signUpUser } from '../../utils/api/authApi';
import { ArticlePage } from '../../pages/ArticlePage';
import { ArticlePayload } from '../../types/article';

test('Authenticated user can create a new article', async ({ page }) => {

  const uniqueId = crypto.randomUUID().slice(0, 8);
  const username = `user_${uniqueId}`;
  const email = `${username}@test.com`;

  const navBar = new Navbar(page);
  const editorPage = new EditorPage(page);
  const articlePage = new ArticlePage(page);

  const newArticle: ArticlePayload = {
    title: `Generic Title ${uniqueId}`,
    description: "This is a test article",
    body: "This is test content",
    tagList: ["music", "lyrics"]
  }

  const user = await signUpUser({email, username});

  // Inject JWT token into localStorage BEFORE the app loads.
  // This bypasses UI login by simulating an already authenticated user
  await page.addInitScript((token) => {
    window.localStorage.setItem('jwtToken', token);
  }, user.token);

  await page.goto('/');

  await navBar.expectUserLoggedIn(username);

  await navBar.newArticleLink.click();

  await editorPage.createNewArticle(newArticle);
  await articlePage.expectArticleToBeDisplayed({ ...newArticle, author: username });
});

test('Authenticated user can edit own article', async ({ page }) => {
  const uniqueId = crypto.randomUUID().slice(0, 8);

  const username = `user_${uniqueId}`;
  const email = `${username}@test.com`;

  const navBar = new Navbar(page);
  const editorPage = new EditorPage(page);
  const articlePage = new ArticlePage(page);

  const newArticle: ArticlePayload = {
    title: `Original Title ${uniqueId}`,
    description: 'This is the original description',
    body: 'This is the original content',
    tagList: ['music', 'lyrics'],
  };

  const updatedArticle: ArticlePayload = {
    title: `Updated Title ${uniqueId}`,
    description: 'This is the updated description',
    body: 'This is the updated content',
    tagList: ['updated', 'article'],
  };

  const user = await signUpUser({email, username});

  await page.addInitScript((token) => {
    window.localStorage.setItem('jwtToken', token);
  }, user.token);

  await page.goto('/');

  await navBar.expectUserLoggedIn(username);

  // Create article
  await navBar.newArticleLink.click();
  await editorPage.createNewArticle(newArticle);
  await articlePage.expectArticleToBeDisplayed({ ...newArticle, author: username });

  // Edit article
  await articlePage.editArticleButton.click();
  await editorPage.expectEditorToHaveArticle(newArticle);
  await editorPage.updateArticle(updatedArticle);

  // Validate updated article
  await articlePage.expectArticleToBeDisplayed({ ...updatedArticle, author: username });
});