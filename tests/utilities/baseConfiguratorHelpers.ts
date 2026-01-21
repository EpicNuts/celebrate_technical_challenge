import { Locator, Page } from '@playwright/test';

export class BaseConfiguratorHelpers {
  constructor(protected page: Page) {}

  /**
   * Common locators can be added here
   */ 

  get openConfiguratorButton(): Locator { return this.page.locator('[data-testid="open-configurator"]') }

  /**
   * Common methods can be added here
   */

  // Select the "Hochformat" format and wait for filter to be applied
  async selectPortraitFormat(): Promise<void> {
    await this.page.getByRole('link', { name: 'Hochformat' }).click();
    await this.page.locator('.selected-filter-option[data-filter-value="F570"]').waitFor({ state: 'visible', timeout: 5000 });
  }

  // Select the specific product "Fotobuch Softcover Memories" and open configurator
  async openSoftcoverMemoriesConfigurator(): Promise<void> {
    await this.page.getByRole('link', { name: /Fotobuch Softcover Memories/i }).click();
    await this.page.waitForURL(/fotobuch-softcover-memories/i, { timeout: 10000 });
    await this.openConfiguratorButton.click();
  }
}