import { Page, Locator } from '@playwright/test';

export class MobileNavigationHelpers {
  constructor(private page: Page) {}

  // Element locators as static getters
  get hamburgerMenuSelector(): Locator { return this.page.locator('.hamburger-menu.js-hamburger-menu.mobile-menu-view') }
  get pageOverlaySelector(): Locator { return this.page.locator('.page-overlay') }
  
  // Product Category Hardcoded for Single Test Use Case
  get portraitFormatLink(): Locator { return this.page.getByRole('link', { name: 'Hochformat' }) }
  get selectedPortraitFilterOption(): Locator { return this.page.locator('.selected-filter-option[data-filter-value="F570"]') }
  get softcoverMemoriesProductLink(): Locator { return this.page.getByRole('link', { name: /Fotobuch Softcover Memories/i }) }
  
  get openConfiguratorButton(): Locator { return this.page.locator('[data-testid="open-configurator"]') }

  /**
   * Ensures the hamburger side menu is open
   * @returns true if menu is open (was already open or successfully opened), false if failed to open
   */
  async ensureSideMenuOpen(): Promise<boolean> {
    try {
      // First check if menu is already open
      const isAlreadyOpen = await this.page.locator('body.is-menu-open').isVisible();
      if (isAlreadyOpen) {
        console.log('Side menu is already open');
        return true;
      }

      // Wait for hamburger button and click it
      await this.hamburgerMenuSelector.waitFor({ state: 'visible', timeout: 5000 });
      await this.hamburgerMenuSelector.click();
      
      // Wait for body to gain the "is-menu-open" class
      await this.page.locator('body.is-menu-open').waitFor({ state: 'visible', timeout: 2000 });
      console.log('Side menu opened successfully');
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.log('Failed to open side menu:', errorMessage);
      return false;
    }
  }

  async ensureSideMenuClosed(): Promise<boolean> {
    try {      
      // First check if menu is already closed
      const isAlreadyClosed = await this.page.locator('body:not(.is-menu-open)').isVisible();
      if (isAlreadyClosed) {
        console.log('Side menu is already closed');
        return true;
      }

      // Click overlay to close menu
      await this.pageOverlaySelector.waitFor({ state: 'visible', timeout: 5000 });
      await this.pageOverlaySelector.click();
      
      // Wait for body to lose the "is-menu-open" class
      await this.page.locator('body:not(.is-menu-open)').waitFor({ state: 'visible', timeout: 2000 });
      console.log('Side menu closed successfully');
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.log('Failed to close side menu:', errorMessage);

      return false;
    }
  }

  // Select the "Hochformat" format and wait for filter to be applied
  async selectPortraitFormat(): Promise<void> {
    await this.portraitFormatLink.click();
    await this.selectedPortraitFilterOption.waitFor({ state: 'visible', timeout: 5000 });
  }

  // Select the specific product "Fotobuch Softcover Memories" and open configurator
  async openSoftcoverMemoriesConfigurator(): Promise<void> {
    await this.softcoverMemoriesProductLink.click();
    await this.page.waitForURL(/fotobuch-softcover-memories/i, { timeout: 10000 });
    await this.openConfiguratorButton.click();
  }
}