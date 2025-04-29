<script context="module" lang="ts">
  // Formatted Article interface
  export interface Article {
    headline: string;
    url: string;
    snippet: string;
    published: Date;
  }

  // https://developer.nytimes.com/docs/articlesearch-product/1/routes/articlesearch.json/get
  interface Docs {
    headline: { main: string  };
    web_url: string;
    snippet: string;
    pub_date: string;
  }

  interface Response {
    response: {
      docs: Docs[];
    };
  }

  /**
   * Fetches articles in the Sacramento area
   * 
   * @param api_key - Key to access the NYT API
   * @returns An array of articles formatted as Article
   */
  export async function fetchArticles(api_key: string): Promise<Article[]> {
    const url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?&fq=timesTag.organization%3A(%22United%20Nations%22%20AND%20%22Security%20Council%20(UN)%22)&api-key=${api_key}`;

    const response = await fetch(url);
    if (!response.ok) {
      console.log('Failed to fetch articles: ' + response.statusText);
    }

    const data: Response = await response.json();

    return data.response.docs.map(doc => ({
      headline: doc.headline.main,
      url: doc.web_url,
      snippet: doc.snippet,
      published: new Date(doc.pub_date)
    }));
  }
</script>