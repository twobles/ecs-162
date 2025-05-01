import { render } from 'svelte/server';
import { vi, test, expect, beforeEach, describe } from 'vitest';
import App from './App.svelte'

test('App', async () => {
    render(App);
});
