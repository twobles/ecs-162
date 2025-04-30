<script lang="ts">
  import { onMount } from 'svelte';
  import type { Article } from './lib/Article.svelte';
  import { fetchArticles } from './lib/Article.svelte';
  import NYTHead from './assets/NewYorkTimesHead.png'

  let apiKey: string = '';

  let date: string = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })

  let articles: Article[] = [];

  onMount(async () => {
    try {
      const res = await fetch('/api/key');
      const data = await res.json();
      apiKey = data.apiKey;

      try {
        articles = await fetchArticles(apiKey);
      } catch (e) {
        console.log((e as Error).message);
      }
    } catch (error) {
      console.error('Failed to fetch API key:', error);
    }
  });
</script>

<main>
  <header>
    <img src={NYTHead} alt="New York Times logo" class="nyt-head">
    <div class="page-info">
      <p class="page-date">{date}</p>
      <span class="page-meta">Today's Paper</span>
    </div>
    <nav>
      <ul>
        <li>U.S.</li>
        <li>World</li>
        <li>Business</li>
        <li>Arts</li>
        <li>Lifestyle</li>
        <li>Opinion</li>
        <li>Audio</li>
        <li>Games</li>
        <li>Cooking</li>
      </ul>
    </nav>
  </header>
  <hr>
  <div class="column-container">
    {#each articles as article}
      <article class="column">
        <h2><a href={article.url} target="_blank" rel="noopener noreferrer">{article.headline}</a></h2>
        <p>{article.snippet}</p>
        <small>{article.published.toLocaleDateString()}</small>
        <div style="height: 1rem;"></div>
        <img class="article-img" src={article.img_url} alt={article.img_cap}>
      </article>
    {/each}
  </div>
</main>
