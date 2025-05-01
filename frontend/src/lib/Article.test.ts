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
    console.log('document.body.innerHTML:', document.body.innerHTML);

    // Assert mobile-specific styles using DOM queries and Vitest's expect
    const columnContainer = document.querySelector('.column-container');
    expect(columnContainer).not.toBeNull();
    if (columnContainer) {
      const computedStyle = globalThis.window.getComputedStyle(columnContainer);
      console.log('computedStyle.gridTemplateColumns:', computedStyle);
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

// TEST 3 : Test API fetches
describe('App Component - API Key Fetching', () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn();
  });

  test('fetches and receives the API key on mount', async () => {
    const mockApiKey = 'test-api-key-from-server';

    // Mock the /api/key endpoint to return the API key
    (globalThis.fetch as vi.mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ apiKey: mockApiKey }),
    } as Response);

    // Render the App component
    render(App);

    // Wait for the API key to be fetched and potentially displayed or used
    await waitFor(() => {
      // Add an assertion here that checks if the API key has been received.
      // The exact assertion depends on how your App component uses the API key.
      // For example, if it's displayed in the component:
      expect(screen.getByText(mockApiKey)).toBeInTheDocument();
      // Or if it's stored in a variable that affects the rendering (you might need to expose it for testing):
      // const appInstance = component.$$; // Access Svelte component instance (use with caution)
      // expect(appInstance.ctx.apiKey).toBe(mockApiKey);
    });

    // Ensure that fetch was called with the correct URL
    expect(globalThis.fetch).toHaveBeenCalledWith('/api/key');
  });

  test('handles API key fetch error', async () => {
    const mockErrorMessage = 'Failed to fetch API key from server';

    // Mock the /api/key endpoint to simulate an error
    (globalThis.fetch as vi.Mock).mockRejectedValueOnce(new Error(mockErrorMessage));

    // Mock console.error to capture error messages
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Render the App component
    render(App);

    // Wait for a short time to allow the error to be handled
    await new Promise(resolve => setTimeout(resolve, 100));

    // Assert that console.error was called with the error message
    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to fetch API key:', new Error(mockErrorMessage));

    // Restore the original console.error function
    consoleErrorSpy.mockRestore();

    // You might also want to assert that the component renders some fallback UI
    // in case of an error.
  });
});