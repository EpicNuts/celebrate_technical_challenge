import { test, expect, devices } from '@playwright/test';
import dotenv from 'dotenv';
import { CookieHelpers } from './utilities/CookieHelpers';
import { AuthHelpers } from './utilities/AuthHelpers';
import { URLS, getAllTestImages } from './utilities/testData';
import { MobileConfiguratorHelpers } from './utilities/mobileHelpers/mobileConfiguratorHelpers';
import { DesktopNavigationHelpers } from './utilities/desktopHelpers/desktopNavigationHelpers';
import { DesktopConfiguratorHelpers } from './utilities/desktopHelpers/desktopConfiguratorHelpers';

// Load environment variables
dotenv.config();

/**
 * Device combinations for cross-device testing 
 */

const DEVICE_COMBINATIONS = [
  // { 
  //   mobile: devices['iPhone 12'], 
  //   desktop: devices['Desktop Chrome'],
  //   name: 'iPhone-to-Chrome'
  // },
  { 
    mobile: devices['Pixel 5'], 
    desktop: devices['Desktop Chrome'],
    name: 'Android-to-Chrome'
  },
  // { 
  //   mobile: devices['iPhone 12'], 
  //   desktop: devices['Desktop Firefox'],
  //   name: 'iPhone-to-Firefox'
  // }
];

/**
 * Test Case 1: Core Flow - Mobile start => Desktop continue (Explicit Saving)
 * Priority: Highest
 * Covers: Basic cross-device persistence of a user's fotobook journey 
 */

test.describe('Foto Book Cross-Device Experience', () => {  
  // Test each device combination
  DEVICE_COMBINATIONS.forEach(({ mobile, desktop, name }) => {

    test.describe(`Test Case 1: Mobile Start → Desktop Continue (${name})`, () => {

      let authHelpers: AuthHelpers;
      
      test(`should persist photo book state from ${mobile.defaultBrowserType || 'mobile'} to ${desktop.defaultBrowserType || 'desktop'}`, async ({ browser }) => {
        
        // ==================== MOBILE PHASE ==================== //
        
        const mobileContext = await browser.newContext({...mobile});
        const mobilePage = await mobileContext.newPage();
        authHelpers = new AuthHelpers(mobilePage);
        const mobileConfiguratorHelpers = new MobileConfiguratorHelpers(mobilePage);
        
        await test.step('Mobile: Open homepage', async () => {
          await mobilePage.goto(URLS.homepage);
          await CookieHelpers.dismissCookieBanner(mobilePage);
        });
        
        await test.step('Mobile: Login user', async () => {
          await authHelpers.loginUserMobile(
            AuthHelpers.TEST_USER.email, 
            AuthHelpers.TEST_USER.password
          );
        });
        
        await test.step('Mobile: Start new photo book project', async () => {
          await mobilePage.goto(URLS.photobook);
          await mobileConfiguratorHelpers.selectPortraitFormat();
          await mobileConfiguratorHelpers.openSoftcoverMemoriesConfigurator();
        });
        
        await test.step('Mobile: Open configurator', async () => {
          await mobileConfiguratorHelpers.waitForConfiguratorReady();
        });
        
        await test.step('Mobile: Upload fotos', async () => {
          await mobileConfiguratorHelpers.openFotosPanel();
          await mobileConfiguratorHelpers.minimizeSmartLayoutsPromptIfPresent();
          await mobileConfiguratorHelpers.uploadFotos([...getAllTestImages()]);
          expect(
            await mobileConfiguratorHelpers.getUploadedFotoCount()
          ).toBe(
            getAllTestImages().length
          );
        });

        await test.step('Mobile: Place image on page', async () => {
          await mobileConfiguratorHelpers.placeFotosAutomatically();
        });
        
        await test.step('Mobile: Save session', async () => {
          await mobileConfiguratorHelpers.saveProject();
        });
        
        await mobileContext.close();
        
        // // ==================== DESKTOP PHASE ==================== //

        const desktopContext = await browser.newContext({...desktop});
        const desktopPage = await desktopContext.newPage();
        authHelpers = new AuthHelpers(desktopPage);
        const desktopNavigationHelpers = new DesktopNavigationHelpers(desktopPage);
        const desktopConfiguratorHelpers = new DesktopConfiguratorHelpers(desktopPage);
        
        await test.step('Desktop: Navigate to homepage', async () => {
          await desktopPage.goto(URLS.homepage);
          await CookieHelpers.dismissCookieBanner(desktopPage);
        });

        await test.step('Desktop: Login user', async () => {
          await authHelpers.loginUserDesktop(
            AuthHelpers.TEST_USER.email, 
            AuthHelpers.TEST_USER.password
          );
        });
        
        await test.step('Desktop: Find and resume project', async () => {
          await desktopNavigationHelpers.goToProjectsPage();
          expect(await desktopNavigationHelpers.getProjectsCount()).toBeGreaterThan(0);
          await desktopNavigationHelpers.resumeFirstProjectFromProjectlist();
          await desktopPage.waitForURL('**/configurator**', { timeout: 15000 });
        });
         
        await test.step('Desktop: Validate Cross-device User Data', async () => {          
          console.log('Validating uploaded photos and image assignment on desktop...');
          
          // Wait for configurator to fully load
          await desktopPage.waitForLoadState('networkidle');
          await desktopPage.waitForTimeout(3000);
          
          // Use the improved scrolling mechanism to trigger image loading
          await desktopConfiguratorHelpers.waitForImagesAssigned(getAllTestImages().length);
          
          // Validate that images actually loaded after scrolling
          const imagesLoaded = await desktopConfiguratorHelpers.validateImagesLoadedAfterScroll(getAllTestImages().length);
          expect(imagesLoaded).toBe(true);
          
          // Also check assigned count matches expected
          const assignedCount = await desktopConfiguratorHelpers.getAssignedImageCount();
          expect(assignedCount).toBe(getAllTestImages().length);
          
          console.log('✓ Cross-device image validation completed successfully');
        });

        await desktopContext.close();
      });
    });
  });
   /** Cleanup after each test to remove uploaded photos and delete created projects **/
  test.afterEach(async ({ browser }) => {

    console.log('Cleanup: Starting cleanup after test...');
    
    const mobileContext = await browser.newContext(devices['Pixel 5']);
    const mobilePage = await mobileContext.newPage();

    const mobileAuth = new AuthHelpers(mobilePage);
    const mobileConfigurator = new MobileConfiguratorHelpers(mobilePage);
    
    await mobilePage.goto(URLS.homepage);
    await CookieHelpers.dismissCookieBanner(mobilePage);
    await mobileAuth.loginUserMobile(AuthHelpers.TEST_USER.email, AuthHelpers.TEST_USER.password);
    await mobileConfigurator.openConfiguratorForCleanup();
    await mobileConfigurator.openFotosPanel();
    
    console.log('Cleanup: Deleting uploaded photos...');
    await mobileConfigurator.deleteAllUploadedFotos();
    console.log('Cleanup: Deleted all uploaded photos');
    
    // TODO: Clean up projects

    await mobileContext.close();
   
  });
});
