// Global test setup and configuration
// This file contains shared test utilities and environment setup

export const testConfig = {
  timeout: 5000,
  retries: 2,
};

export function setupTestEnvironment() {
  // Test environment initialization
  process.env.NODE_ENV = 'test';
  process.env.DB_NAME = 'stockbox_test';
}
