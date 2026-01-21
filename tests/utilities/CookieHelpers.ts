import { Page } from '@playwright/test';

/**
 * 
 * Handles cookie banners
 */

export class CookieHelpers {

  static async dismissCookieBanner(page: Page): Promise<boolean> {
    try {
      const rejectCookiesButton = page.getByRole('button', { name: 'opt. Cookies ablehnen' });

      await rejectCookiesButton.waitFor({ state: 'visible', timeout: 3000 });      
      await rejectCookiesButton.click();
      await rejectCookiesButton.waitFor({ state: 'hidden', timeout: 1000 }); 
      
      console.log('Cookie banner dismissed');
      return true;
      
    } catch {  
      console.log('Cookie banner not found or already dismissed');
      return false;
    }
  }
}