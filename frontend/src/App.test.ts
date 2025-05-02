import { render } from 'svelte/server';
import { vi, test, expect, beforeEach, describe, afterEach } from 'vitest';
import App from './App.svelte'
import { JSDOM } from 'jsdom'


// TEST 1 : Test App Loads
test('App', async () => {
    render(App);
});

test('DateTime is accurate', async () => {

});

// TEST 2 : Test Date component
// Setup JSDOM
const dom = new JSDOM('<!DOCTYPE html><html lang="en"><body></body></html>');
globalThis.window = dom.window as any;
globalThis.document = dom.window.document;
globalThis.HTMLElement = dom.window.HTMLElement;

describe('App Component - Date matches today', () => {
  test('renders the correct current date', async () => {
    const today = new Date();
    const expectedDate = today.toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    const { html } = await render(App, {});
    document.body.innerHTML = html;

    console.log(document.body.innerHTML);
    const pageDateElement = document.querySelector('.page-date');
    expect(pageDateElement).not.toBeNull();

    if (pageDateElement) {
      expect(pageDateElement.textContent).toBe(expectedDate);
    } else {
      console.error('.page-date element not found in the rendered HTML.');
    }
  });
});

// // TEST 3 : Test MediaQueries for Mobile Responsiveness

// describe('App Component - Mobile Responsiveness', () => {
//   test('renders with mobile-specific styles when screen width is max 768px', async () => {
//     // Mock matchMedia for mobile
//     globalThis.window.matchMedia = vi.fn((query) => ({
//       matches: query === '(max-width: 768px)',
//       media: query,
//       onchange: null,
//       addListener: vi.fn(),
//       removeListener: vi.fn(),
//       addEventListener: vi.fn(),
//       removeEventListener: vi.fn(),
//       dispatchEvent: vi.fn(),
//     }));

//     // Render the App component using svelte/server
//     const { html } = await render(App, {});
//     document.body.innerHTML = html; 

//     console.log(document.body.innerHTML)
//     const columnContainer = document.querySelector('.column-container');
//     expect(columnContainer).not.toBeNull();    
//     if (columnContainer) {
//       const computedStyle = globalThis.window.getComputedStyle(columnContainer);
//       console.log("COMPUTEDSTYLE:", computedStyle)
//       expect(computedStyle.gridTemplateColumns).toBe('1fr');
//     }

//     const firstArticle = document.querySelector('.column-container .column');
//     expect(firstArticle).not.toBeNull();
//     expect(globalThis.window.getComputedStyle(firstArticle!).borderRight).toBe('none');

//     const pageInfo = document.querySelector('.page-info');
//     expect(pageInfo).not.toBeNull();
//     expect(globalThis.window.getComputedStyle(pageInfo!).display).toBe('none');

//     const nav = document.querySelector('nav');
//     expect(nav).not.toBeNull();
//     expect(globalThis.window.getComputedStyle(nav!).display).toBe('none');
//   });
// });



