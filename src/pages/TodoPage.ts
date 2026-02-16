import { browser } from '@wdio/globals';
import { BasePage } from './BasePage';

/**
 * TodoPage - Page Object for TodoMVC application
 * Handles all interactions with the task list
 */
export class TodoPage extends BasePage {
  // Selectors (using modern CSS, no XPath)
  private readonly selectors = {
    newTodoInput: '.new-todo',
    todoList: '.todo-list',
    todoItem: '.todo-list li',
    completedTodo: '.completed',
    todoCount: '.todo-count',
    clearCompletedButton: '.clear-completed',
    filterAll: 'a[href="#/"]',
    filterActive: 'a[href="#/active"]',
    filterCompleted: 'a[href="#/completed"]',
    toggleAll: '.toggle-all',
  };

  constructor() {
    super('https://todomvc.com/examples/typescript-react/');
  }

  /**
   * Navigate to TodoMVC application
   */
  async navigateToTodoApp() {
    await this.navigate('/');
    await this.waitForSelector(this.selectors.newTodoInput);
  }

  /**
   * Add a new task
   */
  async addTodo(taskText: string) {
    await this.fill(this.selectors.newTodoInput, taskText);
    await browser.keys('Enter');
    await browser.pause(500); // Wait for task to be added
  }

  /**
   * Add multiple tasks
   */
  async addMultipleTodos(tasks: string[]) {
    for (const task of tasks) {
      await this.addTodo(task);
    }
  }

  /**
   * Mark a task as completed
   */
  async markTodoAsCompleted(taskText: string) {
    // Find all todo items
    const items = await $$('.todo-list li');
    
    for (const item of items) {
      const label = await item.$('label');
      const labelText = await label.getText();
      
      if (labelText.trim() === taskText) {
        const checkbox = await item.$('input[type="checkbox"]');
        await checkbox.click();
        await browser.pause(300);
        break;
      }
    }
  }

  /**
   * Unmark a completed task
   */
  async unmarkTodo(taskText: string) {
    // Find all todo items
    const items = await $$('.todo-list li');
    
    for (const item of items) {
      const label = await item.$('label');
      const labelText = await label.getText();
      
      if (labelText.trim() === taskText) {
        const checkbox = await item.$('input[type="checkbox"]');
        if (await checkbox.isSelected()) {
          await checkbox.click();
          await browser.pause(200);
        }
        break;
      }
    }
  }

  /**
   * Check if a task is completed
   */
  async isTodoCompleted(taskText: string): Promise<boolean> {
    try {
      // Wait for list to be loaded
      await this.waitForSelector(this.selectors.todoList);
      
      // Get all list items
      const items = await $$('.todo-list li');
      
      for (const item of items) {
        const label = await item.$('label');
        const labelText = await label.getText();
        
        // If we found the text we're looking for
        if (labelText?.trim() === taskText) {
          const className = await item.getAttribute('class');
          return className?.includes('completed') || false;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error checking if task is completed:', error);
      return false;
    }
  }

  /**
   * Get task counter text
   */
  async getTodoCount(): Promise<string> {
    try {
      const countElement = await $(this.selectors.todoCount);
      
      if (!(await countElement.isExisting())) {
        return '';
      }
      
      const text = await countElement.getText();
      return text?.trim() || '';
    } catch (error) {
      return '';
    }
  }

  /**
   * Check if counter is visible
   */
  async isCounterVisible(): Promise<boolean> {
    return await this.isVisible(this.selectors.todoCount);
  }

  /**
   * Get number of tasks in list
   */
  async getTodoItemsCount(): Promise<number> {
    const items = await $$(this.selectors.todoItem);
    return items.length;
  }

  /**
   * Check if task list is empty
   */
  async isTodoListEmpty(): Promise<boolean> {
    const count = await this.getTodoItemsCount();
    return count === 0;
  }

  /**
   * Delete a specific task (hover and click X button)
   */
  async deleteTodo(taskText: string) {
    // Find all todo items
    const items = await $$('.todo-list li');
    
    for (const item of items) {
      const label = await item.$('label');
      const labelText = await label.getText();
      
      if (labelText.trim() === taskText) {
        // Move to element to show delete button
        await item.moveTo();
        await browser.pause(200);
        
        // Click the delete button (button.destroy)
        const deleteButton = await item.$('button.destroy');
        await deleteButton.click();
        await browser.pause(300);
        break;
      }
    }
  }

  /**
   * Delete all tasks one by one
   */
  async deleteAllTodos() {
    let count = await this.getTodoItemsCount();
    
    while (count > 0) {
      // Get the first element and delete it
      const firstTodo = await $('.todo-list li label');
      
      if (await firstTodo.isExisting()) {
        const text = await firstTodo.getText();
        if (text) {
          await this.deleteTodo(text.trim());
        }
      }
      
      // Update count
      count = await this.getTodoItemsCount();
    }
  }

  /**
   * Clear completed tasks
   */
  async clearCompleted() {
    try {
      const clearButton = await $(this.selectors.clearCompletedButton);
      
      if (await clearButton.isExisting()) {
        await clearButton.click();
        await browser.pause(300);
      }
    } catch (error) {
      console.log('Clear completed button not available');
    }
  }

  /**
   * Reload the page
   */
  async reloadPage() {
    await browser.refresh();
    await this.waitForSelector(this.selectors.newTodoInput);
  }

  /**
   * Filter by all tasks
   */
  async filterAll() {
    await this.click(this.selectors.filterAll);
    await browser.pause(300);
  }

  /**
   * Filter by active tasks
   */
  async filterActive() {
    await this.click(this.selectors.filterActive);
    await browser.pause(300);
  }

  /**
   * Filter by completed tasks
   */
  async filterCompleted() {
    await this.click(this.selectors.filterCompleted);
    await browser.pause(300);
  }

  /**
   * Check if a task exists in the list (visible)
   */
  async todoExists(taskText: string): Promise<boolean> {
    try {
      // Get all todo items
      const items = await $$('.todo-list li');
      
      for (const item of items) {
        // Check if item is visible
        const isVisible = await item.isDisplayed();
        if (!isVisible) continue;
        
        const label = await item.$('label');
        const labelText = await label.getText();
        
        if (labelText?.trim() === taskText) {
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error checking if task exists:', error);
      return false;
    }
  }

  /**
   * Get all visible tasks
   */
  async getVisibleTodos(): Promise<string[]> {
    const todos: string[] = [];
    
    // Get all visible items
    const items = await $$('.todo-list li');
    
    for (const item of items) {
      const isVisible = await item.isDisplayed();
      if (!isVisible) continue;
      
      const label = await item.$('label');
      const text = await label.getText();
      if (text) {
        todos.push(text.trim());
      }
    }
    
    return todos;
  }

  /**
   * Mark all tasks as completed
   */
  async toggleAllTodos() {
    await this.click(this.selectors.toggleAll);
    await browser.pause(300);
  }
}
