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

    private async getLoggedInUsername() {
        const profileLink = this.page
            .locator('app-layout-header')
            .locator('a[href^="/profile/"]');

        await expect(profileLink, 'Expected a profile link in the navbar').toBeVisible();

        return (await profileLink.innerText()).trim();
    }

    async expectUserLoggedIn(expectedUsername: string) {
        const actualUsername = await this.getLoggedInUsername();

        expect(
            actualUsername,
            `Auth identity mismatch: expected "${expectedUsername}", but UI is logged in as "${actualUsername}". Possible backend token collision/session contamination.`
        ).toBe(expectedUsername);
    }
}