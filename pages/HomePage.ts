import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
    readonly page: Page;
    readonly globalFeedTab: Locator;
    readonly yourFeedTab: Locator;
    readonly articlePreview: Locator;
    readonly loadingFeedText: Locator;

    private readonly title = /Conduit/i;


    constructor(page: Page) {
        this.page = page;
        this.globalFeedTab = page.getByText('Global Feed');
        this.yourFeedTab = page.getByText('Your Feed');
        this.articlePreview = page.locator('.article-preview');
        this.loadingFeedText = page.getByText('Loading articles...');
    }

    async goto() {
        await this.page.goto('/');
    }

    async expectHomePageLoaded() {
        await expect(this.page).toHaveTitle(this.title);
        await expect(this.globalFeedTab).toBeVisible();
    }

    async expectGlobalFeedLoaded() {
        await expect(this.loadingFeedText).toBeHidden();
        await expect(this.articlePreview.first()).toBeVisible();
    }

    async expectYourFeedTabToBeVisible() {
        await expect(this.yourFeedTab).toBeVisible();
    }

}

