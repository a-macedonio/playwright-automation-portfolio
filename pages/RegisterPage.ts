import { expect, Locator, Page } from '@playwright/test';

export class RegisterPage {

    readonly page: Page;
    readonly usernameInput: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly signInButton: Locator;
    readonly haveAnAccountLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.getByPlaceholder('Username');
        this.emailInput = page.getByPlaceholder('Email');
        this.passwordInput = page.getByPlaceholder('Password');
        this.signInButton = page.getByRole('button', { name: 'Sign up' });
        this.haveAnAccountLink = page.getByRole('link', { name: 'Have an account?' });
    }

    async goto() {
        await this.page.goto('/register');
        await expect(this.emailInput).toBeVisible();
    }

    async signUp(username: string, email: string, password: string) {
        await this.usernameInput.fill(username);
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.signInButton.click();
    }

    async expectSignUpPageLoaded() {
        await expect(this.emailInput).toBeVisible();
        await expect(this.passwordInput).toBeVisible();
        await expect(this.signInButton).toBeVisible();
    }

    async expectSignUpButtonDisabled() {
        await expect(this.signInButton).toBeDisabled();
    }
}