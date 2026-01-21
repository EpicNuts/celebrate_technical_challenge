import { Locator, Page } from '@playwright/test';

export class BaseConfiguratorHelpers {
  constructor(protected page: Page) {}

  /**
   * Common locators can be added here
   */
  
  get getSoftcoverFotobuchOption(): Locator { return this.page.getByRole('link', { name: /Fotobuch Softcover Memories/i }) }  
  get openConfiguratorButton(): Locator { return this.page.locator('[data-testid="open-configurator"]') }
  get portraitFormatOption(): Locator { return this.page.getByRole('link', { name: 'Hochformat' }) }
  get selectedPortraitFilter(): Locator { return this.page.locator('.selected-filter-option[data-filter-value="F570"]') }
  
  /**
   * Common methods can be added here
   */

  // Select the "Hochformat" format and wait for filter to be applied
  async selectPortraitFormat(): Promise<void> {
    await this.portraitFormatOption.click();
    await this.selectedPortraitFilter.waitFor({ state: 'visible', timeout: 5000 });
  }

  // Select the specific product "Fotobuch Softcover Memories" and open configurator
  async openSoftcoverMemoriesConfigurator(): Promise<void> {
    await this.getSoftcoverFotobuchOption.click();
    await this.page.waitForURL(/fotobuch-softcover-memories/i, { timeout: 10000 });
    await this.openConfiguratorButton.click();
  }
}