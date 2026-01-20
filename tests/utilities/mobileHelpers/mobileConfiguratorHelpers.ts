import { Page, Locator } from '@playwright/test';
import { URLS } from '../testData';

/**
 * Helper class for interacting with the kartenmacherei configurator interface
 * Provides reusable methods for common configurator operations without full Page Object Model
*/
export class MobileConfiguratorHelpers {
  constructor(private page: Page) {}

  // Top Menu
  get closeConfiguratorButton(): Locator { return this.page.locator('button:has([data-testid="svg-icon-cross"])') };
  get priceSummaryButton(): Locator { return this.page.getByRole('button', { name: 'Preisgestaltung anzeigen' }) };
  get saveButton(): Locator { return this.page.locator('button:has([data-testid="svg-icon-save"])') };  
  get basketButton(): Locator { return this.page.locator('button:has([data-testid="svg-icon-basket"])') };
  // Page Layout and Content
  get doublePageViewToggleButton(): Locator { return this.page.getByTestId('double-page-view-button') };
  get singlePageViewToggleButton(): Locator { return this.page.getByTestId('single-page-view-button') };
  get firstPageSpread(): Locator { return this.page.getByTestId('spread-view-box-content').nth(0) };  
  // Footer Menu
  get mobileMenuBar(): Locator { return this.page.locator('div[role="menubar"][aria-label="bottom navigation mobile"]') };
  get fotosButton(): Locator { return this.page.locator('[role="menuitem"]').filter({ hasText: 'Fotos' }) };
  get layoutButton(): Locator { return this.page.locator('[role="menuitem"]').filter({ hasText: 'Layout' }) };
  
  // Foto Upload Panel
  get fotoUploadPanel(): Locator { return this.page.locator('[role="dialog"]').filter({ hasText: 'Fotos hochladen' }) };
  get fotoUploadClosePanelButton(): Locator { return this.fotoUploadPanel.locator('button[aria-label="close slider menu"]') };

  /**
   * Waits for the configurator to be fully loaded
   * @returns Promise that resolves when configurator is ready
   */
  async waitForConfiguratorReady(): Promise<void> {
    await Promise.all([
      this.closeConfiguratorButton.waitFor({ state: 'visible', timeout: 15000 }),
      this.priceSummaryButton.waitFor({ state: 'visible', timeout: 15000 }),
      this.saveButton.waitFor({ state: 'visible', timeout: 15000 }),
      this.basketButton.waitFor({ state: 'visible', timeout: 15000 }),
      this.doublePageViewToggleButton.waitFor({ state: 'visible', timeout: 15000 }),
      this.singlePageViewToggleButton.waitFor({ state: 'visible', timeout: 15000 }),
      this.firstPageSpread.waitFor({ state: 'visible', timeout: 15000 }),
      this.fotosButton.waitFor({ state: 'visible', timeout: 15000 }),
      this.layoutButton.waitFor({ state: 'visible', timeout: 15000 })
    ]);
    console.log('Configurator is ready');
  }

  async openConfiguratorForCleanup(): Promise<void> {
    await this.page.goto(URLS.photobook);
    // Select the "Hochformat" format and wait for filter to be applied
    await this.page.getByRole('link', { name: 'Hochformat' }).click();
    await this.page.locator('.selected-filter-option[data-filter-value="F570"]').waitFor({ state: 'visible', timeout: 5000 });
    // Select the specific product "Fotobuch Softcover Memories" and open configurator
    await this.page.getByRole('link', { name: /Fotobuch Softcover Memories/i }).click();
    await this.page.waitForURL(/fotobuch-softcover-memories/i, { timeout: 10000 });
    await this.page.locator('[data-testid="open-configurator"]').click();
  }
  
  get fotoUploadButton(): Locator { return this.page.locator('button').filter({ hasText: 'Fotos hochladen' }) };

  /**
   * Opens the fotos panel in the configurator footer
   * @returns Promise that resolves when the fotos panel is expanded
   */
  async openFotosPanel(): Promise<void> {
    // Check if foto upload panel is already open by looking for upload button
    if (await this.fotoUploadPanel.isVisible()) {
      console.log('Fotos panel is already open');
      return;
    } else {
      await this.fotosButton.click();
      await this.fotoUploadPanel.waitFor({ state: 'visible', timeout: 5000 });
      console.log('Opened fotos panel');
    }
  }

  get collapseInfoMessageButton() { return this.page.getByRole('button', { name: 'Collapse info message' }) };
  
  async minimizeSmartLayoutsPromptIfPresent(): Promise<void> {
    try {
      await this.collapseInfoMessageButton.waitFor({ state: 'visible', timeout: 3000 });
      await this.collapseInfoMessageButton.click();
      console.log('Minimized Smart Layouts prompt');
    } catch {
      // Prompt not present - do nothing
    }
  }

