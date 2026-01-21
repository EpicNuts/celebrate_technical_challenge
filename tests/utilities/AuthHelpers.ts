import { Page } from '@playwright/test';
import { MobileNavigationHelpers } from './mobileHelpers/mobileNavigationHelpers';
import { DesktopNavigationHelpers } from './desktopHelpers/desktopNavigationHelpers';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Authentication utilities for kartenmacherei testing
 */

// Type definitions
export interface TestUser {
  readonly email: string;
  readonly password: string;
}

export class AuthHelpers {
    private readonly page: Page;
    private mobileNav: MobileNavigationHelpers;
    private desktopNav: DesktopNavigationHelpers;
    
    // Test user credentials (keep as static since they're shared)
    static readonly TEST_USER: TestUser = {
        email: process.env.TEST_EMAIL!,
        password: process.env.TEST_PASSWORD!
    } as const;

    constructor(page: Page) {
        this.page = page;
        this.mobileNav = new MobileNavigationHelpers(page);
        this.desktopNav = new DesktopNavigationHelpers(page);
    }

    // Mobile-specific login functions that use hamburger menu //
    async openMobileLoginForm(): Promise<void> {
        await this.mobileNav.ensureSideMenuOpen();
        await this.page.locator('[data-target="login-flyout-popup"]').click();
        await this.page.waitForSelector('.login-flyout-popup', { state: 'visible' });
    }

    async loginUserMobile(email: string, password: string): Promise<void> {
        await this.openMobileLoginForm();
        await this.page.fill('#login-email-flyout', email);
        await this.page.fill('#login-password-flyout', password);
        await this.page.click('input[type="submit"][value="Anmelden"]');
        await this.page.waitForSelector('#login-modal', { state: 'hidden' });
        await this.mobileNav.ensureSideMenuClosed();

        console.log('Mobile login completed successfully');
    }

    // Desktop-specific login functions that don't require hamburger menu //
    async loginUserDesktop(email: string, password: string): Promise<void> {
        await this.desktopNav.openAccountMenu();
        await this.page.fill('#login-email-flyout', email);
        await this.page.fill('#login-password-flyout', password);
        await this.page.click('input[type="submit"][value="Anmelden"]');
        await this.page.locator('.header-popup.account-login.js-account-login').waitFor({ state: 'hidden', timeout: 10000 });
        
        console.log('Desktop login completed successfully');
    }
}