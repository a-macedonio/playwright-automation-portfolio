import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly signInButton: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.emailInput = page.getByPlaceholder('Email');
        this.passwordInput = page.getByPlaceholder('Password');
        this.signInButton = page.getByRole('button', { name: 'Sign in' });
        this.errorMessage = page.getByText('credentials invalid');
    }

    async goto() {
        await this.page.goto('/login');
        await expect(this.emailInput).toBeVisible();
    }

    async login(user: string, password: string) {
        await this.emailInput.fill(user);
        await this.passwordInput.fill(password);
        await this.signInButton.click();
    }

    async expectInvalidCredentialsMessage() {
        await expect(this.errorMessage).toBeVisible();
    }

    async expectLoginPageLoaded() {
        await expect(this.emailInput).toBeVisible();
        await expect(this.passwordInput).toBeVisible();
        await expect(this.signInButton).toBeVisible();
    }
}

