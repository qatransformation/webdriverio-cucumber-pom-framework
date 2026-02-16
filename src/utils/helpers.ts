import { browser } from '@wdio/globals';

/**
 * Utilities for interacting with page elements
 */

/**
 * Wait for an element to be visible and clickable
 */
export async function waitForClickable(selector: string, timeout: number = 30000): Promise<void> {
  const element = await $(selector);
  await element.waitForDisplayed({ timeout });
  await element.waitForClickable({ timeout });
}

/**
 * Scroll to a specific element
 */
export async function scrollToElement(selector: string): Promise<void> {
  const element = await $(selector);
  await element.scrollIntoView();
}

/**
 * Wait for the page to be completely loaded
 */
export async function waitForPageLoad(): Promise<void> {
  await browser.waitUntil(
    async () => {
      const state = await browser.execute(() => document.readyState);
      return state === 'complete';
    },
    {
      timeout: 30000,
      timeoutMsg: 'Page did not load completely'
    }
  );
}

/**
 * Gets text from multiple elements
 */
export async function getTextFromElements(selector: string): Promise<string[]> {
  const elements = await $$(selector);
  const texts: string[] = [];
  
  for (const element of elements) {
    const text = await element.getText();
    if (text) {
      texts.push(text.trim());
    }
  }
  
  return texts;
}

/**
 * Check if an element contains a CSS class
 */
export async function hasClass(selector: string, className: string): Promise<boolean> {
  const element = await $(selector);
  if (!(await element.isExisting())) return false;
  
  const classes = await element.getAttribute('class');
  return classes ? classes.split(' ').includes(className) : false;
}

/**
 * Click with retry logic
 */
export async function clickWithRetry(selector: string, maxAttempts: number = 3): Promise<void> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const element = await $(selector);
      await element.click();
      return;
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error;
      }
      await browser.pause(1000);
    }
  }
}

/**
 * Clear and fill a field
 */
export async function clearAndFill(selector: string, text: string): Promise<void> {
  const element = await $(selector);
  await element.click();
  await element.clearValue();
  await element.setValue(text);
}

/**
 * Hover over an element and wait
 */
export async function hoverAndWait(selector: string, waitTime: number = 500): Promise<void> {
  const element = await $(selector);
  await element.moveTo();
  await browser.pause(waitTime);
}
