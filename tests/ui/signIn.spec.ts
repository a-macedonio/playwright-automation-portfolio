import { test } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { LoginPage } from '../../pages/LoginPage';
import { Navbar } from '../../components/Navbar';
import { signUpUser } from '../../utils/api/authApi';

test('Successful login', async ({ page }) => {
  const timestamp = Date.now();

  const email = `andres_${timestamp}@test.com`;
  const password = 'Password123';
  const username = `andres_${timestamp}`;

  await signUpUser(email, password, username);

  const loginPage = new LoginPage(page);
  const navbar = new Navbar(page);
  const homePage = new HomePage(page);

  await loginPage.goto();
  await loginPage.login(email, password);

  console.log('email: ', email);
  console.log('password: ', password);

  await navbar.expectUserLoggedIn(username);
  await homePage.expectHomePageLoaded();
  await homePage.expectGlobalFeedLoaded();
  await homePage.expectYourFeedTabToBeVisible();
});

test('Login with incorrect password', async ({ page }) => {
  const INVALID_PASSWORD = 'WrongPassword123';
  const timestamp = Date.now();

  const email = `andres_${timestamp}@test.com`;
  const password = 'Password123';
  const username = `andres_${timestamp}`;

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

test('User can navigate to Sign In from home', async ({ page }) => {
  const homePage = new HomePage(page);
  const loginPage = new LoginPage(page);
  const navbar = new Navbar(page);

  await homePage.goto();
  await navbar.signInLink.click();

  await loginPage.expectLoginPageLoaded();
});