import { Page } from '@playwright/test';

export class BaseNavigationHelpers {
  constructor(protected page: Page) {}

  /**
   * Common methods can be added here
   */

  // Navigate directly to wishlist page instead of using hover popup
  async goToProjectsPage(): Promise<void> {
    await this.page.goto('https://www.kartenmacherei.de/wishlist/', { timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
    
    console.log('Navigated to wishlist page');
  }
}