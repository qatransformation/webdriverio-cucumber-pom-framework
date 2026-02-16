import { browser } from '@wdio/globals';
import { BasePage } from './BasePage';

/**
 * SauceDemoPage - Page Object for SauceDemo application
 * Handles all interactions with the login and main pages
 */
export class SauceDemoPage extends BasePage {
  // Selectors for Login Page
  private readonly selectors = {
    // Login page elements
    usernameInput: '#user-name',
    passwordInput: '#password',
    loginButton: '#login-button',
    errorMessage: '[data-test="error"]',
    errorButton: '.error-button',

    // Main page elements (after login)
    inventoryContainer: '#inventory_container',
    productsTitle: '.title',
    menuButton: '#react-burger-menu-btn',
    logoutLink: '#logout_sidebar_link',
    inventoryItem: '.inventory_item',
    shoppingCart: '.shopping_cart_link',

    // Navigation
    appLogo: '.app_logo',
  };

  constructor() {
    super('https://www.saucedemo.com');
  }

  /**
   * Navigate to SauceDemo login page
   */
  async navigateToLoginPage() {
    await this.navigate('/');
    await this.waitForSelector(this.selectors.usernameInput);
  }

  /**
   * Enter username in login form
   */
  async enterUsername(username: string) {
    await this.fill(this.selectors.usernameInput, username);
  }

  /**
   * Enter password in login form
   */
  async enterPassword(password: string) {
    await this.fill(this.selectors.passwordInput, password);
  }

  /**
   * Click the login button
   */
  async clickLoginButton() {
    await this.click(this.selectors.loginButton);
    await browser.pause(1000); // Wait for navigation
  }

  /**
   * Perform complete login action
   */
  async login(username: string, password: string) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    return await this.getText(this.selectors.errorMessage);
  }

  /**
   * Check if error message is visible
   */
  async isErrorMessageVisible(): Promise<boolean> {
    return await this.isVisible(this.selectors.errorMessage);
  }

  /**
   * Get products page title
   */
  async getProductsTitle(): Promise<string> {
    await this.waitForSelector(this.selectors.productsTitle);
    return await this.getText(this.selectors.productsTitle);
  }

  /**
   * Check if user is logged in (inventory is visible)
   */
  async isLoggedIn(): Promise<boolean> {
    return await this.isVisible(this.selectors.inventoryContainer);
  }

  /**
   * Check if user is on login page
   */
  async isOnLoginPage(): Promise<boolean> {
    return await this.isVisible(this.selectors.loginButton);
  }

  /**
   * Click the hamburger menu button
   */
  async clickMenuButton() {
    await this.waitForSelector(this.selectors.menuButton);
    await this.click(this.selectors.menuButton);
    await browser.pause(500); // Wait for menu animation
  }

  /**
   * Click the logout link in the menu
   */
  async clickLogoutLink() {
    await this.waitForSelector(this.selectors.logoutLink);
    await this.click(this.selectors.logoutLink);
    await browser.pause(500); // Wait for navigation
  }

  /**
   * Perform complete logout action
   */
  async logout() {
    await this.clickMenuButton();
    await this.clickLogoutLink();
  }

  /**
   * Get the number of products in inventory
   */
  async getProductCount(): Promise<number> {
    const elements = await $$(this.selectors.inventoryItem);
    return elements.length;
  }

  /**
   * Clear login form fields
   */
  async clearLoginForm() {
    const usernameInput = await $(this.selectors.usernameInput);
    const passwordInput = await $(this.selectors.passwordInput);
    await usernameInput.clearValue();
    await passwordInput.clearValue();
  }

  /**
   * Check if specific text is visible on the page
   */
  async isTextVisible(text: string): Promise<boolean> {
    try {
      const element = await $(`//*[contains(text(), "${text}")]`);
      return await element.isDisplayed();
    } catch (error) {
      return false;
    }
  }
}
