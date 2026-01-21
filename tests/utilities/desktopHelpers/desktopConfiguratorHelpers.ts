import { Page, Locator, Response } from '@playwright/test';

export class DesktopConfiguratorHelpers {
  constructor(private page: Page) {}

  // Element locators as static getters
  get uploadedPhotoThumbnails(): Locator { return this.page.getByRole('button', { name: 'Foto platzieren' }) };
  get spreadViewBoxes(): Locator { return this.page.locator('[data-testid="spread-view-box-content"]') }; 
  get clickableImageAreas(): Locator { return this.spreadViewBoxes.locator('button[aria-label*="Foto"]') };
  get imageCanvases(): Locator { return this.spreadViewBoxes.locator('canvas') };

  // Elements that indicate an empty drop area (with "add image" icon)
  get emptyDropAreas(): Locator { 
    return this.spreadViewBoxes.locator('[data-testid="spread-drop-area"]').filter({ 
      has: this.page.locator('svg[data-testid="svg-icon-addImageElement"]') 
    }); 
  }

  // Elements that indicate an image has been assigned (not empty drop areas)
  get assignedImageContainers(): Locator {
    return this.spreadViewBoxes.locator('[data-testid="spread-drop-area"]').filter({ 
      hasNot: this.page.locator('svg[data-testid="svg-icon-addImageElement"]') 
    });
  }

  /**
   * Waits for images to be assigned by checking for non-empty drop areas and triggering lazy loading
   * First tries without page reload, then with reload as fallback
   */
  async waitForImagesAssigned(expectedCount: number, timeoutMs: number = 30000): Promise<void> {
    console.log(`Waiting for ${expectedCount} images to be assigned...`);
    
    // First attempt: try triggering lazy loading without page reload
    const initialSuccess = await this.attemptImageLoadingWithoutReload(expectedCount);
    
    if (initialSuccess) {
      console.log('✓ Images loaded successfully without page reload');
      return;
    }
    
    console.log('Initial attempt failed, trying with page reload...');
    
    // Fallback: reload page and try again
    await this.page.reload();
    await this.page.waitForLoadState('networkidle');
    await this.spreadViewBoxes.first().waitFor({ state: 'visible', timeout: timeoutMs });
    
    const reloadSuccess = await this.attemptImageLoadingWithoutReload(expectedCount);
    
    if (!reloadSuccess) {
      console.log('Warning: Images still not loading after page reload');
    }
  }

  /**
   * Attempts to load images through scrolling and interaction without page reload
   */
  private async attemptImageLoadingWithoutReload(expectedCount: number): Promise<boolean> {
    try {
      // 1. Scroll through all spreads to trigger lazy loading
      const spreads = this.spreadViewBoxes;
      const spreadCount = await spreads.count();
      console.log(`Scrolling through ${spreadCount} spreads to trigger lazy loading...`);
      
      for (let i = 0; i < spreadCount; i++) {
        // console.log(`Scrolling to spread ${i}...`);
        await spreads.nth(i).scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(1000); // Longer wait for each spread
        
        // Check if images started loading after this scroll
        if (i === 3) { 
          console.log('Reached spread 3 - checking if images started loading...');
          await this.page.waitForTimeout(2000); // Extra wait at the trigger point
          
          const celebrateImages = await this.page.locator('img[src*="images.celebrate.company"]').count();
          console.log(`Images with celebrate.company URLs after spread 3: ${celebrateImages}`);
        }
      }
      
      // Check if we have the expected number of assigned areas
      const emptyAreas = await this.emptyDropAreas.count();
      const totalDropAreas = await this.spreadViewBoxes.locator('[data-testid="spread-drop-area"]').count();
      const assignedAreas = totalDropAreas - emptyAreas;
      
      console.log(`Found ${assignedAreas} assigned areas out of ${totalDropAreas} total (expected: ${expectedCount})`);
      
      return assignedAreas >= expectedCount;
      
    } catch (error) {
      console.log(`Error during image loading attempt: ${error}`);
      return false;
    }
  }

