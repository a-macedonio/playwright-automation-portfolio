import { test } from '@playwright/test';
import { RegisterPage } from '../../pages/RegisterPage';
import { Navbar } from '../../components/Navbar';
import { HomePage } from '../../pages/HomePage';
import { LoginPage } from '../../pages/LoginPage';

test('Successful SignUp', async ({ page }) => {
    const uniqueId = crypto.randomUUID().replace(/-/g, '');
    const username = 'Rigo'
    const email = `rigo_${uniqueId}@test.com`;
    const password = 'Password123'

    const registerPage = new RegisterPage(page);
    const navbar = new Navbar(page);
    const homePage = new HomePage(page);

    await registerPage.goto();
    await registerPage.signUp(username, email, password);

    console.log('New email registered: ', email);

    await navbar.expectUserLoggedIn(username);
    await homePage.expectHomePageLoaded();
    await homePage.expectGlobalFeedLoaded();
    await homePage.expectYourFeedTabToBeVisible();

});

test('User can navigate from Login to Sign Up' , async ({ page }) => {
  const registerPage = new RegisterPage(page);
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.needAnAccountLink.click();

  await registerPage.expectSignUpPageLoaded();
});

test('SignUp button disabled when Username missing', async ({ page }) => {

    const email = "user@test.com";
    const password = 'Password123';

    const registerPage = new RegisterPage(page);

    await registerPage.goto();
    await registerPage.emailInput.fill(email);
    await registerPage.passwordInput.fill(password);
    await registerPage.expectSignUpButtonDisabled();
})

test('SignUp button disabled when Email missing', async ({ page }) => {

    const username = 'Rigo'
    const password = 'Password123';

    const registerPage = new RegisterPage(page);

    await registerPage.goto();
    await registerPage.usernameInput.fill(username);
    await registerPage.passwordInput.fill(password);
    await registerPage.expectSignUpButtonDisabled();
})

test('SignUp button disabled when Password missing', async ({ page }) => {

    const username = 'Rigo'
    const email = "user@test.com";

    const registerPage = new RegisterPage(page);

    await registerPage.goto();
    await registerPage.usernameInput.fill(username);
    await registerPage.emailInput.fill(email);
    await registerPage.expectSignUpButtonDisabled();
})