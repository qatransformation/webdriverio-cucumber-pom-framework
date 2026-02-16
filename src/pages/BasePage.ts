import { browser } from '@wdio/globals';

/**
 * BasePage - Base class for all Page Objects
 * Provides common functionality for all pages
 */
export class BasePage {
  protected baseURL: string;

  constructor(baseURL: string = '') {
    this.baseURL = baseURL;
  }

  /**
   * Navigate to a specific URL
   */
  async navigate(path: string = '') {
    await browser.url(`${this.baseURL}${path}`);
  }

  /**
   * Wait for an element to be visible
   */
  async waitForSelector(selector: string, timeout: number = 30000) {
    const element = await $(selector);
    await element.waitForDisplayed({ timeout });
  }

  /**
   * Click an element
   */
  async click(selector: string) {
    const element = await $(selector);
    await element.click();
  }

  /**
   * Type text in a field
   */
  async fill(selector: string, text: string) {
    const element = await $(selector);
    await element.setValue(text);
  }

  /**
   * Get text from an element
   */
  async getText(selector: string): Promise<string> {
    const element = await $(selector);
    return await element.getText();
  }

  /**
   * Check if an element is visible
   */
  async isVisible(selector: string): Promise<boolean> {
    try {
      const element = await $(selector);
      return await element.isDisplayed();
    } catch (error) {
      return false;
    }
  }

  /**
   * Get page title
   */
  async getTitle(): Promise<string> {
    return await browser.getTitle();
  }

  /**
   * Wait for a specific time
   */
  async wait(milliseconds: number) {
    await browser.pause(milliseconds);
  }

  /**
   * Take a screenshot
   */
  async screenshot(path: string) {
    await browser.saveScreenshot(path);
  }
}
