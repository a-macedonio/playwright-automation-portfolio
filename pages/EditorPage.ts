import { expect, Locator, Page } from "@playwright/test";

export class EditorPage {
    readonly page: Page;
    readonly titleInput: Locator;
    readonly descriptionInput: Locator;
    readonly bodyInput: Locator;
    readonly publishArticleButton: Locator;
    readonly tagsInput: Locator;
    readonly removeTagButtons: Locator;

    constructor(page: Page) {
        this.page = page;
        this.titleInput = page.getByRole('textbox', { name: 'Article Title' });
        this.descriptionInput = page.getByRole('textbox', { name: 'What\'s this article about?' });
        this.bodyInput = page.getByRole('textbox', { name: 'Write your article (in markdown)' });
        this.tagsInput = page.getByRole('textbox', { name: 'Enter tags' });
        this.publishArticleButton = page.getByRole('button', { name: 'Publish Article' });
        this.removeTagButtons = page.locator('.tag-list .ion-close-round');
    }

    private async removeAllTags() {
        while (await this.removeTagButtons.count() > 0) {
            await this.removeTagButtons.first().click();
        }
    }

    async createNewArticle(title: string, description: string, body: string, tags: string[]) {
        await this.titleInput.fill(title);
        await this.descriptionInput.fill(description);
        await this.bodyInput.fill(body);

        for (const tag of tags) {
            await this.tagsInput.fill(tag);
            await this.tagsInput.press('Enter');
        };

        await Promise.all([
            this.page.waitForURL(/article/),
            this.publishArticleButton.click()
        ]);

    }

    async updateArticle(
        title: string,
        description: string,
        body: string,
        tags: string[]
    ) {
        await this.titleInput.fill(title);
        await this.descriptionInput.fill(description);
        await this.bodyInput.fill(body);

        await this.removeAllTags();

        for (const tag of tags) {
            await this.tagsInput.fill(tag);
            await this.tagsInput.press('Enter');
        }

        await Promise.all([
            this.page.waitForURL(/article/),
            this.publishArticleButton.click()
        ]);
    }

    async expectEditorToHaveArticle(article: {
        title: string;
        description: string;
        body: string;
    }) {
        await expect(this.titleInput).toHaveValue(article.title);
        await expect(this.descriptionInput).toHaveValue(article.description);
        await expect(this.bodyInput).toHaveValue(article.body);
    }
}