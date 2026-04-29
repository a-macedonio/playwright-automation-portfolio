import { expect, Locator } from "@playwright/test";
import { Page } from "@playwright/test";

export class Navbar {
    readonly page: Page;
    readonly homeLink: Locator;
    readonly newArticleLink: Locator;
    readonly settingsLink: Locator;
    readonly brandLink: Locator;
    readonly signInLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.homeLink = this.page.getByRole('link', { name: 'Home' });
        this.signInLink = this.page.getByRole('link', { name: 'Sign in' });
        this.newArticleLink = this.page.getByRole('link', { name: 'New Article' });
        this.brandLink = page.getByRole('link', { name: 'Conduit' });
        this.settingsLink = this.page.getByRole('link', { name: 'Settings' });
    }

    async clickSignIn() {
        await this.signInLink.click();
    }

    userLink(username: string) {
        return this.page.getByRole('link', { name: username });
    }

    async expectUserLoggedIn(username: string) {
        await expect(this.userLink(username)).toBeVisible();
    }
}