  /**
   * Gets the count of uploaded photos in the thumbnail gallery
   */
  async getUploadedPhotoCount(): Promise<number> {
    try {
      await this.uploadedPhotoThumbnails.first().waitFor({ state: 'visible', timeout: 5000 });
      const count = await this.uploadedPhotoThumbnails.count();
      console.log(`Found ${count} uploaded photos in gallery`);
      return count;
    } catch (error) {
      console.log(`No uploaded photos found or error: ${error}`);
      return 0;
    }
  }

  /**
   * Waits for image CDN requests to complete
   * Monitors network traffic to images.celebrate.company to ensure images are fully loaded
   */
  async waitForImageCDNRequests(expectedImageCount: number, timeoutMs: number = 30000): Promise<void> {
    console.log(`Waiting for ${expectedImageCount} image CDN requests to complete...`);
    
    const imageResponses: string[] = [];
    
    // Listen for responses from the image CDN
    const responseHandler = (response: Response) => {
      const url = response.url();
      if (url.includes('images.celebrate.company') && response.status() === 200) {
        console.log(`✓ Image loaded: ${url.split('/').pop()}`);
        imageResponses.push(url);
      }
    };
    
    this.page.on('response', responseHandler);
    
    try {
      // Wait for the expected number of image responses
      await this.page.waitForFunction(
        (count) => {
          const imageElements = document.querySelectorAll('img[src*="images.celebrate.company"]');
          return imageElements.length >= count;
        },
        expectedImageCount,
        { timeout: timeoutMs }
      );
      
      // Additional wait for network stability
      await this.page.waitForLoadState('networkidle');
      
      console.log(`✓ All ${expectedImageCount} images loaded from CDN`);
      
    } catch (error) {
      console.log(`Warning: Timeout waiting for image CDN requests: ${error}`);
    } finally {
      this.page.off('response', responseHandler);
    }
  }

  /**
   * Gets the count of images that have been assigned to spread pages
   */
  async getAssignedImageCount(): Promise<number> {    
    // Count assigned areas (drop areas without the "add image" icon)
    const emptyCount = await this.emptyDropAreas.count();
    const totalDropAreas = await this.spreadViewBoxes.locator('[data-testid="spread-drop-area"]').count();
    const assignedCount = totalDropAreas - emptyCount;
    
    console.log(`Found ${assignedCount} assigned images (${totalDropAreas} total areas - ${emptyCount} empty areas)`);
    return assignedCount;
  }

  /**
   * Validates that images are actually loaded and visible after scrolling
   * Only checks canvas images (alt="previewImage"), not media library thumbnails
   */
  async validateImagesLoadedAfterScroll(expectedCount: number): Promise<boolean> {
    console.log('Validating that canvas images loaded correctly after scrolling...');
    
    // Only count canvas images, not thumbnail images in media library
    const canvasImages = this.page.locator('img[alt="previewImage"][data-critical-resource="true"]');
    const canvasImageCount = await canvasImages.count();
    
    console.log(`Found ${canvasImageCount} canvas images (expected: ${expectedCount})`);
    
    if (canvasImageCount >= expectedCount) {
      // Verify first few canvas images are actually visible and loaded
      const maxCheck = Math.min(canvasImageCount, expectedCount);
      for (let i = 0; i < maxCheck; i++) {
        const img = canvasImages.nth(i);
        const isVisible = await img.isVisible();
        const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
        const isPending = await img.getAttribute('data-pending');
        
        console.log(`Canvas image ${i}: visible=${isVisible}, naturalWidth=${naturalWidth}, pending=${isPending}`);
        
        if (!isVisible || naturalWidth === 0 || isPending === 'true') {
          console.log(`✗ Canvas image ${i} is not properly loaded`);
          return false;
        }
      }

      console.log(`✓ All ${maxCheck} canvas images are properly loaded and visible`);
      return true;
    } else {
      console.log(`✗ Expected ${expectedCount} canvas images, only found ${canvasImageCount}`);
      return false;
    }
  }
}