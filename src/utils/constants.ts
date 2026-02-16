/**
 * Global project constants
 */

export const TIMEOUTS = {
  SHORT: 5000,
  MEDIUM: 10000,
  LONG: 30000,
  EXTRA_LONG: 60000,
};

export const URLS = {
  BASE: 'https://todomvc.com/examples/typescript-react/',
  DOCS: 'https://webdriver.io/docs/gettingstarted',
  API: 'https://webdriver.io/docs/api',
};

export const BROWSER_CONFIG = {
  HEADLESS: process.env.HEADLESS === 'true',
  SLOW_MO: process.env.SLOW_MO ? parseInt(process.env.SLOW_MO) : 0,
  VIEWPORT: {
    width: 1280,
    height: 720,
  },
};

export const TEST_DATA = {
  SEARCH_QUERIES: {
    API: 'API',
    TESTING: 'testing',
    TYPESCRIPT: 'typescript',
  },
};
