import { IWorldOptions, World, setWorldConstructor } from '@wdio/cucumber-framework';
import { TodoPage } from '../pages';

/**
 * CustomWorld - Shared context between all Cucumber steps
 * Handles WebdriverIO session and page objects
 */
export class CustomWorld extends World {
  // Page Objects
  todoPage: TodoPage;
  
  // Test execution tracking
  startTime?: number;

  constructor(options: IWorldOptions) {
    super(options);
    
    // Initialize Page Objects
    this.todoPage = new TodoPage();
  }
}

// Register custom world
setWorldConstructor(CustomWorld);
