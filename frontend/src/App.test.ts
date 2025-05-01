import { render } from 'svelte/server';
import { vi, test, expect, beforeEach, describe } from 'vitest';
import App from './App.svelte'
import fetchApiKey from './App.svelte'
import {JSDOM} from 'jsdom'


// TEST 1 : Test App Loads
test('App', async () => {
    render(App);
});

// TEST 2 : Test MediaQueries for Mobile Responsiveness

// Setup JSDOM at the top of the file
const dom = new JSDOM('<!DOCTYPE html><html lang="en"><body></body></html>');
globalThis.window = dom.window as any;
globalThis.document = dom.window.document;
globalThis.HTMLElement = dom.window.HTMLElement;

describe('App Component - Mobile Responsiveness', () => {
  test('renders with mobile-specific styles when screen width is max 768px', async () => {
    // Mock matchMedia for mobile
    globalThis.window.matchMedia = vi.fn((query) => ({
      matches: query === '(max-width: 768px)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    // Render the App component using svelte/server
    const { html } = await render(App, {}); // Pass empty props if App doesn't need any for rendering layout
    document.body.innerHTML = html; // Set the rendered HTML into JSDOM

    // Assert mobile-specific styles using DOM queries and Vitest's expect
    const columnContainer = document.querySelector('.column-container');
    expect(columnContainer).not.toBeNull();
    if (columnContainer) {
      const computedStyle = globalThis.window.getComputedStyle(columnContainer);
      expect(computedStyle.gridTemplateColumns).toBe('1fr'); // Check for single column
    }


    const firstArticle = document.querySelector('.column-container .column');
    expect(firstArticle).not.toBeNull();
    expect(globalThis.window.getComputedStyle(firstArticle!).borderRight).toBe('none');

    const pageInfo = document.querySelector('.page-info');
    expect(pageInfo).not.toBeNull();
    expect(globalThis.window.getComputedStyle(pageInfo!).display).toBe('none');

    const nav = document.querySelector('nav');
    expect(nav).not.toBeNull();
    expect(globalThis.window.getComputedStyle(nav!).display).toBe('none');
  });
});


// TEST 3 : make sure fetchArticles returns formatted articles 
test('fetchAPI returns api Key', async () => {
  const apiKey = await fetchApiKey();

  expect(apiKey).not.NaN;
  console.log(apiKey)
});