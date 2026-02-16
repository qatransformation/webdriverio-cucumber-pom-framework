import { Given, When, Then } from '@wdio/cucumber-framework';
import { expect } from '@wdio/globals';
import { CustomWorld } from '../support/world';

/**
 * Step Definitions for SauceDemo Login functionality
 */

// GIVEN - Initial setup steps

Given('the user navigates to the SauceDemo login page', async function (this: CustomWorld) {
  // Navigation is handled in Before hook via world.ts
  console.log('🔄 Navigation to SauceDemo handled in Before hook');
});

// WHEN - User actions

When('the user enters username {string}', async function (this: CustomWorld, username: string) {
  if (!this.sauceDemoPage) {
    throw new Error('SauceDemoPage is not initialized');
  }
  await this.sauceDemoPage.enterUsername(username);
});

When('the user enters password {string}', async function (this: CustomWorld, password: string) {
  if (!this.sauceDemoPage) {
    throw new Error('SauceDemoPage is not initialized');
  }
  await this.sauceDemoPage.enterPassword(password);
});

When('the user clicks the login button', async function (this: CustomWorld) {
  if (!this.sauceDemoPage) {
    throw new Error('SauceDemoPage is not initialized');
  }
  await this.sauceDemoPage.clickLoginButton();
});

When('the user clicks the menu button', async function (this: CustomWorld) {
  if (!this.sauceDemoPage) {
    throw new Error('SauceDemoPage is not initialized');
  }
  await this.sauceDemoPage.clickMenuButton();
});

When('the user clicks the logout option', async function (this: CustomWorld) {
  if (!this.sauceDemoPage) {
    throw new Error('SauceDemoPage is not initialized');
  }
  await this.sauceDemoPage.clickLogoutLink();
});

// THEN - Assertions

Then('the user should see the {string}', async function (this: CustomWorld, expectedText: string) {
  if (!this.sauceDemoPage) {
    throw new Error('SauceDemoPage is not initialized');
  }

  // Check if it's the Products title
  if (expectedText === 'Products') {
    const productsTitle = await this.sauceDemoPage.getProductsTitle();
    expect(productsTitle).toBe('Products');
    console.log('✅ User successfully logged in - Products page visible');
  } else {
    // Generic text visibility check
    const isVisible = await this.sauceDemoPage.isTextVisible(expectedText);
    expect(isVisible).toBe(true);
    console.log(`✅ Text "${expectedText}" is visible`);
  }
});

Then('the user should see the error message {string}', async function (this: CustomWorld, expectedError: string) {
  if (!this.sauceDemoPage) {
    throw new Error('SauceDemoPage is not initialized');
  }

  const isErrorVisible = await this.sauceDemoPage.isErrorMessageVisible();
  expect(isErrorVisible).toBe(true);

  const errorMessage = await this.sauceDemoPage.getErrorMessage();
  expect(errorMessage).toContain(expectedError);
  console.log(`✅ Expected error message displayed: "${expectedError}"`);
});

Then('the user should be redirected to the login page', async function (this: CustomWorld) {
  if (!this.sauceDemoPage) {
    throw new Error('SauceDemoPage is not initialized');
  }

  const isOnLoginPage = await this.sauceDemoPage.isOnLoginPage();
  expect(isOnLoginPage).toBe(true);
  console.log('✅ User successfully logged out - back on login page');
});

Then('the inventory page should be displayed', async function (this: CustomWorld) {
  if (!this.sauceDemoPage) {
    throw new Error('SauceDemoPage is not initialized');
  }

  const isLoggedIn = await this.sauceDemoPage.isLoggedIn();
  expect(isLoggedIn).toBe(true);
  console.log('✅ Inventory page is displayed');
});

Then('the user should see {int} products', async function (this: CustomWorld, expectedCount: number) {
  if (!this.sauceDemoPage) {
    throw new Error('SauceDemoPage is not initialized');
  }

  const productCount = await this.sauceDemoPage.getProductCount();
  expect(productCount).toBe(expectedCount);
  console.log(`✅ Found ${productCount} products in inventory`);
});
