import { fetchApiKey, fetchArticles } from './Article.svelte';
import { vi, test, expect, beforeEach, describe } from 'vitest';

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
  const articles = await fetchArticles('fake-api-key', 0);

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

// TEST 2 : make sure fetchAPI function returns a proper api Key
test('fetchAPI returns a non-null apiKey to the frontEnd', async () => {
  // Mock the global fetch function to return a successful response with an apiKey
  globalThis.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ apiKey: 'any-non-null-key' }),
    } as Response)
  ) as unknown as typeof fetch;

  const apiKey = await fetchApiKey();

  expect(apiKey).not.toBeNull();

  expect(apiKey).toBeTypeOf('string');

  expect(globalThis.fetch).toHaveBeenCalledWith('/api/key');
});
