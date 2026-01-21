import { Page } from '@playwright/test';
import { BaseNavigationHelpers } from '../baseNavigationHelpers';

export class DesktopNavigationHelpers extends BaseNavigationHelpers {
  constructor(page: Page) {
    super(page);
  }
    
  /**
   * Hovers over the account link to show the account dropdown or login form
   */
  async openAccountMenu(): Promise<void> {
    const accountLink = this.page.locator('a.popup-login-open.link-customer-account');
    await accountLink.waitFor({ state: 'visible', timeout: 5000 });
    await accountLink.hover();
    await this.page.locator('.header-popup.account-login.js-account-login').waitFor({ state: 'visible', timeout: 3000 })
    
    console.log('Account menu opened');
  }

  /**
   * Gets the current projects item count by counting actual project items on the page
   */
  async getProjectsCount(): Promise<number> {
    try {
      // Count actual project items on the wishlist page
      const projectItems = this.page.locator('.product.js-product');
      const count = await projectItems.count();

      console.log(`Found ${count} projects on the page`);
      return count;
    } catch (error) {
      
      console.log(`Error counting projects: ${error}`);
      return 0;
    }
  }

  /**
   * Resumes the first project from the project list
   */
  async resumeFirstProjectFromProjectlist(): Promise<void> {
    // Click the first "Zur Gestaltung" button to resume the project
    const resumeProjectButton = this.page.locator('span.mimic-link').filter({ hasText: 'Zur Gestaltung' }).first();
    await resumeProjectButton.waitFor({ state: 'visible', timeout: 10000 });
    await resumeProjectButton.click();
  }
}