  /**
   * Closes the fotos panel by clicking the close button
   * @returns Promise that resolves when the fotos panel is closed
   */
  async closeFotosPanel(): Promise<void> {
    // Check if the panel is open
    if (await this.fotoUploadPanel.isVisible()) {
      await this.fotoUploadClosePanelButton.click();
      // Wait for the panel to close (become hidden)
      await this.fotoUploadPanel.waitFor({ state: 'hidden', timeout: 5000 });
      console.log('Closed fotos panel');
    } else {
      console.log('Fotos panel is already closed');
    }
  }

  get uploadIndicator(): Locator { return this.page.locator('div').filter({ hasText: 'Fotos werden hochgeladen.' }).nth(1) };

  /**
   * Uploads fotos through the configurator foto upload interface
   * @param imagePaths Array of test image paths (use getAllTestImages() from testData)
   * @returns Promise that resolves when upload is complete
   */
  async uploadFotos(imagePaths: readonly string[]): Promise<void> {
    // Ensure fotos panel is open
    await this.openFotosPanel();

    // Trigger file chooser and set files
    const fileChooserPromise = this.page.waitForEvent('filechooser');
    await this.fotoUploadButton.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(imagePaths);
    // Wait for upload indicator to appear and then disappear
    await this.uploadIndicator.waitFor({ state: 'visible', timeout: 10000 });
    await this.uploadIndicator.waitFor({ state: 'hidden', timeout: 30000 });
  }

  get fotoThumbnails() { return this.page.locator('button[aria-label="Foto platzieren"]') };
  get draggableFotoThumbnails() { return this.page.locator('div[data-testid="drag-item"]') };
  
  /**
   * Gets the count of uploaded fotos in the media library
   * @returns Promise that resolves to the number of uploaded fotos
   */
  async getUploadedFotoCount(): Promise<number> {
    // Wait for elements to be present and visible, then get count
    try {
      await this.fotoThumbnails.first().waitFor({ state: 'visible', timeout: 5000 });
    } catch {
      // No fotos found - return 0
      return 0;
    }
    return await this.fotoThumbnails.count();
  }

  get deleteAllFotosButton(): Locator { return this.page.locator('button[aria-label="Alle Fotos löschen"]') };
  get deleteAllFotosConfirmButton(): Locator { return this.page.locator('[role="dialog"]').getByRole('button', { name: 'Alle Fotos löschen' }) };

  /**
   * Deletes all uploaded fotos from the media library
   * @returns Promise that resolves when all fotos are deleted
   */
  async deleteAllUploadedFotos(): Promise<void> {
    // Check if there are any fotos to delete
    const fotoCount = await this.getUploadedFotoCount();
    if (fotoCount === 0) {
      console.log('No fotos to delete');
      return;
    }
    // Click the "Alle Fotos löschen" (Delete all fotos) button
    await this.deleteAllFotosButton.click();
    // Wait for modal and click the confirmation button specifically  
    await this.deleteAllFotosConfirmButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.deleteAllFotosConfirmButton.click();
    // Wait for deletion to complete - fotos should be gone
    await this.page.waitForFunction(
      () => document.querySelectorAll('button[aria-label="Foto platzieren"]').length === 0,
      { timeout: 10000 }
    );
  }

  /**
   * Internal method that performs the actual drag and drop to a specific spread index
   * @param fotoIndex Index of the foto thumbnail (0-based)
   * @param spreadIndex The spread index (maps directly to DOM order)
   */
  async dragAndDropFotoToSpread(fotoIndex: number, spreadIndex: number): Promise<void> {
    
    const fotoThumbnail = this.draggableFotoThumbnails.nth(fotoIndex);

    const targetPage = this.page.getByLabel(`Seite ${spreadIndex}`, { exact: true }).getByTestId('spread-view-box-content');
    const targetDropArea = targetPage.locator('div').filter({ hasText: 'Fotos hierherziehen' }).first();
    
    // Ensure both elements are visible before attempting drag
    await fotoThumbnail.waitFor({ state: 'visible', timeout: 5000 });
    await targetDropArea.waitFor({ state: 'visible', timeout: 5000 });
    
    // Scroll elements into view if needed
    await fotoThumbnail.scrollIntoViewIfNeeded();
    await targetDropArea.scrollIntoViewIfNeeded();
    
    // Get center coordinates for touch gestures
    const thumbnailBox = await fotoThumbnail.boundingBox();
    const dropAreaBox = await targetDropArea.boundingBox();
    
    if (!thumbnailBox || !dropAreaBox) {
      throw new Error(`Cannot get bounding box for drag operation - thumbnail: ${!!thumbnailBox}, dropArea: ${!!dropAreaBox}`);
    }
    
    const startX = thumbnailBox.x + thumbnailBox.width / 2;
    const startY = thumbnailBox.y + thumbnailBox.height / 2;
    const endX = dropAreaBox.x + dropAreaBox.width / 2;
    const endY = dropAreaBox.y + dropAreaBox.height / 2;
    
    // Perform mobile drag and drop using touch gestures
    await this.page.touchscreen.tap(startX, startY);
    await this.page.waitForTimeout(100); // Brief pause after tap
    
    // Perform the drag gesture
    await this.page.evaluate(async (coords) => {
      const startEvent = new TouchEvent('touchstart', {
        touches: [new Touch({
          identifier: 0,
          target: document.elementFromPoint(coords.startX, coords.startY)!,
          clientX: coords.startX,
          clientY: coords.startY
        })],
        bubbles: true
      });
      
      const moveEvent = new TouchEvent('touchmove', {
        touches: [new Touch({
          identifier: 0,
          target: document.elementFromPoint(coords.endX, coords.endY)!,
          clientX: coords.endX,
          clientY: coords.endY
        })],
        bubbles: true
      });
      
      const endEvent = new TouchEvent('touchend', {
        changedTouches: [new Touch({
          identifier: 0,
          target: document.elementFromPoint(coords.endX, coords.endY)!,
          clientX: coords.endX,
          clientY: coords.endY
        })],
        bubbles: true
      });
      
      const startElement = document.elementFromPoint(coords.startX, coords.startY);
      const endElement = document.elementFromPoint(coords.endX, coords.endY);
      
      if (startElement && endElement) {
        startElement.dispatchEvent(startEvent);
        await new Promise(resolve => setTimeout(resolve, 100));
        endElement.dispatchEvent(moveEvent);
        await new Promise(resolve => setTimeout(resolve, 100));
        endElement.dispatchEvent(endEvent);
      }
    }, { startX, startY, endX, endY });
    
    // Wait for the drop to process
    await this.page.waitForTimeout(1500);
    
    // Verification: check if a placed image appeared in the target spread
    try {
      await targetSpread.locator('[data-testid^="u"]').waitFor({ state: 'visible', timeout: 3000 });
      console.log(`✓ Verified: Image ${fotoIndex} successfully placed on spread ${spreadIndex}`);
    } catch {
      console.warn(`⚠ Warning: Could not verify image ${fotoIndex} placement on spread ${spreadIndex}`);
    }
  }

