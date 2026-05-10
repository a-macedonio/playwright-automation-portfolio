import { Locator, Page, expect } from "@playwright/test";

export class ArticlePage {
    readonly page: Page;
    readonly heading: Locator;
    readonly author: Locator;
    readonly editArticleButton: Locator;
    readonly body: Locator;
    readonly tags: Locator;


    constructor(page: Page) {
        this.page = page;
        this.heading = page.locator('.banner .container h1');
        this.author = page.locator('.banner .author');
        this.editArticleButton = page.locator('.banner').getByRole('link', { name: /Edit Article/i });
        this.body = page.locator('.article-content p');
        this.tags = page.locator('.tag-list .tag-pill');
    }

    async expectHeadingToContain(title: string) {
        await expect(this.heading).toHaveText(title);
    }

    async expectAuthorToContain(author: string) {
        await expect(this.author).toContainText(author);
    }

    async expectBodyToContain(body: string) {
        await expect(this.body).toContainText(body);
    }

    async expectTagsToContain(tags: string[]) {
        const tagsText = (await this.tags.allTextContents()).map(tag => tag.trim());
        for (const tag of tags) {
            expect(tagsText).toContain(tag);
        }
    }
}