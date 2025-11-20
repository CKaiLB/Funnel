/**
 * Environment variable validation and utilities
 * 
 * This module provides safe access to environment variables with validation.
 * All VITE_ prefixed variables are exposed to the client-side, so only use
 * for values that are safe to expose in the browser.
 */

/**
 * Validates that a required environment variable is present
 * @param key - The environment variable key
 * @param defaultValue - Optional default value if not in production
 * @returns The environment variable value or default
 */
export const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[key];
  
  if (!value && import.meta.env.PROD) {
    console.error(`❌ Required environment variable ${key} is not configured`);
    return defaultValue || '';
  }
  
  if (!value && import.meta.env.DEV) {
    console.warn(`⚠️ Environment variable ${key} is not configured${defaultValue ? `, using default` : ''}`);
    return defaultValue || '';
  }
  
  return value;
};

/**
 * Validates that a required environment variable is present (throws in production)
 * @param key - The environment variable key
 * @returns The environment variable value
 * @throws Error if variable is missing in production
 */
export const requireEnvVar = (key: string): string => {
  const value = import.meta.env[key];
  
  if (!value) {
    const error = `Required environment variable ${key} is not configured`;
    if (import.meta.env.PROD) {
      console.error(`❌ ${error}`);
      throw new Error(error);
    } else {
      console.warn(`⚠️ ${error}`);
      return '';
    }
  }
  
  return value;
};

/**
 * Checks if we're in development mode
 */
export const isDev = (): boolean => {
  return import.meta.env.DEV;
};

/**
 * Checks if we're in production mode
 */
export const isProd = (): boolean => {
  return import.meta.env.PROD;
};

