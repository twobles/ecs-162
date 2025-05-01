import { render } from 'svelte/server';
import { fetchArticles } from './Article.svelte';
import App from '../App.svelte';
import { JSDOM } from 'jsdom';
import { vi, test, expect, beforeEach, describe } from 'vitest';

// Setup JSDOM at the top of the file
const dom = new JSDOM('<!DOCTYPE html><html lang="en"><body></body></html>');
globalThis.window = dom.window as any;
globalThis.document = dom.window.document;
globalThis.HTMLElement = dom.window.HTMLElement;

// TEST 1 : make sure fetchArticles returns formatted articles 
const mockResponse = {
  response: {
    docs: [
      {
        headline: { main: "Sacramento News Headline" },
        web_url: "https://example.com/article",
        snippet: "This is a summary of the article.",
        pub_date: "2024-04-01T12:00:00Z",
        multimedia: {
          caption: "Image caption",
          default: {
            url: "https://example.com/image.jpg",
            height: 150,
            width: 200,
          }
        }
      }
    ]
  }
};

beforeEach(() => {
  (globalThis.fetch as typeof fetch) = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    })
  ) as unknown as typeof fetch;
});

test('fetchArticles returns formatted articles', async () => {
  const articles = await fetchArticles('fake-api-key');

  expect(articles).toHaveLength(1);
  expect(articles[0]).toEqual({
    headline: "Sacramento News Headline",
    url: "https://example.com/article",
    snippet: "This is a summary of the article.",
    published: new Date("2024-04-01T12:00:00Z"),
    img_cap: "Image caption",
    img_url: "https://example.com/image.jpg",
  });
});

// TEST 2 : Test MediaQueries for Mobile Responsiveness
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
    expect(globalThis.window.getComputedStyle(columnContainer!).gridTemplateColumns).toBe('1fr'); // Check for single column

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