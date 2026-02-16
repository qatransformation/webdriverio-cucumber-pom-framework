import { Given, When, Then, DataTable } from '@wdio/cucumber-framework';
import { expect } from '@wdio/globals';
import { CustomWorld } from '../support/world';

/**
 * Step Definitions for TodoMVC functionality
 */

// GIVEN - Initial setup steps

Given('the user navigates to the TodoMVC application', async function (this: CustomWorld) {
  // Navigation is now handled automatically in Before hook
  // This step is kept for backward compatibility
  console.log('🔄 Navigation already handled in Before hook');
});

// WHEN - User actions

When('the user adds the task {string}', async function (this: CustomWorld, taskText: string) {
  if (!this.todoPage) {
    throw new Error('TodoPage is not initialized');
  }
  await this.todoPage.addTodo(taskText);
});

When('the user adds the following tasks:', async function (this: CustomWorld, dataTable: DataTable) {
  if (!this.todoPage) {
    throw new Error('TodoPage is not initialized');
  }
  
  const tasks = dataTable.hashes();
  for (const row of tasks) {
    await this.todoPage.addTodo(row.task);
  }
});

When('the user adds {int} tasks', async function (this: CustomWorld, quantity: number) {
  if (!this.todoPage) {
    throw new Error('TodoPage is not initialized');
  }
  
  for (let i = 1; i <= quantity; i++) {
    await this.todoPage.addTodo(`Task ${i}`);
  }
});

When('the user marks as completed the task {string}', async function (this: CustomWorld, taskText: string) {
  if (!this.todoPage) {
    throw new Error('TodoPage is not initialized');
  }
  await this.todoPage.markTodoAsCompleted(taskText);
});

When('the user unmarks the task {string}', async function (this: CustomWorld, taskText: string) {
  if (!this.todoPage) {
    throw new Error('TodoPage is not initialized');
  }
  await this.todoPage.unmarkTodo(taskText);
});

When('the user deletes the task {string}', async function (this: CustomWorld, taskText: string) {
  if (!this.todoPage) {
    throw new Error('TodoPage is not initialized');
  }
  await this.todoPage.deleteTodo(taskText);
});

When('the user deletes all tasks', async function (this: CustomWorld) {
  if (!this.todoPage) {
    throw new Error('TodoPage is not initialized');
  }
  await this.todoPage.deleteAllTodos();
});

When('the user clears completed tasks', async function (this: CustomWorld) {
  if (!this.todoPage) {
    throw new Error('TodoPage is not initialized');
  }
  await this.todoPage.clearCompleted();
});

When('the user reloads the page', async function (this: CustomWorld) {
  if (!this.todoPage) {
    throw new Error('TodoPage is not initialized');
  }
  await this.todoPage.reloadPage();
});

When('the user filters by all tasks', async function (this: CustomWorld) {
  if (!this.todoPage) {
    throw new Error('TodoPage is not initialized');
  }
  await this.todoPage.filterAll();
});

When('the user filters by active tasks', async function (this: CustomWorld) {
  if (!this.todoPage) {
    throw new Error('TodoPage is not initialized');
  }
  await this.todoPage.filterActive();
});

When('the user filters by completed tasks', async function (this: CustomWorld) {
  if (!this.todoPage) {
    throw new Error('TodoPage is not initialized');
  }
  await this.todoPage.filterCompleted();
});

When('the user marks all tasks as completed', async function (this: CustomWorld) {
  if (!this.todoPage) {
    throw new Error('TodoPage is not initialized');
  }
  await this.todoPage.toggleAllTodos();
});

// THEN - Verifications

Then('the counter should show {string}', async function (this: CustomWorld, expectedText: string) {
  const counterText = await this.todoPage.getTodoCount();
  await expect(counterText).toContain(expectedText);
});

Then('the task list should be empty', async function (this: CustomWorld) {
  const isEmpty = await this.todoPage.isTodoListEmpty();
  await expect(isEmpty).toBe(true);
});

Then('the task {string} should be marked as completed', async function (this: CustomWorld, taskText: string) {
  const isCompleted = await this.todoPage.isTodoCompleted(taskText);
  await expect(isCompleted).toBe(true);
});

Then('the task {string} should not be marked as completed', async function (this: CustomWorld, taskText: string) {
  const isCompleted = await this.todoPage.isTodoCompleted(taskText);
  await expect(isCompleted).toBe(false);
});

Then('should see {int} task in the list', async function (this: CustomWorld, expectedCount: number) {
  const actualCount = await this.todoPage.getTodoItemsCount();
  await expect(actualCount).toBe(expectedCount);
});

Then('should see {int} tasks in the list', async function (this: CustomWorld, expectedCount: number) {
  const actualCount = await this.todoPage.getTodoItemsCount();
  await expect(actualCount).toBe(expectedCount);
});

Then('should see the task {string}', async function (this: CustomWorld, taskText: string) {
  const exists = await this.todoPage.todoExists(taskText);
  await expect(exists).toBe(true);
});

Then('should not see the task {string}', async function (this: CustomWorld, taskText: string) {
  const exists = await this.todoPage.todoExists(taskText);
  await expect(exists).toBe(false);
});

Then('should not see the counter', async function (this: CustomWorld) {
  const isVisible = await this.todoPage.isCounterVisible();
  await expect(isVisible).toBe(false);
});

Then('should see only {int} task', async function (this: CustomWorld, expectedCount: number) {
  const visibleTodos = await this.todoPage.getVisibleTodos();
  await expect(visibleTodos.length).toBe(expectedCount);
});

Then('should see the following tasks:', async function (this: CustomWorld, dataTable: DataTable) {
  const expectedTasks = dataTable.hashes().map(row => row.task);
  const visibleTodos = await this.todoPage.getVisibleTodos();
  
  for (const expectedTask of expectedTasks) {
    await expect(visibleTodos).toContain(expectedTask);
  }
});
