import { Page, Locator } from '@playwright/test';
import { BaseConfiguratorHelpers } from '../BaseConfiguratorHelpers';
import { URLS } from '../testData';

/**
 * Helper class for interacting with the kartenmacherei configurator interface
 * Provides reusable methods for common configurator operations without full Page Object Model
*/
export class MobileConfiguratorHelpers extends BaseConfiguratorHelpers {
  constructor(page: Page) {
    super(page);
  }

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
  
  get fotoThumbnails(): Locator { return this.page.locator('button[aria-label="Foto platzieren"]') };
  get draggableFotoThumbnails(): Locator { return this.page.locator('div[data-testid="drag-item"]') };
   
  // Foto Upload Panel
  get fotoUploadButton(): Locator { return this.page.locator('button').filter({ hasText: 'Fotos hochladen' }) };
  get fotoUploadPanel(): Locator { 
    return this.page.locator('[role="dialog"]')
      .filter({ hasText: 'Fotos hochladen' })
  }
  get fotoUploadClosePanelButton(): Locator { return this.fotoUploadPanel.locator('button[aria-label="close slider menu"]') };

  get deleteAllFotosButton(): Locator { return this.page.locator('button[aria-label="Alle Fotos löschen"]') };
  get deleteAllFotosConfirmButton(): Locator { 
    return this.page.locator('[role="dialog"]')
      .getByRole('button', { name: 'Alle Fotos löschen' });
  }
  
  get uploadIndicator(): Locator { 
    return this.page.locator('div')
      .filter({ hasText: 'Fotos werden hochgeladen.' }).nth(1);
  }
  
  get collapseInfoMessageButton(): Locator { return this.page.getByRole('button', { name: 'Collapse info message' }) };
 
  get loadingMessage(): Locator { return this.page.locator('p').filter({ hasText: 'Wir speichern Ihr Design.' }); }
  get saveConfirmation(): Locator { 
    return this.page.locator('#modal-saved-to-wishlist-success-title')
      .filter({ hasText: 'Ihr Entwurf wurde auf dem Merkzettel gespeichert.' }); 
  }
  
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
 
  /** 
   * Minimizes the Smart Layouts prompt if it is present 
   */
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
   * Places fotos automatically using the auto-fill functionality
   */
  async placeFotosAutomatically(): Promise<void> {   
    // Wait for fotos to be uploaded first
    await this.fotoThumbnails.first().waitFor({ state: 'visible', timeout: 10000 });
    
    const thumbnailCount = await this.fotoThumbnails.count();
    if (thumbnailCount === 0) {
      throw new Error('No foto thumbnails found to place');
    }
    console.log(`Found ${thumbnailCount} foto thumbnails, proceeding with auto-fill`);
    const autoFillButton = this.page.getByRole('button', { name: 'Platziere Fotos automatisch' });
    await autoFillButton.waitFor({ state: 'visible', timeout: 15000 });
    await autoFillButton.click();
    const confirmButton = this.page.getByRole('button', { name: 'Seiten automatisch befüllen' });
    await confirmButton.waitFor({ state: 'visible', timeout: 5000 });    
    await confirmButton.click();
    // Wait for the success message to confirm auto-fill completed
    const successMessage = this.page.locator('div').filter({ 
      hasText: 'Super! Alle Fotos konnten' }).first();
    await successMessage.waitFor({ state: 'visible', timeout: 10000 });
  }

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

  /**
   * Opens the configurator for cleanup operations
   */
  async openConfiguratorForCleanup(): Promise<void> {
    await this.page.goto(URLS.photobook);
    await this.selectPortraitFormat();
    await this.openSoftcoverMemoriesConfigurator();
    await this.waitForConfiguratorReady();
  }
}