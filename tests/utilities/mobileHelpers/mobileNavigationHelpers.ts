import { Page, Locator } from '@playwright/test';
import { BaseNavigationHelpers } from '../BaseNavigationHelpers';

export class MobileNavigationHelpers extends BaseNavigationHelpers {
  constructor(page: Page) {
    super(page);
  }

  // Element locators as static getters
  get hamburgerMenuSelector(): Locator { return this.page.locator('.hamburger-menu.js-hamburger-menu.mobile-menu-view') }
  get pageOverlaySelector(): Locator { return this.page.locator('.page-overlay') }
  get sideMenuOpen(): Locator { return this.page.locator('body.is-menu-open') }
  get sideMenuClosed(): Locator { return this.page.locator('body:not(.is-menu-open)') }

  /**
   * Ensures the hamburger side menu is open
   * @returns true if menu is open (was already open or successfully opened), false if failed to open
   */
  async ensureSideMenuOpen(): Promise<boolean> {
    try {
      // First check if menu is already open
      const isAlreadyOpen = await this.sideMenuOpen.isVisible();
      if (isAlreadyOpen) {
        console.log('Side menu is already open');
        return true;
      }

      // Wait for hamburger button and click it
      await this.hamburgerMenuSelector.waitFor({ state: 'visible', timeout: 5000 });
      await this.hamburgerMenuSelector.click();
      
      // Wait for body to gain the "is-menu-open" class
      await this.sideMenuOpen.waitFor({ state: 'visible', timeout: 2000 });
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
      const isAlreadyClosed = await this.sideMenuClosed.isVisible();
      if (isAlreadyClosed) {
        console.log('Side menu is already closed');
        return true;
      }

      // Click overlay to close menu
      await this.pageOverlaySelector.waitFor({ state: 'visible', timeout: 5000 });
      await this.pageOverlaySelector.click();
      
      // Wait for body to lose the "is-menu-open" class
      await this.sideMenuClosed.waitFor({ state: 'visible', timeout: 2000 });
      console.log('Side menu closed successfully');
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.log('Failed to close side menu:', errorMessage);

      return false;
    }
  }

}