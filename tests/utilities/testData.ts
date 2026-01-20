/**
 * Test data and constants for kartenmacherei testing
 */

// Type definitions for test data

export interface TestImages {
  readonly image1: string;
  readonly image2: string;
  readonly image3: string;
  readonly image4: string;
  readonly image5: string;
  readonly image6: string;
}

export interface TestUrls {
  readonly homepage: string;
  readonly photobook: string;
  readonly wishlist: string;
}

// Test data constants

export const TEST_IMAGES: TestImages = {
  image1: 'tests/images/heic0515a.jpg',
  image2: 'tests/images/heic0601a.jpg',
  image3: 'tests/images/heic0822a.jpg',
  image4: 'tests/images/heic1105a.jpg',
  image5: 'tests/images/heic1307a.jpg',
  image6: 'tests/images/heic1808a.jpg'
} as const;

export const URLS: TestUrls = {
  homepage: 'https://kartenmacherei.de',
  photobook: 'https://kartenmacherei.de/fotoprodukte/fotobuecher/alle-fotobuecher/softcover.html',
  wishlist: 'https://www.kartenmacherei.de/wishlist/'
} as const;

// Type-safe helper functions

export function getAllTestImages(): readonly string[] {
  return Object.values(TEST_IMAGES);
}

export function getRandomTestImage(): string {
  const images = getAllTestImages();
  return images[Math.floor(Math.random() * images.length)];
}

export function getTestImageByKey(key: keyof TestImages): string {
  return TEST_IMAGES[key];
}