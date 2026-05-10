import { test } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { LoginPage } from '../../pages/LoginPage';
import { Navbar } from '../../components/Navbar';
import { signUpUser } from '../../utils/api/authApi';
import { RegisterPage } from '../../pages/RegisterPage';

test('Successful login', async ({ page }) => {
  const uniqueId = crypto.randomUUID().replace(/-/g, '');

  const email = `andres_${uniqueId}@test.com`;
  const password = 'Password123';
  const username = `andres_${uniqueId}`;

  await signUpUser(email, password, username);

  const loginPage = new LoginPage(page);
  const navBar = new Navbar(page);
  const homePage = new HomePage(page);

  await loginPage.goto();
  await loginPage.login(email, password);

  await navBar.expectUserLoggedIn(username);
  await homePage.expectHomePageLoaded();
  await homePage.expectGlobalFeedLoaded();
  await homePage.expectYourFeedTabToBeVisible();
});

test('Login with incorrect password', async ({ page }) => {
  const INVALID_PASSWORD = 'WrongPassword123';
  const uniqueId = crypto.randomUUID().replace(/-/g, '');

  const email = `andres_${uniqueId}@test.com`;
  const password = 'Password123';
  const username = `andres_${uniqueId}`;

  await signUpUser(email, password, username);

  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(email, INVALID_PASSWORD);

  await loginPage.expectInvalidCredentialsMessage();
});

test('Login with non-existent email', async ({ page }) => {
  const NON_EXISTENT_USER = `nonexistent_${Date.now()}@test.com`;
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(NON_EXISTENT_USER, 'Password123');

  await loginPage.expectInvalidCredentialsMessage();
});

test('User can navigate from Home to Login ', async ({ page }) => {
  const homePage = new HomePage(page);
  const loginPage = new LoginPage(page);
  const navBar = new Navbar(page);

  await homePage.goto();
  await navBar.signInLink.click();

  await loginPage.expectLoginPageLoaded();
});

test('User can navigate from Sign Up to Login' , async ({ page }) => {
  const signUp = new RegisterPage(page);
  const loginPage = new LoginPage(page);

  await signUp.goto();
  await signUp.haveAnAccountLink.click();

  await loginPage.expectLoginPageLoaded();
});
