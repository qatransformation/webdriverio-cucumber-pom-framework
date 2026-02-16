import { Given, When, Then, Before, After } from '@wdio/cucumber-framework';
import { browser, expect } from '@wdio/globals';
import { CustomWorld } from '../support/world';

/**
 * Common Step Definitions that can be reused
 */

// Generic navigation steps
Given('I navigate to {string}', async function (this: CustomWorld, url: string) {
  await browser.url(url);
});

// Generic interaction steps
When('I click on the element {string}', async function (this: CustomWorld, selector: string) {
  const element = await $(selector);
  await element.click();
});

When('I fill {string} with {string}', async function (this: CustomWorld, selector: string, text: string) {
  const element = await $(selector);
  await element.setValue(text);
});

// Generic verification steps
Then('the element {string} should be visible', async function (this: CustomWorld, selector: string) {
  const element = await $(selector);
  const isVisible = await element.isDisplayed();
  expect(isVisible).toBe(true);
});

Then('the element {string} should contain text {string}', async function (this: CustomWorld, selector: string, expectedText: string) {
  const element = await $(selector);
  const text = await element.getText();
  expect(text).toContain(expectedText);
});

Then('the URL should contain {string}', async function (this: CustomWorld, urlPart: string) {
  const url = await browser.getUrl();
  expect(url).toContain(urlPart);
});

Then('I wait for {int} seconds', async function (this: CustomWorld, seconds: number) {
  await browser.pause(seconds * 1000);
});
