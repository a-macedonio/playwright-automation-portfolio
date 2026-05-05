import { test } from '@playwright/test';
import { Navbar } from '../../components/Navbar';
import { EditorPage } from '../../pages/EditorPage';
import { LoginPage } from '../../pages/LoginPage';
import { signUpUser } from '../../utils/api/authApi';
import { ArticlePage } from '../../pages/ArticlePage';

test('Create new article', async ({ page }) => {

    const timestamp = Date.now();

    const email = `andres_${timestamp}@test.com`;
    const password = 'Password123';
    const username = `andres_${timestamp}`;

    const navBar = new Navbar(page);
    const loginPage = new LoginPage(page);
    const editorPage = new EditorPage(page);
    const articlePage = new ArticlePage(page);

    const newArticle = {
        title: `Generic Title ${timestamp}`,
        description: "This is a test article",
        body: "This is test content",
        tags: ["music", "lyrics"]
    }

    const user = await signUpUser(email, password, username);

    // Inject JWT token into localStorage BEFORE the app loads.
    // This bypasses UI login by simulating an already authenticated user
    await page.addInitScript((token) => {
        window.localStorage.setItem('jwtToken', token);
    }, user.token);

    await page.goto('/');

    await navBar.expectUserLoggedIn(username);

    await navBar.newArticleLink.click();

    await editorPage.createNewArticle(newArticle.title, newArticle.description, newArticle.body, newArticle.tags);
    await articlePage.expectHeadingToContain(newArticle.title);
    await articlePage.expectAuthorToContain(username);
});