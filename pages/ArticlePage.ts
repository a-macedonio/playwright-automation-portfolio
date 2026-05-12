import { Locator, Page, expect } from "@playwright/test";
import type { DisplayedArticleData } from '../types/article';

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

    async expectArticleToBeDisplayed(article: DisplayedArticleData) {
        await expect(this.heading).toHaveText(article.title);
        await expect(this.author).toContainText(article.author);
        await expect(this.body).toContainText(article.body);
        await this.expectTagsToContain(article.tagList);
    }

    private async expectTagsToContain(tags: string[]) {
        const tagsText = (await this.tags.allTextContents()).map(tag => tag.trim());
        for (const tag of tags) {
            expect(tagsText).toContain(tag);
        }
    }
}