import { Locator, Page, expect } from "@playwright/test";

export class ArticlePage {
    readonly page: Page;
    readonly heading: Locator;
    readonly author: Locator;

    constructor(page: Page) {
        this.page = page;
        this.heading = page.locator('.banner .container h1');
        this.author = page.locator('.banner .author');
    }

    async expectHeadingToContain(title: string) {
        await expect(this.heading).toHaveText(title);
    }

    async expectAuthorToContain(author: string) {
        await expect(this.author).toContainText(author);
    }
}