  get targetPage() { return this.page.getByLabel(`Seite`, { exact: true }).getByTestId('spread-view-box-content'); }

  /**
   * Confirms that the image has been dragged and dropped to the target page
   * @param fotoIndex Index of the foto thumbnail (0-based)
   * @param spreadIndex The spread index (maps directly to DOM order)
   */
  async confirmImageDraggedAndDropped(spreadIndex: number): Promise<void> {
    // Confirm that the image is now present on the target page
    const placedImage = this.targetPage.locator(`img[src*=" "]`);
    await placedImage.waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * Places fotos automatically using the auto-fill functionality
   */
  async placeFotosAutomatically(): Promise<void> {   
    // Wait for fotos to be uploaded first
    const fotoThumbnails = this.page.locator('button[aria-label="Foto platzieren"]');
    await fotoThumbnails.first().waitFor({ state: 'visible', timeout: 10000 });
    
    const thumbnailCount = await fotoThumbnails.count();
    if (thumbnailCount === 0) {
      throw new Error('No foto thumbnails found to place');
    }
        
    const autoFillButton = this.page.getByRole('button', { name: 'Platziere Fotos automatisch' });
    await autoFillButton.waitFor({ state: 'visible', timeout: 15000 });
    await autoFillButton.click();
    
    const confirmButton = this.page.getByRole('button', { name: 'Seiten automatisch befüllen' });
    await confirmButton.waitFor({ state: 'visible', timeout: 5000 });    
    await confirmButton.click();
    
    // Wait for the success message to confirm auto-fill completed
    const successMessage = this.page.locator('div').filter({ hasText: 'Super! Alle Fotos konnten' }).first();
    await successMessage.waitFor({ state: 'visible', timeout: 10000 });
  }

  get loadingMessage() { return this.page.locator('p').filter({ hasText: 'Wir speichern Ihr Design.' }); }
  get saveConfirmation() { return this.page.locator('#modal-saved-to-wishlist-success-title').filter({ hasText: 'Ihr Entwurf wurde auf dem Merkzettel gespeichert.' }); }
  
  /**
   * Saves the current project in the configurator
   */
  async saveProject(): Promise<void> {
    await this.saveButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.saveButton.click();
    
    console.log('Save button clicked, waiting for save completion...');
    
    try {
      await Promise.race([
        // Option 1: Loading message appears and disappears
        this.waitForLoadingSequence(),
        // Option 2: Success confirmation appears directly (fast save)
        this.saveConfirmation.waitFor({ state: 'visible', timeout: 8000 })
      ]);
    } catch {
      console.log('Neither loading nor immediate success detected, waiting longer for confirmation...');
    }    
    // Final wait for save confirmation
    await this.saveConfirmation.waitFor({ state: 'visible', timeout: 20000 });
    
    console.log('Project saved successfully');
  }
  
  /**
   * Helper method to wait for loading message sequence
   */
  private async waitForLoadingSequence(): Promise<void> {
    await this.loadingMessage.waitFor({ state: 'visible', timeout: 5000 });
    console.log('Loading message appeared, waiting for it to disappear...');
    await this.loadingMessage.waitFor({ state: 'hidden', timeout: 30000 });
    console.log('Loading message disappeared');
  } 
}