import { Page, Locator } from '@playwright/test';

export class DesktopNavigationHelpers {
  constructor(private page: Page) {}
    
  // Account/Login section
  get accountLink(): Locator { return this.page.locator('a.popup-login-open.link-customer-account') };
  get accountDropdown(): Locator { return this.page.locator('.header-popup.account-popup.js-account-dropdown-menu') };  
  get accountLoginPopup(): Locator { return this.page.locator('.header-popup.account-login.js-account-login') };
  get customerNameElement(): Locator { return this.page.locator('.customer-name.js-customer-name#customer-name') };
  
  /**
   * Hovers over the account link to show the account dropdown or login form
   */
  async openAccountMenu(): Promise<void> {
    await this.accountLink.waitFor({ state: 'visible', timeout: 5000 });
    await this.accountLink.hover();
    await this.accountLoginPopup.waitFor({ state: 'visible', timeout: 3000 })
    
    console.log('Account menu opened');
  }

  // Projects methods
  /**
   * Navigates to the full wishlist page
   */
  async goToProjectsPage(): Promise<void> {
    // Navigate directly to wishlist page instead of using hover popup
    await this.page.goto('https://www.kartenmacherei.de/wishlist/', { timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
    
    console.log('Navigated to wishlist page');
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