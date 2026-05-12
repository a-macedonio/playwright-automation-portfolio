import { expect, Locator, Page } from "@playwright/test";
import type { ArticleFormData, ArticleEditorValues } from '../types/article';

export class EditorPage {
    readonly page: Page;
    readonly titleInput: Locator;
    readonly descriptionInput: Locator;
    readonly bodyInput: Locator;
    readonly publishArticleButton: Locator;
    readonly tagsInput: Locator;
    readonly tagPills: Locator;

    constructor(page: Page) {
        this.page = page;
        this.titleInput = page.getByRole('textbox', { name: 'Article Title' });
        this.descriptionInput = page.getByRole('textbox', { name: 'What\'s this article about?' });
        this.bodyInput = page.getByRole('textbox', { name: 'Write your article (in markdown)' });
        this.tagsInput = page.getByRole('textbox', { name: 'Enter tags' });
        this.publishArticleButton = page.getByRole('button', { name: 'Publish Article' });
        this.tagPills = page.locator('.tag-list .tag-pill');
    }

    private async removeAllTags() {
        while (await this.tagPills.count() > 0) {
            const countBefore = await this.tagPills.count();
            await this.tagPills.first().locator('.ion-close-round').click();
            await expect(this.tagPills).toHaveCount(countBefore - 1);
        }
    }

    private async fillArticleForm(article: ArticleFormData) {
        await this.titleInput.fill(article.title);
        await this.descriptionInput.fill(article.description);
        await this.bodyInput.fill(article.body);
        await this.addTags(article.tags);
    }

    private async addTags(tags: string[]) {
        for (const tag of tags) {
            await this.tagsInput.fill(tag);
            await this.tagsInput.press('Enter');
        }
    }

    private async submitArticle() {
        await Promise.all([
            this.page.waitForURL(/article/),
            this.publishArticleButton.click()
        ]);
    }

    async createNewArticle(article: ArticleFormData) {
        await this.fillArticleForm(article);
        await this.submitArticle();
    }

    async updateArticle(article: ArticleFormData) {
        await this.removeAllTags();
        await this.fillArticleForm(article);
        await this.submitArticle();
    }

    async expectEditorToHaveArticle(article: ArticleEditorValues) {
        await expect(this.titleInput).toHaveValue(article.title);
        await expect(this.descriptionInput).toHaveValue(article.description);
        await expect(this.bodyInput).toHaveValue(article.body);
    }
}